<?php

namespace App\Http\Controllers\V1\Frontend;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Stripe\Exception\SignatureVerificationException;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\Webhook;
use UnexpectedValueException;

class OrderController extends Controller
{
    public function order(Request $request): JsonResponse
    {
        $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'required|string|max:50',
            'shipping_address' => 'required|string|max:1000',
            'payment_method' => 'required|in:cod,card',
        ]);

        $user = Auth::user();
        $cart = $user?->cart;

        if (! $cart) {
            return response()->json([
                'errors' => [
                    'cart' => ['Cart not found.'],
                ],
            ], 422);
        }

        DB::beginTransaction();

        try {
            $cartItems = CartItem::query()
                ->where('cart_id', $cart->id)
                ->with('product:id,name,stock_quantity')
                ->lockForUpdate()
                ->get();

            if ($cartItems->isEmpty()) {
                throw ValidationException::withMessages([
                    'cart' => ['Your cart is empty.'],
                ]);
            }

            $products = Product::query()
                ->whereIn('id', $cartItems->pluck('product_id')->unique())
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $insufficientStockProducts = [];
            foreach ($cartItems as $item) {
                $product = $products->get($item->product_id);

                if (! $product || $product->stock_quantity < $item->quantity) {
                    $insufficientStockProducts[] = $item->product->name ?? 'Unknown product';
                }
            }

            if (! empty($insufficientStockProducts)) {
                throw ValidationException::withMessages([
                    'out_of_stock' => [
                        'Not enough stock for: '.implode(', ', $insufficientStockProducts),
                    ],
                ]);
            }

            $total = (float) $cartItems->sum(fn ($item) => $item->quantity * $item->price);

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $this->generateOrderNumber(),
                'total_amount' => $total,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => $request->payment_method,
                'guest_name' => $request->guest_name,
                'guest_email' => $request->guest_email,
                'guest_phone' => $request->guest_phone,
                'shipping_address' => $request->shipping_address,
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->quantity * $item->price,
                ]);

                $products->get($item->product_id)?->decrement('stock_quantity', $item->quantity);
            }

            $intent = null;
            if ($request->payment_method === 'card') {
                Stripe::setApiKey((string) config('services.stripe.secret'));

                $amountForStripe = (int) round($total * 100);
                $intent = PaymentIntent::create([
                    'amount' => $amountForStripe,
                    'currency' => 'php',
                    'payment_method_types' => ['card'],
                    'metadata' => [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'user_id' => $user->id,
                    ],
                ]);

                Payment::create([
                    'order_id' => $order->id,
                    'payment_reference' => $intent->id,
                    'payment_gateway' => 'stripe',
                    'amount' => $total,
                    'status' => 'pending',
                    'payload' => json_encode($intent->toArray(), JSON_THROW_ON_ERROR),
                ]);
            } else {
                Payment::create([
                    'order_id' => $order->id,
                    'payment_gateway' => 'cod',
                    'amount' => $total,
                    'status' => 'pending',
                ]);
            }

            CartItem::query()->where('cart_id', $cart->id)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'clientSecret' => $intent->client_secret ?? null,
            ]);
        } catch (ValidationException $exception) {
            DB::rollBack();

            return response()->json([
                'errors' => $exception->errors(),
            ], 422);
        } catch (\Throwable $exception) {
            DB::rollBack();

            Log::error('Order placement failed', [
                'user_id' => $user?->id,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unable to place order right now. Please try again.',
            ], 500);
        }
    }

    public function markAsPaid(Order $order): JsonResponse
    {
        $user = Auth::user();

        if (! $user || (int) $order->user_id !== (int) $user->id) {
            return response()->json([
                'message' => 'Unauthorized order access.',
            ], 403);
        }

        if ($order->payment_method !== 'card') {
            return response()->json([
                'message' => 'Payment confirmation is only valid for card orders.',
            ], 422);
        }

        if ($order->status === 'cancelled') {
            return response()->json([
                'message' => 'Order is already cancelled.',
            ], 422);
        }

        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Order payment already confirmed.',
            ]);
        }

        $payment = Payment::query()
            ->where('order_id', $order->id)
            ->where('payment_gateway', 'stripe')
            ->latest('id')
            ->first();

        if (! $payment || ! $payment->payment_reference) {
            return response()->json([
                'message' => 'No Stripe payment reference found.',
            ], 422);
        }

        try {
            Stripe::setApiKey((string) config('services.stripe.secret'));
            $intent = PaymentIntent::retrieve($payment->payment_reference);

            if (($intent->status ?? null) !== 'succeeded') {
                return response()->json([
                    'message' => 'Payment is not completed yet.',
                ], 422);
            }

            DB::transaction(function () use ($order, $payment, $intent): void {
                $order->update([
                    'status' => 'paid',
                    'payment_status' => 'paid',
                ]);

                $payment->update([
                    'status' => 'success',
                    'paid_at' => now(),
                    'payload' => json_encode($intent->toArray(), JSON_THROW_ON_ERROR),
                ]);
            });

            return response()->json([
                'message' => 'Payment confirmed.',
            ]);
        } catch (\Throwable $exception) {
            Log::error('Manual payment confirmation failed', [
                'order_id' => $order->id,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unable to confirm payment right now.',
            ], 500);
        }
    }

    public function stripeWebhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $signature = (string) $request->header('Stripe-Signature', '');
        $webhookSecret = (string) config('services.stripe.webhook_secret');

        if ($webhookSecret === '') {
            Log::error('Stripe webhook secret is not configured.');

            return response()->json([
                'message' => 'Webhook misconfigured.',
            ], 500);
        }

        try {
            $event = Webhook::constructEvent($payload, $signature, $webhookSecret);
        } catch (UnexpectedValueException|SignatureVerificationException $exception) {
            Log::warning('Invalid Stripe webhook request', [
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Invalid payload.',
            ], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $intent = $event->data->object;
            $this->syncStripePaymentSuccess($intent->id, (array) $intent);
        }

        if ($event->type === 'payment_intent.payment_failed') {
            $intent = $event->data->object;
            $this->syncStripePaymentFailure($intent->id, (array) $intent);
        }

        return response()->json([
            'received' => true,
        ]);
    }

    private function syncStripePaymentSuccess(string $paymentIntentId, array $payload): void
    {
        $payment = Payment::query()
            ->where('payment_gateway', 'stripe')
            ->where('payment_reference', $paymentIntentId)
            ->latest('id')
            ->first();

        if (! $payment) {
            return;
        }

        $order = Order::query()->find($payment->order_id);
        if (! $order || $order->status === 'cancelled') {
            return;
        }

        DB::transaction(function () use ($order, $payment, $payload): void {
            if ($order->payment_status !== 'paid') {
                $order->update([
                    'status' => 'paid',
                    'payment_status' => 'paid',
                ]);
            }

            if ($payment->status !== 'success') {
                $payment->update([
                    'status' => 'success',
                    'paid_at' => now(),
                    'payload' => json_encode($payload, JSON_THROW_ON_ERROR),
                ]);
            }
        });
    }

    private function syncStripePaymentFailure(string $paymentIntentId, array $payload): void
    {
        $payment = Payment::query()
            ->where('payment_gateway', 'stripe')
            ->where('payment_reference', $paymentIntentId)
            ->latest('id')
            ->first();

        if (! $payment) {
            return;
        }

        $order = Order::query()->find($payment->order_id);
        if (! $order || $order->payment_status === 'paid') {
            return;
        }

        DB::transaction(function () use ($order, $payment, $payload): void {
            if ($payment->status !== 'failed') {
                $payment->update([
                    'status' => 'failed',
                    'payload' => json_encode($payload, JSON_THROW_ON_ERROR),
                ]);
            }

            if ($order->status !== 'cancelled') {
                $this->releaseOrderStock($order);
                $order->update([
                    'status' => 'cancelled',
                    'payment_status' => 'failed',
                ]);
            }
        });
    }

    private function releaseOrderStock(Order $order): void
    {
        $orderItems = OrderItem::query()
            ->where('order_id', $order->id)
            ->lockForUpdate()
            ->get();

        if ($orderItems->isEmpty()) {
            return;
        }

        $products = Product::query()
            ->whereIn('id', $orderItems->pluck('product_id')->unique())
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        foreach ($orderItems as $item) {
            $products->get($item->product_id)?->increment('stock_quantity', $item->quantity);
        }
    }

    private function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'ORD-'.strtoupper(Str::random(8));
        } while (Order::query()->where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}

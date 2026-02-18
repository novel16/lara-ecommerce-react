<?php

namespace App\Http\Controllers\V1\Frontend;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Stripe\PaymentIntent;
use Stripe\Stripe;



class OrderController extends Controller
{
    public function order(Request $request)
    {

        Stripe::setApiKey(env("STRIPE_SECRET_KEY"));

        $request->validate([
            "guest_name" => "required|string",
            "guest_email" => "required|email",
            "guest_phone" => "required|string",
            "shipping_address" => "required|string"
        ]);

        $user = Auth::user();

        $cartItems = $user->cart->cartItems()->with('product')->get();

        DB::beginTransaction();

        try {

            // 1️⃣ Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'total_amount' => $cartItems->sum(fn($item) => $item->quantity * $item->price),
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => $request->payment_method,
                'guest_name' => $request->guest_name,
                'guest_email' => $request->guest_email,
                'guest_phone' => $request->guest_phone,
                'shipping_address' => $request->shipping_address,
            ]);

            // 2️⃣ Save MULTIPLE Order Items
            foreach ($cartItems as $item) {

                // Optional: stock validation
                if ($item->product->stock_quantity < $item->quantity) {
                    return response()->json(
                        [
                            'errors' => [
                                'out_of_stock' => ["Not enough stock for " . $item->product->name],
                            ]
                        ],
                        422
                    );
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->quantity * $item->price,
                ]);

                // 3️⃣ Deduct stock
                // $item->product->decrement('stock_quantity', $item->quantity);
            }
            $total = $cartItems->sum(fn($item) => $item->quantity * $item->price);
            $intent = null;
            if ($request->payment_method === 'card') {

                $amountForStripe = $total * 100;

                $intent = PaymentIntent::create([
                    'amount' => $amountForStripe,
                    'currency' => 'php',
                    'metadata' => [
                        'order_id' => $order->id,
                    ],
                ]);

                Payment::create([
                    'order_id' => $order->id,
                    'payment_reference' => $intent->id,
                    'payment_gateway' => 'stripe',
                    'amount' => $total,
                    'status' => 'pending',
                    'payload' => json_encode($intent->toArray()),
                ]);
            } else {
                Payment::create([
                    'order_id' => $order->id,
                    'payment_gateway' => 'cod',
                    'amount' => $total,
                    'status' => 'pending',
                    'paid_at' => now()
                ]);
            }


            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'clientSecret' => $intent->client_secret ?? null,
            ]);

        } catch (\Throwable $e) {
            //throw $th;
            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function markAsPaid(Order $order)
    {
        $order->update([
            'status' => 'paid',
            'payment_status' => 'paid'
        ]);

        $payment = Payment::where('order_id', $order->id)->first();
        $payment->update([
            'status' => 'success',
            'paid_at' => now()
        ]);
    }
}

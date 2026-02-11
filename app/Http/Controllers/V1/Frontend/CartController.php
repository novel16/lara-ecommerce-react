<?php

namespace App\Http\Controllers\V1\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartItemResource;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{

    public function viewCart()
    {
        return CartItemResource::collection(CartItem::with('product')->latest()->get());
    }
    public function addToCart(Request $request)
    {
        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id(),
        ]);

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            // Kung existing na, i-increment lang ang quantity
            $cartItem->increment('quantity', $request->quantity);
        } else {
            // Kung wala pa, create new cart item
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity'  => $request->quantity,
                'price'     => $request->price,
            ]);
        }

        return $cartItem;
    }

    public function increaseCartQty(CartItem $cartItem)
    {
        $product = $cartItem->product; // get related product

        // ❗ Prevent exceeding stock
        if ($cartItem->quantity >= $product->stock_quantity) {
            return response()->json([
                'message' => 'Maximum stock reached',
                'quantity' => $cartItem->quantity
            ], 400);
        }

        $cartItem->increment('quantity', 1);

        return response()->json([
            'quantity' => $cartItem->quantity,
        ]);
    }

    public function decreaseCartQty(CartItem $cartItem)
    {
        if ($cartItem->quantity <= 1) {
            $cartItem->delete();

            return response()->json([
                'message' => 'Item removed from cart',
                'quantity' => 0
            ]);
        }

        $cartItem->decrement('quantity', 1);

        return response()->json([
            'quantity' => $cartItem->quantity,
        ]);
    }
}

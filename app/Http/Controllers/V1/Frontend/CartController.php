<?php

namespace App\Http\Controllers\V1\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
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
}

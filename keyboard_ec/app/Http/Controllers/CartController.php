<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function getCart()
    {
        $cart = Cart::with('items.product')
            ->firstOrCreate([
                'user_id' => Auth::id()
            ]);

        return response()->json($cart);
    }

    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id()
        ]);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($item) {

            $item->quantity += $validated['quantity'];

            $item->save();

        } else {

            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity']
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart'
        ]);
    }

    public function updateQuantity(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item = CartItem::whereHas('cart', function ($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($id);

        $item->quantity = $validated['quantity'];
        $item->save();

        return response()->json([
            'message' => 'Quantity updated',
        ]);
    }

    public function removeFromCart($id)
    {
        $item = CartItem::whereHas('cart', function ($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($id);

        $item->delete();

        return response()->json([
            'message' => 'Item removed'
        ]);
    }

    public function clearCart()
    {
        $cart = Cart::where('user_id', Auth::id())->first();

        if ($cart) {

            $cart->items()->delete();
        }

        return response()->json([
            'message' => 'Cart cleared'
        ]);
    }
}
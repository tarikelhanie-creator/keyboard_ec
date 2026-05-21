<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_price' => 'required|numeric|min:0',

            'phone' => 'required|string|max:20',

            'city' => 'required|string|max:255',

            'shipping_address' => 'required|string',

            'items' => 'required|array|min:1',

            'items.*.product_id' => 'required|exists:products,id',

            'items.*.quantity' => 'required|integer|min:1',

            'items.*.price' => 'required|numeric|min:0'
        ]);

        $order = Order::create([
            'user_id' => Auth::id(),
            'total_price' => $validated['total_price'],
            'status' => 'pending',
            'phone' => $validated['phone'],
            'city' => $validated['city'],
            'shipping_address' => $validated['shipping_address']
        ]);

        foreach ($validated['items'] as $item) {

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
        }

        return response()->json([
            'message' => 'Order created successfully'
        ], 201);
    }

    public function myOrders()
    {
        return Order::with('orderItems.product')
            ->where('user_id', Auth::id())
            ->get();
    }
}
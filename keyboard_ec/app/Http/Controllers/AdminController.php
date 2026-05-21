<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        $orders = Order::query();

        return response()->json([
            'total_revenue' => (float) $orders->clone()->where('status', '!=', 'cancelled')->sum('total_price'),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_products' => Product::count(),
            'low_stock_products' => Product::where('stock', '<', 10)->count(),
            'total_users' => User::count(),
            'recent_orders' => Order::with(['user:id,name,email'])
                ->latest()
                ->take(6)
                ->get(),
        ]);
    }

    public function orders(Request $request)
    {
        $query = Order::with(['user:id,name,email', 'orderItems.product'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        return response()->json(
            $query->paginate(min((int) $request->input('per_page', 15), 50))
        );
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $validated['status'];
        $order->save();

        return response()->json($order->load(['user:id,name,email', 'orderItems.product']));
    }
}

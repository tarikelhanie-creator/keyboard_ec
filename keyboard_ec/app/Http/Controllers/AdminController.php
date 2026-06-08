<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function stats()
    {
        $user = Auth::user();
        $ordersQuery = Order::query();
        $productsQuery = Product::query();

        // If seller, only show their products and related orders
        if ($user->role === 'seller') {
            $productsQuery->where('seller_id', $user->id);
            // For orders, we need to filter by products that belong to this seller
            $ordersQuery->whereHas('orderItems.product', function ($q) use ($user) {
                $q->where('seller_id', $user->id);
            });
        }

        return response()->json([
            'total_revenue' => (float) $ordersQuery->clone()->where('status', '!=', 'cancelled')->sum('total_price'),
            'total_orders' => $ordersQuery->clone()->count(),
            'pending_orders' => $ordersQuery->clone()->where('status', 'pending')->count(),
            'total_products' => $productsQuery->clone()->count(),
            'low_stock_products' => $productsQuery->clone()->where('stock', '<', 10)->count(),
            'total_users' => $user->role === 'seller' ? 1 : User::count(),
            'recent_orders' => $ordersQuery->with(['user:id,name,email', 'orderItems.product'])
                ->latest()
                ->take(6)
                ->get(),
        ]);
    }

    public function orders(Request $request)
    {
        $user = Auth::user();
        $query = Order::with(['user:id,name,email', 'orderItems.product'])
            ->latest();

        // If seller, only show orders for their products
        if ($user->role === 'seller') {
            $query->whereHas('orderItems.product', function ($q) use ($user) {
                $q->where('seller_id', $user->id);
            });
        }

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

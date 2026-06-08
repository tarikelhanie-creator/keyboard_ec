<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Filter by seller if user is a seller (for seller dashboard)
        if (Auth::check() && Auth::user()->role === 'seller') {
            $query->where('seller_id', Auth::id());
        }

        // Search by product name
        if ($request->has('search')) {

            $query->where('name', 'ILIKE', '%' . $request->search . '%');
        }

        // Filter by brand
        if ($request->has('brand')) {

            $query->where('brand', 'ILIKE', '%' . $request->brand . '%');
        }

        // Filter by category
        if ($request->has('category_id')) {

            $query->where('category_id', $request->category_id);
        }

        // Min price
        if ($request->has('min_price')) {

            $query->where('price', '>=', $request->min_price);
        }

        // Max price
        if ($request->has('max_price')) {

            $query->where('price', '<=', $request->max_price);
        }

        $perPage = min(max((int) $request->input('per_page', 10), 1), 100);
        $products = $query->latest()->paginate($perPage);

        return response()->json($products);
    }

    public function show($id)
    {
        return Product::with('category')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'brand' => 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {

            $path = $request->file('image')->store('products', 'public');

            $validated['image'] = $path;
        }

        $validated['seller_id'] = Auth::id();
        $product = Product::create($validated);

        return response()->json($product->load('category'), 201);
    }
    
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        // Verify seller ownership
        if ($product->seller_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized. You can only edit your own products.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'brand' => 'nullable|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {

            $path = $request->file('image')->store('products', 'public');

            $validated['image'] = $path;
        }

        $product->update($validated);

        return response()->json($product->load('category'));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Verify seller ownership
        if ($product->seller_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized. You can only delete your own products.'
            ], 403);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted'
        ]);
    }
}
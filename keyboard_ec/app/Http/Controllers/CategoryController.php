<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * List all categories, optionally filtered by search query.
     * Includes a product count for each category.
     */
    public function index(Request $request)
    {
        $query = Category::withCount('products');

        if ($request->filled('search')) {
            $query->where('name', 'ILIKE', '%' . $request->search . '%');
        }

        return response()->json($query->orderBy('name')->get());
    }

    /**
     * Show a single category.
     */
    public function show($id)
    {
        $category = Category::withCount('products')->findOrFail($id);
        return response()->json($category);
    }

    /**
     * Create a new category. Admin only.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $validated['slug'] = Category::generateSlug($validated['name']);

        $category = Category::create($validated);

        return response()->json($category->loadCount('products'), 201);
    }

    /**
     * Update an existing category. Admin only.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
        ]);

        $validated['slug'] = Category::generateSlug($validated['name'], $id);

        $category->update($validated);

        return response()->json($category->loadCount('products'));
    }

    /**
     * Delete a category. Admin only.
     * Will fail if products are still assigned (due to FK cascade in products table).
     */
    public function destroy($id)
    {
        $category = Category::withCount('products')->findOrFail($id);

        if ($category->products_count > 0) {
            return response()->json([
                'message' => "Cannot delete: {$category->products_count} product(s) still use this category. Reassign or delete them first."
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully.']);
    }
}
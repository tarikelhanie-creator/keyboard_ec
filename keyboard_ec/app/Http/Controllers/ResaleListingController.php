<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResaleListingRequest;
use App\Models\ResaleCategory;
use App\Models\ResaleImage;
use App\Models\ResaleListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResaleListingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = ResaleListing::active()
            ->with(['user', 'category', 'images'])
            ->when($request->search, fn($q, $s) => $q->search($s))
            ->latest()
            ->paginate(20);

        return response()->json($q);
    }

    public function categories(): JsonResponse
    {
        return response()->json(ResaleCategory::all());
    }

    public function store(ResaleListingRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['status'] = 'active';

        $listing = ResaleListing::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $img) {
                $path = $img->store('resale-images', 'public');
                ResaleImage::create([
                    'resale_listing_id' => $listing->id,
                    'path' => $path,
                    'order' => $i,
                ]);
            }
        }

        return response()->json($listing->load('images', 'category'), 201);
    }

    public function show(ResaleListing $resaleListing): JsonResponse
    {
        $resaleListing->increment('views');
        $resaleListing->load('user', 'category', 'images');

        return response()->json($resaleListing);
    }

    public function buy(Request $request, ResaleListing $resaleListing): JsonResponse
    {
        $request->validate([
            'buyer_phone' => 'required|string|max:20',
            'buyer_location' => 'required|string|max:255',
        ]);

        $resaleListing->update(['status' => 'sold']);

        return response()->json([
            'message' => 'Purchase initiated. Seller will contact you.',
            'listing' => $resaleListing,
            'buyer_phone' => $request->buyer_phone,
            'buyer_location' => $request->buyer_location,
        ]);
    }

    public function myListings(): JsonResponse
    {
        $listings = ResaleListing::with(['category', 'images'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($listings);
    }
}

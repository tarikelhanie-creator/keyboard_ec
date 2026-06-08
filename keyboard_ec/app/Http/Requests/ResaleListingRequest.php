<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResaleListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'price' => 'required|numeric|min:0.01|max:999999.99',
            'condition' => 'required|in:new,like_new,excellent,good,fair,for_parts',
            'location' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'resale_category_id' => 'nullable|exists:resale_categories,id',
            'images' => 'nullable|array|max:8',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ];
    }
}

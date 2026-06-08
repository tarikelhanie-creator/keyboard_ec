<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResaleListing extends Model
{
    protected $fillable = [
        'user_id', 'resale_category_id', 'title', 'description', 'price',
        'condition', 'location', 'phone_number', 'status', 'views',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'views' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ResaleCategory::class, 'resale_category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ResaleImage::class);
    }

    public function scopeActive($q)
    {
        return $q->where('status', 'active');
    }

    public function scopeSearch($q, string $s)
    {
        return $q->where('title', 'like', "%{$s}%")
                 ->orWhere('description', 'like', "%{$s}%");
    }
}

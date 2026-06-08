<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResaleImage extends Model
{
    protected $fillable = ['resale_listing_id', 'path', 'order'];

    protected $casts = ['order' => 'integer'];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(ResaleListing::class);
    }
}

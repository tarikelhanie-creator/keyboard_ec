<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResaleCategory extends Model
{
    protected $fillable = ['name', 'slug'];

    public function listings(): HasMany
    {
        return $this->hasMany(ResaleListing::class);
    }
}

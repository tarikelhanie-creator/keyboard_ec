<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resale_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('resale_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->index('resale_listings_user_id_index');
            $table->unsignedBigInteger('resale_category_id')->nullable()->index('resale_listings_resale_category_id_index');
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->enum('condition', ['new', 'like_new', 'excellent', 'good', 'fair', 'for_parts'])->default('good');
            $table->string('location');
            $table->string('phone_number')->nullable();
            $table->enum('status', ['active', 'sold'])->default('active');
            $table->integer('views')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->foreign('resale_category_id', 'fk_resale_listings_category')->references('id')->on('resale_categories')->nullOnDelete();
        });

        Schema::create('resale_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resale_listing_id')->constrained()->cascadeOnDelete()->index();
            $table->string('path');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resale_images');
        Schema::dropIfExists('resale_listings');
        Schema::dropIfExists('resale_categories');
    }
};

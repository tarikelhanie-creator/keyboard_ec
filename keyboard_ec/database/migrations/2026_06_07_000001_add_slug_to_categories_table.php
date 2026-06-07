<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
        });

        // Backfill slugs for any existing categories
        $categories = DB::table('categories')->get();
        foreach ($categories as $category) {
            $slug = Str::slug($category->name);
            // Ensure uniqueness by appending the ID if slug exists
            $exists = DB::table('categories')
                ->where('slug', $slug)
                ->where('id', '!=', $category->id)
                ->exists();
            if ($exists) {
                $slug = $slug . '-' . $category->id;
            }
            DB::table('categories')->where('id', $category->id)->update(['slug' => $slug]);
        }

        // Now add the unique constraint after backfilling
        Schema::table('categories', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};

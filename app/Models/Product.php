<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'sku',
        'name',
        'slug',
        'description',
        'price',
        'stock_quantity',
        'image',
        'status',
    ];

    public function products()
    {
        return $this->hasMany(Stock::class);
    }
}

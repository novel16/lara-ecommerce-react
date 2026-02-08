<?php

namespace App\Http\Controllers\V1\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class FrontendController extends Controller
{
    public function index()
    {
        return ProductResource::collection(Product::latest()->paginate(8));
    }

    public function viewProduct(Product $product)
    {
        return new ProductResource($product);
    }
}

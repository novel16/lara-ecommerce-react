<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "sku"=> $this->sku,
            "name"=> $this->name,
            "slug"=> $this->slug,
            "description"=> $this->description,
            "price"=> $this->price,
            "stock_quantity"=> $this->stock_quantity,
            "image"=> $this->image,
            "status"=> $this->status,
            "created_at"=> $this->created_at->format('Y-m-d H:i:s'),
            "updated_at"=> $this->updated_at->format('Y-m-d H:i:s'),

        ];
    }
}

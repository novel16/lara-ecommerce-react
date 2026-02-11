<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => new ProductResource($this->product),
            'quantity'=> $this->quantity,
            'price'=> $this->price,
            'created_at' => $this->created_at->format("Y-m-d"),
            'updated_at'=> $this->updated_at->format("Y-m-d"),
        ];
    }
}

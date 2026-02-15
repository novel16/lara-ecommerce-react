<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'status',
        'payment_status',
        'payment_method',
        'guest_name',
        'guest_email',
        'guest_phone',
        'shipping_address'
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'payment_reference',
        'payment_gateway',
        'amount',
        'status',
        'payload',
        'paid_at'
    ];
}

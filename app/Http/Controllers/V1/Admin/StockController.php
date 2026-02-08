<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\FormStockRequest;
use App\Http\Resources\StockResource;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return StockResource::collection(Stock::with('product')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FormStockRequest $request)
{
    $data = $request->validated();

    $product = Product::findOrFail($data['product_id']);

    DB::transaction(function () use ($product, $data, &$stock) {

        $stock = $product->stocks()->create([
            'quantity' => $data['quantity'],
            'cost_price' => $data['cost_price'],
            'supplier' => $data['supplier'] ?? null,
            'remarks' => $data['remarks'] ?? null,
        ]);

        $product->increment('stock_quantity', $data['quantity']);
    });

    return response()->json($stock, 201);
}


    /**
     * Display the specified resource.
     */
    public function show(Stock $id)
    {
        return new StockResource($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FormStockRequest $request, Stock $stock)
    {
        $data = $request->validated();

        DB::transaction(function () use ($stock, $data) {
            $stock->update($data);
        });

        return response()->json(new StockResource($stock));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        $stock->delete();

        return response()->json(null, 204);
    }
}

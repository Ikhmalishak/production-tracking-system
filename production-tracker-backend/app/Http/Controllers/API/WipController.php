<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Wip;
use Illuminate\Support\Facades\DB;

class WipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $wips = Wip::orderBy('created_at', 'desc')->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $wips,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'sku_id' => 'required|exists:skus,id',
                'wip_code' => 'required|string|unique:wips,wip_code',
                'batch_size' => 'required|integer',
                'status' => 'required|in:Assembly,Testing',
            ]);

            $wip = DB::transaction(function () use ($validated) {
                return Wip::create([
                    'sku_id' => $validated['sku_id'],
                    'wip_code' => $validated['wip_code'],
                    'batch_size' => $validated['batch_size'],
                    'status' => $validated['status']
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'SKU created successfully',
                'data' => $wip,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create SKU',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $wip = Wip::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $wip,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'SKU not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    //show by sku ID
    public function getBySkuId($skuId)
    {
        try {
            // Fetch all WIPs associated with the provided SKU ID
            $wips = Wip::where('sku_id', $skuId)->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $wips,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'sku_id' => 'required|exists:skus,id',
                'wip_code' => 'required|string',
                'batch_size' => 'required|integer',
                'status' => 'required|in:Assembly,Testing'
            ]);

            $wip = Wip::findOrFail($id);
            $wip->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'SKU updated successfully',
                'data' => $wip,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update SKU',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $wip = Wip::findOrFail($id);
            $wip->delete();

            return response()->json([
                'success' => true,
                'message' => 'SKU deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete SKU',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

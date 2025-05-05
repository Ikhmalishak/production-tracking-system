<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Sku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SkuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $skus = Sku::orderBy('created_at', 'desc')->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $skus,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong!',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function getByProject(Request $request, $projectId)
    {
        try {
            $skus = Sku::where('project_id', $projectId)
                        ->orderBy('created_at', 'desc')
                        ->get();
    
            if ($skus->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No SKUs found for the given project ID.',
                ], 404); // Return 404 if no SKUs are found
            }
    
            return response()->json([
                'success' => true,
                'data' => $skus,
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
                'project_id' => 'required|exists:projects,id',
                'sku_code' => 'required|string|unique:skus,sku_code',
                'description' => 'nullable|string',
            ]);

            $sku = DB::transaction(function () use ($validated) {
                return Sku::create([
                    'project_id' => $validated['project_id'],
                    'sku_code' => $validated['sku_code'],
                    'description' => $validated['description'] ?? null,
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'SKU created successfully',
                'data' => $sku,
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
            $sku = Sku::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $sku,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'SKU not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'sku_code' => 'sometimes|required|string|unique:skus,sku_code,' . $id,
                'description' => 'nullable|string',
            ]);

            $sku = Sku::findOrFail($id);
            $sku->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'SKU updated successfully',
                'data' => $sku,
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
            $sku = Sku::findOrFail($id);
            $sku->delete();

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

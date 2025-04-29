<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ScanRecord;
use App\Models\Sku;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Make sure you import Carbon
use Illuminate\Support\Facades\Log;

class ScanRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $sku_id = $request->input('sku_id');

            $scan_records = ScanRecord::where('sku_id', $sku_id)
                ->orderBy('created_at', 'desc')
                ->with(
                    [
                        'sku:id,sku_code',
                        'wip:id,wip_code'
                    ]
                )
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $scan_records,
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
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'sku_id' => 'required|exists:skus,id',
                'wip_id' => 'required|exists:wips,id',
                'serial_id' => 'required|string|unique:scan_records,serial_id',
                'scanned_at' => 'required',
            ]);

            // Format scanned_at using Carbon to MySQL datetime format
            $scannedAt = Carbon::parse($validated['scanned_at'])->format('Y-m-d H:i:s');

            $scan_number = $this->generateScanNumber($validated['sku_id']);

            $scanned_records = DB::transaction(function () use ($validated, $scan_number, $scannedAt) {
                return ScanRecord::create([
                    'sku_id' => $validated['sku_id'],
                    'wip_id' => $validated['wip_id'],
                    'serial_id' => $validated['serial_id'],
                    'scanned_at' => $scannedAt,
                    'scan_number' => $scan_number
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Item scanned successfully',
                'data' => $scanned_records,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error scanning item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to scan item',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    private function generateScanNumber($sku_id)
    {
        $today = Carbon::today();

        $latest = ScanRecord::where('sku_id', $sku_id)
            ->whereDate('created_at', $today)
            ->orderBy('scan_number', 'desc')
            ->first();

        return $latest ? $latest->scan_number + 1 : 1;
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

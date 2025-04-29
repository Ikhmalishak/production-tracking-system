<?php

namespace Database\Seeders;

use App\Models\Sku;
use App\Models\Wip;
use App\Models\ScanRecord;
use Illuminate\Database\Seeder;

class ScanRecordSeeder extends Seeder
{
    public function run()
    {
        $sku1 = Sku::where('sku_code', '1234')->first();
        $sku2 = Sku::where('sku_code', '123')->first();

        $wip1 = Wip::where('wip_code', 'WIP-1234-202504-001')->first();
        $wip2 = Wip::where('wip_code', 'WIP-1234-202504-002')->first();
        $wip5 = Wip::where('wip_code', 'WIP-123-202504-005')->first();

        $scanRecords = [
            [
                'serial_id' => 'TW-1234-A001-000001',
                'sku_id' => $sku1->id,
                'wip_id' => $wip1->id,
                'scan_number' => 1,
                'scanned_at' => '2025-04-22 10:53:35',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'serial_id' => 'TW-1234-A002-000001',
                'sku_id' => $sku1->id,
                'wip_id' => $wip2->id,
                'scan_number' => 1,
                'scanned_at' => '2025-04-22 10:53:34',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'serial_id' => 'TW-123-A005-000001',
                'sku_id' => $sku2->id,
                'wip_id' => $wip5->id,
                'scan_number' => 1,
                'scanned_at' => '2025-04-22 09:01:43',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        ScanRecord::insert($scanRecords);
    }
}
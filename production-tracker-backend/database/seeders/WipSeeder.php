<?php

namespace Database\Seeders;

use App\Models\Sku;
use App\Models\Wip;
use Illuminate\Database\Seeder;

class WipSeeder extends Seeder
{
    public function run()
    {
        $sku1 = Sku::where('sku_code', '1234')->first();
        $sku2 = Sku::where('sku_code', '123')->first();
        $sku3 = Sku::where('sku_code', 'SW-BLK-44MM-001')->first();

        $wips = [
            [
                'sku_id' => $sku1->id,
                'wip_code' => 'WIP-1234-202504-001',
                'batch_size' => 500,
                'status' => 'Assembly',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sku_id' => $sku1->id,
                'wip_code' => 'WIP-1234-202504-002',
                'batch_size' => 300,
                'status' => 'Testing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sku_id' => $sku2->id,
                'wip_code' => 'WIP-123-202504-005',
                'batch_size' => 400,
                'status' => 'Assembly',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sku_id' => $sku3->id,
                'wip_code' => 'WIP-BLK-44MM-202504-001',
                'batch_size' => 1000,
                'status' => 'Assembly',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Wip::insert($wips);
    }
}
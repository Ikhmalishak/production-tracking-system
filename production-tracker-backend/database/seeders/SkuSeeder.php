<?php

namespace Database\Seeders;

use App\Models\Sku;
use App\Models\Project;
use Illuminate\Database\Seeder;

class SkuSeeder extends Seeder
{
    public function run()
    {
        $project1 = Project::where('project_code', 'PRJ-HOZELOCK-2025')->first();
        $project2 = Project::where('project_code', 'PRJ-TECHWATCH-2025')->first();

        $skus = [
            [
                'project_id' => $project1->id,
                'sku_code' => '1234',
                'description' => 'Hozelock Product 1234',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => $project1->id,
                'sku_code' => '123',
                'description' => 'Hozelock Product 123',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => $project2->id,
                'sku_code' => 'SW-BLK-44MM-001',
                'description' => 'Black Smartwatch 44mm',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Sku::insert($skus);
    }
}
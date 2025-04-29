<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        $projects = [
            [
                'project_code' => 'PRJ-HOZELOCK-2025',
                'name' => 'Hozelock Production',
                'description' => 'Production tracking for Hozelock products in 2025',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_code' => 'PRJ-TECHWATCH-2025',
                'name' => 'TechWatch Smartwatch Line',
                'description' => 'Smartwatch production initiative for 2025',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Project::insert($projects);
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InsuranceTypesSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Health Insurance', 'description' => 'Medical and healthcare coverage'],
            ['name' => 'Marine Insurance', 'description' => 'Covers ships, cargo, and transport'],
            ['name' => 'Liability Insurance', 'description' => 'Covers legal liabilities'],
            ['name' => 'Engineering Insurance', 'description' => 'Covers construction & engineering risks'],
            ['name' => 'Residential Insurance', 'description' => 'Covers home and property'],
            ['name' => 'Workmen Compensation', 'description' => 'Covers workplace injuries'],
        ];

        DB::table('insurance_types')->insert($types);
    }
}

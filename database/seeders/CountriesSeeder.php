<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = include config_path('nationalities.php');

        foreach ($countries as $country) {
            DB::table('countries')->insert([
                'num_code' => $country['num_code'],
                'alpha_2_code' => $country['alpha_2_code'],
                'alpha_3_code' => $country['alpha_3_code'],
                'en_short_name' => $country['en_short_name'],
                'nationality' => $country['nationality'],
            ]);
        }
    }
}

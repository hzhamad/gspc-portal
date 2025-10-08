<?php

namespace Database\Seeders;

use App\Enums\UserRoles;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        //Super Admin
        $superAdminRole = Role::firstOrCreate(['name' => UserRoles::SUPER_ADMIN->value]);

        $user = User::create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'superadmin@admin.com',
            'phone' => '0000000000',
            'dob' => now()->subYears(30),
            'residency' => 'Dubai',
            'eid_number' => '12345672201234',
            'password' => bcrypt('admin'),
        ]);

        $user->assignRole($superAdminRole);

        //Admin
        $adminRole = Role::firstOrCreate(['name' => UserRoles::ADMIN->value]);

        $user = User::create([
            'first_name' => "Admin",
            'last_name' => "User",
            'email' => 'admin@admin.com',
            'phone' => '0000000001',
            'dob' => now()->subYears(25),
            'residency' => 'Dubai',
            'eid_number' => '12345678902234',
            'password' => bcrypt('admin'),
        ]);

        $user->assignRole($adminRole);

        //Client / Agent
        $agentRole = Role::firstOrCreate(['name' => UserRoles::AGENT->value]);

        $user = User::create([
            'first_name' => "Client",
            'last_name' => "User",
            'email' => 'client@client.com',
            'phone' => '0000000002',
            'dob' => now()->subYears(20),
            'residency' => 'Dubai',
            'eid_number' => '12345678903224',
            'password' => bcrypt('client'),
        ]);

        $user->assignRole($agentRole);
    }
}

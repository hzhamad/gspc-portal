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
            'password' => bcrypt('admin'),
        ]);

        $user->assignRole($superAdminRole);

        //Admin
        $adminRole = Role::firstOrCreate(['name' => UserRoles::ADMIN->value]);

        $user = User::create([
            'first_name' => "Admin",
            'last_name' => "User",
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin'),
        ]);

        $user->assignRole($adminRole);

        //Agent
        $agentRole = Role::firstOrCreate(['name' => UserRoles::AGENT->value]);

        $user = User::create([
            'first_name' => "Agent",
            'last_name' => "User",
            'email' => 'agent@agent.com',
            'password' => bcrypt('agent'),
        ]);

        $user->assignRole($agentRole);
    }
}

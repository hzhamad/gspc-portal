<?php

namespace App\Enums;

enum UserRoles: string
{
    case SUPER_ADMIN = 'super-admin';
    case ADMIN = 'admin';
    case CLIENT = 'client';

    public function label(): ?string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::ADMIN => 'Admin',
            self::CLIENT => 'Client',
        };
    }
}

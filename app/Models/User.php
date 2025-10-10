<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable // implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'phone',
        'dob',
        'residency',
        'eid_number',
        'eid_file',
        'passport_copy',
        'profile_picture',
        'password',
        'email_verified_at',
    ];

    protected $appends = ['fullname', 'name'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'dob' => 'date',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the OTPs for the user.
     */
    public function otps(): HasMany
    {
        return $this->hasMany(UserOtp::class);
    }

    /**
     * Get the user's full name.
     */
    public function getFullnameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }

    /**
     * Get the user's name (alias for fullname).
     */
    public function getNameAttribute(): string
    {
        return $this->getFullnameAttribute();
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * The attributes that should be cast to native types.
     */
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Scope a query to only include unverified users.
     */
    public function scopeUnverified($query)
    {
        return $query->whereNull('email_verified_at');
    }

    /**
     * Get the appropriate dashboard route based on user role.
     */
    public function getDashboardRoute(): string
    {
        if ($this->hasAnyRole(['admin', 'super-admin'])) {
            return 'admin.dashboard';
        }

        return 'client.dashboard';
    }
}

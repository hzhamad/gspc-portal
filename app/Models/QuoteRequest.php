<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuoteRequest extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'application_type',
        'principal_first_name',
        'principal_middle_name',
        'principal_last_name',
        'phone_number',
        'principal_id',
        'dob',
        'emirate_of_residency',
        'profile_picture',
        'eid_file',
        'passport_copy',
        'status',
        'quote_file',
        'premium_file',
        'payment_link',
        'policy_file',
        'admin_notes',
    ];

    protected $appends = ['principal_fullname', 'principal_name'];

    protected $casts = [
        'dob' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'policy_file' => 'array',
        'admin_notes' => 'array',
    ];

    /**
     * Get the user that owns the quote request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the dependents for the quote request.
     */
    public function dependents(): HasMany
    {
        return $this->hasMany(Dependent::class);
    }

    /**
     * Get the principal's full name.
     */
    public function getPrincipalFullnameAttribute(): string
    {
        return trim("{$this->principal_first_name} {$this->principal_middle_name} {$this->principal_last_name}");
    }

    /**
     * Get the principal's name (alias for principal_fullname).
     */
    public function getPrincipalNameAttribute(): string
    {
        return $this->getPrincipalFullnameAttribute();
    }
}

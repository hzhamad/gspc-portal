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
        'principal_name',
        'phone_number',
        'principal_id',
        'dob',
        'emirate_of_residency',
        'profile_picture',
        'eid_file',
        'passport_copy',
        'status',
        'quote_file',
        'payment_link',
        'policy_file',
        'admin_notes',
    ];

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
}

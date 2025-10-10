<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dependent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'quote_request_id',
        'uid_number',
        'eid_number',
        'marital_status',
        'emirate_of_residency',
        'dob',
        'relationship',
        'profile_picture',
        'eid_file',
        'passport_copy',
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    public function getFullNameAttribute(): string
    {
        return $this->first_name . ($this->middle_name ? ' ' . $this->middle_name : '') . ' ' . $this->last_name;
    }

    /**
     * Get the quote request that owns the dependent.
     */
    public function quoteRequest(): BelongsTo
    {
        return $this->belongsTo(QuoteRequest::class);
    }
}

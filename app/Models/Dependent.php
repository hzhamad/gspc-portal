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

    protected $appends = ['fullname', 'name'];

    protected $casts = [
        'dob' => 'date',
    ];

    /**
     * Get the dependent's full name.
     */
    public function getFullnameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }

    /**
     * Get the dependent's name (alias for fullname).
     */
    public function getNameAttribute(): string
    {
        return $this->getFullnameAttribute();
    }

    /**
     * Get the quote request that owns the dependent.
     */
    public function quoteRequest(): BelongsTo
    {
        return $this->belongsTo(QuoteRequest::class);
    }
}

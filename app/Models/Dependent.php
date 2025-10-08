<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dependent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'quote_request_id',
        'uid_number',
        'eid_number',
        'marital_status',
        'date_of_birth',
        'relationship',
        'profile_picture',
        'eid_copy',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get the quote request that owns the dependent.
     */
    public function quoteRequest(): BelongsTo
    {
        return $this->belongsTo(QuoteRequest::class);
    }
}

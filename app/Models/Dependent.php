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
        'dob',
        'relationship',
        'profile_picture',
        'eid_file',
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    /**
     * Get the quote request that owns the dependent.
     */
    public function quoteRequest(): BelongsTo
    {
        return $this->belongsTo(QuoteRequest::class);
    }
}

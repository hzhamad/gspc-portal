<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteRequestRecipient extends Model
{
    protected $fillable = ['email', 'is_active', 'created_by'];
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('num_code');
            $table->string('alpha_2_code');
            $table->string('alpha_3_code');
            $table->string('en_short_name');
            $table->string('nationality');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('countries');
    }
};

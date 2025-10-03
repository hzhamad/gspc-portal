<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('policy_number')->unique();
            $table->dateTime('issued_at')->nullable();
            $table->enum('status', ['active','expired','cancelled'])->default('active');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('policies');
    }
};

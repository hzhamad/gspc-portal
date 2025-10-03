<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sponsor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('agent_id')->nullable()->constrained('users');
            $table->foreignId('insurance_type_id')->constrained();
            $table->string('request_no')->unique();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('total_sum_insured', 15, 2)->nullable();
            $table->decimal('total_premium', 15, 2)->nullable();
            $table->enum('status', ['draft','pending_approval','approved','rejected'])->default('draft');
            $table->enum('payment_status', ['unpaid','paid','failed'])->default('unpaid');
            $table->timestamps();
        });

        Schema::create('quote_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->json('data'); // product-specific fields
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('quote_details');
        Schema::dropIfExists('quotes');
    }
};

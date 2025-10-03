<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('method')->default('ONLINE');   // Cash, Online,...
            $table->string('provider')->default('PAYD'); //
            $table->string('reference_no')->nullable();
            $table->enum('status', ['PENDING','SUCCESS','FAILED','REFUNDED'])->default('PENDING');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('payments');
    }
};

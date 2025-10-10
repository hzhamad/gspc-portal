<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quote_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('application_type', ['self', 'self_dependents', 'dependents']);

            // Principal applicant details (nullable for dependents-only applications)
            $table->string('principal_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('principal_id')->nullable();
            $table->date('dob')->nullable();
            $table->string('emirate_of_residency')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('eid_file')->nullable();

            // Status and workflow
            $table->enum('status', ['pending', 'quote_sent', 'completed', 'rejected'])->default('pending');

            // Team response files
            $table->string('quote_file')->nullable();
            $table->string('payment_link')->nullable();
            $table->string('policy_file')->nullable();

            // Notes from production team
            $table->json('admin_notes')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};

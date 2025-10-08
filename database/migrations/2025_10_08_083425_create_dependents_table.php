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
        Schema::create('dependents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_request_id')->constrained()->onDelete('cascade');

            // Dependent details
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('uid_number')->nullable();
            $table->string('eid_number')->nullable();
            $table->enum('marital_status', ['single', 'married']);
            $table->date('dob');
            $table->enum('relationship', ['spouse', 'child', 'parent', 'sibling']);

            // Documents
            $table->string('profile_picture')->nullable();
            $table->string('eid_file')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dependents');
    }
};

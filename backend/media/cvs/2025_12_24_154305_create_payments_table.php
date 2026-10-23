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
        Schema::create('payments', function (Blueprint $table) {
            // $table->id();
            // $table->decimal('prime',12,2)->default(0);
            // $table->decimal('ind',12,2)->default(0);
            // $table->decimal('hs',12,2)->default(0);
            // $table->decimal('cp',12,2)->default(0);
            // $table->decimal('avance',12,2)->default(0);
            // $table->decimal('oposition',12,2)->default(0);
            // $table->decimal('salaire_imposable', 12, 2)->default(0);
            // $table->decimal('salaire_net', 12, 2)->default(0);
            // $table->decimal('cnaps1', 12, 2)->default(0);
            // $table->decimal('ostie1', 12, 2)->default(0);
            // $table->decimal('cnaps2', 12, 2)->default(0);
            // $table->decimal('ostie2', 12, 2)->default(0);
            // $table->decimal('irsa', 12, 2)->default(0);
            // $table->decimal('retenues1', 12, 2)->default(0);
            // $table->date('date_payement');
            // $table->unsignedBigInteger('employer_id');
            // $table->foreign('employer_id')->references('id')->on('employers')->onDelete('restrict');
            // $table->timestamps();
             $table->id();

            $table->foreignId('employer_id')
                ->constrained('employers')
                ->onDelete('cascade');

            $table->date('date_paiement');

            // Éléments de gain saisis
            $table->decimal('prime', 12, 2)->default(0);
            $table->decimal('indemnite', 12, 2)->default(0);
            $table->decimal('heures_supplementaires', 12, 2)->default(0);
            $table->decimal('conge_paye', 12, 2)->default(0);

            // Retenues saisies
            $table->decimal('avance', 12, 2)->default(0);
            $table->decimal('opposition', 12, 2)->default(0);

            $table->timestamps();

                });
            }

            /**
             * Reverse the migrations.
             */
            public function down(): void
            {
                Schema::dropIfExists('payments');
    }
};

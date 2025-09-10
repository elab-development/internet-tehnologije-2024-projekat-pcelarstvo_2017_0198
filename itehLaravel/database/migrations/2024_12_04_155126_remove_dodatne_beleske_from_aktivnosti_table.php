<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveDodatneBeleskeFromAktivnostiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('aktivnosts', function (Blueprint $table) {
            $table->dropColumn('dodatne_beleske'); // Uklanjanje kolone
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('aktivnosts', function (Blueprint $table) {
            $table->text('dodatne_beleske')->nullable(); // Vraćanje kolone
        });
    }
}

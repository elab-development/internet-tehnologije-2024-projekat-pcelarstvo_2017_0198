<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameLokacijaToAdresaInKosniceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('kosnice', function (Blueprint $table) {
            $table->renameColumn('lokacija', 'adresa'); // Preimenovanje kolone
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('kosnice', function (Blueprint $table) {
            $table->renameColumn('adresa', 'lokacija'); // Vraćanje starog naziva
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKosniceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('kosnicas', function (Blueprint $table) {
            $table->id(); // Primarni ključ
            $table->string('naziv'); // Naziv košnice
            $table->string('lokacija')->nullable(); // Lokacija, može biti null
            $table->text('opis')->nullable(); // Opis košnice
            $table->timestamps(); // Kolone created_at i updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('kosnicas');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAktivnostiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aktivnosti', function (Blueprint $table) {
            $table->id(); // Primarni ključ
            $table->string('naziv'); // Naziv aktivnosti
            $table->date('datum'); // Datum aktivnosti
            $table->enum('tip', ['sezonska', 'prilagodjena']); // Tip aktivnosti
            $table->text('opis')->nullable(); // Opis aktivnosti, može biti null
            $table->text('dodatne_beleske')->nullable(); // Dodatne beleške, može biti null
            $table->unsignedBigInteger('kosnica_id'); // Strani ključ na tabelu kosnice
            $table->unsignedBigInteger('user_id'); // Strani ključ na tabelu users
            $table->timestamps(); // Kolone created_at i updated_at

            // Definisanje stranih ključeva
            $table->foreign('kosnica_id')->references('id')->on('kosnice')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('aktivnosti');
    }
}

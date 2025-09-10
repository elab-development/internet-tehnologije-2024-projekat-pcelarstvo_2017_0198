<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKomentariTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('komentars', function (Blueprint $table) {
            $table->id(); // Primarni ključ
            $table->text('sadrzaj'); // Sadržaj komentara
            $table->date('datum'); // Datum komentara
            $table->unsignedBigInteger('kosnica_id'); // Strani ključ na tabelu kosnice
            $table->unsignedBigInteger('user_id'); // Strani ključ na tabelu users
            $table->timestamps(); // Kolone created_at i updated_at

            // Definisanje stranih ključeva
            $table->foreign('kosnica_id')->references('id')->on('kosnicas')->onDelete('cascade');
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
        Schema::dropIfExists('komentars');
    }
}

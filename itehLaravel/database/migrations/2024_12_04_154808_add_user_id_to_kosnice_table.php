<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserIdToKosniceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('kosnice', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('opis'); // Dodajemo kolonu user_id posle 'opis'
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Strani ključ sa onDelete('cascade')
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
            $table->dropForeign(['user_id']); // Brisanje stranog ključa
            $table->dropColumn('user_id'); // Brisanje kolone
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCoordinatesToKosniceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('kosnice', function (Blueprint $table) {
            $table->decimal('longitude', 10, 7)->nullable()->after('opis'); // Dodaje longitude kolonu
            $table->decimal('latitude', 10, 7)->nullable()->after('longitude'); // Dodaje latitude kolonu
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
            $table->dropColumn(['longitude', 'latitude']); // Uklanja kolone
        });
    }
}

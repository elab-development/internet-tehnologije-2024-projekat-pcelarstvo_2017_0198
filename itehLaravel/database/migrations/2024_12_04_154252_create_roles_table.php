<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Kreiranje tabele roles
        Schema::create('roles', function (Blueprint $table) {
            $table->id(); // Primarni ključ
            $table->string('naziv'); // Naziv uloga
            $table->text('opis')->nullable(); // Opis uloge, može biti null
            $table->timestamps(); // Kolone created_at i updated_at
        });

        // Dodavanje kolone role_id u tabelu users
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('role_id')->nullable()->after('id'); // Dodaje se kolona posle 'id'
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('set null'); // Postavljanje stranog ključa
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Uklanjanje stranog ključa i kolone iz users
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']); // Brisanje stranog ključa
            $table->dropColumn('role_id'); // Brisanje kolone
        });

        // Brisanje tabele roles
        Schema::dropIfExists('roles');
    }
}

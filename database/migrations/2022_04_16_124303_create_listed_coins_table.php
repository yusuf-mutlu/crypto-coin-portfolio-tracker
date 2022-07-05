<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('listed_coins', function (Blueprint $table) {
            $table->increments('id');
            $table->string('coingecko_id', 255)->unique()->index();
            $table->string('symbol', 255)->index();
            $table->string('name', 255)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('listed_coins');
    }
};

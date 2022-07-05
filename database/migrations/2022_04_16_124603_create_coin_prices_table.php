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
        Schema::create('coin_prices', function (Blueprint $table) {
            $table->id();
            $table->integer('coin_id')->unique()->unsigned();
            $table->decimal('current_price_usd', 65, 18)->nullable();
            $table->bigInteger('market_cap_usd')->nullable();
            $table->bigInteger('market_volume_24h')->nullable();
            $table->decimal('price_change_percentage_24h', 65, 18)->nullable();
            $table->bigInteger('price_last_updated_at')->nullable();
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
        Schema::dropIfExists('coin_prices');
    }
};

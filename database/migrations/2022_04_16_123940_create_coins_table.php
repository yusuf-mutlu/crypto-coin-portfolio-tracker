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
        Schema::create('coins', function (Blueprint $table) {
            $table->increments('id');
            $table->string('coingecko_id', 255)->unique()->index();
            $table->string('symbol', 255)->index();
            $table->string('name', 255)->index();

            //$table->decimal('current_price_usd', 65, 18)->nullable();
            $table->bigInteger('total_supply')->nullable()->index();
            $table->bigInteger('max_supply')->nullable()->index();
            $table->bigInteger('circulating_supply')->nullable()->index();
            //$table->bigInteger('market_cap_usd')->nullable();
            //$table->bigInteger('market_cap_rank')->nullable();
            //$table->bigInteger('coingecko_rank')->nullable();
            //$table->timestamp('last_updated')->nullable();

            //$table->decimal('high_24h_usd', 65, 18)->nullable();
            //$table->decimal('low_24h_usd', 65, 18)->nullable();
            //$table->decimal('price_change_percentage_24h', 65, 18)->nullable();

            //$table->longText('total_value_locked')->nullable();
            //$table->decimal('ath_usd', 65, 18)->nullable();
            $table->decimal('ath_change_percentage_usd', 65, 18)->nullable()->index();
            //$table->timestamp('ath_date_usd')->nullable();
            //$table->decimal('atl_usd', 65, 18)->nullable();
            //$table->timestamp('atl_date_usd')->nullable();

            //$table->longText('platforms')->nullable();
            $table->text('categories_text')->nullable();
            $table->text('public_notice')->nullable();
            //$table->longText('additional_notices')->nullable();
            $table->text('description')->nullable();
            //$table->longText('links')->nullable();

            $table->text('image_thumb')->nullable();
            $table->text('image_small')->nullable();
            $table->text('image_large')->nullable();
            $table->string('country_origin', 255)->nullable();
            $table->string('contract_address', 255)->nullable();

            //$table->bigInteger('facebook_likes')->nullable();
            //$table->bigInteger('twitter_followers')->nullable();
            //$table->bigInteger('reddit_average_posts_48h')->nullable();
            //$table->bigInteger('reddit_average_comments_48h')->nullable();
            //$table->bigInteger('reddit_subscribers')->nullable();
            //$table->bigInteger('reddit_accounts_active_48h')->nullable();
            //$table->bigInteger('telegram_channel_user_count')->nullable();

            //$table->longText('tickers')->nullable();
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
        Schema::dropIfExists('coins');
    }
};

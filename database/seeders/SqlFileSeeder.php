<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SqlFileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categoriesSqlPath = base_path('/database/seeds/sql/categories.sql');
        $categoriesSql = file_get_contents($categoriesSqlPath);
        DB::unprepared($categoriesSql);

        $listedCoinsSqlPath = base_path('/database/seeds/sql/listed_coins.sql');
        $listedCoinsSql = file_get_contents($listedCoinsSqlPath);
        DB::unprepared($listedCoinsSql);

        $coinsSqlPath = base_path('/database/seeds/sql/coins.sql');
        $coinsSql = file_get_contents($coinsSqlPath);
        DB::unprepared($coinsSql);

        $categoryCoinSqlPath = base_path('/database/seeds/sql/category_coin.sql');
        $categoryCoinsSql = file_get_contents($categoryCoinSqlPath);
        DB::unprepared($categoryCoinsSql);

        $coinPricesSqlPath = base_path('/database/seeds/sql/coin_prices.sql');
        $coinPricesSql = file_get_contents($coinPricesSqlPath);
        DB::unprepared($coinPricesSql);
    }
}

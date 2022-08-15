<?php

namespace App\Console\Commands;

use App\Models\Coin;
use App\Models\CoinPrice;
use Codenixsv\CoinGeckoApi\CoinGeckoClient;
use Illuminate\Console\Command;
use Symfony\Component\Console\Command\Command as CommandAlias;

class SaveCoinPricesFromCoinGecko extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coinGecko:saveCoinPrices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Saves coin prices from CoinGecko API.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     * @throws \Exception
     */
    public function handle()
    {
        $this->line('Saving coin prices from coingecko.');

        $coinCount = Coin::count();
        $client = new CoinGeckoClient();
        $priceArray = [];

        for ($x = 0; $x <= $coinCount; $x+=500) {
            sleep(6);
            $coins = Coin::skip($x)->take(500)->pluck('coingecko_id')->toArray();
            $priceData = $client->simple()->getPrice(implode(',' , $coins), 'usd', [
                'include_market_cap' => 'true',
                'include_24hr_vol' => 'true',
                'include_24hr_change' => 'true',
                'include_last_updated_at' => 'true',
            ]);

            $priceArray[] = $priceData;
        }

        foreach (array_filter($priceArray) as $prices) {
            foreach ($prices as $key => $price) {
                $coinId = Coin::where('coingecko_id', $key)->pluck('id')->first();
                $currentCoinFromDB = CoinPrice::where('coin_id', $coinId)->first();

                if (!$currentCoinFromDB) {
                    $newCoin = new CoinPrice;
                    $newCoin->coin_id = $coinId;
                    $newCoin->current_price_usd = isset($price['usd']) && trim($price['usd']) !== null ? (float)($price['usd']) : 0;
                    $newCoin->market_cap_usd = isset($price['usd_market_cap']) && trim($price['usd_market_cap']) !== null ? (int)($price['usd_market_cap']) : 0;
                    $newCoin->market_volume_24h = isset($price['usd_24h_vol']) && trim($price['usd_24h_vol']) !== null ? (int)($price['usd_24h_vol']) : 0;
                    $newCoin->price_change_percentage_24h = isset($price['usd_24h_change']) && trim($price['usd_24h_change']) !== null ? (float)($price['usd_24h_change']) : 0;
                    $newCoin->price_last_updated_at = isset($price['last_updated_at']) && trim($price['last_updated_at']) !== null ? (int)($price['last_updated_at']) : 0;
                    $newCoin->save();
                } else {
                    $currentCoinFromDB->current_price_usd = isset($price['usd']) && trim($price['usd']) !== null ? (float)($price['usd']) : 0;
                    $currentCoinFromDB->market_cap_usd = isset($price['usd_market_cap']) && trim($price['usd_market_cap']) !== null ? (int)($price['usd_market_cap']) : 0;
                    $currentCoinFromDB->market_volume_24h = isset($price['usd_24h_vol']) && trim($price['usd_24h_vol']) !== null ? (int)($price['usd_24h_vol']) : 0;
                    $currentCoinFromDB->price_change_percentage_24h = isset($price['usd_24h_change']) && trim($price['usd_24h_change']) !== null ? (float)($price['usd_24h_change']) : 0;
                    $currentCoinFromDB->price_last_updated_at = isset($price['last_updated_at']) && trim($price['last_updated_at']) !== null ? (int)($price['last_updated_at']) : 0;
                    $currentCoinFromDB->save();
                }
            }
        }

        $this->info('Saved coin prices from coingecko successfully!');

        return CommandAlias::SUCCESS;
    }
}

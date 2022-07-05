<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Coin;
use App\Models\ListedCoin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Console\Command\Command as CommandAlias;

class SaveCoinsFromCoinGecko extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coinGecko:saveCoins';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
     */
    public function handle()
    {
        $this->line('Saving coin details from coingecko.');

        $coinsFromDB = ListedCoin::all();

        foreach ($coinsFromDB as $coinFromDB) {
            $currentCoinFromDB = Coin::where('coingecko_id', $coinFromDB->getAttributes()['coingecko_id'])->first();

            if ($currentCoinFromDB === null) {
                $coinApiUrl = $this->getApiUrlOfCoin($coinFromDB->getAttributes()['coingecko_id']);
                $coin = Http::get($coinApiUrl, ['verify' => false])->json();

                if (isset($coin['error'])) {
                    continue;
                }

                if (isset($coin['id']) && $coin['id'] !== null) {
                    $coinObj = new Coin;
                    $coinObj->coingecko_id = $coin['id'];
                    $coinObj->symbol = $coin['symbol'];
                    $coinObj->name = $coin['name'];
                    //$coinObj->current_price_usd = isset($coin['market_data']['current_price']['usd']) && trim($coin['market_data']['current_price']['usd']) !== null ? (float)($coin['market_data']['current_price']['usd']) : null;
                    $coinObj->total_supply = (int)($coin['market_data']['total_supply']);
                    $coinObj->max_supply = (int)($coin['market_data']['max_supply']);
                    $coinObj->circulating_supply = (int)($coin['market_data']['circulating_supply']);
                    //$coinObj->market_cap_usd = isset($coin['market_data']['market_cap']['usd']) ? (int)($coin['market_data']['market_cap']['usd']) : 0;
                    //$coinObj->market_cap_rank = (int)($coin['market_cap_rank']);
                    //$coinObj->coingecko_rank = (int)($coin['coingecko_rank']);
                    //$coinObj->last_updated = date('Y-m-d h:i:s', strtotime($coin['last_updated']));
                    //$coinObj->high_24h_usd = isset($coin['market_data']['high_24h']['usd']) ? (float)($coin['market_data']['high_24h']['usd']) : 0;
                    //$coinObj->low_24h_usd = isset($coin['market_data']['low_24h']['usd']) ? (float)($coin['market_data']['low_24h']['usd']) : 0;
                    //$coinObj->price_change_percentage_24h = (float)($coin['market_data']['price_change_percentage_24h']);
                    //$coinObj->total_value_locked = json_encode($coin['market_data']['total_value_locked']);
                    //$coinObj->ath_usd = isset($coin['market_data']['ath']['usd']) ? (float)($coin['market_data']['ath']['usd']) : 0;
                    $coinObj->ath_change_percentage_usd = isset($coin['market_data']['ath_change_percentage']['usd']) ? number_format($coin['market_data']['ath_change_percentage']['usd'], 6) : 0;
                    //$coinObj->ath_date_usd = isset($coin['market_data']['ath_date']['usd']) ? date('Y-m-d h:i:s', strtotime($coin['market_data']['ath_date']['usd'])) : null;
                    //$coinObj->atl_usd = isset($coin['market_data']['atl']['usd']) ? (float)($coin['market_data']['atl']['usd']) : null;
                    //$coinObj->atl_date_usd = isset($coin['market_data']['atl_date']['usd']) ? date('Y-m-d h:i:s', strtotime($coin['market_data']['atl_date']['usd'])) : null;
                    //$coinObj->platforms = json_encode($coin['platforms']);
                    $coinObj->categories_text = json_encode($coin['categories']);
                    $coinObj->public_notice = $coin['public_notice'];
                    //$coinObj->additional_notices = json_encode($coin['additional_notices']);
                    $coinObj->description = $coin['description']['en'];
                    //$coinObj->links = json_encode($coin['links']);
                    $coinObj->image_thumb = $coin['image']['thumb'];
                    $coinObj->image_small = $coin['image']['small'];
                    $coinObj->image_large = $coin['image']['large'];
                    $coinObj->country_origin = $coin['country_origin'];
                    $coinObj->contract_address = isset($coin['contract_address']) ? $coin['contract_address'] : '';
                    //$coinObj->facebook_likes = (int)($coin['community_data']['facebook_likes']);
                    //$coinObj->twitter_followers = (int)($coin['community_data']['twitter_followers']);
                    //$coinObj->reddit_average_posts_48h = (int)($coin['community_data']['reddit_average_posts_48h']);
                    //$coinObj->reddit_average_comments_48h = (int)($coin['community_data']['reddit_average_comments_48h']);
                    //$coinObj->reddit_subscribers = (int)($coin['community_data']['reddit_subscribers']);
                    //$coinObj->reddit_accounts_active_48h = (int)($coin['community_data']['reddit_accounts_active_48h']);
                    //$coinObj->telegram_channel_user_count = (int)($coin['community_data']['telegram_channel_user_count']);
                    //$coinObj->tickers = json_encode($coin['tickers']);
                    $coinObj->save();

                    $category = Category::whereIn('name', $coin['categories'])->get();
                    $coinObj->categories()->attach($category);
                }
            }
        }

        $this->info('Saved all coin details from coingecko successfully!');

        return CommandAlias::SUCCESS;
    }

    protected function getApiUrlOfCoin($coinId): string
    {
        return 'https://api.coingecko.com/api/v3/coins/'.$coinId.'?localization=false';
    }
}

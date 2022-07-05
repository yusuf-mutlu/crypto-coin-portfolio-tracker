<?php

namespace App\Console\Commands;

use App\Models\ListedCoin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Console\Command\Command as CommandAlias;

class SaveListedCoinsFromCoinGecko extends Command
{
    protected CONST COINS_LIST_API = "https://api.coingecko.com/api/v3/coins/list";

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coinGecko:saveListedCoins';

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
     */
    public function handle(): int
    {
        $this->line('Saving all listed coins from coingecko.');

        $listedCoins = Http::get(self::COINS_LIST_API, ['verify' => false])->json();

        foreach ($listedCoins as $coin) {
            if (
                !$this->contains('Long', $coin['name'])
                && !$this->contains('Short', $coin['name'])
                && !$this->contains('RealT Token', $coin['name'])
            ) {
                $currentCoinFromDB = ListedCoin::where('coingecko_id', $coin['id'])->first();

                if ($currentCoinFromDB === null) {
                    $coinObj = new ListedCoin;
                    $coinObj->coingecko_id = $coin['id'];
                    $coinObj->symbol = $coin['symbol'];
                    $coinObj->name = $coin['name'];
                    $coinObj->save();
                }
            }
        }

        $this->info('Saved all listed coins from coingecko successfully!');

        return CommandAlias::SUCCESS;
    }

    protected function contains($needle, $haystack): bool
    {
        return str_contains($haystack, $needle);
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Command\Command as CommandAlias;

class UpdateDataFromCoinGecko extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coinGecko:updateData';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command saves categories, listed coins and coins from CoinGecko API.';

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
    public function handle(): int
    {
        if (
            $this->call('coinGecko:saveCategories') === CommandAlias::SUCCESS
            && $this->call('coinGecko:saveListedCoins') === CommandAlias::SUCCESS
            && $this->call('coinGecko:saveCoins') === CommandAlias::SUCCESS
        ) {
            $this->info('Updated all data from coingecko successfully!');

            return CommandAlias::SUCCESS;
        } else {
            $this->error('An error has happened!');

            return CommandAlias::FAILURE;
        }
    }
}

<?php

namespace App\Console\Commands;

use App\Models\Category;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Console\Command\Command as CommandAlias;

class SaveCategoriesFromCoinGecko extends Command
{
    protected CONST COINS_CATEGORIES_API = "https://api.coingecko.com/api/v3/coins/categories/list";

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coinGecko:saveCategories';

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
    public function handle(): int
    {
        $this->line('Saving categories from coingecko.');

        $categoriesList = Http::get(self::COINS_CATEGORIES_API, ['verify' => false])->json();

        foreach ($categoriesList as $category) {
            $currentCategoryFromDB = Category::where('coingecko_category_id', $category['category_id'])->first();

            if (!$currentCategoryFromDB) {
                $coinObj = new Category;
                $coinObj->coingecko_category_id = $category['category_id'];
                $coinObj->name = $category['name'];
                $coinObj->save();
            }
        }

        $this->info('Saved all categories successfully!');

        return CommandAlias::SUCCESS;
    }
}

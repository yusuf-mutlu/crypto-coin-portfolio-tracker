<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class CryptocurrenciesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'symbol' => $this->symbol,
            'name' => $this->name,
            'image_thumb' => $this->image_thumb,
            'categories' => $this->getCoinCategoriesFromCoinId($this->id),
            'price' => DB::table('coin_prices')->where('coin_id', $this->id)->pluck(
                DB::raw('TRIM(coin_prices.current_price_usd)+0 as price')
            )->first(),
            'market_cap_usd' => DB::table('coin_prices')->where('coin_id', $this->id)->pluck(
                DB::raw('TRIM(coin_prices.market_cap_usd)+0 as market_cap_usd')
            )->first(),
            'price_change_percentage_24h' => DB::table('coin_prices')->where('coin_id', $this->id)->pluck(
                DB::raw('TRIM(coin_prices.price_change_percentage_24h)+0 as price_change_percentage_24h')
            )->first(),
            'market_volume_24h' => DB::table('coin_prices')->where('coin_id', $this->id)->pluck(
                DB::raw('TRIM(coin_prices.market_volume_24h)+0 as market_volume_24h')
            )->first(),
            'circulating_supply' => $this->circulating_supply,
            'max_supply' => $this->max_supply,
            'description' => $this->description,
        ];
    }

    public function getCoinCategoriesFromCoinId($coinId): string
    {
        $categories = DB::table('category_coin')
            ->leftJoin('categories', 'categories.id', '=', 'category_coin.category_id')
            ->where('category_coin.coin_id', $coinId)
            ->pluck('categories.name')
            ->toArray();
        return implode(', ', $categories);
    }
}

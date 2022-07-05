<?php

namespace App\Models;

use App\Http\Resources\CryptocurrenciesResource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Coin extends Model
{
    protected $table = 'coins';

    public function categories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    protected $appends = ['price'];
    public function getPriceAttribute()
    {
        $price = CoinPrice::where('coin_id', $this->id)->pluck('current_price_usd')->first();
        return $price;
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['coinName'] ?? null, function ($query, $coinName) {
            $query->where('name', 'like', '%'.$coinName.'%');
            $query->orWhere('symbol', 'like', '%'.$coinName.'%');
        })->when($filters['coinDescription'] ?? null, function ($query, $coinName) {
            $query->where('description', 'like', '%'.$coinName.'%');
        });
    }

    public function coinPrice()
    {
        return $this->hasOne(CoinPrice::class, 'coin_id', 'id');
    }

    public function scopeRestCryptocurrenciesPortfolio($query, $skip, $take, $sortField = 'market_cap_usd', $isDesc = true, $filter = []): array
    {
        $cryptocurrencies = DB::table('coins')
            ->leftJoin('coin_prices', 'coin_prices.coin_id', '=', 'coins.id')
            ->skip($skip)->take($take)
            ->when($filter, function ($query) use ($filter) {
                $query->where(function ($query) use ($filter) {
                    foreach ($filter as $filterItem) {
                        if (is_array($filterItem)) {
                            if ($filterItem[0] === 'name') {
                                $query->orWhere(function ($query) use ($filterItem) {
                                    $query->where('name', 'like', '%'.$filterItem[2].'%')
                                        ->orWhere('symbol', 'like', '%'.$filterItem[2].'%');
                                });
                            } else {
                                $query->where($filterItem[0], 'like', '%'.$filterItem[2].'%');
                            }
                        }
                    }
                });
            })
            ->select(
                'coins.id',
                'coins.name',
                'coins.symbol',
                'coins.image_thumb',
                DB::raw('TRIM(coin_prices.current_price_usd)+0 as price'),
                'coin_prices.market_cap_usd',
                'coins.circulating_supply',
                'coins.max_supply',
                'coins.description',
            )
            ->orderBy($sortField, $isDesc ? 'desc' : 'asc')
            ->get();

        return [
            'data' => CryptocurrenciesResource::collection(
                $cryptocurrencies
            )->response()->getData(),
            'totalCount' => !empty($filter) ? $cryptocurrencies->count() : Coin::count(),
        ];
    }
}

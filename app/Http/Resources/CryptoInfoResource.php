<?php

namespace App\Http\Resources;

use App\Models\CoinPrice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class CryptoInfoResource extends JsonResource
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
            'price' => DB::table('coin_prices')
                ->where('coin_id', $this->id)
                ->select(
                DB::raw('TRIM(coin_prices.current_price_usd)+0 as price'),
            )->get()->first()->price,
            'image_thumb' => $this->image_thumb,
        ];
    }
}

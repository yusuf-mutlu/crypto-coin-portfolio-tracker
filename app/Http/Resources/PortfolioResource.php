<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class PortfolioResource extends JsonResource
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
            'coin_id' => $this->coin_id,
            'name' => $this->name,
            'symbol' => $this->symbol,
            'image_thumb' => $this->image_thumb,
            'price' => $this->price,
            'price_change_percentage_24h' => DB::table('coin_prices')->where('coin_id', $this->coin_id)->pluck(
                DB::raw('TRIM(coin_prices.price_change_percentage_24h)+0 as price_change_percentage_24h')
            )->first(),
            'holdings' => $this->holdings,
            'quantity' => $this->quantity,
            'description' => $this->description,
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CoinResource extends JsonResource
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
            'coingecko_id' => $this->coingecko_id,
            'symbol' => $this->symbol,
            'name' => $this->name,
            'circulating_supply' => $this->circulating_supply,
            'total_supply' => $this->total_supply,
            'max_supply' => $this->max_supply,
            'image_thumb' => $this->image_thumb,
            'description' => $this->description,
        ];
    }
}

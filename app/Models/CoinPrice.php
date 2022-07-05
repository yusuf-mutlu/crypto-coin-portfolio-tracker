<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoinPrice extends Model
{
    protected $table = 'coin_prices';

    public function coin()
    {
        return $this->belongsTo(Coin::class, 'coin_id', 'id');
    }
}

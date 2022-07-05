<?php

namespace App\Http\Controllers;

use App\Models\Coin;
use Illuminate\Http\Request;

class CoinController extends Controller
{
    public function cryptocurrencies(Request $request)
    {
        $sort = json_decode($request->input('sort'));
        $filter = json_decode($request->input('filter'));

        $sortField = $sort ? $sort[0]->selector : 'market_cap_usd';
        $isDesc = $sort ? $sort[0]->desc : true;

        return Coin::restCryptocurrenciesPortfolio(
            $request->input('skip'),
            $request->input('take'),
            $sortField,
            $isDesc,
            $filter,
        );
    }
}

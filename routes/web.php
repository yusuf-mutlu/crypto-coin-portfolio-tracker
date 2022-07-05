<?php

use App\Http\Controllers\CoinController;
use App\Http\Controllers\PortfolioController;
use App\Http\Resources\CoinResource;
use App\Http\Resources\CryptoInfoResource;
use App\Models\Coin;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/crypto-alarm', function () {
    return Inertia::render('CryptoAlarm');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

//portfolio
Route::resource('portfolio', PortfolioController::class)->middleware('auth');

Route::get('/user-rest-portfolio', [PortfolioController::class, 'userPortfolio']
)->middleware('auth')->name('user.portfolio');

Route::get('/user-total-portfolio', [PortfolioController::class, 'userTotalPortfolio']
)->middleware('auth')->name('user.total.portfolio');

//portfolioStyle
Route::get('/portfolio-style', function (Request $request) {
    session(['user_portfolio_style' => $request->input('portfolioStyle')]);

    return response()->json(['success' => true]);
})->middleware('auth')->name('user.portfolioStyle');

//Coins
Route::get('/coins-dropdown', function () {
    return CoinResource::collection(
        Coin::leftJoin('coin_prices', 'coin_prices.coin_id', '=', 'coins.id')
            ->orderBy('market_cap_usd', 'desc')
            ->select('coins.*')
            ->take(100)
            ->get()
    )->response()->getData();
})->middleware('auth')->name('coins');

Route::get('/coins-dropdown-search', function (Request $request) {
    return CoinResource::collection(
        Coin::leftJoin('coin_prices', 'coin_prices.coin_id', '=', 'coins.id')
            ->orderBy('market_cap_usd', 'desc')
            ->select('coins.*')
            ->whereLike(['name', 'symbol'], $request->input('search'))
            ->get()
    )->response()->getData();
})->middleware('auth')->name('coins');

Route::get('/crypto-info-bar', function () {
    return CryptoInfoResource::collection(
        Coin::leftJoin('coin_prices', 'coin_prices.coin_id', '=', 'coins.id')
            ->orderBy('market_cap_usd', 'desc')
            ->select('coins.*')
            ->where('name', 'not like', '%USD%')->where('name', 'not like', '%Tether%')
            ->take(4)
            ->get()
    )->response()->getData();
})->name('crypto-info-bar');

Route::get('/cryptocurrencies', [CoinController::class, 'cryptocurrencies']
)->name('cryptocurrencies');

require __DIR__.'/auth.php';

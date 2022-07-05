<?php

namespace App\Models;

use App\Http\Resources\PortfolioResource;
use App\Notifications\VerifyEmailQueued;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'email', 'password'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function portfolio()
    {
        return $this->hasMany(Portfolio::class, 'user_id', 'id');
    }

    public function scopeRestUserPortfolio($query, $skip, $take, $sortField = 'holdings', $isDesc = true): array
    {
        $userPortfolio =
            DB::table('portfolios')
                ->leftJoin('coins', 'coins.id', '=', 'portfolios.coin_id')
                ->leftJoin('coin_prices', 'coin_prices.coin_id', '=', 'coins.id')
                ->where('portfolios.user_id', '=', Auth::id())
                ->skip($skip)->take($take)
                ->select(
                    'portfolios.id',
                    'portfolios.coin_id',
                    'coins.name',
                    'coins.symbol',
                    'coins.image_thumb',
                    DB::raw('TRIM(coin_prices.current_price_usd)+0 as price'),
                    DB::raw('TRIM(coin_prices.current_price_usd * portfolios.quantity)+0 AS holdings'),
                    DB::raw('TRIM(portfolios.quantity)+0 as quantity'),
                    'coins.description',
                )
                ->orderBy($sortField, $isDesc ? 'desc' : 'asc')
                ->get();

        return [
            'data' => PortfolioResource::collection(
                $userPortfolio
            )->response()->getData(),
            'totalCount' => Portfolio::where('user_id', Auth::id())->count(),
        ];
    }

    public function scopeRestUserTotalPortfolio ($query)
    {
        $total = DB::table('portfolios')
            ->leftJoin('coin_prices', 'coin_prices.coin_id', '=', 'portfolios.coin_id')
            ->where('portfolios.user_id', '=', Auth::id())
            ->select(
                DB::raw('sum(trim(coin_prices.current_price_usd) * portfolios.quantity) AS total')
            )
            ->get();

        return json_encode($total[0]->total);
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailQueued);
    }
}

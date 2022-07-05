<?php

namespace App\Http\Controllers;

use App\Http\Resources\PortfolioResource;
use App\Models\Coin;
use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PortfolioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'coin' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (Portfolio::where('coin_id', '=', $value)->where('user_id', '=', Auth::id())->exists()) {
                        $coinName = Coin::where('id', '=', $value)->pluck('name')->first();
                        $fail($coinName.' already exists in your portfolio. Try updating or deleting it.');
                    }
                },
            ],
            'quantity' => 'required',
        ]);

        $portfolio = new Portfolio();
        $portfolio->user_id = Auth::id();
        $portfolio->coin_id = $request->input('coin');
        $portfolio->quantity = $request->input('quantity');
        $portfolio->save();

        return back();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Portfolio  $portfolio
     * @return \Illuminate\Http\Response
     */
    public function show(Portfolio $portfolio)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Portfolio  $portfolio
     * @return \Illuminate\Http\Response
     */
    public function edit(Portfolio $portfolio)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Portfolio  $portfolio
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Portfolio $portfolio)
    {
        $request->validate([
            'quantity' => 'required',
        ]);

        $portfolio = Portfolio::findOrFail($portfolio->id);
        $portfolio->quantity = $request->input('quantity');
        $portfolio->save();

        session(['user_portfolio_style' => $request->input('portfolioStyle')]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Portfolio  $portfolio
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Portfolio $portfolio, Request $request)
    {
        Portfolio::destroy($portfolio->id);

        session(['user_portfolio_style' => $request->query('portfolioStyle')]);

        return back();
    }

    public function userPortfolio(Request $request)
    {
        $sort = json_decode($request->input('sort'));

        $sortField = $sort ? $sort[0]->selector : 'holdings';
        $isDesc = $sort ? $sort[0]->desc : true;

        return User::restUserPortfolio(
            $request->input('skip'),
            $request->input('take'),
            $sortField,
            $isDesc,
        );
    }

    public function userTotalPortfolio()
    {
        return User::restUserTotalPortfolio();
    }
}

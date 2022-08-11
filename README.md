<img src="https://img.shields.io/packagist/l/laravel/framework" alt="License">

## Crypto Coin Portfolio Tracker

Crypto Coin Portfolio Tracker is a web application that helps users to track their cryptocurrency portfolio.

Built with:
- [Laravel 9](https://laravel.com/docs/9.x/releases)
- ReactJS
- Inertia.js
- Typescript
- [Formik](https://formik.org/)
- [Material-UI 5 (MUI)](https://mui.com/material-ui/getting-started/overview/)
- DxReactGrid
- [CoinGecko API](https://www.coingecko.com/en/api) (Many thanks to CoinGecko because the API is free)

## Screenshots

<img src="https://awesomebucket12.s3.us-east-2.amazonaws.com/screen1.png">

<img src="https://awesomebucket12.s3.us-east-2.amazonaws.com/screen2.png">

## Demo
https://cryptotracker.portfoliobox.dev

## Installation

Clone the repository:
```
git clone https://github.com/yusuf-mutlu/crypto-coin-portfolio-tracker.git
```

Run composer install:
```
composer install
```

Run npm install:
```
npm install
```

Then configure database settings inside your .env file.

Be careful about setting up your APP_URL correctly. You must set it right to make the app work.
```
APP_URL=YOUR_SITE_URL
```

Run migrations and seeds:
```
php artisan migrate --seed
```


There are scheduled commands those are executed in certain intervals. They update the necessary data(prices, etc) from CoinGecko. So schedule service should always be running to get up-to-date data.
```
php artisan schedule:work
```

Run npm dev:
```
npm run dev
```

Run server:
```
php artisan serve
```


Now you are all set up. You can now track your own cryptocurrency portfolio. Yay!

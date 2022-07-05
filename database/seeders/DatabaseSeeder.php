<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'user@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('p@ssword'),
            'remember_token' => Str::random(10),
        ]);

        $this->call([
            SqlFileSeeder::class,
        ]);
    }
}

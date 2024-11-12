<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(30)->create();

        User::factory()->create([
            'name' => 'Test User',
            'user_name' => 'testuser',
            'email' => 'mubashir4xp@gmail.com',
            'password' => Hash::make('1122334455'),
        ]);
    }
}

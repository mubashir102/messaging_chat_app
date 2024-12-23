<?php

use App\Http\Controllers\MessengerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::group(['middleware' => 'auth'], function () {
    Route::get('/messenger', [MessengerController::class, 'index'])->name('home');
    Route::post('/profile', [UserProfileController::class, 'update'])->name('profile.update');
    //search route
    Route::get('/messenger/search', [MessengerController::class, 'search'])->name('messenger.search');
    // Fetch user by id
    Route::get('/messenger/id-info', [MessengerController::class, 'fetchIdInfo'])->name('messenger.id-info');

    // send message route
    Route::post('/messenger/send-message', [MessengerController::class, 'sendMessage'])->name('messenger.send-message');
});

require __DIR__ . '/auth.php';

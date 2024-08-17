<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessengerController extends Controller
{
    public function index()
    {
        return view('messenger.index');
    }
    public function search(Request $request)
    {
        $getRecords = null;
        $input = $request['query'];
        $records = User::where('id', '!=', Auth::user()->id)
            ->where('name', 'like', "%{$input}%")
            ->orWhere('user_name', 'like', "%{$input}%")
            ->get();
        return response()->json($records);
    }
}

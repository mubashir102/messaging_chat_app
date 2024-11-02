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
            ->paginate(10);
        if ($records->isEmpty()) {
            $getRecords .= '<div class="text-center text-muted font-italic">No records found</div>';
        }
        foreach ($records as $record) {
            $getRecords .= view('messenger.components.search-item', compact('record'))->render();
        }
        return response()->json([
            'records' => $getRecords,
            'last_page' => $records->lastPage(),
        ]);
    }
}

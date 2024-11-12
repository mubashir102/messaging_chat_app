<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Traits\FileUploadtrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessengerController extends Controller
{
    use FileUploadtrait;
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

    public function fetchIdInfo(Request $request)
    {
        // $user = User::find($request->id);
        $fetch = User::where('id', $request->id)->first();
        return response()->json([
            'fetch' => $fetch,
        ]);
    }
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required',
            'id' => 'required',
            'integer',
            'temporaryMsgId' => 'required',
            'attachment' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $attachmentPath = $this->uploadFile($request, 'attachment', '/uploads');
        $message = new Message();
        $message->from_id = Auth::user()->id;
        $message->to_id = $request->id;
        $message->body = $request->message;
        if ($attachmentPath) {
            $message->attachment = json_encode($attachmentPath);
        }
        $message->save();
        return response()->json([
            'message' => $message->attachment ? $this->messageCard($message, true) : $this->messageCard($message),
            'tempId' => $request->temporaryMsgId,
        ]);
    }

    public function messageCard($message, $attachment = false)
    {
        return view('messenger.components.message-card', compact('message', 'attachment'))->render();
    }
}

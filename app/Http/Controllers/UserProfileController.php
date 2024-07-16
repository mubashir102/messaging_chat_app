<?php

namespace App\Http\Controllers;

use App\Traits\FileUploadtrait;
use Flasher\Notyf\Laravel\Facade\Notyf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserProfileController extends Controller
{
    use FileUploadtrait;

    public function update(Request $request)
    {
        $request->validate([
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:512',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'user_id' => 'required',
        ], [
            'avatar.required' => 'The Avatar field is required.',
            'user_id.required' => 'The user ID field is required.',
            'name.required' => 'The Name field is required.',
            'email.required' => 'The Email field is required.',
        ]);
        $avatarPath = $this->uploadFile($request, 'avatar', $request->avatar_path);
        $user = Auth::user();
        if ($avatarPath) {
            $user->avatar = $avatarPath;
        }
        $user->name = $request->name;
        $user->email = $request->email;
        $user->user_name = $request->user_id;

        if ($request->filled('current_password')) {
            $request->validate([
                'current_password' => 'required | current_password',
                'password' => 'required|string|min:8|confirmed',
            ], [
                'current_password.required' => 'The Current Password field is required.',
                'current_password.current_password' => 'The Current Password is incorrect.',
                'password.required' => 'The Password field is required.',
                'password.min' => 'The Password must be at least 8 characters.',
                'password.confirmed' => 'The Password confirmation does not match.',
            ]);
            $user->password = bcrypt($request->password);
        }

        $user->save();
        // notyf()->flash('Profile updated successfully!', 'success');
        return response()->json(['success' => 'Profile updated successfully!']);
    }
}

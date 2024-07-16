<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait FileUploadtrait
{
    public function uploadFile(Request $request, string $inputName, ?string $oldPath = null, string $path = '/uploads')
    {
        if ($request->hasFile($inputName)) {
            $file = $request->{$inputName};
            $ext = $file->getClientOriginalExtension();
            $fileName = 'media_' . uniqid() . '.' . $ext;
            $file->move(public_path($path), $fileName);

            return $path . '/' . $fileName;
        }
        return null;

        // if ($request->hasFile($inputName)) {
        //     $file = $request->file($inputName);
        //     $fileName = time() . '_' . $file->getClientOriginalName();
        //     $file->move(public_path($path), $fileName);
        //     if ($oldPath) {
        //         unlink(public_path($oldPath));
        //     }
        //     return $path . '/' . $fileName;
        // }
        // return $oldPath;
    }
}

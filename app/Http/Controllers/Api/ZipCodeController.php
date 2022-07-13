<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ZipCodeController extends Controller
{
    /**
     * Display a resource by zip code passed in the request.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        // Get the zip code from the request.
        $zipCode = $request->zip_code;

        if (Cache::has($zipCode)) {
            // Return the cached data.
            return Cache::get($zipCode);
        }

        // Read the zip code from json file.
        try {
            $jsonFile = json_decode(file_get_contents(base_path('resources/data/' . $zipCode . '.json')));
            // Return the json file as a response.
            return Cache::remember($zipCode, now()->addMinutes(60), function () use ($jsonFile) {
                return response()->json($jsonFile);
            });
        } catch (\Exception $e) {
            // Nothing for return 404 in all cases, except when the the file is found.
        }
        return response()->json([
            'message' => 'Zip code not found.'
        ], 404);
    }
}

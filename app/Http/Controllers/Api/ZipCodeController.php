<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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

        // Read the zip code from json file.
        try {
            $zipCodeData = json_decode(file_get_contents(base_path('resources/data/' . $zipCode . '.json')), true);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Zip code not found.'
            ], 404);
        }

        // Return the zip code data.
        return response()->json($zipCodeData);
    }
}

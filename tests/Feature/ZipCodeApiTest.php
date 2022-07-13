<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ZipCodeApiTest extends TestCase
{
    /**
     * Test Endpoint.
     *
     * @return void
     */
    public function test_it_can_get_zip_code_data()
    {
        $zipCode = '01210';
        $url = '/api/zip-codes/' . $zipCode;
        $currentTime = microtime(true);
        $response = $this->get($url);

        // Response time should be less than 300ms.
        $responseTime = microtime(true) - $currentTime;
        $this->assertLessThan(0.3, $responseTime);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'zip_code',
            'locality',
            'federal_entity' => [
                'key',
                'name',
                'code'
            ],
            'settlements',
            'municipality'
        ]);

        $response->assertJsonFragment([
            'zip_code' => $zipCode
        ]);
    }

    public function test_it_can_not_get_zip_code_data_if_zip_code_is_not_found()
    {
        $zipCode = '12345';
        $url = '/api/zip-codes/' . $zipCode;
        $response = $this->get($url);

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'message'
        ]);
        $response->assertJsonFragment([
            'message' => 'Zip code not found.'
        ]);
    }
}

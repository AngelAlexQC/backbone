# Backbone Backend Test

Requisites for run the project:

-   Composer
-   Node.js

### Install

```bash
composer install
yarn install
```

## Problem:

Use excel file as data source to make api for get zip code's info.

## Solution Steps:

1. Create script for convert and save data from excel to json files

The script file is called 'convert-data.js'.

To run the script, you can use the following command:

```
node convert-data.js
```

The script will output static json files in resources/data folder.

2. Create Controller for get zip code's info

The controller file is called `ZipCodeController.php`.

3. Add route for get zip code's info

```php
Route::get('/zip-codes/{zip_code}', ZipCodeController::class . '@show');
```

4. Write test for check the api

To run the test, you can use the following command:

```
php artisan test
```

# Timing

## Reponse Time Comparison

### Local: avg 19.5ms

![Local Time](https://user-images.githubusercontent.com/9358510/178659781-b1098a31-d388-4aa4-9dc2-81e47ad5d9f7.png)

### [Backbone Backend](https://jobs.backbonesystems.io/api/zip-codes/01210): avg 240ms

![Backbone Time](https://user-images.githubusercontent.com/9358510/178661133-f69197bb-e3f9-4305-b436-7e89957e9245.png)

### [Deployed on Heroku](https://backbone-reto.herokuapp.com/api/zip-codes/01210): avg 128ms

![Deployed on Heroku](https://user-images.githubusercontent.com/9358510/178660388-18b7ede1-c637-45c9-a0b6-b6abd209cef6.png)

-   Features of server:
    ![Free Dyno](https://user-images.githubusercontent.com/9358510/178660759-84939690-b104-43db-b563-2610521d4140.png)

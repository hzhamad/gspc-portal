<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Quote Request Notification
    |--------------------------------------------------------------------------
    |
    | Email address to receive notifications when new insurance applications
    | (quote requests) are submitted by users.
    |
    */

    'quote_request' => [
        'notification_email' => env('QUOTE_REQUEST_NOTIFICATION_EMAIL', 'admin@example.com'),
        'notification_recipients' => array_filter(array_map('trim', explode(',', env('QUOTE_REQUEST_NOTIFICATION_RECIPIENTS', 'hasan@click2secure.me,bellel@payd.ae,reham@click2secure.me,shibila@click2secure.me,juby@click2secure.me,individualmedical@seguroinsurance.ae')))), /*  */
    ],

];

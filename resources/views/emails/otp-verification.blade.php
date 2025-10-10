<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .otp-code {
            background-color: #fff;
            border: 2px dashed #4CAF50;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #4CAF50;
            margin: 30px 0;
        }
        .info {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $action === 'register' ? 'Welcome!' : 'Verification Code' }}</h1>
        </div>

        <p>Hello {{ $userName }},</p>

        @if($action === 'register')
            <p>Thank you for registering! Please use the verification code below to complete your registration:</p>
        @elseif($action === 'login')
            <p>You requested to log in to your account. Please use the verification code below:</p>
        @else
            <p>Please use the verification code below to verify your email:</p>
        @endif

        <div class="otp-code">
            {{ $otpCode }}
        </div>

        <div class="info">
            <strong>⏰ Important:</strong> This code will expire in {{ $expiresIn }} minutes. Please do not share this code with anyone.
        </div>

        <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>


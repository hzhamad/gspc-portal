<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>GSPC Portal</title>
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>

<body class="min-h-screen bg-[#F8FAFC] text-[var(--foreground)] antialiased">
    @inertia
</body>

</html>
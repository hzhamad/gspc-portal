@props(['url', 'logo' => null])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if (trim($slot) === 'Laravel')
            <img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
            @else
            @if($logo)
            @php
                // If logo is a relative path, prepend the app URL
                $logoUrl = str_starts_with($logo, 'http') ? $logo : rtrim(config('app.url'), '/') . '/' . ltrim($logo, '/');
            @endphp
            <img src="{{ $logoUrl }}" class="logo" alt="{{ config('app.name') }} Logo">
            @else
            {!! $slot !!}
            @endif
            @endif
        </a>
    </td>
</tr>

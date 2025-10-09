@props(['url', 'logo' => null])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if (trim($slot) === 'Laravel')
            <img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
            @else
            @if($logo)
            @php
            // Handle embedded images (CID URLs) or convert relative paths to absolute
            if (str_starts_with($logo, 'cid:')) {
            $logoUrl = $logo;
            } elseif (str_starts_with($logo, 'http')) {
            $logoUrl = $logo;
            } else {
            $logoUrl = rtrim(config('app.url'), '/') . '/' . ltrim($logo, '/');
            }
            @endphp
            <img src="{{ $logoUrl }}" class="logo" alt="{{ config('app.name') }} Logo">
            @else
            {!! $slot !!}
            @endif
            @endif
        </a>
    </td>
</tr>
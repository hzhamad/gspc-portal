<x-mail::message>
    # New Insurance Application Submitted

    A new insurance application has been submitted and requires review.

    ## Application Details

    **Application ID:** #{{ $quoteRequest->id }}
    **Application Type:** {{ ucwords(str_replace('_', ' + ', $quoteRequest->application_type)) }}
    **Submission Date:** {{ $quoteRequest->created_at->format('F d, Y h:i A') }}
    **Status:** {{ ucfirst($quoteRequest->status) }}

    ---

    ## Applicant Information

    **Name:** {{ $user->name }}
    **Email:** {{ $user->email }}
    **Phone:** {{ $user->phone ?? 'N/A' }}

    ---

    @if(in_array($quoteRequest->application_type, ['self', 'self_dependents']))
    ## Principal/Sponsor Information

    **Full Name:** {{ $quoteRequest->sponsor_name }}
    **Sponsor ID:** {{ $quoteRequest->sponsor_id }}
    **Date of Birth:** {{ \Carbon\Carbon::parse($quoteRequest->date_of_birth)->format('F d, Y') }}
    **Emirate of Residency:** {{ $quoteRequest->emirate_of_residency }}

    **Documents Attached:**
    @if($quoteRequest->profile_picture)
    - ✓ Profile Picture
    @endif
    @if($quoteRequest->eid_copy)
    - ✓ Emirates ID Copy
    @endif

    ---
    @endif

    @if(in_array($quoteRequest->application_type, ['dependents', 'self_dependents']) && $dependents->count() > 0)
    ## Dependents Information

    **Total Dependents:** {{ $dependents->count() }}

    @foreach($dependents as $index => $dependent)
    ### Dependent #{{ $index + 1 }}

    **Relationship:** {{ ucfirst($dependent->relationship) }}
    **Date of Birth:** {{ \Carbon\Carbon::parse($dependent->date_of_birth)->format('F d, Y') }}
    **Marital Status:** {{ ucfirst($dependent->marital_status) }}
    @if($dependent->uid_number)
    **UID Number:** {{ $dependent->uid_number }}
    @endif
    @if($dependent->eid_number)
    **Emirates ID Number:** {{ $dependent->eid_number }}
    @endif

    **Documents Attached:**
    @if($dependent->profile_picture)
    - ✓ Profile Picture
    @endif
    @if($dependent->eid_copy)
    - ✓ Emirates ID Copy
    @endif

    @if(!$loop->last)
    ---
    @endif
    @endforeach

    ---
    @endif

    ## Next Steps

    Please review the application details and attached documents. You can:

    1. Review the application thoroughly
    2. Prepare and upload the insurance quote
    3. Update the application status accordingly

    <x-mail::button :url="config('app.url') . '/admin/quote-requests/' . $quoteRequest->id">
        View Full Application
    </x-mail::button>

    **Important:** All uploaded documents are attached to this email for your convenience.

    ---

    **Note:** This is an automated notification. Please do not reply to this email.

    Thanks,<br>
    {{ config('app.name') }}
</x-mail::message>
@component('mail::message')

# New Insurance Application Received

Dear Team,

A new insurance application has been submitted by **{{ $user->name }}** (Email: {{ $user->email }}).

Please find the application details below for your review and processing.

---

## Application Summary

- **Application ID:** #{{ $quoteRequest->id }}
- **Application Type:** {{ ucwords(str_replace('_', ' + ', $quoteRequest->application_type)) }}
- **Submission Date:** {{ $quoteRequest->created_at->format('l, F d, Y \a\t h:i A') }}
- **Current Status:** {{ ucfirst($quoteRequest->status) }}

---

## Applicant Information

- **Full Name:** {{ $user->name }}
- **Email Address:** {{ $user->email }}
- **Contact Number:** {{ $user->phone ?? 'Not Provided' }}

---

@if(in_array($quoteRequest->application_type, ['self', 'self_dependents']))

## Principal / Sponsor Information

- **Full Name:** {{ $quoteRequest->sponsor_name }}
- **Sponsor ID:** {{ $quoteRequest->sponsor_id }}
- **Date of Birth:** {{ \Carbon\Carbon::parse($quoteRequest->dob)->format('F d, Y') }}
- **Emirate of Residency:** {{ $quoteRequest->emirate_of_residency }}

### 📎 Attached Documents

| Document Type | Status |
|---------------|--------|
@if($quoteRequest->profile_picture)
| Profile Picture | ✅ Attached |
@endif
@if($quoteRequest->eid_file)
| Emirates ID Copy | ✅ Attached |
@endif

---

@endif

@if(in_array($quoteRequest->application_type, ['dependents', 'self_dependents']) && $dependents->count() > 0)

## Dependents Information

**Total Dependents:** {{ $dependents->count() }}

@foreach($dependents as $index => $dependent)

### Dependent {{ $index + 1 }} of {{ $dependents->count() }}

- **Relationship:** {{ ucfirst($dependent->relationship) }}
- **Date of Birth:** {{ \Carbon\Carbon::parse($dependent->dob)->format('F d, Y') }}
- **Marital Status:** {{ ucfirst($dependent->marital_status) }}
@if($dependent->uid_number)
- **UID Number:** {{ $dependent->uid_number }}
@endif
@if($dependent->eid_number)
- **Emirates ID Number:** {{ $dependent->eid_number }}
@endif

@if($dependent->profile_picture || $dependent->eid_file)

**📎 Attached Documents:**
@if($dependent->profile_picture)
- ✅ Profile Picture
@endif
@if($dependent->eid_file)
- ✅ Emirates ID Copy
@endif
@endif

---

@endforeach
@endif

## Next Steps

1. **Review Application** - Check all submitted details and documents.
2. **Validate Documents** - Ensure all attachments are correct and legible.
3. **Prepare Quote** - Calculate and prepare the insurance quotation.
4. **Update Status** - Reflect progress within the GSPC Portal.

@component('mail::button', ['url' => config('app.url') . '/my-requests/' . $quoteRequest->id])
View Application Details
@endcomponent

---

**Note:** All uploaded documents are attached to this email for your convenience. This is an **automated message** from the GSPC Portal. Please do not reply to this email.

Warm regards,<br>
**The {{ config('app.name') }} Team**

@endcomponent
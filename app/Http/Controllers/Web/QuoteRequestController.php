<?php

namespace App\Http\Controllers\Web;

use App\Rules\ValidatedFile;
use App\Services\FileValidationService;
use App\Http\Controllers\Controller;
use App\Mail\QuoteRequestSubmitted;
use App\Models\QuoteRequest;
use App\Models\Dependent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuoteRequestController extends Controller
{
    /**
     * Show the quote request form.
     */
    public function create()
    {
        $emirates = [
            'Abu Dhabi',
            'Dubai',
            'Sharjah',
            'Ajman',
            'Umm Al Quwain',
            'Ras Al Khaimah',
            'Fujairah'
        ];

        return Inertia::render('Client/QuoteRequest', [
            'emirates' => $emirates,
        ]);
    }

    /**
     * Store a new quote request.
     */
    public function store(Request $request)
    {
        // Custom validation for profile_picture
        $profilePictureRules = ['required_if:application_type,self,self_dependents'];

        // If profile_picture is a file, validate it; if it's a string (existing path), allow it
        if ($request->hasFile('profile_picture')) {
            $profilePictureRules[] = new ValidatedFile('image');
        } else {
            $profilePictureRules[] = 'string';
        }

        $validated = $request->validate([
            'application_type' => 'required|in:self,dependents,self_dependents',

            // Principal details
            'principal_name' => 'required_if:application_type,self,self_dependents|string|max:255',
            'phone_number' => 'required_if:application_type,self,self_dependents|string|regex:/^\+971[0-9]{9}$/',
            'principal_id' => 'required_if:application_type,self,self_dependents|string|max:100',
            'dob' => 'required_if:application_type,self,self_dependents|date',
            'emirate_of_residency' => 'required_if:application_type,self,self_dependents|string|max:100',
            'profile_picture' => $profilePictureRules,
            // 'eid_file' => ['required_if:application_type,self,self_dependents', new ValidatedFile('document')],

            // Dependents
            'dependents' => 'required_if:application_type,dependents,self_dependents|array|min:1',
            'dependents.*.dob' => 'required|date',
            'dependents.*.relationship' => 'required|in:spouse,child,parent,sibling',
            'dependents.*.first_name' => 'required|string|max:255',
            'dependents.*.middle_name' => 'nullable|string|max:255',
            'dependents.*.last_name' => 'required|string|max:255',
            'dependents.*.uid_number' => 'nullable|string|max:100',
            'dependents.*.eid_number' => 'nullable|string|max:100',
            'dependents.*.marital_status' => 'required|in:single,married,divorced,widowed',
            'dependents.*.emirate_of_residency' => 'nullable|string|max:100',
            'dependents.*.profile_picture' => ['required', new ValidatedFile('image')],
            'dependents.*.eid_file' => ['required', new ValidatedFile('document')],
        ]);

        DB::beginTransaction();
        try {
            // Create quote request
            $quoteRequest = new QuoteRequest();
            $quoteRequest->user_id = $request->user()->id;
            $quoteRequest->application_type = $validated['application_type'];

            // Add principal details if applicable
            if (in_array($validated['application_type'], ['self', 'self_dependents'])) {
                $quoteRequest->principal_name = $validated['principal_name'];
                $quoteRequest->phone_number = $validated['phone_number'];
                $quoteRequest->principal_id = $validated['principal_id'];
                $quoteRequest->dob = $validated['dob'];
                $quoteRequest->emirate_of_residency = $validated['emirate_of_residency'];

                // Handle file uploads for principal
                if ($request->hasFile('profile_picture')) {
                    $quoteRequest->profile_picture = $request->file('profile_picture')
                        ->store('quote-requests/profiles', 'public');
                } elseif ($request->user()->profile_picture && Storage::disk('public')->exists($request->user()->profile_picture)) {
                    $source = $request->user()->profile_picture;
                    $extension = pathinfo($source, PATHINFO_EXTENSION);
                    $destination = 'quote-requests/profiles/' . Str::uuid() . ($extension ? '.' . $extension : '');
                    Storage::disk('public')->copy($source, $destination);
                    $quoteRequest->profile_picture = $destination;
                }

                // if ($request->hasFile('eid_file')) {
                //     $quoteRequest->eid_file = $request->file('eid_file')
                //         ->store('quote-requests/eids', 'public');
                // } elseif ($request->user()->eid_file && Storage::disk('public')->exists($request->user()->eid_file)) {
                //     $source = $request->user()->eid_file;
                //     $extension = pathinfo($source, PATHINFO_EXTENSION);
                //     $destination = 'quote-requests/eids/' . Str::uuid() . ($extension ? '.' . $extension : '');
                //     Storage::disk('public')->copy($source, $destination);
                //     $quoteRequest->eid_file = $destination;
                // }

                if ($request->user()->eid_file && Storage::disk('public')->exists($request->user()->eid_file)) {
                    $source = $request->user()->eid_file;
                    $extension = pathinfo($source, PATHINFO_EXTENSION);
                    $destination = 'quote-requests/eids/' . Str::uuid() . ($extension ? '.' . $extension : '');
                    Storage::disk('public')->copy($source, $destination);
                    $quoteRequest->eid_file = $destination;
                } else {
                    // If no existing eid_file, validation error
                    return back()
                        ->withInput()
                        ->withErrors(["eid_file" => "The eid file field is required when application type is self."]);
                }
            }

            $quoteRequest->save();

            // Add dependents if applicable
            if (
                in_array($validated['application_type'], ['dependents', 'self_dependents']) &&
                isset($validated['dependents'])
            ) {

                foreach ($validated['dependents'] as $index => $dependentData) {
                    $dependent = new Dependent();
                    $dependent->quote_request_id = $quoteRequest->id;
                    $dependent->uid_number = $dependentData['uid_number'] ?? null;
                    $dependent->eid_number = $dependentData['eid_number'] ?? null;
                    $dependent->marital_status = $dependentData['marital_status'];
                    $dependent->emirate_of_residency = $dependentData['emirate_of_residency'] ?? null;
                    $dependent->dob = $dependentData['dob'];
                    $dependent->relationship = $dependentData['relationship'];
                    $dependent->first_name = $dependentData['first_name'];
                    $dependent->middle_name = $dependentData['middle_name'] ?? null;
                    $dependent->last_name = $dependentData['last_name'];

                    // Handle file uploads for dependent
                    if ($request->hasFile("dependents.{$index}.profile_picture")) {
                        $dependent->profile_picture = $request->file("dependents.{$index}.profile_picture")
                            ->store('dependents/profiles', 'public');
                    }

                    if ($request->hasFile("dependents.{$index}.eid_file")) {
                        $dependent->eid_file = $request->file("dependents.{$index}.eid_file")
                            ->store('dependents/eids', 'public');
                    }

                    $dependent->save();
                }
            }

            DB::commit();

            // Send email notification to principal/admin team
            try {
                $notificationRecipients = config('services.quote_request.notification_recipients');

                if (empty($notificationRecipients)) {
                    $fallbackEmail = config('services.quote_request.notification_email');
                    $notificationRecipients = $fallbackEmail ? [$fallbackEmail] : [];
                }

                if (! empty($notificationRecipients)) {
                    Mail::to($notificationRecipients)->send(new QuoteRequestSubmitted($quoteRequest));
                }

                // Mail::to($quoteRequest->user->email)->send(new QuoteRequestSubmitted($quoteRequest));
            } catch (\Exception $emailException) {
                // Log the error but don't fail the request submission
                Log::error('Failed to send quote request notification email', [
                    'quote_request_id' => $quoteRequest->id,
                    'error' => $emailException->getMessage()
                ]);
            }

            return redirect()->route('my-requests.index')
                ->with('success', 'Your insurance application has been submitted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to submit application. Please try again.']);
        }
    }

    /**
     * Display all quote requests for the authenticated user.
     */
    public function index(Request $request)
    {
        $requests = QuoteRequest::with('dependents')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Client/MyRequests', [
            'requests' => $requests,
        ]);
    }

    /**
     * Display the specified quote request.
     */
    public function show(Request $request, QuoteRequest $quoteRequest)
    {
        // Ensure user can only view their own requests
        if ($quoteRequest->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this request.');
        }

        $quoteRequest->load('dependents');

        return Inertia::render('Client/RequestDetail', [
            'request' => $quoteRequest,
        ]);
    }

    /**
     * Show the form for editing the specified quote request.
     */
    public function edit(Request $request, QuoteRequest $quoteRequest)
    {
        // Ensure user can only edit their own requests
        if ($quoteRequest->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this request.');
        }

        // Only allow editing pending requests
        if ($quoteRequest->status !== 'pending') {
            return redirect()->route('my-requests.show', $quoteRequest)
                ->with('error', 'You can only edit applications with "Pending Review" status.');
        }

        $quoteRequest->load('dependents');

        $emirates = [
            'Abu Dhabi',
            'Dubai',
            'Sharjah',
            'Ajman',
            'Umm Al Quwain',
            'Ras Al Khaimah',
            'Fujairah'
        ];

        return Inertia::render('Client/RequestEdit', [
            'request' => $quoteRequest,
            'emirates' => $emirates,
        ]);
    }

    /**
     * Update the specified quote request.
     */
    public function update(Request $request, QuoteRequest $quoteRequest)
    {
        // Authorization check
        if ($quoteRequest->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'application_type' => 'required|in:self,dependents,self_dependents',

            // Principal details
            'principal_name' => 'required_if:application_type,self,self_dependents|string|max:255',
            'phone_number' => 'required_if:application_type,self,self_dependents|string|regex:/^\+971[0-9]{9}$/',
            'principal_id' => 'required_if:application_type,self,self_dependents|string|max:100',
            'dob' => 'required_if:application_type,self,self_dependents|date',
            'emirate_of_residency' => 'required_if:application_type,self,self_dependents|string|max:100',
            'profile_picture' => ['nullable', new ValidatedFile('image')],
            'eid_file' => ['nullable', new ValidatedFile('document')],

            // Dependents
            'dependents' => 'required_if:application_type,dependents,self_dependents|array',
            'dependents.*.id' => 'nullable|exists:dependents,id',
            'dependents.*.dob' => 'required|date',
            'dependents.*.relationship' => 'required|in:spouse,child,parent,sibling',
            'dependents.*.first_name' => 'required|string|max:255',
            'dependents.*.middle_name' => 'nullable|string|max:255',
            'dependents.*.last_name' => 'required|string|max:255',
            'dependents.*.uid_number' => 'nullable|string|max:100',
            'dependents.*.eid_number' => 'nullable|string|max:100',
            'dependents.*.marital_status' => 'required|in:single,married,divorced,widowed',
            'dependents.*.profile_picture' => ['nullable', new ValidatedFile('image')],
            'dependents.*.eid_file' => ['nullable', new ValidatedFile('document')],
        ]);

        DB::beginTransaction();
        try {
            // Update quote request basic info
            $quoteRequest->application_type = $validated['application_type'];

            // Update principal details if applicable
            if (in_array($validated['application_type'], ['self', 'self_dependents'])) {
                $quoteRequest->principal_name = $validated['principal_name'];
                $quoteRequest->phone_number = $validated['phone_number'];
                $quoteRequest->principal_id = $validated['principal_id'];
                $quoteRequest->dob = $validated['dob'];
                $quoteRequest->emirate_of_residency = $validated['emirate_of_residency'];

                // Handle file uploads for principal
                if ($request->hasFile('profile_picture')) {
                    // Delete old file if exists
                    if ($quoteRequest->profile_picture) {
                        Storage::disk('public')->delete($quoteRequest->profile_picture);
                    }
                    $quoteRequest->profile_picture = $request->file('profile_picture')
                        ->store('quote-requests/profiles', 'public');
                } elseif ($request->user()->profile_picture && Storage::disk('public')->exists($request->user()->profile_picture)) {
                    $source = $request->user()->profile_picture;
                    $extension = pathinfo($source, PATHINFO_EXTENSION);
                    $destination = 'quote-requests/profiles/' . Str::uuid() . ($extension ? '.' . $extension : '');
                    Storage::disk('public')->copy($source, $destination);
                    $quoteRequest->profile_picture = $destination;
                }

                if ($request->hasFile('eid_file')) {
                    // Delete old file if exists
                    if ($quoteRequest->eid_file) {
                        Storage::disk('public')->delete($quoteRequest->eid_file);
                    }
                    $quoteRequest->eid_file = $request->file('eid_file')
                        ->store('quote-requests/eids', 'public');
                } elseif ($request->user()->eid_file && Storage::disk('public')->exists($request->user()->eid_file)) {
                    $source = $request->user()->eid_file;
                    $extension = pathinfo($source, PATHINFO_EXTENSION);
                    $destination = 'quote-requests/eids/' . Str::uuid() . ($extension ? '.' . $extension : '');
                    Storage::disk('public')->copy($source, $destination);
                    $quoteRequest->eid_file = $destination;
                }
            } else {
                // Clear principal data if not applicable
                $quoteRequest->principal_name = null;
                $quoteRequest->phone_number = null;
                $quoteRequest->principal_id = null;
                $quoteRequest->dob = null;
                $quoteRequest->emirate_of_residency = null;

                if ($quoteRequest->profile_picture) {
                    Storage::disk('public')->delete($quoteRequest->profile_picture);
                    $quoteRequest->profile_picture = null;
                }
                if ($quoteRequest->eid_file) {
                    Storage::disk('public')->delete($quoteRequest->eid_file);
                    $quoteRequest->eid_file = null;
                }
            }

            $quoteRequest->save();

            // Handle dependents
            if (in_array($validated['application_type'], ['dependents', 'self_dependents']) && isset($validated['dependents'])) {
                $existingDependentIds = [];

                foreach ($validated['dependents'] as $index => $dependentData) {
                    if (isset($dependentData['id'])) {
                        // Update existing dependent
                        $dependent = Dependent::where('id', $dependentData['id'])
                            ->where('quote_request_id', $quoteRequest->id)
                            ->first();

                        if ($dependent) {
                            $dependent->uid_number = $dependentData['uid_number'] ?? null;
                            $dependent->eid_number = $dependentData['eid_number'] ?? null;
                            $dependent->marital_status = $dependentData['marital_status'];
                            $dependent->emirate_of_residency = $dependentData['emirate_of_residency'] ?? null;
                            $dependent->dob = $dependentData['dob'];
                            $dependent->relationship = $dependentData['relationship'];
                            $dependent->first_name = $dependentData['first_name'];
                            $dependent->middle_name = $dependentData['middle_name'] ?? null;
                            $dependent->last_name = $dependentData['last_name'];

                            // Handle file uploads
                            if ($request->hasFile("dependents.{$index}.profile_picture")) {
                                if ($dependent->profile_picture) {
                                    Storage::disk('public')->delete($dependent->profile_picture);
                                }
                                $dependent->profile_picture = $request->file("dependents.{$index}.profile_picture")
                                    ->store('dependents/profiles', 'public');
                            }

                            if ($request->hasFile("dependents.{$index}.eid_file")) {
                                if ($dependent->eid_file) {
                                    Storage::disk('public')->delete($dependent->eid_file);
                                }
                                $dependent->eid_file = $request->file("dependents.{$index}.eid_file")
                                    ->store('dependents/eids', 'public');
                            }

                            $dependent->save();
                            $existingDependentIds[] = $dependent->id;
                        }
                    } else {
                        // Create new dependent
                        $dependent = new Dependent();
                        $dependent->quote_request_id = $quoteRequest->id;
                        $dependent->uid_number = $dependentData['uid_number'] ?? null;
                        $dependent->eid_number = $dependentData['eid_number'] ?? null;
                        $dependent->marital_status = $dependentData['marital_status'];
                        $dependent->emirate_of_residency = $dependentData['emirate_of_residency'] ?? null;
                        $dependent->dob = $dependentData['dob'];
                        $dependent->relationship = $dependentData['relationship'];
                        $dependent->first_name = $dependentData['first_name'];
                        $dependent->middle_name = $dependentData['middle_name'] ?? null;
                        $dependent->last_name = $dependentData['last_name'];

                        // Handle file uploads
                        if ($request->hasFile("dependents.{$index}.profile_picture")) {
                            $dependent->profile_picture = $request->file("dependents.{$index}.profile_picture")
                                ->store('dependents/profiles', 'public');
                        }

                        if ($request->hasFile("dependents.{$index}.eid_file")) {
                            $dependent->eid_file = $request->file("dependents.{$index}.eid_file")
                                ->store('dependents/eids', 'public');
                        }

                        $dependent->save();
                        $existingDependentIds[] = $dependent->id;
                    }
                }

                // Delete removed dependents
                $dependentsToDelete = Dependent::where('quote_request_id', $quoteRequest->id)
                    ->whereNotIn('id', $existingDependentIds)
                    ->get();

                foreach ($dependentsToDelete as $dependent) {
                    if ($dependent->profile_picture) {
                        Storage::disk('public')->delete($dependent->profile_picture);
                    }
                    if ($dependent->eid_file) {
                        Storage::disk('public')->delete($dependent->eid_file);
                    }
                    $dependent->delete();
                }
            } else {
                // Delete all dependents if not applicable
                $dependents = Dependent::where('quote_request_id', $quoteRequest->id)->get();
                foreach ($dependents as $dependent) {
                    if ($dependent->profile_picture) {
                        Storage::disk('public')->delete($dependent->profile_picture);
                    }
                    if ($dependent->eid_file) {
                        Storage::disk('public')->delete($dependent->eid_file);
                    }
                    $dependent->delete();
                }
            }

            DB::commit();

            return redirect()->route('my-requests.show', $quoteRequest)
                ->with('success', 'Your application has been updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update application. Please try again.']);
        }
    }
}

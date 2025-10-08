<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Mail\QuoteRequestSubmitted;
use App\Models\QuoteRequest;
use App\Models\Dependent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
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

        return Inertia::render('Agent/QuoteRequest', [
            'emirates' => $emirates,
        ]);
    }

    /**
     * Store a new quote request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'application_type' => 'required|in:self,self_dependents,dependents',
            'sponsor_name' => 'required_if:application_type,self,self_dependents|string|max:255',
            'sponsor_id' => 'required_if:application_type,self,self_dependents|string|max:255',
            'date_of_birth' => 'required_if:application_type,self,self_dependents|date',
            'emirate_of_residency' => 'required_if:application_type,self,self_dependents|string|max:255',
            'profile_picture' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'eid_copy' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'dependents' => 'required_if:application_type,dependents,self_dependents|array',
            'dependents.*.uid_number' => 'nullable|string|max:255',
            'dependents.*.eid_number' => 'nullable|string|max:255',
            'dependents.*.marital_status' => 'required|in:single,married',
            'dependents.*.date_of_birth' => 'required|date',
            'dependents.*.relationship' => 'required|in:spouse,child,parent,sibling',
            'dependents.*.profile_picture' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'dependents.*.eid_copy' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        DB::beginTransaction();
        try {
            // Create quote request
            $quoteRequest = new QuoteRequest();
            $quoteRequest->user_id = $request->user()->id;
            $quoteRequest->application_type = $validated['application_type'];

            // Add principal details if applicable
            if (in_array($validated['application_type'], ['self', 'self_dependents'])) {
                $quoteRequest->sponsor_name = $validated['sponsor_name'];
                $quoteRequest->sponsor_id = $validated['sponsor_id'];
                $quoteRequest->date_of_birth = $validated['date_of_birth'];
                $quoteRequest->emirate_of_residency = $validated['emirate_of_residency'];

                // Handle file uploads for principal
                if ($request->hasFile('profile_picture')) {
                    $quoteRequest->profile_picture = $request->file('profile_picture')
                        ->store('quote-requests/profiles', 'public');
                }

                if ($request->hasFile('eid_copy')) {
                    $quoteRequest->eid_copy = $request->file('eid_copy')
                        ->store('quote-requests/eids', 'public');
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
                    $dependent->date_of_birth = $dependentData['date_of_birth'];
                    $dependent->relationship = $dependentData['relationship'];

                    // Handle file uploads for dependent
                    if ($request->hasFile("dependents.{$index}.profile_picture")) {
                        $dependent->profile_picture = $request->file("dependents.{$index}.profile_picture")
                            ->store('dependents/profiles', 'public');
                    }

                    if ($request->hasFile("dependents.{$index}.eid_copy")) {
                        $dependent->eid_copy = $request->file("dependents.{$index}.eid_copy")
                            ->store('dependents/eids', 'public');
                    }

                    $dependent->save();
                }
            }

            DB::commit();

            // Send email notification to sponsor/admin team
            try {
                $notificationEmail = config('services.quote_request.notification_email');
                Mail::to($notificationEmail)->send(new QuoteRequestSubmitted($quoteRequest));
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

        return Inertia::render('Agent/MyRequests', [
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

        return Inertia::render('Agent/RequestDetail', [
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

        return Inertia::render('Agent/RequestEdit', [
            'request' => $quoteRequest,
            'emirates' => $emirates,
        ]);
    }

    /**
     * Update the specified quote request.
     */
    public function update(Request $request, QuoteRequest $quoteRequest)
    {
        // Ensure user can only update their own requests
        if ($quoteRequest->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this request.');
        }

        // Only allow updating pending requests
        if ($quoteRequest->status !== 'pending') {
            return redirect()->route('my-requests.show', $quoteRequest)
                ->with('error', 'You can only edit applications with "Pending Review" status.');
        }

        $validated = $request->validate([
            'application_type' => 'required|in:self,self_dependents,dependents',
            'sponsor_name' => 'required_if:application_type,self,self_dependents|string|max:255',
            'sponsor_id' => 'required_if:application_type,self,self_dependents|string|max:255',
            'date_of_birth' => 'required_if:application_type,self,self_dependents|date',
            'emirate_of_residency' => 'required_if:application_type,self,self_dependents|string|max:255',
            'profile_picture' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'eid_copy' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'dependents' => 'required_if:application_type,dependents,self_dependents|array',
            'dependents.*.id' => 'nullable|exists:dependents,id',
            'dependents.*.uid_number' => 'nullable|string|max:255',
            'dependents.*.eid_number' => 'nullable|string|max:255',
            'dependents.*.marital_status' => 'required|in:single,married',
            'dependents.*.date_of_birth' => 'required|date',
            'dependents.*.relationship' => 'required|in:spouse,child,parent,sibling',
            'dependents.*.profile_picture' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'dependents.*.eid_copy' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        DB::beginTransaction();
        try {
            // Update quote request basic info
            $quoteRequest->application_type = $validated['application_type'];

            // Update principal details if applicable
            if (in_array($validated['application_type'], ['self', 'self_dependents'])) {
                $quoteRequest->sponsor_name = $validated['sponsor_name'];
                $quoteRequest->sponsor_id = $validated['sponsor_id'];
                $quoteRequest->date_of_birth = $validated['date_of_birth'];
                $quoteRequest->emirate_of_residency = $validated['emirate_of_residency'];

                // Handle file uploads for principal
                if ($request->hasFile('profile_picture')) {
                    // Delete old file if exists
                    if ($quoteRequest->profile_picture) {
                        Storage::disk('public')->delete($quoteRequest->profile_picture);
                    }
                    $quoteRequest->profile_picture = $request->file('profile_picture')
                        ->store('quote-requests/profiles', 'public');
                }

                if ($request->hasFile('eid_copy')) {
                    // Delete old file if exists
                    if ($quoteRequest->eid_copy) {
                        Storage::disk('public')->delete($quoteRequest->eid_copy);
                    }
                    $quoteRequest->eid_copy = $request->file('eid_copy')
                        ->store('quote-requests/eids', 'public');
                }
            } else {
                // Clear principal data if not applicable
                $quoteRequest->sponsor_name = null;
                $quoteRequest->sponsor_id = null;
                $quoteRequest->date_of_birth = null;
                $quoteRequest->emirate_of_residency = null;

                if ($quoteRequest->profile_picture) {
                    Storage::disk('public')->delete($quoteRequest->profile_picture);
                    $quoteRequest->profile_picture = null;
                }
                if ($quoteRequest->eid_copy) {
                    Storage::disk('public')->delete($quoteRequest->eid_copy);
                    $quoteRequest->eid_copy = null;
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
                            $dependent->date_of_birth = $dependentData['date_of_birth'];
                            $dependent->relationship = $dependentData['relationship'];

                            // Handle file uploads
                            if ($request->hasFile("dependents.{$index}.profile_picture")) {
                                if ($dependent->profile_picture) {
                                    Storage::disk('public')->delete($dependent->profile_picture);
                                }
                                $dependent->profile_picture = $request->file("dependents.{$index}.profile_picture")
                                    ->store('dependents/profiles', 'public');
                            }

                            if ($request->hasFile("dependents.{$index}.eid_copy")) {
                                if ($dependent->eid_copy) {
                                    Storage::disk('public')->delete($dependent->eid_copy);
                                }
                                $dependent->eid_copy = $request->file("dependents.{$index}.eid_copy")
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
                        $dependent->date_of_birth = $dependentData['date_of_birth'];
                        $dependent->relationship = $dependentData['relationship'];

                        // Handle file uploads
                        if ($request->hasFile("dependents.{$index}.profile_picture")) {
                            $dependent->profile_picture = $request->file("dependents.{$index}.profile_picture")
                                ->store('dependents/profiles', 'public');
                        }

                        if ($request->hasFile("dependents.{$index}.eid_copy")) {
                            $dependent->eid_copy = $request->file("dependents.{$index}.eid_copy")
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
                    if ($dependent->eid_copy) {
                        Storage::disk('public')->delete($dependent->eid_copy);
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
                    if ($dependent->eid_copy) {
                        Storage::disk('public')->delete($dependent->eid_copy);
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

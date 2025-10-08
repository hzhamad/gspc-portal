<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use App\Models\Dependent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

            // TODO: Send email notification to production team

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
}

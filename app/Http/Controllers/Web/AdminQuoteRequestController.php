<?php

namespace App\Http\Controllers\Web;

use App\Rules\ValidatedFile;
use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminQuoteRequestController extends Controller
{
    /**
     * Display a listing of all quote requests for admin.
     */
    public function index(Request $request)
    {
        $query = QuoteRequest::with(['user', 'dependents']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('sponsor_name', 'like', "%{$search}%")
                    ->orWhere('sponsor_id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $requests = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/QuoteRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['status', 'search', 'sort', 'direction']),
        ]);
    }

    /**
     * Display the specified quote request.
     */
    public function show(QuoteRequest $quoteRequest)
    {
        $quoteRequest->load(['user', 'dependents']);

        return Inertia::render('Admin/QuoteRequests/Show', [
            'request' => $quoteRequest,
        ]);
    }

    /**
     * Upload a quote file for the specified quote request.
     */
    public function uploadQuote(Request $request, QuoteRequest $quoteRequest)
    {
        $validated = $request->validate([
            'quote_file' => ['required', new ValidatedFile('document')],
            'payment_link' => 'nullable|url|max:500',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        try {
            // Delete old quote file if exists
            if ($quoteRequest->quote_file) {
                Storage::disk('public')->delete($quoteRequest->quote_file);
            }

            // Upload new quote file
            $quoteRequest->quote_file = $request->file('quote_file')
                ->store('quote-files', 'public');

            $quoteRequest->payment_link = $validated['payment_link'] ?? $quoteRequest->payment_link;

            // Append admin notes to history
            if (!empty($validated['admin_notes'])) {
                $existingNotes = is_array($quoteRequest->admin_notes) ? $quoteRequest->admin_notes : [];
                $existingNotes[] = [
                    'note' => $validated['admin_notes'],
                    'created_at' => now()->toIso8601String(),
                    'action' => 'Quote Submitted'
                ];
                $quoteRequest->admin_notes = $existingNotes;
            }

            // Update status to quote_sent if it was pending
            if ($quoteRequest->status === 'pending') {
                $quoteRequest->status = 'quote_sent';
            }

            $quoteRequest->save();

            return redirect()->back()
                ->with('success', 'Quote file uploaded successfully!');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to upload quote file. Please try again.']);
        }
    }

    /**
     * Upload policy files for the specified quote request.
     */
    public function uploadPolicy(Request $request, QuoteRequest $quoteRequest)
    {
        $validated = $request->validate([
            'policy_files' => 'required|array|min:1|max:10',
            'policy_files.*' => ['required', new ValidatedFile('document')],
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        try {
            $uploadedFiles = [];

            // Upload each policy file
            foreach ($request->file('policy_files') as $file) {
                $path = $file->store('policy-files', 'public');
                $uploadedFiles[] = $path;
            }

            // Store policy files as array (model will cast to JSON)
            $existingFiles = is_array($quoteRequest->policy_file) ? $quoteRequest->policy_file : [];
            $allFiles = array_merge($existingFiles, $uploadedFiles);
            $quoteRequest->policy_file = $allFiles;

            // Append admin notes to history
            if (!empty($validated['admin_notes'])) {
                $existingNotes = is_array($quoteRequest->admin_notes) ? $quoteRequest->admin_notes : [];
                $existingNotes[] = [
                    'note' => $validated['admin_notes'],
                    'created_at' => now()->toIso8601String(),
                    'action' => 'Policy Submitted'
                ];
                $quoteRequest->admin_notes = $existingNotes;
            }

            // Update status to completed
            $quoteRequest->status = 'completed';
            $quoteRequest->save();

            return redirect()->back()
                ->with('success', 'Policy files uploaded successfully!');
        } catch (\Exception $e) {
            // Clean up uploaded files on error
            if (isset($uploadedFiles)) {
                foreach ($uploadedFiles as $file) {
                    Storage::disk('public')->delete($file);
                }
            }

            return back()
                ->withErrors(['error' => 'Failed to upload policy files. Please try again.']);
        }
    }

    /**
     * Update the status of a quote request.
     */
    public function updateStatus(Request $request, QuoteRequest $quoteRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,quote_sent,completed,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $quoteRequest->status = $validated['status'];

        // Append admin notes to history
        if (!empty($validated['admin_notes'])) {
            $existingNotes = is_array($quoteRequest->admin_notes) ? $quoteRequest->admin_notes : [];
            $existingNotes[] = [
                'note' => $validated['admin_notes'],
                'created_at' => now()->toIso8601String(),
                'action' => 'Status Updated to ' . ucwords(str_replace('_', ' ', $validated['status']))
            ];
            $quoteRequest->admin_notes = $existingNotes;
        }

        $quoteRequest->save();

        return redirect()->back()
            ->with('success', 'Status updated successfully!');
    }
}

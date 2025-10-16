<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequestRecipient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminQuoteRequestRecipientsController extends Controller
{
    // protect with middleware for SUPER_ADMIN in routes
    public function index()
    {
        $recipients = QuoteRequestRecipient::orderBy('email')->get();
        return Inertia::render('SuperAdmin/QuoteRequestRecipients', [
            'recipients' => $recipients
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['email' => 'required|email|unique:quote_request_recipients,email']);
        $recipient = QuoteRequestRecipient::create([
            'email' => $request->email,
            'created_by' => $request->user()?->id,
        ]);
        return redirect()->back()->with('success', 'Recipient added.');
    }

    public function update(Request $request, QuoteRequestRecipient $recipient)
    {
        // validate only the fields that were sent (allows toggling is_active without sending email)
        $rules = [];

        if ($request->has('email')) {
            $rules['email'] = 'required|email|unique:quote_request_recipients,email,' . $recipient->id;
        }

        if ($request->has('is_active')) {
            $rules['is_active'] = 'required|boolean';
        }

        if (!empty($rules)) {
            $request->validate($rules);
        }

        // Only update the provided fields
        $recipient->update($request->only(array_keys($rules)));

        return redirect()->back()->with('success', 'Recipient updated.');
    }

    public function destroy(QuoteRequestRecipient $recipient)
    {
        $recipient->delete();
        return redirect()->back()->with('success', 'Recipient removed.');
    }
}

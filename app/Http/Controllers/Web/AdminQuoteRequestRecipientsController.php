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
        $request->validate(['email' => 'required|email|unique:quote_request_recipients,email,' . $recipient->id]);
        $recipient->update($request->only('email', 'is_active'));
        return redirect()->back()->with('success', 'Recipient updated.');
    }

    public function destroy(QuoteRequestRecipient $recipient)
    {
        $recipient->delete();
        return redirect()->back()->with('success', 'Recipient removed.');
    }
}

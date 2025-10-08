<?php

namespace App\Mail;

use App\Models\QuoteRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class QuoteRequestSubmitted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public QuoteRequest $quoteRequest
    ) {
        $this->quoteRequest->load('dependents', 'user');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Insurance Application Submitted - #' . $this->quoteRequest->id,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.quote-request-submitted',
            with: [
                'quoteRequest' => $this->quoteRequest,
                'user' => $this->quoteRequest->user,
                'dependents' => $this->quoteRequest->dependents,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        // Add principal's profile picture if exists
        if ($this->quoteRequest->profile_picture && Storage::disk('public')->exists($this->quoteRequest->profile_picture)) {
            $attachments[] = Attachment::fromStorageDisk('public', $this->quoteRequest->profile_picture)
                ->as('principal_profile_picture.' . pathinfo($this->quoteRequest->profile_picture, PATHINFO_EXTENSION));
        }

        // Add principal's EID copy if exists
        if ($this->quoteRequest->eid_copy && Storage::disk('public')->exists($this->quoteRequest->eid_copy)) {
            $attachments[] = Attachment::fromStorageDisk('public', $this->quoteRequest->eid_copy)
                ->as('principal_eid_copy.' . pathinfo($this->quoteRequest->eid_copy, PATHINFO_EXTENSION));
        }

        // Add dependents' documents
        foreach ($this->quoteRequest->dependents as $index => $dependent) {
            $dependentNumber = $index + 1;

            // Add dependent's profile picture
            if ($dependent->profile_picture && Storage::disk('public')->exists($dependent->profile_picture)) {
                $attachments[] = Attachment::fromStorageDisk('public', $dependent->profile_picture)
                    ->as("dependent_{$dependentNumber}_profile_picture." . pathinfo($dependent->profile_picture, PATHINFO_EXTENSION));
            }

            // Add dependent's EID copy
            if ($dependent->eid_copy && Storage::disk('public')->exists($dependent->eid_copy)) {
                $attachments[] = Attachment::fromStorageDisk('public', $dependent->eid_copy)
                    ->as("dependent_{$dependentNumber}_eid_copy." . pathinfo($dependent->eid_copy, PATHINFO_EXTENSION));
            }
        }

        return $attachments;
    }
}

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
    public function __construct(public QuoteRequest $quoteRequest)
    {
        $this->quoteRequest->load(['dependents', 'user']);
    }

    /**
     * Define the email envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Insurance Application Submitted — #' . $this->quoteRequest->id,
        );
    }

    /**
     * Define the email content.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.quote-request-submitted',
            with: [
                'quoteRequest' => $this->quoteRequest,
                'user'         => $this->quoteRequest->user,
                'dependents'   => $this->quoteRequest->dependents,
                'logoUrl'      => $this->getLogoUrl(),
            ],
        );
    }

    /**
     * Get the absolute URL for the logo.
     */
    protected function getLogoUrl(): string
    {
        $logoPath = config('mail.markdown.logo', '/images/uae_logo.svg');

        // If it's already an absolute URL, return it
        if (str_starts_with($logoPath, 'http')) {
            return $logoPath;
        }

        // Convert relative path to absolute URL
        return rtrim(config('app.url'), '/') . '/' . ltrim($logoPath, '/');
    }

    /**
     * Define attachments.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        // Principal documents
        $this->attachIfExists($attachments, $this->quoteRequest->profile_picture, 'principal_profile_picture');
        $this->attachIfExists($attachments, $this->quoteRequest->eid_file, 'principal_eid_file');

        // Dependent documents
        foreach ($this->quoteRequest->dependents as $index => $dependent) {
            $number = $index + 1;
            $this->attachIfExists($attachments, $dependent->profile_picture, "dependent_{$number}_profile_picture");
            $this->attachIfExists($attachments, $dependent->eid_file, "dependent_{$number}_eid_file");
        }

        return $attachments;
    }

    /**
     * Helper method to add an attachment if the file exists.
     */
    protected function attachIfExists(array &$attachments, ?string $path, string $alias): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            $attachments[] = Attachment::fromStorageDisk('public', $path)
                ->as($alias . '.' . pathinfo($path, PATHINFO_EXTENSION));
        }
    }
}

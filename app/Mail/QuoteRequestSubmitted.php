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
use Illuminate\Support\Facades\Log;

class QuoteRequestSubmitted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    private const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024; // 20MB

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
                'attachments_skipped' => $this->attachmentsTotalBytes() >= self::MAX_ATTACHMENT_BYTES,
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

        $totalBytes = $this->attachmentsTotalBytes();

        if ($totalBytes >= self::MAX_ATTACHMENT_BYTES) {
            try {
                Log::info('QuoteRequestSubmitted: skipping attachments because total size >= 20MB', [
                    'quote_request_id' => $this->quoteRequest->id,
                    'total_bytes' => $totalBytes,
                ]);
            } catch (\Exception $_) {
                // ignore logging failures
            }

            return [];
        }

        // Attach files as usual
        // Principal documents
        $this->attachIfExists($attachments, $this->quoteRequest->profile_picture, 'principal_profile_picture');
        $this->attachIfExists($attachments, $this->quoteRequest->eid_file, 'principal_eid_file');
        $this->attachIfExists($attachments, $this->quoteRequest->passport_copy, 'principal_passport_copy');

        // Dependent documents
        foreach ($this->quoteRequest->dependents as $index => $dependent) {
            $number = $index + 1;
            $this->attachIfExists($attachments, $dependent->profile_picture, "dependent_{$number}_profile_picture");
            $this->attachIfExists($attachments, $dependent->eid_file, "dependent_{$number}_eid_file");
            $this->attachIfExists($attachments, $dependent->passport_copy, "dependent_{$number}_passport_copy");
        }

        return $attachments;
    }

    /**
     * Compute total bytes for all candidate attachments (principal + dependents).
     */
    protected function attachmentsTotalBytes(): int
    {
        $totalBytes = 0;
        $addIfExistsSize = function (?string $path) use (&$totalBytes) {
            if ($path && Storage::disk('public')->exists($path)) {
                try {
                    $totalBytes += Storage::disk('public')->size($path);
                } catch (\Exception $e) {
                    // ignore size failures
                }
            }
        };

        $addIfExistsSize($this->quoteRequest->profile_picture);
        $addIfExistsSize($this->quoteRequest->eid_file);
        $addIfExistsSize($this->quoteRequest->passport_copy);

        foreach ($this->quoteRequest->dependents as $dependent) {
            $addIfExistsSize($dependent->profile_picture);
            $addIfExistsSize($dependent->eid_file);
            $addIfExistsSize($dependent->passport_copy);
        }

        return $totalBytes;
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

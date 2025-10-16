<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class FileValidationService
{
    // Allowed file types with their MIME types and extensions
    private const ALLOWED_TYPES = [
        'application/pdf' => ['.pdf'],
        'image/jpeg' => ['.jpg', '.jpeg'],
        'image/png' => ['.png'],
        'application/msword' => ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => ['.docx'],
    ];

    // File signatures (magic numbers) for verification
    private const FILE_SIGNATURES = [
        'pdf' => ['25504446'], // %PDF
        'jpg' => ['FFD8FF'],
        'png' => ['89504E47'],
        'doc' => ['D0CF11E0A1B11AE1'],
        'docx' => ['504B0304'], // ZIP signature (DOCX is a ZIP file)
    ];

    // Maximum file sizes in bytes
    private const MAX_SIZES = [
        'image' => 50 * 1024 * 1024, // 50MB for images
        'document' => 50 * 1024 * 1024, // 50MB for documents
    ];

    // Error messages
    private const ERROR_MESSAGES = [
        'INVALID_TYPE' => 'Please upload PDF, DOC, DOCX, JPG, or PNG files only',
        'FILE_TOO_LARGE' => 'File size must not exceed :max MB',
        'INVALID_SIGNATURE' => 'File appears to be corrupted or invalid. Please try again',
        'INVALID_NAME' => 'File name contains invalid characters',
        'EMPTY_FILE' => 'The uploaded file is empty',
        'UPLOAD_FAILED' => 'File upload failed. Please try again',
    ];

    /**
     * Validate an uploaded file
     *
     * @param UploadedFile|null $file
     * @param string $type 'image' or 'document'
     * @return array ['valid' => bool, 'errors' => array]
     */
    public function validate(?UploadedFile $file, string $type = 'document'): array
    {
        $errors = [];

        if (!$file) {
            return ['valid' => false, 'errors' => ['File is required']];
        }

        if (!$file->isValid()) {
            return ['valid' => false, 'errors' => [self::ERROR_MESSAGES['UPLOAD_FAILED']]];
        }

        // Validate file type
        if (!$this->validateFileType($file)) {
            $errors[] = self::ERROR_MESSAGES['INVALID_TYPE'];
        }

        // Validate file size
        if (!$this->validateFileSize($file, $type)) {
            $maxSize = $type === 'image' ? 50 : 50;
            $errors[] = str_replace(':max', $maxSize, self::ERROR_MESSAGES['FILE_TOO_LARGE']);
        }

        // Validate file name
        if (!$this->validateFileName($file->getClientOriginalName())) {
            $errors[] = self::ERROR_MESSAGES['INVALID_NAME'];
        }

        // Validate file signature (magic numbers)
        if (!$this->validateFileSignature($file)) {
            $errors[] = self::ERROR_MESSAGES['INVALID_SIGNATURE'];
        }

        // Check if file is empty
        if ($file->getSize() === 0) {
            $errors[] = self::ERROR_MESSAGES['EMPTY_FILE'];
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Validate file type against allowed MIME types and extensions
     */
    private function validateFileType(UploadedFile $file): bool
    {
        $extension = '.' . strtolower($file->getClientOriginalExtension());
        $mimeType = $file->getMimeType();

        if (!isset(self::ALLOWED_TYPES[$mimeType])) {
            return false;
        }

        return in_array($extension, self::ALLOWED_TYPES[$mimeType]);
    }

    /**
     * Validate file size based on type
     */
    private function validateFileSize(UploadedFile $file, string $type): bool
    {
        $maxSize = self::MAX_SIZES[$type] ?? self::MAX_SIZES['document'];
        return $file->getSize() > 0 && $file->getSize() <= $maxSize;
    }

    /**
     * Validate file name for security
     */
    private function validateFileName(string $filename): bool
    {
        // Check for null bytes
        if (strpos($filename, "\0") !== false) {
            return false;
        }

        // Check for directory traversal
        if (preg_match('/\.\.[\\/]/', $filename)) {
            return false;
        }

        // Check for invalid characters (allow alphanumeric, spaces, hyphens, underscores, and dots)
        if (!preg_match('/^[a-zA-Z0-9\s\-_.]+$/', $filename)) {
            return false;
        }

        // Check filename length
        if (strlen($filename) > 255) {
            return false;
        }

        return true;
    }

    /**
     * Validate file signature (magic numbers)
     */
    private function validateFileSignature(UploadedFile $file): bool
    {
        try {
            $handle = fopen($file->getRealPath(), 'rb');
            if (!$handle) {
                return false;
            }

            // Read first 8 bytes
            $bytes = fread($handle, 8);
            fclose($handle);

            if ($bytes === false) {
                return false;
            }

            $hex = strtoupper(bin2hex($bytes));
            $extension = strtolower($file->getClientOriginalExtension());

            // Map extension to signature key
            $signatureKey = match ($extension) {
                'jpg', 'jpeg' => 'jpg',
                'png' => 'png',
                'pdf' => 'pdf',
                'doc' => 'doc',
                'docx' => 'docx',
                default => null,
            };

            if (!$signatureKey || !isset(self::FILE_SIGNATURES[$signatureKey])) {
                return false;
            }

            // Check if the file signature matches any of the allowed signatures
            foreach (self::FILE_SIGNATURES[$signatureKey] as $signature) {
                if (str_starts_with($hex, $signature)) {
                    return true;
                }
            }

            return false;
        } catch (\Exception $e) {
            Log::error('File signature validation failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get allowed file types for validation rules
     */
    public static function getAllowedMimeTypes(): string
    {
        return implode(',', array_keys(self::ALLOWED_TYPES));
    }

    /**
     * Get allowed extensions for validation rules
     */
    public static function getAllowedExtensions(): string
    {
        $extensions = [];
        foreach (self::ALLOWED_TYPES as $mimes) {
            $extensions = array_merge($extensions, $mimes);
        }
        return implode(',', array_map(fn($ext) => ltrim($ext, '.'), array_unique($extensions)));
    }

    /**
     * Get max file size for a type
     */
    public static function getMaxSize(string $type): int
    {
        return self::MAX_SIZES[$type] ?? self::MAX_SIZES['document'];
    }
}

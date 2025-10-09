<?php

namespace App\Rules;

use App\Services\FileValidationService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class ValidatedFile implements ValidationRule
{
    private string $fileType;
    private FileValidationService $validator;

    public function __construct(string $fileType = 'document')
    {
        $this->fileType = $fileType;
        $this->validator = new FileValidationService();
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value instanceof UploadedFile) {
            $fail('The :attribute must be a valid file.');
            return;
        }

        $result = $this->validator->validate($value, $this->fileType);

        if (!$result['valid']) {
            foreach ($result['errors'] as $error) {
                $fail($error);
            }
        }
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $userId],
            'phone' => ['nullable', 'string', 'regex:/^\+971[0-9]{9}$/', 'max:20'],
            'dob' => ['nullable', 'date', 'before:today'],
            'residency' => ['nullable', 'string', 'max:255'],
            'eid_number' => ['nullable', 'string', 'max:50'],
            'eid_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
            'profile_picture' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'first name',
            'middle_name' => 'middle name',
            'last_name' => 'last name',
            'email' => 'email address',
            'phone' => 'phone number',
            'dob' => 'date of birth',
            'residency' => 'emirate of residency',
            'eid_number' => 'Emirates ID number',
            'eid_file' => 'Emirates ID file',
            'profile_picture' => 'profile image',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'Phone number must be in the format +971XXXXXXXXX (9 digits after +971).',
            'dob.before' => 'The date of birth must be a date before today.',
            'eid_file.mimes' => 'The Emirates ID file must be a file of type: jpg, jpeg, png, pdf.',
            'eid_file.max' => 'The Emirates ID file must not be larger than 2MB.',
            'profile_picture.mimes' => 'The profile image must be a file of type: jpg, jpeg, png.',
            'profile_picture.max' => 'The profile image must not be larger than 2MB.',
        ];
    }
}

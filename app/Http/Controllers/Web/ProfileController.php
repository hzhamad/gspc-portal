<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load('roles');

        // List of UAE Emirates
        $emirates = [
            'Abu Dhabi',
            'Dubai',
            'Sharjah',
            'Ajman',
            'Umm Al Quwain',
            'Ras Al Khaimah',
            'Fujairah'
        ];

        return Inertia::render('Agent/Profile', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'name' => $user->name,
                'fullname' => $user->fullname,
                'email' => $user->email,
                'phone' => $user->phone,
                'dob' => $user->dob ? $user->dob->format('Y-m-d') : null,
                'residency' => $user->residency,
                'eid_number' => $user->eid_number,
                'eid_file' => $user->eid_file,
                'profile_image' => $user->profile_image,
                'email_verified_at' => $user->email_verified_at,
                'roles' => $user->roles->pluck('name')->toArray(),
            ],
            'emirates' => $emirates,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Prepare data for update
        $updateData = [
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'dob' => $validated['dob'] ?? null,
            'residency' => $validated['residency'] ?? null,
            'eid_number' => $validated['eid_number'] ?? null,
        ];

        // Update the 'name' field based on first, middle, and last names
        // $updateData['name'] = trim("{$validated['first_name']} " .
        //     ($validated['middle_name'] ? "{$validated['middle_name']} " : '') .
        //     "{$validated['last_name']}");

        // Handle EID file upload
        if ($request->hasFile('eid_file')) {
            // Delete old file if exists
            if ($user->eid_file && Storage::disk('public')->exists($user->eid_file)) {
                Storage::disk('public')->delete($user->eid_file);
            }
            $updateData['eid_file'] = $request->file('eid_file')->store('eid_files', 'public');
        }

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old file if exists
            if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $updateData['profile_image'] = $request->file('profile_image')->store('profile_images', 'public');
        }

        // Update user
        $user->update($updateData);

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Delete the user's profile image.
     */
    public function deleteProfileImage(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
            Storage::disk('public')->delete($user->profile_image);
            $user->update(['profile_image' => null]);
        }

        return redirect()->back()->with('success', 'Profile image deleted successfully!');
    }

    /**
     * Delete the user's EID file.
     */
    public function deleteEidFile(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->eid_file && Storage::disk('public')->exists($user->eid_file)) {
            Storage::disk('public')->delete($user->eid_file);
            $user->update(['eid_file' => null]);
        }

        return redirect()->back()->with('success', 'EID file deleted successfully!');
    }
}

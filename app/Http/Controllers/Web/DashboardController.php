<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Home');
    }

    public function dashboard()
    {
        $user = Auth::user();
        return Inertia::render('Dashboard', ['user' => $user]);
    }

    public function adminDashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('status', true)->count(),
            'total_quote_requests' => QuoteRequest::count(),
            'pending_requests' => QuoteRequest::where('status', 'pending')->count(),
            'completed_requests' => QuoteRequest::where('status', 'completed')->count(),
            'active_policies' => QuoteRequest::where('status', 'completed')->count(), // Adjust based on your logic
        ];

        $recentUsers = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentRequests = QuoteRequest::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentRequests' => $recentRequests,
        ]);
    }
}

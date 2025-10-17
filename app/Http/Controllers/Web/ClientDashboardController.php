<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientDashboardController extends Controller
{
    /**
     * Display the client dashboard.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Get statistics
        $stats = [
            'total_requests' => QuoteRequest::where('user_id', $userId)->count(),
            'pending_requests' => QuoteRequest::where('user_id', $userId)->where('status', 'pending')->count(),
            'completed_requests' => QuoteRequest::where('user_id', $userId)->where('status', 'completed')->count(),
            'active_policies' => QuoteRequest::where('user_id', $userId)->where('status', 'completed')->count(),
        ];

        // Get recent requests
        $recentRequests = QuoteRequest::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Client/Dashboard', [
            'stats' => $stats,
            'recentRequests' => $recentRequests,
        ]);
    }

    public function getSupport()
    {
        return Inertia::render('Client/GetSupport');
    }

    public function userGuide()
    {
        return Inertia::render('Client/UserGuide');
    }
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
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
}

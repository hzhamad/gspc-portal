# GSPC Portal

A Laravel-based web application for managing health insurance quote requests and policies. Built with Laravel 12, React, Inertia.js, and Tailwind CSS.

## Features

### Client Features
- **User Registration & Authentication** - Secure user registration with email verification
- **Quote Request Management** - Submit and manage health insurance quote requests
- **Profile Management** - Update personal information, upload documents (Emirates ID, passport, profile picture)
- **Request Tracking** - View status and history of submitted quote requests
- **Document Management** - Upload and manage dependents' documents
- **Client Dashboard** - Overview of all quote requests and their statuses

### Admin Features
- **Admin Dashboard** - Overview of all quote requests and system statistics
- **User Management** - Create, view, update, and manage user accounts
- **Quote Request Processing** - Review, process, and update quote request statuses
- **File Upload** - Upload insurance quotes and policy documents
- **Status Management** - Update request statuses (pending, quoted, policy issued, etc.)
- **Email Notifications** - Automated email notifications for quote request submissions

### Application Types
- New Insurance Applications
- Renewal Applications
- Dependent Management

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js & npm
- MariaDB/MySQL
- Redis (optional, for caching)
- SMTP server (for email functionality)

## ️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gspc-portal
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Configuration

```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Environment Variables

Edit the `.env` file with your configuration:

```env
# Application
APP_NAME="GSPC Portal"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://gspc-portal.local

# Database
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gspc_portal
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="admin@gspc-portal.ae"
MAIL_FROM_NAME="${APP_NAME}"

# Quote Request Notifications
QUOTE_REQUEST_NOTIFICATION_EMAIL="sponsor@gspc-portal.ae"
MAIL_LOGO=https://gspchealth.ae/images/uae_logo.svg

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

### 5. Database Setup

```bash
# Create the database
mysql -u your_username -p
CREATE DATABASE gspc_portal;
exit;

# Run migrations
php artisan migrate

# Seed the database (creates initial users and countries)
php artisan db:seed
```

### 6. Storage Setup

```bash
# Create symbolic link for storage
php artisan storage:link

# Set proper permissions
chmod -R 775 storage bootstrap/cache
```

### 7. Build Frontend Assets

```bash
# Development build with hot reload
npm run dev

# Production build
npm run build
```

##  Running the Application

### Development

```bash
# Terminal 1 - Start the Laravel development server
php artisan serve

# Terminal 2 - Start Vite development server
npm run dev
```

The application will be available at `http://localhost:8000` (or your configured APP_URL).

### Using Laravel Sail (Docker)

```bash
# Start containers
./vendor/bin/sail up -d

# Stop containers
./vendor/bin/sail down
```

## User Roles

The application uses Spatie Laravel Permission for role-based access control:

- **Admin** - Full access to all features, user management, and quote request processing
- **Client** - Can submit and manage their own quote requests

### Default Admin Account

After running the seeder, you can log in with:
- Check `database/seeders/UsersSeeder.php` for default credentials

## Project Structure

```
├── app/
│   ├── Enums/          # Enumerations (UserRoles, etc.)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/    # API controllers
│   │   │   └── Web/    # Web controllers
│   │   ├── Middleware/ # Custom middleware
│   │   └── Requests/   # Form request validation
│   ├── Mail/           # Mailable classes
│   ├── Models/         # Eloquent models
│   ├── Rules/          # Custom validation rules
│   └── Services/       # Business logic services
├── database/
│   ├── migrations/     # Database migrations
│   └── seeders/        # Database seeders
├── resources/
│   ├── css/            # Stylesheets
│   ├── js/             # React components
│   └── views/          # Blade templates
├── routes/
│   ├── api.php         # API routes
│   └── web.php         # Web routes
└── public/
    ├── images/         # Public images
    └── storage/        # Public storage (symlinked)
```

##  Database Tables

- **users** - User accounts and authentication
- **quote_requests** - Insurance quote requests
- **dependents** - Dependent information for quote requests
- **countries** - Country/nationality data
- **roles** & **permissions** - Role-based access control (Spatie)
- **cache**, **sessions**, **jobs** - Laravel system tables

## Email Configuration

For local development, you can use MailHog or Mailtrap:

### MailHog (included with Laravel Sail)
```env
MAIL_MAILER=smtp
MAIL_HOST=localhost
MAIL_PORT=1025
```

Access MailHog at `http://localhost:8025`

## Testing

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit
```

## Artisan Commands

```bash
# Clear all caches
php artisan optimize:clear

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run queue worker
php artisan queue:work

# View logs in real-time
php artisan pail
```

## Key Dependencies

### Backend
- **Laravel 12** - PHP framework
- **Inertia.js** - Modern monolith approach
- **Spatie Laravel Permission** - Role and permission management
- **Laravel Sanctum** - API authentication

### Frontend
- **React 18** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Frontend build tool
- **Axios** - HTTP client

## Security

- Email verification required for new users
- Role-based access control (RBAC)
- CSRF protection
- File upload validation
- Secure password hashing with bcrypt
- Signed URLs for sensitive routes

## File Upload Directories

The application stores files in the following directories:
- `storage/app/public/profile_pictures/` - User profile pictures
- `storage/app/public/eid_files/` - Emirates ID files
- `storage/app/public/passport_copies/` - Passport copies
- `storage/app/public/dependents/` - Dependent documents
- `storage/app/public/quote-files/` - Insurance quote files
- `storage/app/public/policy-files/` - Policy documents
- `storage/app/public/quote-requests/` - Quote request attachments

## Debugging

```bash
# Enable debug mode in .env
APP_DEBUG=true
LOG_LEVEL=debug

# View real-time logs
php artisan pail

# Check log files
tail -f storage/logs/laravel.log
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team or create an issue in the project repository.

## Development Workflow

1. Make sure migrations are up to date: `php artisan migrate`
2. Start development servers: `php artisan serve` and `npm run dev`
3. Make your changes
4. Test thoroughly
5. Build for production: `npm run build`
6. Deploy

---

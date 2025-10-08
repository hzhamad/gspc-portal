# My Requests - View & Edit Implementation

## Overview
Professional implementation of view and edit functionality for insurance quote requests in the my-requests section.

## Features Implemented

### 1. Request Detail View (`RequestDetail.jsx`)
**Route:** `/my-requests/{id}`

#### Key Features:
- **Comprehensive Data Display**
  - Application status with color-coded badges
  - Application type (Self, Self + Dependents, Dependents Only)
  - Submission and update timestamps
  - Complete principal/sponsor information
  - All dependent details with relationship indicators
  - Document previews (profile pictures, Emirates ID copies)
  - Admin notes section
  - Quote, payment, and policy document downloads

- **Professional UI Elements**
  - Gold-themed consistent with the application design
  - Responsive grid layouts for different screen sizes
  - Icon-based visual cues for different sections
  - Hover effects on images with "View Full Size" overlay
  - Document download buttons with appropriate styling
  - Back navigation to requests list

- **Status-Based Actions**
  - Edit button only visible for "Pending" status applications
  - Different action buttons for different statuses (Quote Download, Payment Link, Policy Download)
  - Clear visual feedback for application state

### 2. Request Edit Form (`RequestEdit.jsx`)
**Route:** `/my-requests/{id}/edit`

#### Key Features:
- **Conditional Field Display**
  - Application type selection (disabled after creation)
  - Principal fields shown only for applicable types
  - Dependents section shown only for applicable types

- **Form Validation**
  - Required field indicators with red asterisks
  - Real-time validation feedback
  - File upload constraints (size, type)
  - Server-side validation through Laravel

- **File Management**
  - Preview current uploaded files
  - Replace files with new uploads
  - Support for images (JPG, PNG) and PDFs
  - Automatic cleanup of old files on update

- **Dependent Management**
  - Add new dependents dynamically
  - Edit existing dependents
  - Remove dependents
  - Preserve existing dependent data on edit

- **User Experience**
  - Info alert about editing restrictions
  - Cancel button to return to detail view
  - Loading state on form submission
  - Success/error messaging via flash messages

### 3. Backend Implementation

#### Routes Added (`web.php`)
```php
Route::get('/my-requests/{quoteRequest}/edit', [QuoteRequestController::class, 'edit'])->name('my-requests.edit');
Route::put('/my-requests/{quoteRequest}', [QuoteRequestController::class, 'update'])->name('my-requests.update');
```

#### Controller Methods (`QuoteRequestController.php`)

**`edit()`**
- Authorization check (user owns the request)
- Status validation (only pending requests can be edited)
- Load request with dependents
- Render edit form with emirates data

**`update()`**
- Authorization check
- Status validation
- Comprehensive form validation
- Database transaction for data integrity
- File upload handling with cleanup of old files
- Dependent CRUD operations (create, update, delete)
- Success/error response handling

### 4. Data Model Support

#### QuoteRequest Model
- `application_type`: self, self_dependents, dependents
- `sponsor_name`: Principal's full name
- `sponsor_id`: Emirates ID number
- `date_of_birth`: Date of birth
- `emirate_of_residency`: Current emirate
- `profile_picture`: Path to profile image
- `eid_copy`: Path to Emirates ID document
- `status`: pending, quote_sent, payment_pending, completed, rejected
- `quote_file`: Quote document path
- `payment_link`: Payment URL
- `policy_file`: Policy document path
- `admin_notes`: Notes from admin team

#### Dependent Model
- `uid_number`: UID number (optional)
- `eid_number`: Emirates ID number (optional)
- `marital_status`: single, married
- `date_of_birth`: Date of birth
- `relationship`: spouse, child, parent, sibling
- `profile_picture`: Path to profile image
- `eid_copy`: Path to Emirates ID document

## UI/UX Highlights

### Professional Design Elements
1. **Consistent Color Scheme**
   - Gold (#C8A870) for primary actions
   - Status-specific colors (yellow for pending, blue for quote sent, etc.)
   - Neutral grays for backgrounds and borders

2. **Icon System**
   - Heroicons for consistent iconography
   - Contextual icons for each section
   - Status-specific icons in badges

3. **Responsive Layout**
   - Mobile-first design
   - Grid layouts that adapt to screen size
   - Stacked layouts on mobile, side-by-side on desktop

4. **Visual Hierarchy**
   - Clear section headers with icons
   - Card-based layout for grouping related information
   - Proper spacing and padding throughout

5. **Interactive Elements**
   - Hover effects on clickable items
   - Loading states on form submission
   - Smooth transitions and animations
   - Clear focus states for accessibility

## Security Features

1. **Authorization**
   - Users can only view/edit their own requests
   - Middleware authentication required
   - Route model binding for automatic model loading

2. **Validation**
   - Server-side validation for all inputs
   - File type and size restrictions
   - Required field validation
   - Database transaction for atomicity

3. **Status Protection**
   - Only pending requests can be edited
   - Clear error messages for invalid operations
   - Automatic redirect on unauthorized access

## File Structure

```
resources/js/Pages/Agent/
├── MyRequests.jsx        # List view (existing)
├── RequestDetail.jsx     # Detail view (new)
└── RequestEdit.jsx       # Edit form (new)

routes/
└── web.php              # Updated with edit/update routes

app/Http/Controllers/Web/
└── QuoteRequestController.php  # Added edit() and update() methods
```

## Usage Flow

1. **View Request Details**
   - User navigates from My Requests list
   - Clicks "View Details" on any request
   - Sees complete request information
   - Can download documents if available

2. **Edit Request**
   - From detail view, clicks "Edit Application" (if pending)
   - Redirected to edit form with pre-filled data
   - Makes changes to fields
   - Updates or replaces files
   - Saves changes
   - Redirected back to detail view with success message

3. **Dependent Management in Edit**
   - Can add new dependents with "Add Dependent" button
   - Can remove existing dependents with "Remove" button
   - Changes are persisted on form submission
   - Old files are automatically cleaned up

## Testing Recommendations

1. **Functional Tests**
   - View request details as owner
   - Attempt to view another user's request (should fail)
   - Edit pending request
   - Attempt to edit non-pending request (should fail)
   - Update request with file uploads
   - Add/remove dependents

2. **UI Tests**
   - Responsive behavior on mobile/tablet/desktop
   - File upload and preview functionality
   - Form validation messages
   - Navigation between pages
   - Status badge rendering

3. **Security Tests**
   - Authorization checks
   - File upload validation
   - XSS prevention
   - CSRF protection

## Future Enhancements

1. **Possible Additions**
   - Request history/timeline
   - Email notifications on status changes
   - PDF export of request details
   - Bulk file upload for multiple dependents
   - Drag-and-drop file upload
   - Image cropping for profile pictures

2. **Admin Features** (for future implementation)
   - Admin view of all requests
   - Status update workflow
   - Document upload (quote, policy)
   - Notes and communication with users

## Notes

- All dates are formatted in US English format (Month DD, YYYY)
- File uploads are stored in `storage/app/public` with organized subdirectories
- The application uses Inertia.js for seamless page transitions
- Form submissions use FormData to handle file uploads properly
- Database transactions ensure data integrity during updates

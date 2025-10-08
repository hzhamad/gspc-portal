# Quick Start Guide - UI Integration

## 🎉 Integration Complete!

Your Laravel + Inertia.js application now has the complete UI and logic from the Next.js project.

---

## 📁 New Files Created

### Components:
1. **`resources/js/Components/UAEHeader.jsx`**  
   - UAE government header with logo
   - Used in Login, Register pages

2. **`resources/js/Components/FileUpload.jsx`**  
   - Reusable file upload with dashed border
   - Supports images and PDFs
   - Gold hover effect

### Pages:
3. **`resources/js/Pages/Auth/Register.jsx`**  
   - New registration page
   - Multi-field form with gold theme

---

## ✏️ Updated Files

### Styling:
1. **`resources/css/app.css`**
   - Added CSS variables for gold theme
   - Added custom utility classes
   - Added scrollbar styling

2. **`resources/views/app.blade.php`**
   - Updated body classes for consistent background

### Pages:
3. **`resources/js/Pages/Auth/Login.jsx`**
   - Completely redesigned with gold theme
   - Added UAE header
   - Modern card-based layout

4. **`resources/js/Pages/Agent/QuoteRequest.jsx`**
   - Added Emirates ID / Unified ID toggle
   - Added ID validation logic
   - Integrated FileUpload component
   - Applied gold theme throughout
   - Added dependent emirate field

---

## 🎨 Color Theme

### Primary Gold: `#b68a35`
Used for:
- Button backgrounds
- Focus rings
- Active states
- Hover borders
- Links

### Background: `#F8FAFC`
### Text: `#171717`

---

## 🔑 Key Features

### 1. Login & Register
- ✅ UAE-style header
- ✅ Gold focus rings
- ✅ Password visibility toggles
- ✅ Responsive design
- ✅ Loading states

### 2. Quote Request Form
- ✅ **Emirates ID** and **Unified ID** modes
- ✅ ID format validation
- ✅ Dynamic field updates
- ✅ File upload UI with previews
- ✅ Add/remove dependents
- ✅ Complete form data submission

### 3. File Uploads
- ✅ Dashed border design
- ✅ Gold hover effect
- ✅ File type icons
- ✅ File name display
- ✅ PNG/JPG/PDF support

---

## 🧪 Testing

### Test Login:
```bash
# Visit the login page
# URL: http://your-app.test/login
```

**What to verify:**
- UAE header displays
- Form has rounded corners
- Inputs show gold focus ring when clicked
- Password toggle works
- Submit button shows loading spinner

### Test Register:
```bash
# Visit the register page
# URL: http://your-app.test/register
```

**What to verify:**
- Three name fields in a row
- Email and phone side by side
- Password visibility toggles work
- Gold theme on all inputs

### Test Quote Request:
```bash
# Visit the quote request page
# URL: http://your-app.test/quote-request
```

**What to verify:**
1. Click application type - gold border appears
2. Toggle between Emirates ID and Unified ID
3. Enter invalid EID format (e.g., "123") → alert on submit
4. Enter valid EID: `784-2025-1234567-1`
5. Click file upload areas → border turns gold on hover
6. Add dependent → new card appears
7. Remove dependent → card disappears
8. Submit → loading spinner appears

---

## 🔧 Emirates ID Validation

### Valid Format:
```
784-YYYY-XXXXXXX-X
```

**Examples:**
- `784-2025-1234567-1` ✅
- `784-1990-9876543-2` ✅

**Invalid:**
- `123-456-789` ❌
- `784-12-345` ❌
- `abcd` ❌

### Unified ID:
- Minimum 10 characters
- No specific format required

---

## 📝 Backend Requirements

Make sure these routes exist:

```php
// In routes/web.php or routes/api.php

POST /login
POST /register
POST /quote-request
```

### Expected Data from Quote Request:

```php
$request->validate([
    'application_type' => 'required|in:self,dependents,self_dependents',
    'id_type' => 'required|in:eid,uid',
    'sponsor_name' => 'required_if:application_type,self,self_dependents',
    'sponsor_id' => 'required_if:application_type,self,self_dependents',
    'date_of_birth' => 'required_if:application_type,self,self_dependents|date',
    'emirate_of_residency' => 'required_if:application_type,self,self_dependents',
    'profile_picture' => 'nullable|image|max:2048',
    'eid_copy' => 'nullable|mimes:jpg,png,pdf|max:2048',
    'dependents.*.uid_number' => 'nullable|string',
    'dependents.*.eid_number' => 'nullable|string',
    'dependents.*.marital_status' => 'required',
    'dependents.*.date_of_birth' => 'required|date',
    'dependents.*.relationship' => 'required',
]);
```

---

## 🖼️ Required Asset

Ensure the UAE logo exists:
```
public/images/uae_logo.svg
```

If missing, the header will show a broken image icon.

---

## 🎯 Usage Examples

### Using UAEHeader in other pages:

```jsx
import UAEHeader from '@/Components/UAEHeader';

export default function MyPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <UAEHeader />
            {/* Your content */}
        </div>
    );
}
```

### Using FileUpload:

```jsx
import FileUpload from '@/Components/FileUpload';

<FileUpload
    label="Upload Document"
    accept="image/*,.pdf"
    onChange={(e) => handleFile(e.target.files[0])}
    fileName={file?.name}
    error={errors.document}
/>
```

### Using Gold Theme Utilities:

```jsx
// Gold button
<button className="bg-gold text-white px-4 py-2 rounded-lg hover:brightness-110">
    Click Me
</button>

// Gold focus ring
<input className="focus:ring-2 focus:ring-gold focus:border-gold" />

// Or use utility class
<input className="focus-gold" />
```

---

## 🐛 Troubleshooting

### Gold color not showing?
- Check tailwind.config.js has `gold: '#b68a35'` in colors
- Rebuild assets: `npm run dev` or `npm run build`

### UAE Header not displaying?
- Verify `/public/images/uae_logo.svg` exists
- Check UAEHeader.jsx import path

### File upload not working?
- Check FileUpload component is imported
- Verify onChange handler receives file object

### CSS warnings in editor?
- The `@apply`, `@source`, `@theme` warnings are normal for Tailwind v4
- They don't affect functionality

---

## 🚀 Next Steps

1. ✅ Test all pages in browser
2. ✅ Verify backend routes
3. ✅ Add UAE logo to public/images/
4. ✅ Test file uploads
5. ✅ Configure email settings for password reset
6. ✅ Add backend validation rules

---

**Enjoy your new gold-themed UAE government portal! 🇦🇪✨**

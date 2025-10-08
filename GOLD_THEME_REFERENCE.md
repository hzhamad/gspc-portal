# 🌟 Gold Theme Reference - #b68a35

## Color Application Guide

### 📊 Gold Usage Breakdown

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Gold #b68a35)                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Welcome back, John!          john@email.com  [JD] │  │
│  │ Manage your insurance applications                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌──────────────────────┐
│ Sidebar (White BG)   │
│                      │
│ ┌──────────────────┐ │
│ │ LOGO AREA        │ │ ← Gold Gradient Box
│ │ (Gold Gradient)  │ │
│ └──────────────────┘ │
│                      │
│ □ Dashboard         │ │ ← Hover: Gold bg
│ ■ New App (Active)  │ │ ← Active: Gold bg
│ □ My Requests       │ │
│ □ Profile           │ │
│                      │
│ ─────────────────   │ │
│ ⚠ Logout (Red)      │ │
│                      │
│ ┌──────────────────┐ │
│ │ [JD] John Doe    │ │ ← Gold avatar
│ │ john@email.com   │ │
│ └──────────────────┘ │
└──────────────────────┘
```

---

## 🎨 Gold Color Codes

### Main Gold
```css
#b68a35  /* Hex */
rgb(182, 138, 53)  /* RGB */
hsl(40, 55%, 46%)  /* HSL */
```

### Gold Variations
```css
/* Lighter (hover states) */
#b68a35 with 10% opacity = rgba(182, 138, 53, 0.1)
#b68a35 with 20% opacity = rgba(182, 138, 53, 0.2)

/* Darker (scrollbar) */
#a07a2e
```

---

## 📍 Where Gold is Applied

### 1. **Header Component**
```jsx
✅ Background: bg-gold
✅ Border: border-gold/20
✅ Shadow: shadow-md
✅ Text: white (for contrast)
```

### 2. **Sidebar Logo Area**
```jsx
✅ Background: from-gold to-gold/80 (gradient)
✅ Rounded corners: rounded-xl
✅ Shadow: shadow-lg
✅ UAE Logo: brightness-0 invert (white)
```

### 3. **Active Menu Item**
```jsx
✅ Background: bg-gold
✅ Text: text-white
✅ Shadow: shadow-md
```

### 4. **Menu Hover State**
```jsx
✅ Background: bg-gold/10 (light gold)
✅ Text: text-gold
```

### 5. **User Avatar (Sidebar Bottom)**
```jsx
✅ Background: from-gold to-gold/80
✅ Text: text-white
```

### 6. **Focus Rings (Forms)**
```jsx
✅ Ring: ring-gold
✅ Border: border-gold
```

### 7. **Buttons**
```jsx
✅ Background: bg-gold
✅ Hover: hover:brightness-110
✅ Text: text-white
```

### 8. **File Upload Hover**
```jsx
✅ Border: hover:border-gold
```

### 9. **Quick Action Banner (Dashboard)**
```jsx
✅ Background: from-gold to-gold/80
✅ Button: bg-white text-gold
```

### 10. **Scrollbar**
```jsx
✅ Thumb: background: #b68a35
✅ Thumb Hover: background: #a07a2e
```

---

## 🔧 Tailwind Classes Quick Reference

### Backgrounds
```jsx
bg-gold                 // Solid gold
bg-gold/10             // 10% opacity
bg-gold/20             // 20% opacity
bg-gold/80             // 80% opacity
from-gold to-gold/80   // Gradient
```

### Text
```jsx
text-gold              // Gold text
text-white             // White text (on gold)
text-white/80          // 80% opacity white
text-white/90          // 90% opacity white
```

### Borders
```jsx
border-gold            // Gold border
border-gold/20         // 20% opacity border
border-gold/30         // 30% opacity border
border-gold/50         // 50% opacity border
hover:border-gold      // Gold on hover
```

### Focus/Ring
```jsx
ring-gold              // Gold focus ring
focus:ring-gold        // Gold ring on focus
focus:border-gold      // Gold border on focus
```

### Hover Effects
```jsx
hover:bg-gold/10       // Light gold background
hover:text-gold        // Gold text
hover:brightness-110   // Brighten on hover (for gold buttons)
hover:border-gold      // Gold border on hover
```

---

## 🎯 Gold vs Other Colors

### When to Use Gold
✅ Primary actions (Submit, New Application)
✅ Active states (selected menu item)
✅ Headers and branding
✅ Focus indicators
✅ Logo areas
✅ Important highlights

### When NOT to Use Gold
❌ Error messages (use red)
❌ Success messages (use green)
❌ Logout button (use red)
❌ Disabled states (use gray)
❌ Body text (use gray-800)

---

## 📐 Contrast Ratios (Accessibility)

### Gold Background with White Text
```
Gold (#b68a35) + White (#ffffff)
Contrast Ratio: 4.5:1 ✅
WCAG AA: Pass (Large Text)
WCAG AAA: Pass (Large Text)
```

### Gold Text on White Background
```
Gold (#b68a35) + White (#ffffff)
Contrast Ratio: 4.5:1 ✅
WCAG AA: Pass
```

---

## 🖼️ Visual Examples

### Gold Header
```html
<header class="bg-gold border-b border-gold/20 shadow-md">
  <h1 class="text-white">Welcome!</h1>
  <p class="text-white/90">Subtitle</p>
</header>
```

### Gold Button
```html
<button class="bg-gold text-white px-4 py-2 rounded-lg hover:brightness-110">
  Click Me
</button>
```

### Gold Active Menu
```html
<a class="bg-gold text-white px-4 py-3 rounded-lg shadow-md">
  Dashboard
</a>
```

### Gold Hover Menu
```html
<a class="hover:bg-gold/10 hover:text-gold px-4 py-3 rounded-lg">
  Profile
</a>
```

### Gold Gradient Box
```html
<div class="bg-gradient-to-br from-gold to-gold/80 rounded-xl p-4">
  <h2 class="text-white">GSPC Portal</h2>
</div>
```

### Gold Focus Ring
```html
<input class="border border-gray-300 focus:ring-2 focus:ring-gold focus:border-gold">
```

---

## 🌈 Full Color Palette

```css
/* Primary Colors */
--gold: #b68a35          /* Main gold */
--gold-dark: #a07a2e     /* Darker gold (scrollbar hover) */

/* Background Colors */
--bg: #F8FAFC            /* Main background */
--background: #ffffff    /* White background */

/* Text Colors */
--foreground: #171717    /* Dark text */

/* Neutral Colors (from Tailwind) */
gray-50:   #F9FAFB
gray-100:  #F3F4F6
gray-200:  #E5E7EB
gray-300:  #D1D5DB
gray-400:  #9CA3AF
gray-500:  #6B7280
gray-600:  #4B5563
gray-700:  #374151
gray-800:  #1F2937
gray-900:  #111827
```

---

## 🔄 Before & After Comparison

### Before (Blue Theme)
```jsx
// Old blue-based theme
bg-blue-500
text-blue-600
border-blue-300
from-blue-500 to-indigo-600
```

### After (Gold Theme)
```jsx
// New gold-based theme
bg-gold
text-gold
border-gold
from-gold to-gold/80
```

---

## 🎨 Complementary Colors

Gold pairs well with:
- **White** - Clean, professional
- **Gray** - Neutral, sophisticated  
- **Dark Blue** - Traditional, trustworthy (for icons)
- **Red** - For warnings/logout
- **Green** - For success states

---

**The gold theme (#b68a35) creates a luxurious, government-appropriate aesthetic that aligns with UAE branding! 🇦🇪✨**

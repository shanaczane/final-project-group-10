# Tally — Store Inventory Manager

A cross-platform mobile app for small retail stores to manage inventory, record sales, and track stock levels.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native, TypeScript, Expo (SDK 54) |
| Backend | Supabase (PostgreSQL, Auth, RLS) |
| State | Legend State (`@legendapp/state`) |
| Navigation | React Navigation (Bottom Tabs) |
| Fonts | Manrope (via `@expo-google-fonts/manrope`) |
| Build | EAS Build (Expo Application Services) |

---

## Features

### Owner
- Dashboard with today's sales, weekly bar chart, inventory value, and low stock alerts
- Restock products directly from the dashboard low stock section
- Full inventory management — add, edit, delete products with buy/sell price, quantity, and min threshold
- Category management with custom icons per category
- Sales recording with confirmation and stock-after-sale preview
- Activity log with filtering by sales, restocks, and adjustments
- Settings — toggle dark/light mode, manage helper accounts, change email/password

### Helper
- Dashboard with today's sales and recent activity
- Record sales (read + sell only — no edit or delete)
- View inventory with stock status indicators
- Profile screen

### Both
- Low stock push notifications when a sale brings a product to or below its minimum threshold
- Dark and light mode (auto-detected from system, persisted)
- Android hardware back button support throughout the app

---

## Roles

| Role | Access |
|------|--------|
| **Owner** | Full access — inventory, categories, sales, settings |
| **Helper** | Read + sales only — cannot edit products, categories, or settings |

Roles are enforced via **Supabase Row Level Security (RLS)** — not just client-side checks.

---

## Database Tables

| Table | Description |
|-------|-------------|
| `users` | Extended user profile with `role`, `store_name`, `owner_id` |
| `products` | Inventory items with pricing, quantity, and min threshold |
| `categories` | Product categories with custom icons |
| `stock_movements` | Audit log of all sales, restocks, and adjustments |

---

## Project Structure

```
tally/
├── screens/
│   ├── owner/          # Dashboard, Inventory, Categories, Sales, Settings
│   ├── helper/         # Dashboard, Inventory, Sales, Profile
│   ├── shared/         # ProductDetailModal
│   └── auth/           # Login, Signup, CompleteSetup
├── navigation/         # RootNavigator, OwnerNavigator, HelperNavigator
├── components/         # ActivityModal
├── context/            # AuthContext, ThemeContext
├── lib/                # supabase.ts, notifications.ts
├── store.ts            # Global reactive store + all DB mutations
└── types/              # TypeScript interfaces
```

Each screen lives in its own folder with:
- `ScreenName.tsx` — component logic
- `screenname.style.ts` — styles using `createStyles(colors: Colors)`

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Expo Go app (for development testing)
- EAS CLI (`npm install -g eas-cli`) for building APKs

### Install dependencies
```bash
npm install --registry https://registry.npmmirror.com
```

### Environment variables
Create a `.env` file in the root:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For EAS builds, set these as EAS environment variables:
```bash
eas env:create --environment preview --name EXPO_PUBLIC_SUPABASE_URL --value <url> --visibility sensitive
eas env:create --environment preview --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <key> --visibility sensitive
```

### Run development server
```bash
npx expo start
```

### Build APK (Android)
```bash
eas build -p android --profile preview
```

---

## Authentication

- Email/password signup (Owner only — creates store with name)
- Google OAuth (Owner only — prompts for store name after first sign-in)
- Helper accounts are created by the Owner in the Settings screen using a generated temporary password

---

## Notifications

Low stock push notifications are triggered locally when a sale brings a product's quantity to or below its `min_threshold`. Uses `expo-notifications` — permission is requested on first app launch.

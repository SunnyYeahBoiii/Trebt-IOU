# Sổ Thơ Nụ - Debt/IOU Management App (Frontend)

A simple and intuitive web application for managing debts and IOUs (I Owe You) between friends and family members. Built with React, TypeScript, and Vite, this app helps you track who owes whom and keep your financial relationships organized.

## Features

- **Dashboard**: View all debt records in a clean table format with creditor, debtor, amount, and description
- **Add Bill**: Create new debt records with:
  - Select creditor from predefined users (Phương, Pha, Thịnh, Tuấn)
  - Select multiple debtors
  - Specify amount and description
  - Choose bill type (SPLITTING or EACHONE)
- **Statistics**: Visual debt matrix showing net debts between all users
- **Theme Switcher**: Toggle between light and dark modes
- **Edit/Delete**: Manage existing debt records with modal dialogs
- **Filter & Sort**: Upcoming feature for filtering and sorting bills

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Utility**: clsx for conditional styling
- **Deployment**: Vercel (via `vercel.json`)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The optimized production files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## API Configuration

This application connects to a backend API. Configure the API URL in your environment or component code.

Default development API: `http://localhost:3002/v1`

**Available endpoints:**
- `GET /v1/bills/query` - Fetch all debt records with optional filters
- `POST /v1/bills/add` - Create a new debt record
- `POST /v1/bills/edit` - Edit an existing debt record
- `POST /v1/bills/remove` - Remove a debt record
- `GET /v1/statistic` - Get debt statistics matrix

## Project Structure

```
src/
├── components/
│   ├── dialogs/
│   │   ├── EditDialog.tsx    # Modal for editing bills
│   │   └── Options.tsx       # Options dialog
│   ├── themeSwitcher/
│   │   └── ThemeSwitcher.tsx # Dark/light mode toggle
│   ├── AdBill.tsx            # Add new bill form
│   ├── Dashboard.tsx         # Main debt list view
│   └── Statistic.tsx         # Debt statistics matrix
├── dtos/
│   ├── bill.dto.ts           # Bill data transfer object
│   └── debt.dto.ts           # Debt data transfer object
├── helper/
│   ├── amountDots.helper.ts  # Number formatting (adds dots for thousands)
│   └── idToName.helper.ts    # ID to name conversion
├── assets/
│   ├── icons8-loading.png    # Loading indicator
│   └── react.svg
├── App.tsx                   # Main app component with routing
├── global.css                # Global styles and CSS variables
└── main.tsx                  # Application entry point
```

## Data Types

### BillDto
```typescript
interface BillDto {
  id?: string;
  creditorId: string;
  debtorIDs: string;         // Comma-separated debtor IDs
  description: string;
  billType: "SPLITTING" | "EACHONE";
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

**Bill Types:**
- `SPLITTING`: Total amount is divided equally among all debtors
- `EACHONE`: Each debtor owes the full total amount

### DebtDto
```typescript
interface DebtDto {
  totalLent: number;
  totalOwed: number;
  creditorId: string;
  debtorId: string;
  id: string;
}
```

## Routing

The application uses React Router with the following routes:
- `/dashboard` - Main dashboard view (default)
- `/add-bill` - Add new bill form
- `/statistic` - Debt statistics matrix
- `/filter` - Filter and sort bills (upcoming feature)

## Deployment

This project is configured for Vercel deployment. The `vercel.json` file includes:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing rewrite rule for client-side routing

To deploy to Vercel:
1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Vercel will automatically detect the configuration and deploy

## Users

The application is pre-configured with 4 users:
1. Phương (ID: "1")
2. Pha (ID: "2")
3. Thịnh (ID: "3")
4. Tuấn (ID: "4")

## Helper Functions

### amountDots.helper.ts
Formats numbers with dots as thousand separators (Vietnamese currency format).
Example: `1000000` → `1.000.000`

### idToName.helper.ts
Converts user IDs to their corresponding names for display.

## License

Private project

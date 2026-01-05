# Trebt IOU - Debt and Expense Tracker

## Overview

Sổ Thơ Nụ is a lightweight web application designed to simplify personal and shared expense tracking for roommates, automating debt calculations and transaction logging.

### Problem It Solves
Track who owes whom among friends and roommates, eliminating confusion from spreadsheets and manual calculations.

### Key Features
- Quick entry for debts and bills
- Real-time debt dashboard with filtering
- Automatic debt calculations and statistics
- Visual debt matrix showing net balances
- Light/dark theme support
- Vietnamese language interface
- Debt filtering by creditor, debtors, amount, and time
- Edit and delete existing bills

## Project Structure

```
Trebt-IOU/
├── api/                    # NestJS Backend
│   ├── src/
│   │   ├── bills/          # Bill management (CQRS)
│   │   ├── debts/          # Debt tracking
│   │   ├── statistics/     # Statistics calculation
│   │   ├── dtos/           # Data transfer objects
│   │   └── prisma/         # Prisma service
│   ├── prisma/
│   │   ├── schema/         # Prisma schema
│   │   └── migrations/      # Database migrations
│   └── package.json
├── web/                    # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── dtos/           # TypeScript DTOs
│   │   └── helper/         # Utility functions
│   └── package.json
└── README.md
```

## Tech Stack

### Backend (api/)
- **Framework**: NestJS 11.0 with CQRS pattern
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL with Prisma ORM 7.2
- **API Documentation**: Swagger (OpenAPI)
- **Package Manager**: pnpm
- **Validation**: class-validator and class-transformer
- **Session Management**: express-session with cookie-parser

### Frontend (web/)
- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS v4.1
- **Routing**: React Router 7.11
- **HTTP Client**: Axios 1.13
- **State Management**: TanStack React Query 5.62
- **Deployment**: Vercel (frontend), Render (backend)

## Database Schema

![TrebtIOU Database Schema](./images/TrebtIOU.drawio.svg)

### Models
- **User**: User information (name) with relations to bills, debts, and statistics
- **Bill**: Expense records with creditor, debtors, type (SPLITTING/EACHONE), timestamps
- **Debt**: Individual debt relationships linking creditor, debtor, and bill
- **Statistic**: Aggregated debt statistics between users (totalLent, totalOwed)

### Bill Types
- **SPLITTING**: Total amount divided equally among all debtors
- **EACHONE**: Each debtor owes the full amount

### Database Configuration
- PostgreSQL with Prisma ORM
- Custom client output: `@generated/prisma`
- Binary targets: native, linux-musl-openssl-3.0.x
- Preview features: fullTextSearchPostgres, postgresqlExtensions, views

## Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- pnpm (for backend) or npm (for frontend)

### Backend Setup

```bash
cd api
pnpm install
cp .env.example .env
```

Configure your `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/trebt_iou"
PORT=3002
CORS_ORIGIN="http://localhost:5173"
```

Run migrations:
```bash
pnpm prisma migrate dev
```

Start development server:
```bash
pnpm run dev
```

The API will be available at `http://localhost:3002/v1`

### Frontend Setup

```bash
cd web
npm install
```

Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## API Documentation

Swagger UI is available at: `http://localhost:3002/v1/docs`

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/` | Health check |
| POST | `/v1/seed` | Seed initial data |
| POST | `/v1/bills/add` | Add new bill |
| POST | `/v1/bills/edit` | Edit existing bill |
| POST | `/v1/bills/remove` | Remove bill |
| GET | `/v1/bills/query` | Query bills with filters |
| GET | `/v1/statistic` | Get debt statistics matrix |

### Query Parameters (for `/v1/bills/query`)
- `creditorId`: Filter by creditor ID (1-4)
- `debtorIds`: Filter by debtor IDs (comma-separated)
- `lowerAmount`: Minimum total amount
- `upperAmount`: Maximum total amount
- `timeAsc`: Sort by creation time ascending (true/false)
- `amountAsc`: Sort by amount ascending (true/false)

## Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | Dashboard | View all bills with filter options |
| `/add-bill` | AddBill | Create new bills |
| `/statistic` | Statistic | View debt statistics matrix |
| `/filter` | Filter | Filter bills by creditor/debtor |

## Pre-configured Users

The application includes 4 default users:
1. Phương (ID: 1)
2. Pha (ID: 2)
3. Thịnh (ID: 3)
4. Tuấn (ID: 4)

## Development

### Backend Commands
```bash
pnpm run dev          # Start in watch mode
pnpm run build        # Build for production
pnpm run start:prod   # Run production build
pnpm run test         # Run unit tests
pnpm run test:e2e     # Run e2e tests
pnpm run lint         # Lint code with ESLint
pnpm run format       # Format code with Prettier
pnpm run check-types  # Type check with TypeScript
```

### Frontend Commands
```bash
npm run dev           # Start dev server with Vite
npm run build         # Build for production (TypeScript + Vite)
npm run preview       # Preview production build
npm run lint          # Lint code with ESLint
```

## Deployment

### Backend (Render)
Backend is deployed on Render:
- Base URL: `https://trebt-iou-api.onrender.com/v1`
- PostgreSQL database on Render
- Environment variables: `DATABASE_URL`, `PORT`, `CORS_ORIGIN`
- Build command: `pnpm run build`
- Start command: `pnpm run start:prod`

### Frontend (Vercel)
Frontend is configured for Vercel deployment:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing with rewrite rules

Deploy to Vercel:
1. Push code to Git repository
2. Connect repository to Vercel
3. Vercel auto-detects and deploys

### Local Sharing
For sharing with roommates locally:
- **Ngrok**: Expose via `ngrok http 3002` (API) or `ngrok http 5173` (Frontend)
- **Local network**: Use local IP (e.g., `http://192.168.1.100:5173`)
- Update CORS_ORIGIN in backend `.env` to allow access

## Architecture

### CQRS Pattern
The backend implements the CQRS (Command Query Responsibility Segregation) pattern:

**Commands** (write operations):
- `AddBillCommand`: Create new bill
- `EditBillCommand`: Update existing bill
- `DeleteBillCommand`: Remove bill
- `AddDebtCommand`, `EditDebtCommand`, `RemoveDebtCommand`: Debt operations

**Queries** (read operations):
- `BillQuery`: Query bills with filters
- `QueryStatisticQuery`: Get debt statistics

All commands and queries use separate handlers and DTOs for clear separation of concerns.

### Frontend Components
- **Dashboard**: Displays bills in a table with edit/delete options
- **AddBill**: Form to create new bills with creditor, debtors, amount, and type
- **Statistic**: Visual matrix showing net balances between users
- **Filter**: Advanced filtering by creditor, debtors, amount, and time
- **ThemeSwitcher**: Light/dark mode toggle
- **Options/EditDialog**: Dialogs for viewing and editing bill details

## Design Preview

[Figma Design](https://www.figma.com/proto/CZLhPcdSvnKStu2X47k1zo/S%E1%BB%95-th%C6%A1-n%E1%BB%A5-On-Steroid?node-id=0-1&t=VF72d0eYnOOcsK1U-1)

## License

Private project
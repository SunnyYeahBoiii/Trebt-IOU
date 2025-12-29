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
- **Framework**: NestJS 11 with CQRS pattern
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API Documentation**: Swagger (OpenAPI)
- **Package Manager**: pnpm

### Frontend (web/)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Deployment**: Vercel

## Database Schema

![TrebtIOU Database Schema](./images/TrebtIOU.drawio.svg)

### Models
- **User**: User information (name)
- **Bill**: Expense records with creditor, debtors, type (SPLITTING/EACHONE)
- **Debt**: Individual debt relationships
- **Statistic**: Aggregated debt statistics between users

### Bill Types
- **SPLITTING**: Total amount divided among all debtors
- **EACHONE**: Each debtor owes the full amount

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

## API Documentation

Swagger UI is available at: `http://localhost:3002/v1/docs`

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/seed` | Seed initial data |
| POST | `/bills/add` | Add new bill |
| POST | `/bills/edit` | Edit existing bill |
| POST | `/bills/remove` | Remove bill |
| GET | `/bills/query` | Query bills with filters |
| GET | `/statistic` | Get debt statistics matrix |

### Query Parameters (for `/bills/query`)
- `creditorId`: Filter by creditor ID
- `lowerAmount`: Minimum total amount
- `upperAmount`: Maximum total amount
- `timeDesc`: Sort by creation time descending

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
pnpm run lint         # Lint code
pnpm run format       # Format code with Prettier
```

### Frontend Commands
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Lint code
```

## Deployment

### Backend
Deploy to any Node.js hosting platform (Heroku, Render, Railway, etc.) with:
- PostgreSQL database connection
- Environment variables configured
- `pnpm run build` output in `dist/`

### Frontend
Configured for Vercel deployment. The `vercel.json` includes:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing rewrite rule

Deploy to Vercel:
1. Push code to Git repository
2. Connect repository to Vercel
3. Vercel auto-detects and deploys

### Local Sharing
For sharing with roommates locally:
- **Ngrok**: Expose via `ngrok http 3002` or `ngrok http 5173`
- **Local network**: Use local IP (e.g., `http://192.168.1.100:5173`)

## Design Preview

[Figma Design](https://www.figma.com/proto/CZLhPcdSvnKStu2X47k1zo/S%E1%BB%95-th%C6%A1-n%E1%BB%A5-On-Steroid?node-id=0-1&t=VF72d0eYnOOcsK1U-1)

## License

Private project
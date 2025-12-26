# Trebt IOU - Debt and Exspense Tracker

## Overview: 
- PetalsIOU is a lightweight web app designed to simplify personal and shared expense tracking for roommates, automating debt calculations and transaction logging to save time on manual math.

- Problem It Solves:
You and your roommates struggled with tracking income, expenses, and who owes whom, leading to confusion and wasted time on spreadsheets or notes.
PetalsIOU automates this by logging transactions, categorizing debts (IOUs), and generating instant summaries like total owed, pending receivables, and monthly spending breakdowns.

- Key Features:
  - Quick Entry: Add income, expenses, or IOUs with debtor names, amounts, dates, and notes in seconds.

  - Dashboard Overview: See real-time totals—e.g., "Roommates owe you 500,000đ", "This month's expenses: 2,300,000đ"—with filters by person or period.

  - Auto-Calculations: Computes balances, generates shareable reports (e.g., "You owe Phương 200k from groceries"), and alerts for overdue debts.

- Why It Works for You
Built for everyday Vietnamese students, stores data locally or via simple backend. Saves hours weekly, turning chaotic roommate finances into a clear "sổ thu nợ" everyone can trust.


## Planning Phase:

Overall, this app should be basic and lightweight, mainly because its idea is a time-saver app. 

### Techies:

Since this is a financial app, I should be using postgreSQL for transactions, could be postgreSQL in Prisma I think. Besides, I would like to use NestJS for the Backend and React for Frontend.

In total, tech that I should be using is:
- ReactJS (Frontend)
- NestJS (Backend)
- PostgreSQL(Database)

### Design:

Currently working on the design of the web using Figma, the progess can be viewed in the link below.

[Preview on the current progress.](https://www.figma.com/proto/CZLhPcdSvnKStu2X47k1zo/S%E1%BB%95-th%C6%A1-n%E1%BB%A5-On-Steroid?node-id=0-1&t=VF72d0eYnOOcsK1U-1)

## Development Phase

### Database:

![An Overview of TrebtIOU Database](./images/TrebtIOU.drawio.svg)

There exists a Statistic Table to persist the data for the Statistics feature, using datas from the Debt Table.

### Feature:
- Add/Remove/Edit Bills which manipulates data in the statistic table.

## Testing Phase

Currently on Development Phase

## Deployment:
Target: Local development and roommate sharing only—no public hosting needed.

Local Setup:
- Run on localhost:3000 (React) + localhost:3001 (NestJS) for personal use.
- Use npm run dev scripts for hot reload during development.

Sharing with Roommates:
- Ngrok: Expose local server via ngrok http 3000 → get public URL like https://abc123.ngrok.io to share instantly.
- Alternative: Local network IP (e.g., 192.168.1.100:3000)
- Data persistence: PostgreSQL Docker container (docker run -p 5432:5432 postgres) for consistent local DB across sessions.
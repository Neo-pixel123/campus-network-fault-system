# Campus Network Fault Reporting System (NetFault)

DBMS mini project — Next.js 15 + MySQL 8 + Redis 7.

## Setup
1. Start MySQL and Redis locally.
2. Create the database, sample data, routines and triggers:
   ```bash
   npm run db:setup
   ```
3. Create a MySQL user for the app and copy `.env.example` to `.env.local`, filling in the credentials.
4. Install and run:
   ```bash
   npm install
   npm run dev        # http://localhost:3000
   ```

## Folders
- `app/` — pages (App Router) and API route handlers
- `lib/` — MySQL pool (`db.js`), Redis client and helpers (`redis.js`), data-access queries (`data.js`)
- `components/` — shared UI components
- `db/` — SQL scripts (DDL, DML, routines/triggers, queries) and Redis command script

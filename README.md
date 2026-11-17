# Campus Network Fault Reporting System (NetFault)

DBMS mini project — Next.js 15 + MySQL 8 + Redis 7.

## Setup
1. Start MySQL and Redis locally.
2. Create the database, sample data, routines, triggers and login accounts:
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

## Login
One login page for everyone; the account's `role` decides what it can do.

Demo accounts (one admin, plus the sample users) are created by `db/06_auth.sql`. Change their passwords before using this anywhere real.

New users can sign up at `/register` (Student, Faculty or Staff; admin accounts cannot self-register).

Admins can assign and resolve faults and see Technicians. Users can report faults (as themselves) and view reports, devices and the dashboard.
Sessions are stored in Redis (`session:<token>`, 8-hour TTL); passwords are stored as SHA-256 hashes in `SYSTEM_USER.password_hash`.

## Documents
- [Project report (PDF)](docs/DBMS_Mini_Project_Report.pdf)
- [ER diagram](docs/ER_Diagram.png)

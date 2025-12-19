# E-Voting Backend Server

Backend API for the blockchain-based e-voting system, built with Express.js and PostgreSQL.

## Setup

### 1. Configure Environment Variables

Copy `.env.example` to `.env` and update with your PostgreSQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/evoting
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evoting
DB_USER=postgres
DB_PASSWORD=yourpassword
PORT=3001
```

### 2. Create Database and Run Migration

```bash
# Connect to PostgreSQL (adjust for your Docker setup)
docker exec -it <container-name> psql -U postgres

# Create database
CREATE DATABASE evoting;
\q

# Run schema migration
docker exec -i <container-name> psql -U postgres -d evoting < schema.sql
```

Or if PostgreSQL is local:

```bash
createdb evoting
psql -U postgres -d evoting -f schema.sql
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Elections

- `GET /api/election-settings` - Get election settings
- `POST /api/election-settings` - Update election settings (admin)
- `POST /api/election-status` - Update election status (admin)
- `GET /api/elections/active` - Get active election

### Voters

- `POST /api/register-voter` - Register new voter
- `GET /api/voters` - List all voters (admin)
- `GET /api/voter/:walletAddress` - Check voter registration
- `POST /api/mark-voted` - Mark voter as voted

### Categories

- `GET /api/categories` - Get categories for election
- `PUT /api/categories/:id` - Update category (admin)

### Candidates

- `GET /api/candidates` - Get candidates for election
- `POST /api/candidates` - Add candidate (admin)
- `PUT /api/candidates/:id` - Update candidate (admin)
- `DELETE /api/candidates/:id` - Delete candidate (admin)

### Statistics

- `GET /api/statistics` - Get dashboard statistics
- `GET /api/activities` - Get recent activities

## Temporary Authentication

For now, authentication uses a simple header-based system:

- Add `x-user-id: <user-id>` header to authenticated requests
- Admin routes check the `admins` table

**Note**: Session-based authentication will be implemented in Phase 2.

## Database Schema

The database includes the following tables:

- `voters` - Registered voters
- `elections` - Election configurations
- `categories` - Voting categories/positions
- `candidates` - Election candidates
- `votes` - Vote records (with blockchain verification)
- `admins` - System administrators
- `audit_logs` - Activity logs
- `system_settings` - Global configuration

## Development

```bash
# Dev mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

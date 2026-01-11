# E-sport Tournament Manager API

REST API for managing e-sport tournaments, teams and registrations.

## About

This application allows you to:
- Create and manage e-sport tournaments (SOLO or TEAM format)
- Manage teams with a captain system
- Register individual players or entire teams to tournaments
- Control access with JWT authentication and RBAC (Role-Based Access Control)
- Manage tournament lifecycle (DRAFT → OPEN → ONGOING → COMPLETED)
- Track participant registrations with status management

## Getting Started

### Prerequisites

- Node.js >= 24.0.0
- npm >= 11.0.0
- SQLite 3 (included with Prisma)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd PROJET_Tournois_Esport_Elouan

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Initialize the database and apply migrations
npx prisma migrate dev

# Seed database with sample data
node prisma/seed.js

# Start the server
npm run dev
```

The server starts on **http://localhost:3000**

API documentation available at **http://localhost:3000/api-docs** (Swagger UI)

## Configuration

### Environment Variables (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `DATABASE_URL` | SQLite database path | `file:./prisma/dev.db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | (required) |
| `JWT_EXPIRES_IN` | Token expiration time | 24h |

### Example .env
```
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-super-secret-key-min-32-characters-long"
JWT_EXPIRES_IN=24h
```

### Database

The project uses **Prisma 7** with **SQLite**:

```bash
# Create or update database schema
npx prisma migrate dev

# View and edit data visually
npx prisma studio

# Check migration status
npx prisma migrate status
```

## Features

### A. Authentication & Authorization (3 pts)

**Public endpoints:**
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Login and receive JWT token

**Protected endpoints:**
- `GET /api/auth/profile` - Get authenticated user profile

**Validations:**
- Email: valid format and unique in database
- Username: 3-20 alphanumeric characters + underscore, must be unique
- Password: minimum 8 characters with uppercase, lowercase, and digit
- Role: defaults to `PLAYER` (PLAYER | ORGANIZER | ADMIN)

**Password Security:**
- Hashed with bcrypt (SALT_ROUNDS=10)
- Never stored in plain text

### B. Tournament Management (4 pts)

**CRUD Operations:**
```
GET    /api/tournaments              List all tournaments (with filtering, sorting, pagination)
GET    /api/tournaments/:id          Get tournament details
POST   /api/tournaments              Create tournament (ORGANIZER/ADMIN only)
PUT    /api/tournaments/:id          Update tournament (ORGANIZER/ADMIN only)
DELETE /api/tournaments/:id          Delete tournament (ORGANIZER/ADMIN only)
```

**Status Management:**
```
PATCH  /api/tournaments/:id/status   Update tournament status
```

**Status Transitions:**
| From | To | Requirement |
|------|-----|-----------|
| DRAFT | OPEN | startDate must be in future |
| OPEN | ONGOING | Minimum 2 CONFIRMED registrations |
| ONGOING | COMPLETED | ADMIN only |
| Any status | CANCELLED | Creator or ADMIN only |

**Tournament Properties:**
- `format`: SOLO (individual registration) or TEAM (team registration)
- `maxParticipants`: Capacity limit
- `status`: Current state (DRAFT, OPEN, ONGOING, COMPLETED, CANCELLED)

### C. Team Management (2 pts)

**Routes:**
```
GET    /api/teams                    List all teams
GET    /api/teams/:id                Get team details with captain and members
POST   /api/teams                    Create team (authenticated user becomes captain)
PUT    /api/teams/:id                Update team (captain only)
DELETE /api/teams/:id                Delete team (captain only, only if no active registrations)
```

**Team Properties:**
- Name: 3-50 characters, unique
- Tag: 3-5 characters (uppercase + digits), unique
- Captain: Single user who owns/manages the team
- Members: Participants registered under this team

### D. Tournament Registrations (4 pts)

**Routes:**
```
POST   /api/registrations                    Register player/team to tournament
GET    /api/registrations                    List all registrations
GET    /api/registrations/:id                Get registration details
PATCH  /api/registrations/:id                Update registration status (admin only)
DELETE /api/registrations/:id                Cancel registration (PENDING only, creator can delete own)
```

**Registration Properties:**
- `status`: PENDING, CONFIRMED, REJECTED, or WITHDRAWN
- `playerId`: User ID (for SOLO format tournaments)
- `teamId`: Team ID (for TEAM format tournaments)
- Format validation: registrations must match tournament format

**Registration Rules:**
- Cannot exceed tournament `maxParticipants`
- Cannot duplicate (same player/team cannot register twice for same tournament)
- Only team captains can register a team
- SOLO tournament can only accept player registrations
- TEAM tournament can only accept team registrations

### E. User Management (Bonus)

**Admin-only routes:**
```
GET    /api/users                    List all users
GET    /api/users/:id                Get user details
DELETE /api/users/:id                Delete user account
```

## API Documentation

### Interactive Documentation

**Swagger UI**: http://localhost:3000/api-docs

- Browse all endpoints with request/response examples
- Test endpoints directly with the "Try it out" button
- View detailed parameter descriptions and validation rules

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Masters 2026",
    "format": "TEAM"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Tournament not found"
}
```

## Project Structure

```
PROJET_Tournois_Esport_Elouan/
├── src/
│   ├── app.js                          Express application setup
│   ├── server.js                       Server entry point
│   ├── config/
│   │   ├── env.js                      Environment variables validation (Zod)
│   │   ├── prisma.js                   Prisma client singleton
│   │   └── swagger.js                  OpenAPI/Swagger configuration
│   ├── controllers/
│   │   ├── authController.js           Authentication handlers
│   │   ├── tournamentController.js     Tournament CRUD handlers
│   │   ├── teamController.js           Team CRUD handlers
│   │   ├── registrationController.js   Registration handlers
│   │   └── userController.js           User management handlers
│   ├── services/
│   │   ├── authService.js              Authentication business logic
│   │   ├── tournamentService.js        Tournament business logic
│   │   ├── teamService.js              Team business logic
│   │   ├── registrationService.js      Registration validation & logic
│   │   └── userService.js              User management logic
│   ├── routes/
│   │   ├── index.js                    API routes aggregator
│   │   ├── authRoutes.js               Authentication endpoints
│   │   ├── tournamentRoutes.js         Tournament endpoints
│   │   ├── teamRoutes.js               Team endpoints
│   │   ├── registrationRoutes.js       Registration endpoints
│   │   └── userRoutes.js               User management endpoints
│   ├── schemas/
│   │   ├── authSchema.js               Auth validation schemas (Zod)
│   │   ├── tournamentSchema.js         Tournament validation schemas
│   │   ├── teamSchema.js               Team validation schemas
│   │   └── registrationSchema.js       Registration validation schemas
│   ├── middlewares/
│   │   ├── logger.js                   HTTP request logging
│   │   ├── authenticate.js             JWT token verification
│   │   ├── authorize.js                Role-based access control
│   │   ├── errorHandler.js             Centralized error handling
│   │   ├── notFound.js                 404 handler
│   │   └── validate.js                 Zod schema validation middleware
│   ├── utils/
│   │   ├── asyncHandler.js             Async error wrapper
│   │   ├── cryptoHelper.js             Password hashing with bcrypt
│   │   ├── responseHelper.js           Standardized API responses
│   │   └── iconHelper.js               Icon helper utilities
│   ├── public/
│   │   └── css/
│   │       ├── input.css               Tailwind CSS source
│   │       └── style.css               Generated CSS output
│   └── views/
│       ├── partials/                   Reusable EJS components
│       │   ├── head.ejs
│       │   ├── header.ejs
│       │   ├── footer.ejs
│       │   └── deleteModal.ejs
│       └── pages/
│           ├── home.ejs                Home page
│           ├── error.ejs               Error page
│           ├── auth/
│           │   ├── login.ejs
│           │   └── register.ejs
│           └── admin/
│               └── users.ejs           User management (admin only)
├── prisma/
│   ├── schema.prisma                   Database schema definition
│   ├── seed.js                         Database initialization with test data
│   ├── migrations/                     Database migration history
│   │   ├── migration_lock.toml
│   │   ├── 20251124095713_init/
│   │   ├── 20251126132331_add_auth_fields/
│   │   ├── 20251127210256_add_bookings/
│   │   └── 20260105144224_init/
├── .env.example                        Environment variables template
├── .gitignore                          Git ignore rules
├── eslint.config.js                    ESLint configuration
├── package.json                        Dependencies and scripts
├── package-lock.json                   Locked dependency versions
├── prisma.config.ts                    Prisma configuration
└── README.md                           This file
```

## Security

- **Password Security**: Passwords hashed with bcrypt (SALT_ROUNDS=10)
- **Authentication**: JWT tokens with 24-hour expiration
- **Authorization**: Role-Based Access Control (RBAC) with roles: PLAYER, ORGANIZER, ADMIN
- **Validation**: Input validation with Zod schemas (French error messages)
- **Error Handling**: Centralized error handler prevents information leakage
- **Environment Secrets**: Sensitive data stored in .env file (not committed to git)

## Available Commands

```bash
# Development & Testing
npm run dev              Start development server with hot reload
npm run lint             Check code for errors (ESLint)
npm run lint:fix         Automatically fix linting errors
npm run format           Format code (Prettier)

# Production
npm run start            Start production server

# Database Management
npx prisma studio       Open Prisma Studio GUI for data visualization
npx prisma migrate dev  Create and apply database migrations
npx prisma migrate status  Check migration status
node prisma/seed.js     Seed database with sample data
```

## Example Usage

### 1. Register a New Player

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "username": "pro_gamer",
    "password": "SecurePass123",
    "role": "PLAYER"
  }'
```

### 2. Login and Get JWT Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "password": "SecurePass123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "player@example.com",
      "username": "pro_gamer",
      "role": "PLAYER"
    }
  }
}
```

### 3. Create a Tournament (ORGANIZER only)

```bash
curl -X POST http://localhost:3000/api/tournaments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "CS2 Masters 2026",
    "game": "Counter-Strike 2",
    "format": "TEAM",
    "maxParticipants": 16,
    "prizePool": 5000,
    "startDate": "2026-02-01T18:00:00Z",
    "endDate": "2026-02-02T22:00:00Z"
  }'
```

### 4. Create a Team

```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Pro Esports Club",
    "tag": "PROES"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Pro Esports Club",
    "tag": "PROES",
    "captainId": 1,
    "createdAt": "2026-01-11T10:30:00Z"
  }
}
```

### 5. Register Team for Tournament

```bash
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tournamentId": 1,
    "teamId": 1
  }'
```

### 6. Register Player for SOLO Tournament

```bash
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tournamentId": 2,
    "playerId": 3
  }'
```

## Database Schema

### User Model
```prisma
model User {
  id               Int      @id @default(autoincrement())
  email            String   @unique
  username         String   @unique
  password         String   // bcrypt hashed
  role             Role     @default(PLAYER)
  teamId           Int?     // Foreign key (team member)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

### Tournament Model
```prisma
model Tournament {
  id               Int      @id @default(autoincrement())
  name             String
  game             String
  format           Format   // SOLO or TEAM
  maxParticipants  Int
  prizePool        Float    @default(0)
  startDate        DateTime
  endDate          DateTime?
  status           Status   @default(DRAFT)
  organizerId      Int      // Foreign key to User
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  registrations    Registration[]
}
```

### Team Model
```prisma
model Team {
  id               Int      @id @default(autoincrement())
  name             String   @unique
  tag              String   @unique
  captainId        Int      @unique // Team captain (User)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  registrations    Registration[]
}
```

### Registration Model
```prisma
model Registration {
  id               Int      @id @default(autoincrement())
  status           RegStatus @default(PENDING)
  tournamentId     Int      // Foreign key to Tournament
  playerId         Int?     // Foreign key to User (for SOLO)
  teamId           Int?     // Foreign key to Team (for TEAM)
  registeredAt     DateTime @default(now())
  confirmedAt      DateTime?
}
```

## Testing

Manual testing is available through Swagger UI at:
- **http://localhost:3000/api-docs**

Use the "Try it out" button to test all endpoints with:
- Real request/response examples
- Parameter validation
- Authorization headers
- Response status codes

## License

MIT

## Notes

This is an academic project for the Node.js Master course at Hesias.

Built with:
- **Express 5.0.1** - Web framework
- **Prisma 7.2.0** - Database ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Zod** - Schema validation
- **Bcrypt** - Password hashing
- **EJS** - Server-side templating
- **Tailwind CSS** - Styling
- **Swagger/OpenAPI** - API documentation

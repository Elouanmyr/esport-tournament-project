# E-sport Tournament Manager API

REST API for managing e-sport tournaments, teams and registrations.

## About

This application allows you to:
- Create and manage e-sport tournaments (SOLO or TEAM format)
- Manage teams with a captain
- Register players or teams to tournaments
- Control access with JWT authentication and RBAC (Role-Based Access Control)
- Manage tournament status transitions

## Getting Started

### Prerequisites

- Node.js >= 24.0.0
- npm >= 11.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd PROJET_Tournois_Esport_Elouan

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Initialize the database
npx prisma migrate dev

# Start the server
npm run dev
```

The server starts on http://localhost:3000

## Configuration

### Environment Variables (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| DATABASE_URL | SQLite database path | file:./prisma/dev.db |
| JWT_SECRET | JWT secret key (min 32 chars) | your-super-secret-key-here |
| JWT_EXPIRES_IN | Token expiration | 24h |

### Database

The project uses Prisma 7 with SQLite:

```bash
# Apply migrations
npx prisma migrate dev

# View data in Prisma Studio
npx prisma studio
```

## Features

### A. Authentication and Authorization (3 pts)

Public routes:
- POST /api/auth/register - Create a user account
- POST /api/auth/login - Login and get JWT token

Protected routes:
- GET /api/auth/profile - Get user profile

Validations:
- Email: valid format and unique
- Username: 3-20 characters (alphanumeric + underscore), unique
- Password: 8+ characters with uppercase, lowercase, digit
- Role: defaults to PLAYER

### B. Tournament Management (4 pts)

CRUD routes:
```
GET    /api/tournaments                    List all (with filters and pagination)
GET    /api/tournaments/:id                Get details
POST   /api/tournaments                    Create (ORGANIZER/ADMIN)
PUT    /api/tournaments/:id                Update (ORGANIZER/ADMIN)
DELETE /api/tournaments/:id                Delete (ORGANIZER/ADMIN)
```

Status management:
```
PATCH /api/tournaments/:id/status          Change status
```

Allowed transitions:
- DRAFT to OPEN: startDate > now
- OPEN to ONGOING: 2+ CONFIRMED participants
- ONGOING to COMPLETED: ADMIN only
- Any to CANCELLED: Creator or ADMIN

### C. Team Management (2 pts)

Routes:
```
GET    /api/teams                          List all teams
GET    /api/teams/:id                      Get team with captain
POST   /api/teams                          Create (authenticated user = captain)
PUT    /api/teams/:id                      Update (captain only)
DELETE /api/teams/:id                      Delete (captain only)
```

### D. Tournament Registrations (4 pts)

Routes:
```
POST   /api/tournaments/:tournamentId/register              Register (SOLO or TEAM)
GET    /api/tournaments/:tournamentId/registrations        List registrations
PATCH  /api/tournaments/:tournamentId/registrations/:id    Update status
DELETE /api/tournaments/:tournamentId/registrations/:id    Cancel (PENDING only)
```

## API Documentation

### Swagger UI

Interactive documentation: http://localhost:3000/api-docs

Test all endpoints directly with "Try it out" button.

## Architecture

MVC pattern:
- Routes -> Controllers -> Services -> Prisma

Project structure:
```
src/
├── app.js                          Express configuration
├── server.js                       Entry point
├── config/                         Configuration files
├── controllers/                    HTTP request handlers
├── services/                       Business logic
├── routes/                         API endpoints
├── schemas/                        Zod validation schemas
├── middlewares/                    Express middleware
└── utils/                          Reusable helpers

prisma/
├── schema.prisma                   Database schema
├── seed.js                         Sample data
└── migrations/                     Migration history
```

## Security

- Passwords hashed with bcrypt
- JWT authentication with 24h expiration
- Role-Based Access Control (RBAC)
- Input validation with Zod
- Centralized error handling
- Secrets stored in .env (not committed)

## Useful Commands

```bash
# Development
npm run dev              Start with hot reload

# Production
npm run start            Start the server

# Database
npx prisma studio       Open Prisma interface
npx prisma migrate dev  Create migration

# Code quality
npm run lint             Check errors
npm run lint:fix         Auto-fix errors
npm run format           Format code
```

## Example Usage

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "username": "player123",
    "password": "Password123",
    "role": "PLAYER"
  }'
```

### Create Tournament

```bash
curl -X POST http://localhost:3000/api/tournaments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "CS2 Championship",
    "game": "Counter-Strike 2",
    "format": "TEAM",
    "maxParticipants": 16,
    "prizePool": 5000,
    "startDate": "2026-01-20T18:00:00Z"
  }'
```

### Register for Tournament

```bash
curl -X POST http://localhost:3000/api/tournaments/1/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "playerId": 1
  }'
```

## API Response Format

Success:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Error:
```json
{
  "success": false,
  "error": "Error description",
  "status": 400
}
```

## Testing

Manual testing through Swagger UI at http://localhost:3000/api-docs

## License

MIT

## Notes

This is an academic project for the Node.js Master course at Hesias.

All API responses follow a standardized format:

```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication with **bcrypt** for password hashing.

### Authentication Flow

1. **Register**: `POST /api/auth/register` - Create account
2. **Login**: `POST /api/auth/login` - Get JWT token
3. **Use token**: Include in header `Authorization: Bearer <token>`

### Protected Routes

| Access Level | Routes |
|--------------|--------|
| Public | GET routes (read-only) |
| Authenticated | POST, PUT, DELETE on games and stations |
| Admin only | User management (`/api/users/*`) |

### Web Session

For EJS views, sessions are used to maintain authentication state. Login/register forms are available at `/login` and `/register`.

### Roles

- **user**: Default role, can manage own bookings
- **admin**: Full access including user management

## Web Pages (EJS)

| Route | Description |
|-------|-------------|
| / | Home page with stats |
| /login | Login form |
| /register | Registration form |
| /admin/users | User management (admin only) |
| /games | Games list with CRUD actions |
| /games/new | Create new game form |
| /games/:id | Game details |
| /games/:id/edit | Edit game form |
| /stations | Stations list with CRUD actions |
| /stations/new | Create new station form |
| /stations/:id | Station details |
| /stations/:id/edit | Edit station form |
| /bookings | Bookings list |
| /bookings/new | Create new booking form |
| /bookings/:id/edit | Edit booking form |

## API Routes

### Documentation
- **Swagger UI**: `http://localhost:3000/api-docs`

### Games
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/games | List games (filters: genre, limit, offset) |
| GET | /api/games/:id | Get game by ID |
| POST | /api/games | Create game |
| PUT | /api/games/:id | Update game |
| DELETE | /api/games/:id | Delete game |

### Stations
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/stations | List stations (filters: status, limit, offset) |
| GET | /api/stations/:id | Get station by ID |
| POST | /api/stations | Create station (auth required) |
| PUT | /api/stations/:id | Update station (auth required) |
| DELETE | /api/stations/:id | Delete station (auth required) |

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create new account |
| POST | /api/auth/login | Login and get JWT token |
| GET | /api/auth/me | Get current user (auth required) |

### Bookings
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/bookings | List bookings (filters: userId, stationId, status) |
| GET | /api/bookings/:id | Get booking by ID |
| POST | /api/bookings | Create booking (auth required) |
| PUT | /api/bookings/:id | Update booking (auth required) |
| DELETE | /api/bookings/:id | Delete booking (auth required) |

### Users (Admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/users | List all users |
| GET | /api/users/:id | Get user by ID |
| DELETE | /api/users/:id | Delete user |

## Project Structure

```
src/
├── config/
│   ├── env.js              Environment validation (Zod)
│   ├── prisma.js           Prisma client instance
│   └── swagger.js          OpenAPI configuration
├── controllers/
│   ├── authController.js
│   ├── tournamentController.js
│   ├── teamController.js
│   ├── registrationController.js
│   └── userController.js
├── middlewares/
│   ├── authenticate.js     JWT token verification
│   ├── authorize.js        Role-based access control
│   ├── logger.js           Request logging
│   ├── errorHandler.js     Centralized error handling
│   ├── notFound.js         404 handler
│   └── validate.js         Zod validation middleware
├── routes/
│   ├── index.js            API routes aggregator
│   ├── authRoutes.js       Auth API routes
│   ├── tournamentRoutes.js Tournament API routes
│   ├── teamRoutes.js       Teams API routes
│   ├── registrationRoutes.js Registrations API routes
│   └── userRoutes.js       Users API routes
├── schemas/
│   ├── authSchema.js       Zod schema for auth
│   ├── tournamentSchema.js Zod schema for tournaments
│   ├── teamSchema.js       Zod schema for teams
│   └── registrationSchema.js Zod schema for registrations
├── services/
│   ├── authService.js      Authentication logic
│   ├── tournamentService.js Tournament business logic
│   ├── teamService.js      Team business logic
│   ├── registrationService.js Registration business logic
│   └── userService.js      User business logic
├── utils/
│   ├── asyncHandler.js     Async error wrapper
│   ├── responseHelper.js   Standardized API responses
│   └── iconHelper.js       Lucide icons helper
├── public/
│   └── css/
│       ├── input.css       Tailwind source
│       └── style.css       Generated CSS
├── views/
│   ├── partials/           head, header, footer, deleteModal
│   └── pages/              home, error, auth/, admin/, tournaments/
├── app.js                  Express app configuration
└── server.js               Entry point (starts server)

prisma/
├── schema.prisma           Database schema
├── migrations/             Database migrations
└── seed.js                 Seed script

tests/
├── unit/                   Unit tests
├── integration/            Integration tests
└── setup.js                Test configuration

.env                        Environment variables (gitignored)
.env.example                Environment template
package.json                Dependencies and scripts
```

## Features

- **MVC Architecture** with clear separation of concerns
- **Prisma 7 ORM** with SQLite database
- **EJS templates** with server-side rendering
- **Tailwind CSS** for styling
- **Lucide icons** (lucide-static)
- Complete CRUD operations for Tournaments, Teams, and Registrations
- OpenAPI 3.0 documentation with Swagger UI
- **Zod validation** with French error messages
- **Custom middlewares** (logger, errorHandler, notFound, validate)
- **Standardized API responses** with success/error format
- **Environment configuration** with dotenv and Zod validation
- **JWT authentication** with bcrypt password hashing
- **Role-based access control** (PLAYER, ORGANIZER, ADMIN)
- Tournament status management (DRAFT, OPEN, ONGOING, COMPLETED, CANCELLED)
- Team management with captain verification
- Registration system with format validation (SOLO vs TEAM)
- Filters and pagination
- Colored logs (chalk)
- Async/await error handling with asyncHandler

## Middlewares

The application uses custom Express middlewares:

1. **logger** - Logs HTTP requests with method, URL, status code, and duration
2. **errorHandler** - Centralized error handling (JSON for API, HTML for views)
3. **notFound** - Handles 404 errors for undefined routes
4. **validate(schema)** - Factory middleware for Zod schema validation
5. **authenticate** - Verifies JWT token from Authorization header
6. **authorize(...roles)** - Restricts access to specific roles

### Middleware Order (Critical)

```javascript
app.use(logger)           // First: log all requests
app.use(express.json())   // Parse JSON bodies
app.use(express.static())
app.use('/api', apiRoutes) // API routes
app.use(notFound)         // After all routes
app.use(errorHandler)     // Last: catch all errors (4 params)
```

## Utils

### asyncHandler

Wraps async route handlers to automatically catch errors:

```javascript
export const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

### responseHelper

Standardizes API JSON responses:

```javascript
export const success = data => ({ success: true, data })
export const created = data => ({ success: true, data })
export const error = (message, status) => ({ success: false, error: message })
```

## Validation

Data validation is handled by **Zod** schemas with French error messages:

```javascript
// Example: tournamentSchema.js
import { z } from 'zod'

export const tournamentSchema = z.object({
  name: z.string().min(1),
  game: z.string().min(1),
  format: z.enum(['SOLO', 'TEAM']),
  maxParticipants: z.number().int().min(2),
  prizePool: z.number().min(0),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional()
})
```

## Database Models

### User
- `id`: Auto-increment primary key
- `email`: Unique email
- `username`: Unique username (3-20 chars)
- `password`: Hashed password (bcrypt)
- `role`: PLAYER | ORGANIZER | ADMIN
- `teamId`: Foreign key to Team (optional, member)
- `createdAt`, `updatedAt`: Timestamps
- Relations: `captainOf` (Team), `team` (TeamMembers), `organizedTournaments`, `registrations`

### Tournament
- `id`: Auto-increment primary key
- `name`: Tournament name
- `game`: Game title
- `format`: SOLO | TEAM
- `maxParticipants`: Max participants count
- `prizePool`: Prize pool amount
- `startDate`: Tournament start datetime
- `endDate`: Tournament end datetime (optional)
- `status`: DRAFT | OPEN | ONGOING | COMPLETED | CANCELLED
- `organizerId`: Foreign key to User
- `createdAt`, `updatedAt`: Timestamps
- Relations: `registrations` (one-to-many)

### Team
- `id`: Auto-increment primary key
- `name`: Team name (3-50 chars, unique)
- `tag`: Team tag (3-5 chars, uppercase+digits, unique)
- `captainId`: Foreign key to User (unique)
- `createdAt`, `updatedAt`: Timestamps
- Relations: `captain`, `members` (one-to-many), `registrations`

### Registration
- `id`: Auto-increment primary key
- `status`: PENDING | CONFIRMED | REJECTED | WITHDRAWN
- `tournamentId`: Foreign key to Tournament
- `playerId`: Foreign key to User (optional, for SOLO)
- `teamId`: Foreign key to Team (optional, for TEAM)
- `registeredAt`: Registration datetime
- `confirmedAt`: Confirmation datetime (optional)
- Relations: `tournament`, `player`, `team`

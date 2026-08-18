# Wedora

> **Every contribution remembered. Every moment preserved.**

A luxury wedding technology platform for contribution registration, MC acknowledgement, and collaborative memory collection.

## Architecture

```
wedora/
├── backend/          Express.js + Prisma + PostgreSQL + Socket.IO
│   ├── src/
│   │   ├── config/       Environment, DB, Cloudinary, Socket.IO
│   │   ├── controllers/  Request handlers
│   │   ├── middleware/    Auth, validation, error handling, rate limiting
│   │   ├── routes/       API route definitions
│   │   ├── services/     Business logic
│   │   ├── validators/   Zod schemas
│   │   └── utils/        Helpers, tokens, errors
│   └── prisma/           Database schema & migrations
├── frontend/         Next.js + Tailwind CSS v4
│   └── src/
│       ├── app/           Pages (App Router)
│       │   ├── (auth)/    Login, Register
│       │   ├── dashboard/ Organizer dashboard
│       │   ├── mc/         MC acknowledgement queue
│       │   └── w/          Guest experience (QR landing)
│       ├── components/    Reusable UI components
│       └── lib/           API client, Socket.IO, utilities
└── docs/             Documentation & assets
```

## Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | Next.js 16, Tailwind CSS v4, React 19 |
| Backend     | Express.js, Node.js             |
| Database    | PostgreSQL + Prisma ORM         |
| Real-time   | Socket.IO                      |
| Storage     | Cloudinary (S3-compatible)      |
| Validation  | Zod                            |
| Auth        | JWT (access + refresh tokens)  |

## Features

- **Wedding Management** — Create, customize, manage wedding events
- **QR Code System** — Unique QR codes for guest access, contributions, and memories
- **Guest Welcome Experience** — Beautiful mobile-first landing page after QR scan
- **Contribution Registration** — Guests declare gifts, monetary contributions, or messages
- **MC Acknowledgement Queue** — Real-time queue showing only guest names (privacy-first)
- **Camera Capture** — Photo and video capture through web browser (no app install)
- **Memory Gallery** — Editorial masonry gallery with full-screen viewer
- **Memory Moderation** — Approve, reject, remove, report content
- **Live Memory Wall** — Real-time display for reception venues
- **Role-Based Access** — Super Admin, Organizer, Couple, MC, Gift Staff, Guest
- **Luxury Design System** — Cormorant Garamond + Inter, warm neutral palette

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Cloudinary account (for media storage)

### Installation

```bash
# Install all dependencies
npm run install:all

# Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL, JWT secrets, Cloudinary credentials

# Run database migration
npm run db:migrate

# Seed database
npm run db:seed

# Start development servers
npm run dev
```

### Environment Variables

See `backend/.env.example` for all required variables:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — Token signing secrets
- `CLOUDINARY_*` — Cloudinary credentials for media storage
- `CLIENT_URL` — Frontend URL (for CORS)
- `PORT` — Backend port (default: 5000)

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register account
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh token
- `GET /api/auth/profile` — Get profile

### Weddings
- `GET /api/weddings` — List user's weddings
- `POST /api/weddings` — Create wedding
- `GET /api/weddings/:id` — Get wedding details
- `GET /api/weddings/public/:token` — Public wedding info (guest)
- `GET /api/weddings/:id/qr` — Generate QR codes
- `GET /api/weddings/:id/stats` — Wedding statistics

### Contributions
- `POST /api/guest/:eventToken/contribute` — Guest submits contribution
- `GET /api/weddings/:id/contributions` — List contributions
- `GET /api/weddings/:id/contributions/queue` — MC queue
- `POST /api/weddings/:id/contributions/queue/acknowledge` — Acknowledge next

### Memories
- `POST /api/guest/:eventToken/capture` — Guest uploads memory
- `GET /api/weddings/:id/memories` — List memories
- `GET /api/weddings/:id/memories/wall` — Live wall feed
- `POST /api/weddings/:id/memories/:memId/approve` — Approve
- `POST /api/weddings/:id/memories/:memId/reject` — Reject

### WebSocket Events
- `contribution:created` — New contribution submitted
- `contribution:acknowledged` — MC acknowledged a guest
- `queue:updated` — Queue state changed
- `memory:uploaded` — New memory uploaded
- `memory:approved` — Memory approved for wall

## User Roles

| Role          | Access                                      |
|---------------|---------------------------------------------|
| SUPER_ADMIN   | Full platform access                        |
| OWNER         | Full wedding management                     |
| COUPLE        | View all, moderate memories                 |
| MC            | Queue only (no gift details)                |
| GIFT_STAFF    | Register and verify contributions           |
| GUEST         | QR access, contribute, capture memories     |

## Development

```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Database studio
npm run db:studio

# Run migration
npm run db:migrate
```

## Production

```bash
npm run build
cd backend && npm start
```

## License

Private — All rights reserved.

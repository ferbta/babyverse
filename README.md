# BabyVerse - Child Management Application

A comprehensive web application for managing child health information from birth to school age.

## Features (MVP)

✅ **Authentication**
- Email/Password registration and login
- Google OAuth integration
- Session management with NextAuth.js

✅ **Multi-Child Management**
- Create and manage multiple child profiles
- Child switcher with avatars
- Soft delete functionality

✅ **Dashboard**
- Overview of child information
- Birth statistics display
- Quick action cards

🚧 **Coming Soon (Phase 2)**
- Vaccination schedule tracking (Vietnam MOH standard)
- Growth tracking with WHO charts
- Medical visit records
- Nutrition & feeding logs
- Milestone tracking
- Family sharing with roles
- Reminders & notifications

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Auth**: NextAuth.js (Email + Google OAuth)
- **File Storage**: Cloudinary (planned)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts (planned)

## Getting Started

### Prerequisites

- Node.js 20.9+
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials (optional)
- Cloudinary account (optional, for Phase 2)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd babyverse
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string and other credentials:
```env
DATABASE_URL="mongodb://localhost:27017/babyverse"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to MongoDB
npx prisma db push

# Seed Vietnam vaccination schedule
npm run prisma:seed
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
babyverse/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Vaccination schedule seed data
├── src/
│   ├── app/
│   │   ├── (auth)/        # Auth pages (login, register)
│   │   ├── (dashboard)/   # Protected app pages
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── ui/            # Shadcn UI components
│   │   └── children/      # Child-related components
│   ├── lib/
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── prisma.ts      # Prisma client
│   │   └── cloudinary.ts  # Cloudinary helpers
│   └── types/
│       └── index.ts       # Type definitions
├── .env                   # Environment variables
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:seed` - Seed database

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handler

### Children
- `GET /api/children` - List all children for current user
- `POST /api/children` - Create new child
- `GET /api/children/[id]` - Get child details
- `PATCH /api/children/[id]` - Update child
- `DELETE /api/children/[id]` - Soft delete child

## Database Schema

The application uses 14+ models:
- User (authentication)
- Child (profiles)
- MedicalVisit
- Vaccination & VaccinationSchedule
- GrowthRecord
- FeedingLog
- Allergy
- ActivityLog
- Milestone
- Media
- Reminder
- FamilyMember

See `prisma/schema.prisma` for complete schema.

## Contributing

This is a personal project. Contributions, issues, and feature requests are welcome!

## License

MIT

## Acknowledgments

- Vietnam Ministry of Health for vaccination schedule
- WHO growth standards
- Shadcn UI for beautiful components

---

Built with ❤️ for mothers and families in Vietnam

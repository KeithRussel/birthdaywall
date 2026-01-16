# Birthday Wall MVP

A private interactive birthday greeting web app where guests can submit notes, photos, or short videos through a private link.

## Features

- Create birthday walls with unique private links
- Submit text notes, photos, or videos
- View all greetings on a beautiful landing page
- Interactive modal view for each greeting
- Mobile-first responsive design
- No authentication required - access controlled via tokens

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Shadcn UI + Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Language**: TypeScript

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate dev
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Visit `/create` to create a new birthday wall
2. Share the generated link with friends and family
3. Guests can submit greetings at `/b/[token]/submit`
4. View all greetings at `/b/[token]`

## Project Structure

```
app/
├─ create/              # Create birthday wall page
├─ b/[token]/          # Birthday wall landing page
│   └─ submit/         # Submit greeting page
├─ api/greetings/      # API routes for greeting submission
components/
├─ ui/                 # Shadcn UI components
lib/
├─ prisma.ts          # Prisma client
├─ actions.ts         # Server actions
prisma/
├─ schema.prisma      # Database schema
```

## Environment Variables

- `DATABASE_URL`: SQLite database connection string
- `NEXT_PUBLIC_BASE_URL`: Base URL for generating shareable links

## Building for Production

```bash
npm run build
npm start
```

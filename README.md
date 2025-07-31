# Whop Next.js App Template

This is a template for building Whop apps with Next.js, TypeScript, Styled Components, and Drizzle ORM for local SQLite databases.

## Getting Started

1. **Install dependencies:**
```bash
bun install
```

2. **Start development:**
```bash
bun dev
```

The dev server is configured to run automatically - never restart it manually.

## Features

- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Styled Components** for styling
- **Drizzle ORM** with SQLite for local data storage
- **Whop SDK** integration (optional)
- **Hot reload** development with whop-proxy

## Project Structure

```
app/
├── page.tsx          # Main app - build here!
├── api/             # API routes
└── components/      # Reusable components

lib/
├── db/
│   ├── index.ts     # Database connection
│   └── schema.ts    # Define your tables here
└── whop-api.ts      # Whop API setup (optional)

data/                # SQLite databases (auto-created)
drizzle/             # Database migrations
```

## Database Management

This template uses **local SQLite databases only** - no external database connections.

**Available commands:**
- `bun db:generate` - Generate SQL migrations from schema changes
- `bun db:migrate` - Apply migrations to database
- `bun db:studio` - Open Drizzle Studio to view/edit data

**Define your schema in `lib/db/schema.ts`:**
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  // ... your columns
});
```

## Development Guidelines

See `CLAUDE.md` for comprehensive development guidelines including:
- UI/UX best practices
- Database patterns with Drizzle
- Whop integration examples
- Modern design principles

## Documentation

- Whop Developer Docs: https://dev.whop.com/introduction
- Drizzle ORM Docs: https://orm.drizzle.team
- Next.js Docs: https://nextjs.org/docs

# MAP // Mission Console

Foundation scaffold for a personal portfolio website built with Next.js App Router,
React TypeScript, Tailwind CSS, and Supabase.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment names and fill local values:

   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Verify the scaffold:

   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

## Notes

- Supabase client helpers are available in `src/lib/supabase/`, but CRUD, data
  fetching, admin UI, animations, and 3D are not implemented yet.
- The active database migration remains
  `supabase/migrations/20260602000200_portfolio_schema_v2.sql`.
- Public pages should default to Server Components. Use Client Components only for
  interactions, forms, Motion, and WebGL.
- See `supabase/README.md` for migration, type generation, and first admin user setup.

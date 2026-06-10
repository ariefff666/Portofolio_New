# MAP // Mission Console

Foundation scaffold for a personal portfolio website built with Next.js App Router,
React TypeScript, Tailwind CSS, and Supabase.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment names and fill local values when Supabase integration begins:

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

- Supabase clients, data fetching, admin authentication, animations, and 3D are not
  implemented in this foundation phase.
- The active database migration remains
  `supabase/migrations/20260602000200_portfolio_schema_v2.sql`.
- Public pages should default to Server Components. Use Client Components only for
  interactions, forms, Motion, and WebGL.

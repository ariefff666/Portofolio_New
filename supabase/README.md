# Supabase Setup

Use only the active migration:

```text
supabase/migrations/20260602000200_portfolio_schema_v2.sql
```

Do not run archived migrations from `docs/prompt-1/`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill values from the Supabase project Connect
dialog:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY` is server-only. Never add a `NEXT_PUBLIC_` prefix to it.

## Apply Migration

For a linked Supabase project:

```bash
npx supabase db push
```

For local Supabase development:

```bash
npx supabase start
npx supabase db reset
```

## Generate Database Types

After the migration has been applied, refresh `src/types/database.types.ts`:

```bash
npx supabase gen types typescript --project-id <project-ref> --schema public,private > src/types/database.types.ts
```

For local Supabase:

```bash
npx supabase gen types typescript --local --schema public,private > src/types/database.types.ts
```

The current type file is a schema snapshot derived from the active V2 migration because
Supabase CLI and a configured project are not available in this workspace yet.

## Create First Admin

1. Create one Supabase Auth user from Dashboard -> Authentication -> Users.
2. Copy the Auth user UUID.
3. Insert that UUID into `public.admin`:

   ```sql
   insert into public.admin (id, nama, peran)
   values ('<auth-user-uuid>', '<admin-name>', 'admin')
   on conflict (id)
   do update set
     nama = excluded.nama,
     peran = 'admin',
     updated_at = now();
   ```

4. Confirm the user can be selected from `public.admin`.

Admin route protection still needs to be implemented in the auth/admin phases. This
phase only adds the base Supabase clients and session-refresh proxy.

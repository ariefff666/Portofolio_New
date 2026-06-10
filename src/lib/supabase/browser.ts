"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { getSupabasePublicEnv } from "./public-env";

export function createClient() {
  const { supabasePublishableKey, supabaseUrl } = getSupabasePublicEnv();

  return createBrowserClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
  );
}

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://xctxbgstkwukxdjpnedd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjdHhiZ3N0a3d1a3hkanBuZWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzUyNTUsImV4cCI6MjA4NDAxMTI1NX0.LW2Vdlz7VxSFqF2_8XScAxT2JAqk6KM-phdNzdid7G8"
);

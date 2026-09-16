import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/adapters/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL("/auth/login", request.url))
}

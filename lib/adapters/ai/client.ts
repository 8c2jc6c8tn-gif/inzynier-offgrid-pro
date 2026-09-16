import "server-only"

/**
 * Klient Anthropic — wyłącznie server-side (`import "server-only"`, ten sam wzorzec co
 * `lib/adapters/supabase/admin.ts`). Sekret nigdy nie trafia do bundla klienckiego
 * (docs/standards/07-bezpieczenstwo.md, 7.1/6.3). Konstruktor bez argumentów czyta
 * `ANTHROPIC_API_KEY` z env automatycznie (oficjalny SDK) — nie duplikujemy tego odczytu tutaj.
 */
import Anthropic from "@anthropic-ai/sdk"

export function createAnthropicClient(): Anthropic {
  return new Anthropic()
}

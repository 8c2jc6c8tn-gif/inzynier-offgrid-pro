/**
 * docs/standards/09-ai-w-produkcie.md, 9.0/9.6 — AI jest dodatkową, wyłącznie-online warstwą
 * nad rdzeniem, nigdy jego wymogiem. `isAiConfigured()` to jedyne miejsce decydujące, czy klucz
 * API istnieje — cała reszta kodu pyta to, nigdy nie sprawdza `process.env` bezpośrednio (ten sam
 * wzorzec co `isSupabaseConfigured()`).
 */
export function isAiConfigured(): boolean {
  const key = process.env.ANTHROPIC_API_KEY
  return Boolean(key && key.length > 0 && !key.includes("twoj-klucz"))
}

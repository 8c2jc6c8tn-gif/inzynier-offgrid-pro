/**
 * Odczyt aktualnego języka w Server Components — tylko stąd wolno importować `next/headers`
 * w warstwie i18n (Client Components nie mogą go bundlować). Używane w `app/layout.tsx`
 * (przekazuje wartość początkową do `LanguageProvider`) i w Server Components renderujących
 * tekst bezpośrednio (np. `app/kalkulatory/prognozy/page.tsx`, które nie jest Client Component).
 */
import { cookies } from "next/headers"
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage, type Language } from "./language"

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(LANGUAGE_COOKIE)?.value
  return isLanguage(raw) ? raw : DEFAULT_LANGUAGE
}

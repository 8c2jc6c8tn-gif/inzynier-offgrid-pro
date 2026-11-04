// Tests call `t("en" | "ru", …)` synchronously: register every dictionary up front (the app loads English and Russian
// lazily — lib/i18n/rejestr-slownikow.ts; the lazy path has its own tests).
import { dictionaries } from "./lib/i18n/dictionaries"
import { zarejestrujSlownik } from "./lib/i18n/rejestr-slownikow"
import { SUPPORTED_LANGUAGES } from "./lib/i18n/language"

for (const jezyk of SUPPORTED_LANGUAGES) zarejestrujSlownik(jezyk, dictionaries[jezyk])

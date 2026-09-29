import { dictionaryPl } from "./dictionary-pl"
import { dictionaryEn } from "./dictionary-en"
import { dictionaryRu } from "./dictionary-ru"
import { uiEn, uiPl, uiRu } from "./ui"
import type { Language } from "./language"

export const dictionaries: Record<Language, Record<string, string>> = {
  pl: { ...dictionaryPl, ...uiPl },
  en: { ...dictionaryEn, ...uiEn },
  ru: { ...dictionaryRu, ...uiRu },
}

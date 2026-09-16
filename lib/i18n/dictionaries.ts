import { dictionaryPl } from "./dictionary-pl"
import { dictionaryEn } from "./dictionary-en"
import { dictionaryRu } from "./dictionary-ru"
import type { Language } from "./language"

export const dictionaries: Record<Language, Record<string, string>> = {
  pl: dictionaryPl,
  en: dictionaryEn,
  ru: dictionaryRu,
}

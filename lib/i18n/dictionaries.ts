/**
 * All three dictionaries at once, for tests and scripts. App code must not import this file: it would pull English
 * and Russian back into the common bundle (a test guards it). The app reads dictionaries through `rejestr-slownikow.ts`.
 */
import { slownikPl } from "./slownik-pl"
import { slownikEn } from "./slownik-en"
import { slownikRu } from "./slownik-ru"
import type { Language } from "./language"

export const dictionaries: Record<Language, Record<string, string>> = {
  pl: slownikPl,
  en: slownikEn,
  ru: slownikRu,
}

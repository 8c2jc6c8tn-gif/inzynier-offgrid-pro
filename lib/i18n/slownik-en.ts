// Full dictionary of one language (engine messages + screen texts). Loaded through `rejestr-slownikow.ts`;
// `dictionaries.ts` (all three at once) is for tests and scripts only.
import { dictionaryEn } from "./dictionary-en"
import { uiEn } from "./ui-en"

export const slownikEn: Record<string, string> = { ...dictionaryEn, ...uiEn }

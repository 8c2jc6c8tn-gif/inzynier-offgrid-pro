// Full dictionary of one language (engine messages + screen texts). Loaded through `rejestr-slownikow.ts`;
// `dictionaries.ts` (all three at once) is for tests and scripts only.
import { dictionaryPl } from "./dictionary-pl"
import { uiPl } from "./ui"

export const slownikPl: Record<string, string> = { ...dictionaryPl, ...uiPl }

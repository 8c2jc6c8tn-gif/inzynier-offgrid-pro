// Full dictionary of one language (engine messages + screen texts). Loaded through `rejestr-slownikow.ts`;
// `dictionaries.ts` (all three at once) is for tests and scripts only.
import { dictionaryRu } from "./dictionary-ru"
import { uiRu } from "./ui-ru"

export const slownikRu: Record<string, string> = { ...dictionaryRu, ...uiRu }

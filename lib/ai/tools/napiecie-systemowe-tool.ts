/**
 * Narzędzie AI (9.3) dla Ekranu 2, Moduł 4 "Magazyn energii / baterie" — "Doradca doboru
 * napięcia systemowego (12/24/48V)". `operationType: 'read'`. Rdzeń I=P/V — moc szczytowa (albo
 * suma odbiorników z kreatora + ogrzewanie) MUSI pochodzić od użytkownika/projektu instalacji,
 * nigdy nie zgadywana. Etap C (echo `dobor-przekroju-kabla`, patrz `dobor-przekroju-kabla-tool.ts`)
 * wymaga danych trasy kabla (długość, materiał, sposób ułożenia, temperatura) — też wyłącznie od
 * użytkownika/pomiaru; 0 długości pomija ten etap (zgodnie z `calculator.ts`). Etap E (kosztorysy
 * 12/24/48V) wymaga cen — wszystkie edytowalne przez użytkownika, model nigdy nie wymyśla cen;
 * 0 pojemności docelowej pomija ten etap. `zastosowanie`/`priorytet` (Etap A) są czysto
 * informacyjne w jądrze (nie sterują wynikiem liczbowym — patrz `calculator.ts`), ale nadal
 * pochodzą od użytkownika, nie od modelu.
 *
 * Wołane bezpośrednio `calculateNapiecieSystemowe()` — narzędzie nie duplikuje ani algorytmu
 * jednoczesności (jednoczesnosc.ts), ani kosztorysu (kosztorys.ts), ani doboru kabla (Moduł 5).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateNapiecieSystemowe } from "@/lib/core/modules/baterie/napiecie-systemowe/calculator"
import type { NapiecieSystemoweInput } from "@/lib/core/modules/baterie/napiecie-systemowe/input"
import { ZASTOSOWANIA, PRIORYTETY, type Zastosowanie, type Priorytet } from "@/lib/core/modules/baterie/napiecie-systemowe/constants"
import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

const ZASTOSOWANIA_IDS = ZASTOSOWANIA.map((z) => z.id) as [Zastosowanie, ...Zastosowanie[]]
const PRIORYTETY_IDS = PRIORYTETY.map((p) => p.id) as [Priorytet, ...Priorytet[]]
const MATERIALY = ["Cu", "Al"] as [Material, ...Material[]]
const SPOSOBY_ULOZENIA = ["swobodnie", "w_peszlu", "w_ziemi", "w_wiazce"] as [SposobUlozenia, ...SposobUlozenia[]]

const OdbiornikWyborSchema = z.object({
  id: z.string().describe("Identyfikator odbiornika z katalogu (Etap B) — lub dowolny identyfikator użytkownika, jeśli spoza katalogu"),
  mocW: z.number().describe("Moc odbiornika [W] — od użytkownika (karta znamionowa/katalog), 0 = nie wpisano"),
  czasPracyMin: z.number().describe("Czas jednorazowej pracy [min] — 0 = nie podano (traktowane jako chwilowe)"),
  selected: z.boolean().describe("Czy odbiornik jest wliczany do sumy mocy"),
})

export const NapiecieSystemoweToolInput = z.object({
  mocSzczytowaW: z
    .number()
    .describe("Obciążenie szczytowe [W] — pole ręczne (fallback), używane gdy 0 nie podano i nie korzysta się z kreatora odbiorników"),
  zastosowanie: z.enum(ZASTOSOWANIA_IDS).nullable().describe("Etap A — kontekst zastosowania (informacyjny, nie wpływa na wynik liczbowy)"),
  priorytet: z.enum(PRIORYTETY_IDS).nullable().describe("Etap A — priorytet użytkownika (informacyjny, nie wpływa na wynik liczbowy)"),
  ogrzewanieNieDotyczy: z.boolean().describe("Ogrzewanie budynku nie dotyczy tego systemu (np. kamper, ogrzewanie na paliwo stałe)"),
  ogrzewanieMocW: z.number().describe("Szczytowa moc ogrzewania elektrycznego [W], jeśli nie 'nie dotyczy' i nie rozpisano w kreatorze odbiorników. 0 = nie podano"),
  odbiorniki: z.array(OdbiornikWyborSchema).describe("Etap B — kreator odbiorników, lista wybranych/niewybranych pozycji z mocą i czasem pracy"),
  mocCiaglaFalownikaPlanowanaW: z
    .number()
    .describe("Planowana moc ciągła falownika [W] — do sprawdzenia konfliktu jednoczesności (Etap B.2). 0 = nie podano, sprawdzenie pomijane"),
  dlugoscTrasyM: z.number().describe("Etap C — długość trasy kabla [m], z pomiaru. 0 = pomija echo doboru kabla"),
  material: z.enum(MATERIALY).describe("Materiał przewodnika (echo doboru kabla)"),
  sposobUlozenia: z.enum(SPOSOBY_ULOZENIA).describe("Sposób ułożenia kabla (echo doboru kabla)"),
  temperaturaOtoczeniaC: z.number().nullable().describe("Temperatura otoczenia [°C] (echo doboru kabla). null = nie podano"),
  liczbaKabliWWiazce: z.number().describe("Liczba kabli w wiązce (echo doboru kabla). 0/1 = brak wiązki"),
  dopuszczalnySpadekNapieciaPct: z.number().describe("Dopuszczalny spadek napięcia [%] (echo doboru kabla). 0 = nie podano"),
  docelowaPojemnoscKwh: z.number().describe("Etap E — docelowa pojemność energetyczna banku [kWh] dla porównania kosztorysów 12/24/48V. 0 = pomija kosztorysy"),
  cenaOgniwaZl: z.number().describe("Cena jednego ogniwa [zł] — od użytkownika, nie zgaduj"),
  cenaBms4sZl: z.number().describe("Cena BMS 4S (dla 12V) [zł]"),
  cenaBms8sZl: z.number().describe("Cena BMS 8S (dla 24V) [zł]"),
  cenaBms16sZl: z.number().describe("Cena BMS 16S (dla 48V) [zł]"),
  cenaFalownika12vZl: z.number().describe("Cena falownika 12V [zł]"),
  cenaFalownika24vZl: z.number().describe("Cena falownika 24V [zł]"),
  cenaFalownika48vZl: z.number().describe("Cena falownika 48V [zł]"),
  cenaPrzewodow12vZl: z.number().describe("Cena przewodów dla wariantu 12V [zł]"),
  cenaPrzewodow24vZl: z.number().describe("Cena przewodów dla wariantu 24V [zł]"),
  cenaPrzewodow48vZl: z.number().describe("Cena przewodów dla wariantu 48V [zł]"),
  cenaBezpiecznika12vZl: z.number().describe("Cena bezpiecznika/rozłącznika dla wariantu 12V [zł]"),
  cenaBezpiecznika24vZl: z.number().describe("Cena bezpiecznika/rozłącznika dla wariantu 24V [zł]"),
  cenaBezpiecznika48vZl: z.number().describe("Cena bezpiecznika/rozłącznika dla wariantu 48V [zł]"),
  liczbaLiniiOswietlenia24vPrzySystemie48v: z
    .number()
    .describe("Liczba linii oświetleniowych 24V wymagających przetwornicy DC-DC 48V→24V — tylko dla kosztorysu 48V. 0 = brak"),
  cenaPrzetwornicyDcDcZl: z.number().describe("Cena jednej przetwornicy DC-DC 48V→24V [zł]"),
  planowanaKonwersja24Do48: z.boolean().describe("Etap H — czy użytkownik planuje przyszłą konwersję 24V→48V (ostrzeżenie edukacyjne + kosztorys przejścia)"),
})

export type NapiecieSystemoweToolInputT = z.infer<typeof NapiecieSystemoweToolInput>

const KabelPorownanieSchema = z.object({
  przekrojMm2: z.number(),
  obciazalnoscEfektywnaA: z.number(),
  spadekNapieciaPct: z.number(),
  strataRocznaKwh: z.number(),
  status: z.enum(STATUSY),
  ostrzezenia: z.array(z.string()),
})

const JednoczesnoscSchema = z.object({
  sumaBazowaW: z.number(),
  sumaPrzelaczalneWorstCaseW: z.number(),
  sumaWorstCaseW: z.number(),
  limitPodano: z.boolean(),
  konflikt: z.boolean(),
  nadwyzkaW: z.number(),
  sugerowaneWylaczenie: z.array(z.object({ id: z.string(), label: z.string(), mocW: z.number() })),
  wagaOstrzezenia: z.enum(["warning", "critical"]).nullable(),
})

const KosztorysSchema = z.object({
  napiecieV: z.union([z.literal(12), z.literal(24), z.literal(48)]),
  liczbaOgniwSzeregowo: z.number(),
  liczbaStringowRownoleglych: z.number(),
  liczbaOgniwLacznie: z.number(),
  pojemnoscFaktycznaKwh: z.number(),
  kosztOgniwZl: z.number(),
  kosztBmsZl: z.number(),
  kosztFalownikaZl: z.number(),
  kosztPrzewodowZl: z.number(),
  kosztBezpiecznikowZl: z.number(),
  kosztPrzetwornicZl: z.number(),
  razemZl: z.number(),
})

export const NapiecieSystemoweToolOutput = z.object({
  napiecieRekomendowaneV: z.union([z.literal(12), z.literal(24), z.literal(48)]),
  pradPrzy12VA: z.number(),
  pradPrzy24VA: z.number(),
  pradPrzy48VA: z.number(),
  mocSzczytowaCalkowitaW: z.number(),
  jednoczesnosc: JednoczesnoscSchema.nullable(),
  kable: z.object({ v12: KabelPorownanieSchema, v24: KabelPorownanieSchema, v48: KabelPorownanieSchema }).nullable(),
  kosztorysy: z.object({ v12: KosztorysSchema, v24: KosztorysSchema, v48: KosztorysSchema }).nullable(),
  kosztKonwersji24Do48Zl: z.number().nullable(),
  status: z.enum(STATUSY),
  zalozenia: z.array(z.string()),
  ostrzezenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})

export type NapiecieSystemoweToolOutputT = z.infer<typeof NapiecieSystemoweToolOutput>

export const napiecieSystemoweTool: AiToolDefinition<NapiecieSystemoweToolInputT, NapiecieSystemoweToolOutputT> = {
  name: "policz_napiecie_systemowe",
  description:
    "Doradza wybór napięcia systemowego (12/24/48V) dla instalacji off-grid na podstawie mocy szczytowej " +
    "(ręcznie albo z kreatora odbiorników z analizą jednoczesności), sprawdza konflikt z planowaną mocą " +
    "ciągłą falownika, ostrzega gdy ogrzewanie elektryczne wymaga 48V lub prąd przy 12V jest zbyt wysoki, " +
    "porównuje przekrój kabla (echo doboru z Modułu 5) i pełny kosztorys banku energii dla tej samej " +
    "docelowej pojemności przy 12V/24V/48V, oraz liczy koszt ewentualnej przyszłej konwersji 24V→48V. Użyj, " +
    "gdy user pyta jakie napięcie systemowe wybrać dla swojej instalacji off-grid. Moc, dane trasy kabla i " +
    "ceny muszą pochodzić od usera — nie zgaduj.",
  inputSchema: NapiecieSystemoweToolInput,
  outputSchema: NapiecieSystemoweToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "baterie/napiecie-systemowe",
  handler: async (input) => {
    const wynik = calculateNapiecieSystemowe(input as NapiecieSystemoweInput)
    return {
      napiecieRekomendowaneV: wynik.value.napiecieRekomendowaneV,
      pradPrzy12VA: wynik.value.pradPrzy12VA,
      pradPrzy24VA: wynik.value.pradPrzy24VA,
      pradPrzy48VA: wynik.value.pradPrzy48VA,
      mocSzczytowaCalkowitaW: wynik.value.mocSzczytowaCalkowitaW,
      jednoczesnosc: wynik.value.jednoczesnosc,
      kable: wynik.value.kable
        ? {
            v12: { ...wynik.value.kable.v12, ostrzezenia: tekstyOstrzezen(wynik.value.kable.v12.warnings) },
            v24: { ...wynik.value.kable.v24, ostrzezenia: tekstyOstrzezen(wynik.value.kable.v24.warnings) },
            v48: { ...wynik.value.kable.v48, ostrzezenia: tekstyOstrzezen(wynik.value.kable.v48.warnings) },
          }
        : null,
      kosztorysy: wynik.value.kosztorysy,
      kosztKonwersji24Do48Zl: wynik.value.kosztKonwersji24Do48Zl,
      status: wynik.status,
      zalozenia: tekstyZalozen(wynik.assumptions),
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}

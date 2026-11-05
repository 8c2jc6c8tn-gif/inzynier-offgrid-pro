#!/usr/bin/env node
// Generuje moduł TS z przypiętej paczki wg deklaracji konsumenta (rozdz. 19.11, 19.13). Node >= 18, bez zależności.
//   node generuj-modul.mjs [meteo.konsument.json]
// Rdzeń obliczeniowy nie czyta paczki ani plików (01.1) — dostaje wyłącznie ten wygenerowany moduł.
// Deklaracja z nieistniejącym polem/lokalizacją/źródłem = błąd, nie ciche pominięcie (nie zgadujemy).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const die = (m) => { console.error("BŁĄD: " + m); process.exit(1); };
const dekl = JSON.parse(readFileSync(process.argv[2] ?? "meteo.konsument.json", "utf8"));
const paczka = JSON.parse(readFileSync("vendor/dane-srodowiskowe/srodowisko.json", "utf8"));
const lock = JSON.parse(readFileSync("dane-srodowiskowe.lock.json", "utf8"));
if (paczka.wersjaDanych !== lock.wersjaDanych) die(`vendor ma ${paczka.wersjaDanych}, lock ${lock.wersjaDanych} — uruchom pobierz-dane-srodowiskowe.mjs`);

const OBSLUGIWANY_SCHEMAT = 1; // zmiana wersjaSchematu paczki to zmiana kontraktu — generator odmawia, zamiast zgadywać
if (paczka.wersjaSchematu !== OBSLUGIWANY_SCHEMAT) die(`paczka ma schemat ${paczka.wersjaSchematu}, ten generator obsługuje ${OBSLUGIWANY_SCHEMAT} — zaktualizuj generator z new-app-standards`);

const W = paczka.warstwy;
const idy = new Set(W.lokalizacje.map((l) => l.id));
const wybrane = dekl.lokalizacje === "wszystkie" ? [...idy] : dekl.lokalizacje;
for (const id of wybrane) if (!idy.has(id)) die(`lokalizacja ${id} nie istnieje w paczce ${paczka.wersjaDanych}`);

const pick = (o, pola) => Object.fromEntries(pola.map((p) => [p, o[p] ?? null])); // brak ≠ 0: brakujące pole = null
const LOK = ["id", "typ", "nazwa", "szer", "dl", "kodWmo", "wysokoscNpm", "liczbaLat", "niepelnyCiag", "wysokogorska"];
const lokalizacje = wybrane.map((id) => pick(W.lokalizacje.find((l) => l.id === id), LOK));

const polaK = dekl.klimatMiesieczny?.pola ?? [];
const zrodlaK = dekl.klimatMiesieczny?.zrodla ?? [];
for (const p of polaK) if (!(p in paczka.opisPol.klimatMiesieczny)) die(`pole klimatu "${p}" nie istnieje (dostępne: ${Object.keys(paczka.opisPol.klimatMiesieczny).join(", ")})`);
for (const z of zrodlaK) if (!paczka.zrodla.some((s) => s.kod === z)) die(`źródło "${z}" nie istnieje`);
const klimat = {};
if (polaK.length) {
  for (const id of wybrane) {
    klimat[id] = {};
    for (const z of zrodlaK) {
      const zr = W.klimatMiesieczny[id]?.[z];
      if (zr) klimat[id][z] = zr.miesiace.map((m) => ({ miesiac: m.miesiac, ...pick(m, polaK) }));
    }
  }
}

const polaO = dekl.opady?.pola ?? [];
const opady = {};
if (polaO.length) {
  const probka = Object.values(W.opady)[0].miesiace[0];
  for (const p of polaO) if (!(p in probka)) die(`pole opadów "${p}" nie istnieje (dostępne: ${Object.keys(probka).filter((k) => k !== "miesiac").join(", ")})`);
  for (const id of wybrane) {
    const o = W.opady[id];
    if (o) opady[id] = { okres: o.okres, miesiace: o.miesiace.map((m) => ({ miesiac: m.miesiac, ...pick(m, polaO) })) };
  }
}

const strefy = dekl.strefyNormowe
  ? { normy: W.strefyNormowe.normy, przypisania: W.strefyNormowe.przypisania.lokalizacje.filter((l) => wybrane.includes(l.id)) }
  : null;

const union = (a) => (a.length ? a.map((x) => JSON.stringify(x)).join(" | ") : "never");
const j = (v) => JSON.stringify(v);
const wynik = `/**
 * PLIK GENEROWANY — nie edytować ręcznie. Źródło: paczka środowiskowa ${paczka.wersjaDanych} (schemat ${paczka.wersjaSchematu}),
 * generator generuj-modul.mjs, deklaracja meteo.konsument.json. Opis pól i jednostek: paczka → opisPol.
 * Status licencji: ${paczka.statusLicencji}
 */
export const SRODOWISKO_META = ${j({ wersjaDanych: paczka.wersjaDanych, wersjaSchematu: paczka.wersjaSchematu, sha256: lock.sha256, statusLicencji: paczka.statusLicencji })} as const

export interface Lokalizacja {
  id: string; typ: string; nazwa: string; szer: number; dl: number; kodWmo: string | null
  wysokoscNpm: number | null; liczbaLat: number | null; niepelnyCiag: boolean; wysokogorska: boolean
}
export type ZrodloKlimatu = ${union(zrodlaK)}
export type PoleKlimatu = ${union(polaK)}
export type MiesiacKlimatu = { miesiac: number } & { [K in PoleKlimatu]: number | null }
export type PoleOpadu = ${union(polaO)}
export type MiesiacOpadu = { miesiac: number } & { [K in PoleOpadu]: number | null }

export const LOKALIZACJE: readonly Lokalizacja[] = ${j(lokalizacje)}
export const KLIMAT_MIESIECZNY: Readonly<Record<string, Partial<Record<ZrodloKlimatu, readonly MiesiacKlimatu[]>>>> = ${j(klimat)}
export const OPADY: Readonly<Record<string, { okres: readonly [string, string]; miesiace: readonly MiesiacOpadu[] }>> = ${j(opady)}
export const STREFY_NORMOWE: { readonly normy: unknown; readonly przypisania: readonly unknown[] } | null = ${j(strefy)}
`;
mkdirSync(dirname(dekl.wyjscie), { recursive: true });
writeFileSync(dekl.wyjscie, wynik);
console.log(`Zapisano ${dekl.wyjscie}: ${lokalizacje.length} lokalizacji, ${wynik.length} znaków.`);

#!/usr/bin/env node
/**
 * Cross-screen data-flow audit (docs/audyt-powiazan-ekranow-2026-11-09.md). Read-only measurement, not a CI gate:
 * for every screen of the dashboard registry it reports whether the screen reads anything from other screens or from
 * Settings, and it groups the form fields of all screens by the project quantity they repeat (system voltage, battery
 * capacity, daily demand…). Re-run after each repair batch to see the numbers move:
 *
 *   node scripts/audyt-powiazan-ekranow.mjs            # prints the summary
 *   node scripts/audyt-powiazan-ekranow.mjs --write    # also rewrites docs/audyt-powiazan-ekranow-zalacznik.md
 */
import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const ts = require("typescript")
const ROOT = process.cwd()
const ZALACZNIK = "docs/audyt-powiazan-ekranow-zalacznik.md"

/** Hooks and components that carry data between screens (or from Settings to a screen). Currency is listed apart. */
const NOSNIKI = [
  "useOdczytDraftu",
  "useProfilSprzetu",
  "useLokalizacjaProjektu",
  "useDaneTmy",
  "useRodzajObiektu",
  "NapiecieZProfilu",
  "useWynikEkranu1",
  "useOgrzewanieElektryczne",
  "useDaneMrozuZEkranu1",
  "useOgrzewanieMalegoObiektu",
  "useZuzycieMiesieczne",
  "useDaneBilansu",
  "useWynikSymulacjiMrozu",
  "PolaBudynkuUkryteInfo",
]

/** Project quantities and the field names that repeat them (lower bound: only fields named this way are caught). */
const GRUPY = {
  "zużycie / zapotrzebowanie energii": /^(zuzycie(Dobowe|Kwh|Wh)?\w*|zapotrzebowanie(Dobowe|Kwh|Wh|W|Calkowite)?\w*|energiaDobow\w*|zimaKwh|histPopyt)$/i,
  "pojemność baterii": /^(pojemnosc(Kwh|Ah|UzytecznaKwh|Baterii\w*|Akumulatora\w*|Nominalna\w*|Magazynu\w*)?|posiadanyAh|lfpAh|agmAh|histMagPoj|magazyn|bateria)$/i,
  "napięcie układu": /^(napiecie(V|BateriiV|AkumulatoraV|SystemuV|Systemowe\w*|NominalneV|UkladuV|Banku\w*)|system)$/i,
  "chemia / DoD / SoC min": /^(chemia|dodPct|typAkumulatora|technologia|socMinPct|uzytecznaPct)$/i,
  "panel i tablica PV": /^(voc\w*|isc\w*|vmp\w*|imp\w*|mocPanelu\w*|beta\w*|gamma\w*|liczbaPaneli\w*|mocPv\w*|mocInstalacji\w*|histKwp|mocKwp)$/i,
  falownik: /^(mocFalownika\w*|sprawnoscFalownika\w*)$/i,
  "lokalizacja i klimat": /^(szerokosc(Geograficzna|Deg)?|dlugosc|tmin\w*|temperaturaMin\w*|strefa\w*|wysokoscNpm\w*|temperaturaZewn\w*|tZewn\w*|tProj|pvgisLat|pvgisLon|godzinSlonca)$/i,
  "orientacja paneli": /^(azymut\w*|nachylenie\w*|pvgisNach|pvgisAzym)$/i,
  agregat: /^(mocAgregatu\w*|zuzycie\w*LH|sredniZuzycieLH|cenaPaliwa\w*|cenaZaLitrZl|cenaZlL)$/i,
  "cena energii": /^(cena\w*Kwh\w*|cenaPradu\w*|cenaEnergii\w*|cenaZlKwh)$/i,
  "ciepło budynku": /^(zapotrzebowanie(Ciep\w*|Kw|SezonKwh)|mocGrzewcza\w*|mocProj|cop\w*|scop\w*)$/i,
  "prąd i kabel": /^(prad\w*A|przekroj\w*|dlugosc(TrasyM|KablaM)|dopuszczalnySpadek\w*)$/i,
}

function czytaj(plik) {
  try {
    return fs.readFileSync(plik, "utf8")
  } catch {
    return ""
  }
}

function pliki(katalog, wynik = []) {
  for (const e of fs.readdirSync(katalog, { withFileTypes: true })) {
    const p = path.join(katalog, e.name)
    if (e.isDirectory()) {
      if (e.name !== "node_modules" && e.name !== "__tests__") pliki(p, wynik)
    } else if (/\.tsx?$/.test(e.name)) wynik.push(p)
  }
  return wynik
}

function rozwiaz(importowany, z) {
  const baza = importowany.startsWith("@/") ? path.join(ROOT, importowany.slice(2)) : importowany.startsWith(".") ? path.join(path.dirname(z), importowany) : null
  if (!baza) return null
  for (const koncowka of [".tsx", ".ts", "/index.tsx", "/index.ts"]) if (fs.existsSync(baza + koncowka)) return baza + koncowka
  return null
}

/** Source of a screen with its own components and shared (non-`ui`) components, three levels deep. */
function zrodloEkranu(plik, glebokosc, widziane) {
  if (widziane.has(plik)) return ""
  widziane.add(plik)
  const tresc = czytaj(plik)
  let calosc = tresc
  if (glebokosc === 0) return calosc
  for (const m of tresc.matchAll(/from\s+"([^"]+)"/g)) {
    const imp = m[1]
    if (!(imp.startsWith(".") || imp.startsWith("@/components") || imp.startsWith("@/app")) || imp.startsWith("@/components/ui")) continue
    const r = rozwiaz(imp, plik)
    if (r) calosc += zrodloEkranu(r, glebokosc - 1, widziane)
  }
  return calosc
}

function moduly() {
  const wynik = []
  let biezacy = null
  for (const linia of czytaj(path.join(ROOT, "lib/pulpit/registry.ts")).split("\n")) {
    const id = linia.match(/^\s{4}id:\s*(\d+)/)
    if (id) {
      biezacy = { id: Number(id[1]), nazwa: "", ekrany: [] }
      wynik.push(biezacy)
    }
    const nazwa = linia.match(/nazwa:\s*"([^"]+)"/)
    if (nazwa && biezacy && !biezacy.nazwa) biezacy.nazwa = nazwa[1]
    for (const h of linia.matchAll(/href:\s*"\/kalkulatory\/([^"]+)"/g)) if (biezacy) biezacy.ekrany.push(h[1])
  }
  return wynik
}

/** Every `usePersistedDraft` call with the field names of its initial state (the screen's own form). */
function formularze() {
  const wiersze = []
  for (const plik of [...pliki(path.join(ROOT, "app")), ...pliki(path.join(ROOT, "components"))]) {
    const tresc = czytaj(plik)
    if (!tresc.includes("usePersistedDraft")) continue
    const sf = ts.createSourceFile(plik, tresc, ts.ScriptTarget.Latest, true, plik.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
    const stale = new Map()
    const typy = new Map()
    const zbierz = (n) => {
      if (ts.isVariableDeclaration(n) && n.initializer && ts.isIdentifier(n.name)) stale.set(n.name.text, n.initializer)
      if (ts.isTypeAliasDeclaration(n) && ts.isTypeLiteralNode(n.type)) typy.set(n.name.text, n.type.members.map((m) => m.name?.getText(sf)).filter(Boolean))
      ts.forEachChild(n, zbierz)
    }
    zbierz(sf)
    const szukaj = (n) => {
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "usePersistedDraft") {
        let obiekt = n.arguments[1]
        if (obiekt && ts.isIdentifier(obiekt)) obiekt = stale.get(obiekt.text)
        let pola = obiekt && ts.isObjectLiteralExpression(obiekt) ? obiekt.properties.map((p) => p.name?.getText(sf)).filter(Boolean) : []
        if (pola.length === 0) pola = typy.get(n.typeArguments?.[0]?.getText(sf) ?? "") ?? []
        const ekran = path.relative(ROOT, plik).replace("app/kalkulatory/", "").replace("/page.tsx", "")
        wiersze.push({ ekran, pola })
      }
      ts.forEachChild(n, szukaj)
    }
    szukaj(sf)
  }
  return wiersze
}

const listaModulow = moduly()
const wierszeMacierzy = []
for (const m of listaModulow) {
  for (const ekran of m.ekrany) {
    const tresc = zrodloEkranu(path.join(ROOT, "app/kalkulatory", ekran, "page.tsx"), 3, new Set())
    wierszeMacierzy.push({ modul: m.id, ekran, nosniki: NOSNIKI.filter((n) => new RegExp(`\\b${n}\\b`).test(tresc)) })
  }
}

const grupy = {}
for (const { ekran, pola } of formularze()) {
  for (const pole of pola) {
    for (const [grupa, wzorzec] of Object.entries(GRUPY)) {
      if (!wzorzec.test(pole)) continue
      grupy[grupa] ??= {}
      ;(grupy[grupa][ekran] ??= []).push(pole)
    }
  }
}

const linie = []
linie.push("# Załącznik do audytu powiązań ekranów — dane z pomiaru")
linie.push("")
linie.push("Plik generowany: `node scripts/audyt-powiazan-ekranow.mjs --write`. Nie edytować ręcznie. Opis i wnioski: `docs/audyt-powiazan-ekranow-2026-11-09.md`.")
linie.push("")
linie.push("## 1. Ekrany czytające dane z innych ekranów lub z Ustawień — per moduł")
linie.push("")
linie.push("| Moduł (id w rejestrze) | Ekranów | Czyta cokolwiek | Ekrany czytające (nośnik) |")
linie.push("|---|---|---|---|")
for (const m of listaModulow) {
  const moje = wierszeMacierzy.filter((w) => w.modul === m.id)
  const czytajace = moje.filter((w) => w.nosniki.length > 0)
  linie.push(`| ${m.id}. ${m.nazwa} | ${moje.length} | ${czytajace.length} | ${czytajace.map((w) => `${w.ekran} (${w.nosniki.join(", ")})`).join("; ") || "—"} |`)
}
linie.push("")
linie.push("## 2. Te same wielkości projektu wpisywane ręcznie na wielu ekranach")
linie.push("")
linie.push("Dolna granica: wykrywane są tylko pola nazwane zgodnie z wzorcem grupy (`GRUPY` w skrypcie). W nawiasie nazwy pól formularza.")
for (const [grupa, ekrany] of Object.entries(grupy).sort((a, b) => Object.keys(b[1]).length - Object.keys(a[1]).length)) {
  linie.push("")
  linie.push(`### ${grupa} — ${Object.keys(ekrany).length} ekranów`)
  linie.push("")
  linie.push(Object.entries(ekrany).map(([e, pola]) => `${e} (${pola.join(", ")})`).join("; "))
}
linie.push("")

const wszystkie = wierszeMacierzy.length
const czytajacych = wierszeMacierzy.filter((w) => w.nosniki.length > 0).length
console.log(`Ekranów w rejestrze: ${wszystkie}, czytających dane spoza siebie: ${czytajacych} (${Math.round((100 * czytajacych) / wszystkie)}%).`)
for (const [grupa, ekrany] of Object.entries(grupy)) console.log(`  ${grupa}: ${Object.keys(ekrany).length} ekranów`)
if (process.argv.includes("--write")) {
  fs.writeFileSync(path.join(ROOT, ZALACZNIK), linie.join("\n"))
  console.log(`Zapisano ${ZALACZNIK}`)
}

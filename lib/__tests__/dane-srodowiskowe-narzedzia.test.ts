// @vitest-environment node
/**
 * Narzędzia konsumenta paczki `dane-srodowiskowe` (standard 19.13) przetestowane na atrapie wydania —
 * zanim paczka będzie gotowa. `scripts/pobierz-dane-srodowiskowe.mjs` i `scripts/generuj-modul.mjs` to
 * kopie 1:1 z `new-app-standards` (`docs/przyklady/dane-srodowiskowe/`, jedyna zmiana dozwolona w projekcie
 * to stała REPO). Test uruchamia je tak, jak zrobi to CI: w katalogu projektu, bez sieci
 * (`--zrodlo-lokalne` = katalog „wydanie” z manifestem i paczką). Gdy powstanie prawdziwe wydanie, ten sam
 * test zostaje jako dowód, że łańcuch pobranie → lock → moduł → odmowa przy podmianie działa.
 *
 * Kształt atrapy (manifest, `.json.gz`, warstwy) jest kształtem paczki schematu 1 z repo danych
 * (`schemat/paczka.schema.json`, `skrypty/zbuduj_paczke.py`), nie wymysłem tego testu.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { gzipSync } from "node:zlib"

const POBIERZ = resolve(__dirname, "../../scripts/pobierz-dane-srodowiskowe.mjs")
const GENERUJ = resolve(__dirname, "../../scripts/generuj-modul.mjs")
const sha = (b: Buffer | string) => createHash("sha256").update(b).digest("hex")

function paczka(wersja = "0.1.0", schemat = 1) {
  const miesiace = (te: (m: number) => number | null) =>
    Array.from({ length: 12 }, (_, i) => ({ miesiac: i + 1, te: te(i + 1), fie: 1, hdd20_15: i < 4 ? 300 : null, hdd18_15: 250 }))
  return {
    format: "srodowisko-paczka",
    wersjaSchematu: schemat,
    wersjaDanych: wersja,
    zbudowano: "2026-11-05",
    statusLicencji: "niezamkniete — tylko wewnetrzna wspolpraca rodziny (19.10)",
    wersjeWarstw: { lokalizacje: 1, klimatMiesieczny: 1, opady: 1, strefyNormowe: 1 },
    opisPol: { klimatMiesieczny: { te: {}, fie: {}, hdd20_15: {}, hdd18_15: {} } },
    zrodla: [{ kod: "miib", licencja: "nie sprawdzono" }, { kod: "pvgis", licencja: "nie sprawdzono" }],
    licencje: [{ zrodlo: "miib", licencja: "nie sprawdzono", uzycieKomercyjne: "nieznane" }],
    warstwy: {
      lokalizacje: [
        { id: "miib-121000", typ: "stacja", nazwa: "Warszawa", szer: 52.2, dl: 21, kodWmo: "12375", wysokoscNpm: 107, liczbaLat: 30, niepelnyCiag: false, wysokogorska: false },
        { id: "miib-123750", typ: "stacja", nazwa: "Zakopane", szer: 49.3, dl: 19.9, kodWmo: null, wysokoscNpm: 855, liczbaLat: 11, niepelnyCiag: true, wysokogorska: true },
      ],
      klimatMiesieczny: {
        "miib-121000": { miib: { miesiace: miesiace((m) => (m === 7 ? 19 : -1)) }, pvgis: { miesiace: miesiace(() => 8) } },
        // brak danych w jednym miesiącu = null (brak ≠ 0, 19.5)
        "miib-123750": { miib: { miesiace: miesiace((m) => (m === 3 ? null : 5)) } },
      },
      opady: {
        "miib-121000": { id: "miib-121000", okres: ["1991", "2020"], miesiace: [{ miesiac: 1, opad: 30, opadSnieg: 12 }] },
      },
      strefyNormowe: { normy: { snieg: "PN-EN 1991-1-3" }, przypisania: { lokalizacje: [{ id: "miib-121000", strefaSniegu: 2 }, { id: "miib-123750", strefaSniegu: 4 }] } },
    },
  }
}

function zbudujWydanie(katalog: string, wersja = "0.1.0", schemat = 1) {
  mkdirSync(katalog, { recursive: true })
  const json = Buffer.from(JSON.stringify(paczka(wersja, schemat)))
  const gz = gzipSync(json, { level: 9 })
  const manifest = {
    format: "srodowisko-manifest",
    wersjaSchematu: schemat,
    wersjaDanych: wersja,
    statusLicencji: "niezamkniete",
    paczka: { plik: `srodowisko-${wersja}.json`, sha256: sha(json), plikGz: `srodowisko-${wersja}.json.gz`, sha256Gz: sha(gz) },
  }
  writeFileSync(join(katalog, `srodowisko-${wersja}.json.gz`), gz)
  writeFileSync(join(katalog, "manifest.json"), JSON.stringify(manifest))
  return { sha256: sha(json), json }
}

let projekt: string
let wydanie: string
const uruchom = (skrypt: string, ...args: string[]) =>
  execFileSync("node", [skrypt, ...args], { cwd: projekt, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })
const uruchomZBledem = (skrypt: string, ...args: string[]) => {
  try {
    uruchom(skrypt, ...args)
  } catch (e) {
    const err = e as { status: number; stderr: string }
    return { kod: err.status, stderr: err.stderr }
  }
  throw new Error("skrypt miał się zakończyć błędem")
}
const deklaracja = (nad: object = {}) =>
  writeFileSync(
    join(projekt, "meteo.konsument.json"),
    JSON.stringify({
      wyjscie: "wygenerowane/srodowisko.ts",
      lokalizacje: ["miib-121000", "miib-123750"],
      klimatMiesieczny: { zrodla: ["miib", "pvgis"], pola: ["te", "hdd20_15"] },
      opady: { pola: ["opad", "opadSnieg"] },
      strefyNormowe: true,
      ...nad,
    }),
  )

beforeEach(() => {
  projekt = mkdtempSync(join(tmpdir(), "offgrid-srodowisko-"))
  wydanie = join(projekt, "wydanie")
})
afterEach(() => rmSync(projekt, { recursive: true, force: true }))

describe("pobranie i lock (19.13 pkt 2–3)", () => {
  it("przypina wersję, zapisuje sumę w locku i kopię w vendor/", () => {
    const { sha256 } = zbudujWydanie(wydanie)
    uruchom(POBIERZ, "--zaktualizuj", "0.1.0", "--zrodlo-lokalne", wydanie)
    const lock = JSON.parse(readFileSync(join(projekt, "dane-srodowiskowe.lock.json"), "utf8"))
    expect(lock).toEqual({ repo: "8c2jc6c8tn-gif/dane-srodowiskowe", wersjaDanych: "0.1.0", wersjaSchematu: 1, sha256 })
    expect(existsSync(join(projekt, "vendor/dane-srodowiskowe/srodowisko.json"))).toBe(true)
  })

  it("ponowne uruchomienie bez argumentów tylko weryfikuje kopię (bez sieci i bez źródła)", () => {
    zbudujWydanie(wydanie)
    uruchom(POBIERZ, "--zaktualizuj", "0.1.0", "--zrodlo-lokalne", wydanie)
    expect(uruchom(POBIERZ)).toContain("zgodna z lockiem")
  })

  it("wykrywa podmieniony plik w vendor/ i nie przepuszcza go po cichu", () => {
    zbudujWydanie(wydanie)
    uruchom(POBIERZ, "--zaktualizuj", "0.1.0", "--zrodlo-lokalne", wydanie)
    writeFileSync(join(projekt, "vendor/dane-srodowiskowe/srodowisko.json"), "{\"podmienione\":true}")
    // bez źródła i tokenu nie da się odtworzyć kopii → błąd, nie „OK”
    const wynik = uruchomZBledem(POBIERZ)
    expect(wynik.kod).toBe(1)
    expect(wynik.stderr).toContain("DANE_SRODOWISKOWE_TOKEN")
    // ze źródłem kopia jest przywrócona zgodnie z lockiem
    expect(uruchom(POBIERZ, "--zrodlo-lokalne", wydanie)).toContain("Pobrano 0.1.0 zgodnie z lockiem")
    expect(sha(readFileSync(join(projekt, "vendor/dane-srodowiskowe/srodowisko.json")))).toBe(
      JSON.parse(readFileSync(join(projekt, "dane-srodowiskowe.lock.json"), "utf8")).sha256,
    )
  })

  it("odmawia, gdy wydanie ma inną sumę niż lock (podmiana wersji)", () => {
    zbudujWydanie(wydanie)
    uruchom(POBIERZ, "--zaktualizuj", "0.1.0", "--zrodlo-lokalne", wydanie)
    rmSync(join(projekt, "vendor"), { recursive: true })
    // to samo oznaczenie wersji, inna zawartość
    const inne = Buffer.from(JSON.stringify({ ...paczka(), zbudowano: "2026-12-31" }))
    const gz = gzipSync(inne)
    const m = JSON.parse(readFileSync(join(wydanie, "manifest.json"), "utf8"))
    m.paczka.sha256 = sha(inne)
    m.paczka.sha256Gz = sha(gz)
    writeFileSync(join(wydanie, "srodowisko-0.1.0.json.gz"), gz)
    writeFileSync(join(wydanie, "manifest.json"), JSON.stringify(m))
    const wynik = uruchomZBledem(POBIERZ, "--zrodlo-lokalne", wydanie)
    expect(wynik.stderr).toContain("inną sumę niż lock")
    expect(existsSync(join(projekt, "vendor/dane-srodowiskowe/srodowisko.json"))).toBe(false)
  })

  it("odmawia przy uszkodzonym pliku .gz (suma niezgodna z manifestem)", () => {
    zbudujWydanie(wydanie)
    const gz = readFileSync(join(wydanie, "srodowisko-0.1.0.json.gz"))
    gz[gz.length - 10] ^= 0xff
    writeFileSync(join(wydanie, "srodowisko-0.1.0.json.gz"), gz)
    expect(uruchomZBledem(POBIERZ, "--zaktualizuj", "0.1.0", "--zrodlo-lokalne", wydanie).stderr).toContain("niezgodna z manifestem")
  })

  it("bez locka nie zgaduje wersji", () => {
    expect(uruchomZBledem(POBIERZ).stderr).toContain("brak dane-srodowiskowe.lock.json")
  })
})

describe("generator modułu (19.11, 19.13 pkt 4)", () => {
  beforeEach(() => {
    zbudujWydanie(wydanie)
    uruchom(POBIERZ, "--zaktualizuj", "0.1.0", "--zrodlo-lokalne", wydanie)
  })

  it("generuje moduł z samych zadeklarowanych pól i nosi wersję oraz sumę paczki", () => {
    deklaracja()
    uruchom(GENERUJ)
    const ts = readFileSync(join(projekt, "wygenerowane/srodowisko.ts"), "utf8")
    expect(ts).toContain("PLIK GENEROWANY")
    expect(ts).toContain('"wersjaDanych":"0.1.0"')
    expect(ts).toContain(JSON.parse(readFileSync(join(projekt, "dane-srodowiskowe.lock.json"), "utf8")).sha256)
    expect(ts).toContain('export type PoleKlimatu = "te" | "hdd20_15"')
    // pola niezadeklarowane nie trafiają do modułu (paczka PWA nie rośnie „na zapas”)
    expect(ts).not.toContain("hdd18_15\":")
    expect(ts).not.toContain("fie\":")
  })

  it("brak danych zostaje null, nigdy 0 (19.5)", () => {
    deklaracja()
    uruchom(GENERUJ)
    const ts = readFileSync(join(projekt, "wygenerowane/srodowisko.ts"), "utf8")
    const klimat = JSON.parse(ts.match(/KLIMAT_MIESIECZNY[^=]*= (.*)\n/)![1])
    const marzecZakopane = klimat["miib-123750"].miib.find((m: { miesiac: number }) => m.miesiac === 3)
    expect(marzecZakopane.te).toBeNull()
    // brak hdd20_15 w drugiej połowie roku też jest null
    const lipiec = klimat["miib-121000"].miib.find((m: { miesiac: number }) => m.miesiac === 7)
    expect(lipiec.hdd20_15).toBeNull()
  })

  it("przenosi znaczniki jakości lokalizacji (niepełny ciąg, stacja wysokogórska) do modułu", () => {
    deklaracja()
    uruchom(GENERUJ)
    const ts = readFileSync(join(projekt, "wygenerowane/srodowisko.ts"), "utf8")
    const lok = JSON.parse(ts.match(/LOKALIZACJE[^=]*= (.*)\n/)![1])
    const zakopane = lok.find((l: { id: string }) => l.id === "miib-123750")
    expect(zakopane).toMatchObject({ niepelnyCiag: true, wysokogorska: true, liczbaLat: 11 })
  })

  it("odmawia nieznanego pola, lokalizacji i źródła zamiast je pominąć", () => {
    deklaracja({ klimatMiesieczny: { zrodla: ["miib"], pola: ["te", "nie_ma_takiego"] } })
    expect(uruchomZBledem(GENERUJ).stderr).toContain('pole klimatu "nie_ma_takiego" nie istnieje')
    deklaracja({ lokalizacje: ["miib-999999"] })
    expect(uruchomZBledem(GENERUJ).stderr).toContain("lokalizacja miib-999999 nie istnieje")
    deklaracja({ klimatMiesieczny: { zrodla: ["nieznane"], pola: ["te"] } })
    expect(uruchomZBledem(GENERUJ).stderr).toContain('źródło "nieznane" nie istnieje')
    expect(existsSync(join(projekt, "wygenerowane/srodowisko.ts"))).toBe(false)
  })

  it("odmawia paczki z innym schematem niż obsługiwany (kontrakt, nie zgadywanie)", () => {
    const inny = join(projekt, "wydanie2")
    zbudujWydanie(inny, "0.2.0", 2)
    uruchom(POBIERZ, "--zaktualizuj", "0.2.0", "--zrodlo-lokalne", inny)
    deklaracja()
    expect(uruchomZBledem(GENERUJ).stderr).toContain("paczka ma schemat 2")
  })

  it("odmawia, gdy vendor/ i lock wskazują różne wersje", () => {
    deklaracja()
    const lockPath = join(projekt, "dane-srodowiskowe.lock.json")
    const lock = JSON.parse(readFileSync(lockPath, "utf8"))
    writeFileSync(lockPath, JSON.stringify({ ...lock, wersjaDanych: "0.9.9" }))
    expect(uruchomZBledem(GENERUJ).stderr).toContain("vendor ma 0.1.0, lock 0.9.9")
  })
})

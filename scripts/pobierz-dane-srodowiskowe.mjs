#!/usr/bin/env node
// Pobiera wspólną paczkę środowiskową (rozdz. 19.13) i przypina wersję. Node >= 18, bez zależności.
//
//   node pobierz-dane-srodowiskowe.mjs                       weryfikuje kopię w vendor/ względem locka; brakującą/uszkodzoną pobiera
//   node pobierz-dane-srodowiskowe.mjs --zaktualizuj 0.2.0   świadoma zmiana wersji: pobiera, weryfikuje, aktualizuje lock
//   ... --zrodlo-lokalne ../dane-srodowiskowe/wydanie        zamiast GitHuba czyta katalog z wynikiem zbuduj_paczke.py (test, offline)
//
// Token (tylko odczyt, prywatne repo): zmienna DANE_SRODOWISKOWE_TOKEN. Codzienny build i sesje AI nie potrzebują sieci:
// vendor/ jest commitowany, a sumę kontrolną sprawdza ten skrypt i test zgodności (19.11).
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { gunzipSync } from "node:zlib";

const REPO = "8c2jc6c8tn-gif/dane-srodowiskowe"; // jedyna stała do dostosowania
const LOCK = "dane-srodowiskowe.lock.json";
const VENDOR = "vendor/dane-srodowiskowe";
const PACZKA = join(VENDOR, "srodowisko.json");
const MANIFEST = join(VENDOR, "manifest.json");

const sha = (b) => createHash("sha256").update(b).digest("hex");
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const die = (m) => { console.error("BŁĄD: " + m); process.exit(1); };

async function pobierzAsset(wersja, nazwa, lokalne) {
  if (lokalne) return readFileSync(join(lokalne, nazwa));
  const token = process.env.DANE_SRODOWISKOWE_TOKEN;
  if (!token) die("brak DANE_SRODOWISKOWE_TOKEN (token tylko-do-odczytu repo danych) — albo użyj --zrodlo-lokalne");
  const h = { Authorization: `Bearer ${token}`, "User-Agent": "pobierz-dane-srodowiskowe" };
  const rel = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/v${wersja}`, { headers: { ...h, Accept: "application/vnd.github+json" } });
  if (!rel.ok) die(`Release v${wersja}: HTTP ${rel.status}`);
  const asset = (await rel.json()).assets.find((a) => a.name === nazwa);
  if (!asset) die(`Release v${wersja} nie ma pliku ${nazwa}`);
  const r = await fetch(asset.url, { headers: { ...h, Accept: "application/octet-stream" } });
  if (!r.ok) die(`${nazwa}: HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function wgraj(wersja, lokalne, oczekiwanaSuma) {
  const manifestBajty = await pobierzAsset(wersja, "manifest.json", lokalne);
  const m = JSON.parse(manifestBajty.toString("utf8"));
  if (m.wersjaDanych !== wersja) die(`manifest mówi ${m.wersjaDanych}, oczekiwano ${wersja}`);
  const gz = await pobierzAsset(wersja, m.paczka.plikGz, lokalne);
  if (sha(gz) !== m.paczka.sha256Gz) die("suma SHA-256 pliku .gz niezgodna z manifestem");
  const json = gunzipSync(gz);
  if (sha(json) !== m.paczka.sha256) die("suma SHA-256 paczki niezgodna z manifestem");
  if (oczekiwanaSuma && m.paczka.sha256 !== oczekiwanaSuma) die("pobrana paczka ma inną sumę niż lock — wersja została podmieniona, nie zapisuję tego po cichu");
  mkdirSync(dirname(PACZKA), { recursive: true });
  writeFileSync(PACZKA, json);
  writeFileSync(MANIFEST, manifestBajty);
  return m;
}

const nowa = arg("--zaktualizuj");
const lokalne = arg("--zrodlo-lokalne");

if (nowa) {
  const m = await wgraj(nowa, lokalne);
  writeFileSync(LOCK, JSON.stringify({ repo: REPO, wersjaDanych: m.wersjaDanych, wersjaSchematu: m.wersjaSchematu, sha256: m.paczka.sha256 }, null, 2) + "\n");
  console.log(`Przypięto ${m.wersjaDanych} (schemat ${m.wersjaSchematu}). Status licencji: ${m.statusLicencji}`);
  console.log("Pamiętaj (19.4): zmiana wartości zmieniająca wyniki obliczeń = decyzja właściciela i wpis w rejestrze decyzji; potem uruchom generuj-modul.mjs.");
} else {
  if (!existsSync(LOCK)) die(`brak ${LOCK} — pierwsze przypięcie: --zaktualizuj <wersja>`);
  const lock = JSON.parse(readFileSync(LOCK, "utf8"));
  if (existsSync(PACZKA) && sha(readFileSync(PACZKA)) === lock.sha256) {
    console.log(`OK: ${PACZKA} zgodna z lockiem (${lock.wersjaDanych}).`);
  } else {
    await wgraj(lock.wersjaDanych, lokalne, lock.sha256);
    console.log(`Pobrano ${lock.wersjaDanych} zgodnie z lockiem.`);
  }
}

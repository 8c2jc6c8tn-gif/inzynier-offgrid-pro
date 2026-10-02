# Kontrakt telemetrii ESP32 → aplikacja (koperta v1)

Jeden format dla każdego transportu. Wybór WiFi / Bluetooth / USB zapada później i dotyczy wyłącznie adaptera
(`lib/adapters/telemetria/zrodla.ts`) — ekrany i logika widzą tylko `ProbkaTelemetrii` (`lib/core/telemetria/probka.ts`).

## Koperta (JSON, jedna na pomiar)

```json
{ "s": 1, "d": "esp-01", "t": 1759400000,
  "c": [ { "k": "bms", "w": "napiecie", "v": 51.2, "u": "V" },
         { "k": "bms", "w": "soc", "v": null, "u": "%" } ] }
```

- `s` — wersja schematu (obecnie 1; inna wersja jest odrzucana, nie zgadywana),
- `d` — id urządzenia, `t` — czas epoch w sekundach UTC (zegar urządzenia),
- `c[]` — kanały: `k` nazwa, `w` wielkość (`napiecie|prad|moc|energia|temperatura|soc|czestotliwosc|naswietlenie`),
  `v` wartość (`null` = czujnik nie podał danych — osobny stan „brak”, nigdy zero), `u` jednostka (przeliczana na kanoniczną).
- Nieznana wielkość lub jednostka: kanał trafia na listę `odrzucone` (zgłaszane), nie znika po cichu.

## Transporty

| Transport | Format | Ograniczenia |
|---|---|---|
| HTTP (polling) | body = koperta | CORS w firmware; strona HTTPS nie wywoła `http://` w LAN |
| USB Web Serial | NDJSON (koperta w linii, `\n`) | tylko Chromium; nie iOS |
| Web Bluetooth | notyfikacje GATT ze strumieniem NDJSON (fragmenty składane po `\n`); UUID usługi/charakterystyki w ustawieniach źródła | tylko Chromium; nie iOS Safari; **UUID do ustalenia z firmware** |
| CSV | profil mapowania kolumn (`lib/core/telemetria/csv.ts`) | separator wykrywany, przecinek dziesiętny, błędy z numerem wiersza |
| MQTT przez WebSocket | — | niezbudowane; wymaga zależności (budżet SW, D61) — decyzja po wyborze sprzętu |

## CSV: plik z danymi osobno, legenda osobno

Profil (`ProfilCsv`) opisuje plik; zapisuje się go w rejestrze (`lib/core/telemetria/rejestr.ts`) i używa ponownie.
- `bezNaglowka: true` — kolumny adresowane numerem (od 0); legenda nie jest czytana przez aplikację, z niej powstaje profil.
- Czas: `iso`, `epoch-s`, `epoch-ms`, `dmy` (DD.MM.RRRR) albo `data-godzina` (data i godzina w osobnych kolumnach, `kolumnaGodziny`).
  Czas bez strefy jest traktowany jako UTC, chyba że profil podaje `przesuniecieMin` (stałe przesunięcie zegara pliku względem UTC;
  nie zgadywane, bo błędna wartość przesuwa wszystkie próbki).
- `znacznikiBraku` — teksty oznaczające „brak pomiaru” (np. `-999`) stają się jawnym stanem „brak”, nie liczbą.
- Wielkości pogodowe: `predkoscWiatru` (m/s), `wilgotnosc` (%RH), `cisnienie` (hPa), `opad` (mm), `zachmurzenie` (okta).

## Dane demo

`generujDemo` / `ZrodloSymulator` dają ten sam strumień próbek co prawdziwe urządzenie (`demo: true` w konfiguracji —
UI ma to oznaczać). Wartości poglądowe, nie pomiary. Podmiana na dane rzeczywiste = zmiana źródła, nie ekranów.

## Jakość

`ocenJakosc(probki, krokMs)` — luki, duplikaty, zakresy, zamrożony czujnik. Krok próbkowania jest jawnym parametrem zbioru.

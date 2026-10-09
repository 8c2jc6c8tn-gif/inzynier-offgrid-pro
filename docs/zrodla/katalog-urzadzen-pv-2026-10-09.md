# Katalog falowników, mikroinwerterów i regulatorów MPPT — transkrypcja źródeł (09.10.2026)

**Status:** pierwsza partia na prośbę właściciela (09.10.2026): VEVOR (falowniki hybrydowe, mikroinwertery, regulator MPPT) i Victron Energy (regulatory SmartSolar MPPT, falowniki Phoenix).
**Zasada:** do kodu (`lib/core/dane/katalog-urzadzen-pv/`) trafia tylko to, co odczytano na stronie producenta. Brak liczby albo dwie sprzeczne liczby = `null`, nie wartość z pamięci. Ceny nie wchodzą do katalogu (jak w katalogu paneli).
**Jak odczytano:** narzędzie pobierania stron WWW z automatycznym streszczeniem, nie pliki PDF w repo (sieć sesji nie pozwala ich pobrać). Streszczenie bywa mylące w komórkach scalonych, dlatego przypisanie wartości do modelu, którego strona nie podaje jednoznacznie, zostało puste. **Właściciel powinien porównać 2–3 wpisy z kartą otwartą pod podanym adresem** (adresy niżej).

## 1. Victron Energy — regulatory SmartSolar MPPT

Producent: Victron Energy B.V. (Holandia). To nie jest polska firma; sprzęt jest niebieski (RAL 5012) i sprzedawany w Polsce przez dystrybutorów.

Karty (odczyt 09.10.2026):
- 75/10, 75/15, 100/15, 100/20: <https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-75-10,-75-15,-100-15,-100-20_48V-EN.pdf> oraz instrukcja <https://www.victronenergy.com/media/pg/Manual_SmartSolar_MPPT_75-10_up_to_100-20/en/technical-specifications.html>
- 100/30, 100/50: <https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-100-30-&-100-50-EN.pdf>
- 150/35, 150/45: <https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-150-35-&-150-45-EN.pdf>
- 150/60, 150/70: <https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-150-60-&-150-70-EN.pdf>
- 250/60, 250/70: <https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-250-60-and-250-70-EN.pdf>
- 150/70 … 250/100 (VE.Can): <https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-250-70-up-to-250-100-VE.Can-EN.pdf> oraz instrukcja <https://www.victronenergy.com/media/pg/Manual_SmartSolar_MPPT_150-70_up_to_250-100_VE.Can/en/technical-specifications.html>

| Model | Napięcia akumulatora | Prąd ład. | Moc PV nominalna 12 / 24 / 48 V | Isc max | Voc max (bezwzględne / rozruch) | Masa |
|---|---|---|---|---|---|---|
| 75/10 | 12/24 | 10 A | 145 / 290 W | **sprzeczne (13 A karta, 10 A instrukcja) → null** | 75 V | 0,5 kg |
| 75/15 | 12/24 | 15 A | 220 / 440 W | 15 A | 75 V | 0,5 kg |
| 100/15 | 12/24 | 15 A | 220 / 440 W | 15 A | 100 V | 0,6 kg |
| 100/20 | 12/24/48 | 20 A | 290 / 580 / 1160 W | 20 A | 100 V | 0,65 kg |
| 100/30 | 12/24 | 30 A | 440 / 880 W | 35 A | 100 V | 1,3 kg |
| 100/50 | 12/24 | 50 A | 700 / 1400 W | 60 A | 100 V | 1,3 kg |
| 150/35 | 12/24/48 | 35 A | 500 / 1000 / 2000 W | 40 A | 150 V / 145 V | 1,25 kg |
| 150/45 | 12/24/48 | 45 A | 650 / 1300 / 2600 W | 50 A | 150 V / 145 V | 1,25 kg |
| 150/60 | 12/24/48 | 60 A | 860 / 1720 / 3440 W | 50 A | 150 V / 145 V | 3 kg |
| 150/70 | 12/24/48 | 70 A | 1000 / 2000 / 4000 W | 50 A | 150 V / 145 V | 3 kg |
| 150/85 | 12/24/48 | 85 A | 1200 / 2400 / 4900 W | 70 A (instrukcja) | 150 V / 145 V | 4,5 kg |
| 150/100 | 12/24/48 | 100 A | 1450 / 2900 / 5800 W | null (nieczytelne) | 150 V / 145 V | null |
| 250/60 | 12/24/48 | 60 A | 860 / 1720 / 3440 W | 35 A | 250 V / 245 V | 3 kg |
| 250/70 | 12/24/48 | 70 A | 1000 / 2000 / 4000 W | 35 A | 250 V / 245 V | 3 kg |
| 250/85 | 12/24/48 | 85 A | 1200 / 2400 / 4900 W | 70 A (instrukcja) | 250 V / 245 V | 4,5 kg |
| 250/100 | 12/24/48 | 100 A | 1450 / 2900 / 5800 W | null (nieczytelne) | 250 V / 245 V | null |

Wspólne: sprawność maks. 98 % (serie 75, 100, 150) i 99 % (seria 250), praca −30…+60 °C (pełna moc do 40 °C), Bluetooth wbudowany. Rozruch: napięcie PV musi przekroczyć Vbat + 5 V, po rozruchu minimum Vbat + 1 V (karta 100/30 i 100/50) — **okno MPPT zależy więc od napięcia akumulatora i nie jest stałe**, dlatego dolna granica okna w katalogu to `null`.
Moc PV 36 V pominięta: karta mówi, że numery katalogowe są dla 12/24 V, a 36/48 V wybiera się programowo.
Nie wpisano: 100/20 bez „-48V” (karta pokazuje tylko wariant 12/24/48 V), serii MPPT RS i SmartSolar 150/35 w wersji z MC4 (osobne karty, kolejna partia).

## 2. Victron Energy — falowniki Phoenix (VE.Direct, 230 V)

Karta: <https://www.victronenergy.com/upload/documents/Datasheet-Inverter-VE.Direct-250VA-1600VA-EN.pdf>. Wartości dla 230 V / 50 Hz.

| Model (V/VA) | Moc ciągła 25 °C | Szczyt | Napięcie wejścia DC | Sprawność maks. | Pobór bez obciążenia | Masa (wg mocy) |
|---|---|---|---|---|---|---|
| 12/250, 24/250, 48/250 | 250 VA / 200 W | 400 W | 9,2–17 / 18,4–34 / 36,8–62 V | 87 / 88 / 88 % | 4,2 / 5,2 / 7,9 W | 2,4 kg |
| 12/375, 24/375, 48/375 | 375 VA / 300 W | 700 W | jw. | 89 / 89 / 90 % | 5,6 / 6,1 / 8,5 W | 3,0 kg |
| 12/500, 24/500, 48/500 | 500 VA / 400 W | 900 W | jw. | 90 / 90 / 91 % | 6 / 6,5 / 9 W | 3,9 kg |
| 12/800, 24/800, 48/800 | 800 VA / 650 W | 1500 W | jw. | 90 / 90 / 91 % | 6,5 / 7 / 9,5 W | 5,5 kg |
| 12/1200, 24/1200, 48/1200 | 1200 VA / 1000 W | 2200 W | jw. | 91 / 91 / 92 % | 10 / 11 / 12 W | 7,4 kg |
| 12/1600 | 1600 VA / 1450 W | 2200 W | 9,2–17 V | 92 % | 12 W | 8,9 kg |

Pominięto 24/1600 i 48/1600: karta nie podaje ich wartości. Karta podaje też moc ciągłą w 40 °C dla serii (175, 260, 350, 560, 850, 1200 W) — nie wpisano, bo przypisanie do mocy nie jest jednoznaczne w odczycie.

## 3. VEVOR — falowniki hybrydowe (sklep vevor.pl)

Adresy produktów (skrót, działający): `https://www.vevor.pl/falownik-czystej-fali-sinusoidalnej-c_10760/x-p_<numer>`.

| Numer artykułu | Moc znam. | Szczyt | Akumulator | MPPT / ład. | Zakres PV | Maks. moc PV | Wi-Fi | Wymiary / masa | Pobór bez obc. | Strona |
|---|---|---|---|---|---|---|---|---|---|---|
| GD3024JMH | 3000 W | brak na stronie | 24 V | 80 A | brak na stronie | brak | **nie** | brak | brak | p_010413032596 |
| GD5548JMH | 4000 W | brak | 24 V | 120 A | brak | brak | **tak** (moduł WLAN) | brak | brak | p_010597768916 |
| EM3500-24L | 3500 W | brak | 24 V | ład. 100 A (PV), 80 A (AC) | 60–500 V DC (nagłówek na stronie: „od 40 do 500 V” — sprzeczne) | 4000 W | **tak** | 365×308×105 mm / 6,1 kg | 35 W | p_010626100855 |
| EM5500-48L | 5500 W ±10 % | 11000 VA | 48 V | ład. 100 A (PV), 80 A (AC) | tylko „maks. napięcie MPPT 500 V DC” | brak | **nie** (moduł osobno) | 445×313×107 mm / 8,35 kg | brak | p_010914991247 (kategoria off-grid-solar-inverter-c_10764) |
| EM6200-48L | 6000 W | 12000 VA | 48 V | ład. 120 A (PV), 100 A (AC) | 60–500 V DC | brak w tabeli (opis marketingowy: „do 6500 W”) | **tak** | 450×310×125 mm / 9 kg | 35 W | p_010209748438 |

Uwagi:
- Strony **nie podają liczby paneli ani konfiguracji stringów**, ani Voc max, ani Isc, ani maks. prądu wejściowego PV. Właściciel pisał, że producent podaje inną liczbę paneli dla dwóch podobnych modeli — na stronach sklepu tego nie ma; ewentualnie jest w instrukcji PDF (do dostarczenia przez właściciela).
- Sprawność „93 %”, „94 %”, „96 %” to sprawność konwersji MPPT wg tabeli; opisy marketingowe mówią „do 99 %” — niewpisane.
- Wśród dostępnych na vevor.pl wariantów strona oznacza kilka jako „obecnie brak na stanie” — to kwestia magazynu, nie danych.

## 4. VEVOR — regulator MPPT (vevor.pl)

MC2450N10-B: 12/24 V automatycznie, maks. 50 A, Voc maks. 100 V DC, moc PV 660 W (12 V) / 1320 W (24 V), sprawność MPPT ≥ 98 %, 183×125×70 mm, 1,33 kg, Bluetooth + TTL (Modbus). Opis tekstowy ma sprzeczne „220 W” — wpisano tabelę. Okno MPPT i pobór własny: brak na stronie. Adres: `https://www.vevor.pl/kontroler-ladowania-slonecznego-mppt-c_10732/x-p_010825717610`.
VEVOR oferuje na vevor.pl jeszcze regulatory zintegrowane w zestawach z panelem (20 i 50 W, 12 V) i z turbinami — nie wpisano (zestawy, nie samodzielne regulatory).

## 5. VEVOR — mikroinwertery (sklep eur.vevor.com; na vevor.pl nie znaleziono)

| Model | Moc | Wejście DC | Prąd wejściowy | Wejść | Wi-Fi | IP | Masa | Strona |
|---|---|---|---|---|---|---|---|---|
| GT-600 | 600 W ±10 % | 18–50 V | 12 A ×2 (Q&A: „nie więcej niż 15 A” — sprzeczne, wpisano tabelę) | 2 | antena + aplikacja | IP67 | 3,8 kg | p_010205565976 |
| GT-800 | 800 W ±10 % (strona: „ciągła 360 W” — niejasne) | 18–50 V | 14 A ×2 | 2 | antena + aplikacja | IP67 | 3,8 kg | p_010175865987 |
| NBQ600W-220VWXBW1V0 | znam. 550 W (zalecane PV 600 W) | 17–50 V, maks. 54 V, okno MPPT 25–40 V | maks. 27,2 A, Isc maks. 40 A | brak | brak | IP65 | brak | p_010707692025 |

Adres: `https://eur.vevor.com/grid-tie-solar-inverter-c_10762/…-p_<numer>`. Mikroinwertery sieciowe (grid-tie) oddają energię do sieci 230 V — to inna klasa niż falownik wyspowy; do instalacji off-grid bez sieci się nie nadają bez dodatkowego urządzenia. Katalog oznacza je osobnym rodzajem.

## 6. Czego nie ma (kolejne partie)

- Karty PDF VEVOR z liczbą paneli i Voc max / Isc dla EM3500, EM5500, EM6200, GD3024JMH, GD5548JMH.
- Victron: MPPT RS, MultiPlus-II, Quattro, SmartSolar z MC4, Cerbo; falowniki Phoenix 24/1600 i 48/1600.
- Inne marki falowników wyspowych (nie prosił o nie właściciel).

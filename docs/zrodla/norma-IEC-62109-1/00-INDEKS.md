# IEC 62109-1 — "Isolation in solar power converters: Understanding the IEC62109-1 safety
# standard" (materiał branżowy, NIE tekst normy)

**Status: ⚠️ artykuł/whitepaper firmowy, NIE tekst normy IEC 62109-1.** Natywny tekst PDF (nie
skan). **[27.09.2026, później] Przeczytany w całości** — patrz sekcja "Treść" niżej. Korekta:
plik ma **11 stron**, nie 14 (strony 1–10 treść, strona 11 standardowa klauzula prawna TI);
liczba 14 z pierwszego wpisu była błędna.

Plik: `Isolation-in-solar-power-converters-IEC62109-1-explainer.pdf`. Tytuł wg metadanych PDF:
*"Isolation in solar power converters: Understanding the IEC62109-1 safety standard"* —
najprawdopodobniej whitepaper producenta komponentów izolacyjnych/przetwornic (typ dokumentu
analogiczny do poradnika Furse dla EN 62305 czy Purmo dla PN-EN 12831: wyjaśnia normę własnymi
słowami producenta w celach edukacyjno-marketingowych, nie zastępuje oficjalnego tekstu normy).

## Dlaczego to nie zamyka luki IEC 62109-1 z `docs/normy-brakujace.md`

W repo mamy już **pełny tekst IEC 62109-2:2011** (Część 2 — falowniki, FDIS,
`docs/zrodla/norma-IEC-62109-2/`), ale wciąż nie mamy **Części 1** (wymagania ogólne
bezpieczeństwa przetwornic mocy w systemach PV, na której Część 2 się opiera). Ten plik to
komentarz/wyjaśnienie tematu izolacji galwanicznej wg Części 1, nie sam tekst normatywny —
**luka IEC 62109-1 pozostaje częściowo otwarta**, ale ten materiał daje kontekst do zrozumienia
wymagań o izolacji, przed dotarciem do właściwego tekstu normy.

## Zadanie dla następnej sesji — ✅ wykonane 27.09.2026 (treść i ocena niżej)

1. Dokończyć odczyt treści (14 stron, natywny tekst — nie wymaga OCR, tylko odczyt
   stron 1–14, np. przez Read z `pages`).
2. Wyodrębnić konkretne wymagania dot. separacji galwanicznej/klas izolacji (podstawowa/
   wzmocniona/podwójna) i odnieść do istniejących ekranów Modułu 5/8, jeśli takie istnieją.
3. Zaktualizować `docs/normy-brakujace.md` — pozycja IEC 62109-1 pozostaje 🟡 (materiał
   pomocniczy pozyskany, sama norma wciąż nie).

## Treść (odczyt pełny, 27.09.2026)

**Wydawca potwierdzony z metadanych:** Texas Instruments, *white paper* SLYY102, sierpień 2016,
autorzy Xiong Li, Anant Kamath (Isolation Interface Group). Hipoteza "producent komponentów
izolacyjnych" potwierdzona. Odnosi się do **IEC 62109-1 wyd. 1.0 (04.2010)**. Cel dokumentu:
dobór **izolatorów wewnątrz falownika** (izolowane sterowniki bramek IGBT/SiC, izolatory cyfrowe,
izolowane wzmacniacze/ADC) — perspektywa **projektanta elektroniki falownika**, nie instalatora.
Zakres zawężony przez autorów: układy trójfazowe do 1000 V RMS, szyna DC do 1500 V, OVC III po
stronie sieci, OVC II po stronie PV, stopień zanieczyszczenia 2, wysokość < 2000 m.

Co mówi (streszczenie tekstu TI — **nie tekst normy**, liczby nie do kodu bez normy):

1. **Napięcie systemowe** liczone osobno dla obwodów PV i sieciowych. Obwody PV: napięcie
   jałowe (Voc) modułów. Obwody sieciowe zależnie od układu sieci: TN/TT — faza-ziemia RMS
   (400 V gwiazda uziemiona → 230 V); TN "corner-earthed" (uziemiona faza) — międzyfazowe; IT —
   faza-sztuczny punkt neutralny dla napięcia udarowego, międzyfazowe dla przepięć dorywczych.
2. **Kategorie przepięciowe (OVC I–IV)** — opisy jak w serii 60364; w systemie PV obwody od
   strony modułów = **OVC II**, od strony sieci = **OVC III** (założenie domyślne dokumentu).
3. **Separacja ochronna** (protective separation) między obwodami wysokiego napięcia a częściami
   dostępnymi: dwie izolacje podstawowe szeregowo albo jedna wzmocniona. Przy układzie z masą
   sterownika odniesioną do DC− izolacja bramek jest tylko funkcjonalna, a wzmocniona musi być
   na łączu komunikacyjnym.
4. **Wymagania udarowe:** obwody sieciowe — bez interpolacji napięcia systemowego (230 V →
   wiersz 300 V); obwody PV — minimum 2500 V napięcia udarowego, interpolacja dozwolona. Przy
   transformatorze separującym OVC obniżana o jeden poziom dla udaru przenoszonego na drugą
   stronę; bez separacji galwanicznej — wyższa z dwóch wartości dla całości.
5. **Izolacja wzmocniona:** następny wyższy stopień napięcia udarowego i 2× przepięcie dorywcze
   (dla odstępów izolacyjnych: 1,6×, nie 2×); droga upływu ×2 względem podstawowej.
6. **Odstępy izolacyjne powyżej 2000 m n.p.m.** — współczynnik korekcyjny wg normy; przykład
   TI: 5000 m → ×1,48.
7. **Droga upływu** zależy od stopnia zanieczyszczenia i CTI (grupa materiałowa I/II/III);
   nie może być mniejsza niż odstęp izolacyjny.
8. **Tablica 1 (przykład TI):** 480 V AC / 1500 V DC, Voc = 848 V → udar PV 4000 V; odstępy
   3,0 / 5,5 / 5,5 / 8,0 mm dla wariantów podstawowa/wzmocniona × gwiazda/"corner-earth".
   Tablica 2 — katalog układów TI (reklama).

## Ocena trafności dla projektu (27.09.2026)

**Nie odblokowuje żadnego ekranu i nie wnosi liczby do kodu.** Uzasadnienie:
- Treść dotyczy konstrukcji falownika (odstępy izolacyjne i drogi upływu na płytce PCB,
  wybór układów scalonych). Instalator off-grid nie projektuje izolacji wewnątrz falownika —
  sprawdza co najwyżej, czy urządzenie ma deklarację zgodności z IEC 62109-1/-2. To już pokrywa
  M5 "Normy i certyfikaty" (`lib/core/modules/okablowanie/normy-i-certyfikaty/`).
- Jedyne fakty z pogranicza instalacji (OVC II po stronie PV, napięcie systemowe PV = Voc,
  min. 2500 V udaru dla obwodów PV) to parafraza producenta, nie tekst normy — zgodnie z
  zakazem zgadywania norm nie trafiają do kodu. Wymagania instalacyjne dla SPD/napięć udarowych
  po stronie PV i tak pochodzą z HD 60364-7-712 i HD 60364-4-443 (już w repo i w kodzie).
- Przydatność: kontekst dla przyszłej pełnej normy IEC 62109-1 (wiadomo, które tablice będą
  istotne: napięcie systemowe, OVC, udar, odstępy, drogi upływu, korekta wysokości).

## Status wykorzystania

Przeczytany w całości (27.09.2026), **świadomie niewykorzystany w kodzie** (powód wyżej). Luka
IEC 62109-1 w `docs/normy-brakujace.md` bez zmian (🟡 — nadal brak tekstu normy).

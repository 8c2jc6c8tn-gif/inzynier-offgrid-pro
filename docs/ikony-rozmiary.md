# Rozmiary ikon — skala i zasady

**Status:** obowiązuje od 16.10.2026 (układ kafla C wybrany przez właściciela tego samego dnia), decyzja D83 w `rejestr-decyzji.md` (na polecenie właściciela: „ustalić standard ikonek dla różnych wielkości ekranów”).

## Dlaczego

Ilustracje kafli pulpitu są rysowane w `viewBox 256×256` z kreską 2–2,5 jednostki. Pokazywane w 44 px dawały kreskę ok. 0,4 px i napisy o wysokości ok. 2 px, więc wyglądały na rozjechane. Dalsze zmniejszanie pogarszało efekt. Rozmiar ikony ma więc wynikać z jednej skali, a nie być dobierany „na oko” w komponencie.

## Skala

Wyłącznie wielokrotności 4 px: 16 · 20 · 24 · 32 · 48 · 64 · 80 · 96 · 112 · 128.

| Token (`app/globals.css`) | Wartość | Zastosowanie |
|---|---|---|
| `--ikona-kafel` | 112 / 128 px | górny limit ilustracji kafla pulpitu: telefon (<640 px) / od 640 px. Ilustracja wypełnia szerokość kafla (układ C) i nie przekracza limitu |
| `--ikona-min` | 80 px | minimum czytelności ilustracji kafla (decyzja właściciela 18.10.2026, D90); opakowanie ilustracji ma `min-w-(--ikona-min)` obok limitu |

Rozmiary ikon interfejsu leżą na tej samej skali: 16 px (drobne znaczniki w tekście), 20 px (gęste tabele, kompaktowe wiersze) i 24 px (przyciski, menu, „?”, „i”). Tokeny `--ikona-xs`, `--ikona-s` i `--ikona-ui` zostały usunięte 16.10.2026 jako nieużywane (martwy kod); wracają razem z pierwszym komponentem ikony liniowej (lista zadań, „Ikony interfejsu: emoji → liniowe SVG”).

Cel dotykowy przycisku z ikoną ma co najmniej 44×44 px; sama ikona 24 px leży w jego środku.

## Zasady

1. Rozmiar bierzemy z tokenu. Liczba wpisana w komponencie (`size={44}`, `h-16 w-16`) jest błędem.
2. SVG jest wektorowy, więc gęstość pikseli ekranu (1×, 2×, 3×) nie wymaga osobnych plików. Raster zostaje tylko tam, gdzie system tego wymaga: ikony PWA (192, 512, maskable), `apple-icon` 180, favicon 32.
3. Ilustracja kafla wypełnia jego szerokość do limitu z tokenu (układ C, wybrany przez właściciela 16.10.2026), rozmiar ikony interfejsu stały 24 px.
4. Minimum czytelności ilustracji kafla to 80 px, zatwierdzone przez właściciela 18.10.2026 (D90). Wartość pochodzi z oceny Claude (obliczenia i podgląd w emulatorze), nie z pomiaru na urządzeniach; dotyczy ilustracji kafli (SVG, Bob, ikony 3D), nie ikon interfejsu. Token `--ikona-min` i klasy `min-w-(--ikona-min)` na opakowaniach pilnuje test `skala-ikon`. Poniżej 80 px potrzebny jest osobny, uproszczony wariant (bez napisów i cienkich konturów), nie samo zmniejszenie.
5. Grubość kreski liczymy względem rozmiaru wyświetlania. Ikona rysowana pod 24 px ma kreskę 1,5–2 px.
6. Ikona, nazwa i plakietka w kaflu są wycentrowane w poziomie; kafle w jednym rzędzie mają tę samą wysokość (`h-full`).
7. Wspólna linia: ikona zawsze przy górze kafla, więc w rzędzie wszystkie leżą na jednej wysokości. Pod nią stałe pole na dwie linie nazwy (`min-h-[2.5em]`); nazwa jednoliniowa centruje się w tym polu w pionie.

## Czego jeszcze nie ma

- **Grubość kreski i napisy (decyzja właściciela 18.10.2026: „rób to”):** kreska niosąca treść ma mieć co najmniej 1 px na minimalnym rozmiarze, czyli 3,2 jednostki `viewBox 256` przy 80 px; napisów w ilustracjach nie ma. Istniejące animowane ilustracje SVG tego nie spełniają (65 z 70 kresek cieńszych, 23 napisy), ale **nie są dziś pokazywane**, bo każdy kafel ma obraz Boba albo ikonę 3D; ich przerysowanie nie jest potrzebne, dopóki gałąź SVG nie wróci. Test `lib/__tests__/grubosc-kreski-ilustracji.test.ts` jest zapadką: dług może tylko maleć, nowa cienka kreska albo nowy napis łamie test.
- **Rozmiary na urządzeniach:** zmierzone w emulatorze Chromium (Playwright) 18.10.2026 przy szerokości 320, 360, 390, 412, 768 i 1180 px oraz gęstości 1×, 2× i 3×, w trybie Boba i ikon 3D: ilustracja kafla ma zawsze 112 px (poniżej 640 px) albo 128 px (od 640 px), minimum 80 px nigdy nie jest węższe. Obraz źródłowy ma 600 px (Bob) albo 384 px (ikony 3D), co wystarcza do 3× przy 128 px. **To emulator, nie prawdziwy telefon**; ocena wyglądu na urządzeniu fizycznym zostaje po stronie właściciela.
- Uproszczony wariant ilustracji kafla (do użycia poniżej 80 px) nie jest narysowany. Dodajemy go tylko tam, gdzie wersja 80 px wygląda źle.
- Napisy wewnątrz ilustracji (np. „0.6 kW” w kaflu 2) przy 80–112 px nadal są drobne (ok. 4–5 px). Do usunięcia przy przerysowaniu wariantu uproszczonego.
- Ikony interfejsu to w większości emoji z rejestru; przejście na ikony liniowe SVG w skali `--ikona-ui` to osobne zadanie (patrz `docs/lista-do-zrobienia.md`).

Test `lib/__tests__/skala-ikon.test.ts` pilnuje, żeby tokeny istniały, leżały na skali i rosły z ekranem, a komponent ikony kafla nie miał rozmiaru wpisanego w kodzie.

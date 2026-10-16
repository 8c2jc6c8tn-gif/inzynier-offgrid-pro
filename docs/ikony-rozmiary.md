# Rozmiary ikon — skala i zasady

**Status:** obowiązuje od 16.10.2026, decyzja D83 w `rejestr-decyzji.md` (na polecenie właściciela: „ustalić standard ikonek dla różnych wielkości ekranów”).

## Dlaczego

Ilustracje kafli pulpitu są rysowane w `viewBox 256×256` z kreską 2–2,5 jednostki. Pokazywane w 44 px dawały kreskę ok. 0,4 px i napisy o wysokości ok. 2 px, więc wyglądały na rozjechane. Dalsze zmniejszanie pogarszało efekt. Rozmiar ikony ma więc wynikać z jednej skali, a nie być dobierany „na oko” w komponencie.

## Skala

Wyłącznie wielokrotności 4 px: 16 · 20 · 24 · 32 · 48 · 64 · 80 · 96 · 112 · 128.

| Token (`app/globals.css`) | Wartość | Zastosowanie |
|---|---|---|
| `--ikona-xs` | 16 px | drobne znaczniki w tekście |
| `--ikona-s` | 20 px | gęste tabele, kompaktowe wiersze |
| `--ikona-ui` | 24 px | ikony interfejsu (przyciski, menu, „?”, „i”), na każdym ekranie |
| `--ikona-kafel` | 80 / 96 / 112 px | ilustracja kafla pulpitu: telefon (<640 px) / tablet (≥640 px) / desktop (≥1024 px) |

Cel dotykowy przycisku z ikoną ma co najmniej 44×44 px; sama ikona 24 px leży w jego środku.

## Zasady

1. Rozmiar bierzemy z tokenu. Liczba wpisana w komponencie (`size={44}`, `h-16 w-16`) jest błędem.
2. SVG jest wektorowy, więc gęstość pikseli ekranu (1×, 2×, 3×) nie wymaga osobnych plików. Raster zostaje tylko tam, gdzie system tego wymaga: ikony PWA (192, 512, maskable), `apple-icon` 180, favicon 32.
3. Rozmiar ilustracji kafla rośnie z szerokością ekranu, rozmiar ikony interfejsu nie.
4. Minimum czytelności ilustracji kafla to 80 px. Poniżej tego potrzebny jest osobny, uproszczony wariant (bez napisów i cienkich konturów), nie samo zmniejszenie.
5. Grubość kreski liczymy względem rozmiaru wyświetlania. Ikona rysowana pod 24 px ma kreskę 1,5–2 px.

## Czego jeszcze nie ma

- Uproszczony wariant ilustracji kafla (do użycia poniżej 80 px) nie jest narysowany. Dodajemy go tylko tam, gdzie wersja 80 px wygląda źle.
- Napisy wewnątrz ilustracji (np. „0.6 kW” w kaflu 2) przy 80–112 px nadal są drobne (ok. 4–5 px). Do usunięcia przy przerysowaniu wariantu uproszczonego.
- Ikony interfejsu to w większości emoji z rejestru; przejście na ikony liniowe SVG w skali `--ikona-ui` to osobne zadanie (patrz `docs/lista-do-zrobienia.md`).

Test `lib/__tests__/skala-ikon.test.ts` pilnuje, żeby tokeny istniały, leżały na skali i rosły z ekranem, a komponent ikony kafla nie miał rozmiaru wpisanego w kodzie.

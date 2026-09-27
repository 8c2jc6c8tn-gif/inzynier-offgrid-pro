# "Bezpieczeństwo instalacji fotowoltaicznych" — dodatek do magazynu Rynek Elektryczny nr 3/2019
# (egzemplarz ze szkolenia ZIAD Bielsko-Biała)

## [27.09.2026, sesja OCR] Wynik sprawdzenia — to DUPLIKAT bajt-w-bajt

**MD5 `428edf5113a738f0a449c25cf92d6ee5` — identyczny z
`docs/zrodla/materialy-branzowe-PV-2019/Bezpieczenstwo-instalacji-fotowoltaicznych-Rynek-Fotowoltaiczny-2019.docx`**
(ten sam rozmiar 22 507 562 B, ta sama treść). Hipoteza „inna edycja” niżej — **obalona**; różnica
w numeracji rozdziałów widziana przy pobieżnym podglądzie wynikała z tego, jak konwersja rozbiła
tekst, nie z innej treści. Plik jest `.docx` z tekstem natywnym (111 860 znaków, 31 tabel,
127 obrazów / 74 unikalne) — **OCR nie był potrzebny**; obrazy to zdjęcia/rysunki/reklamy
publikacji, treść tekstowa (w tym lista norm) jest w warstwie tekstu.

**Odzyskane „zgubione” 9 pozycji listy norm (#2, #6, #10, #13, #17, #27, #29, #33, #37):**
były w pliku od początku — nie w tabelach, tylko jako zwykłe akapity (konwersja wyrzuciła
co któryś wiersz tabeli poza tabelę). Wcześniejsza sesja czytała tylko `d.tables`. Wartości
potwierdzone wizualnie z PDF tej samej publikacji (str. 8) i wpisane do
`docs/zrodla/materialy-branzowe-PV-2019/01-tresc.md`.

**⚠️ Do decyzji właściciela projektu:** (A) usunąć ten folder jako duplikat (precedens: duplikat
UNE-HD 60364-7-712 usunięty 25.09, duplikat Purmo niedodany 27.09) — treść zostaje w
`materialy-branzowe-PV-2019/`; (B) zostawić jako drugą kopię z odsyłaczem (stan obecny).
Nie usunięto samodzielnie, bo plik dodano na wyraźne polecenie.

---

## [historyczne — opis sprzed sprawdzenia, zachowany bez zmian]

**Status: ⚠️ tylko plik dodany, treść NIE przeanalizowana w tej sesji** (polecenie właściciela
projektu, 27.09.2026: "dodaj, inna sesja zajmie się tym").

Plik: `fotowoltaika-dodatek-szkolenia-ZIAD-Bielsko-Biala.docx` (.docx natywny, ~125 tys. znaków
tekstu wg pobieżnej ekstrakcji techniczne, nie czytane merytorycznie).

## Ważna obserwacja do zweryfikowania przez następną sesję

Tytuł i wydawca ("Rynek Fotowoltaiczny", dodatek do "Rynek Elektryczny" nr 3/2019) są **identyczne**
z już posiadanym materiałem `docs/zrodla/materialy-branzowe-PV-2019/` (plik
`Bezpieczenstwo-instalacji-fotowoltaicznych-Rynek-Fotowoltaiczny-2019.docx`), w którym przy
konwersji PPTX→DOCX zgubiło się 9 pozycji z listy 43 norm (patrz `docs/normy-brakujace.md`,
sekcja ⚫, pozycje #2, #6, #10, #13, #17, #27, #29, #33, #37).

**Hipoteza niesprawdzona:** ten plik może być inną edycją/egzemplarzem tej samej publikacji
(nazwa sugeruje dystrybucję na konkretnym szkoleniu — ZIAD Bielsko-Biała) — spis treści widoczny
przy pobieżnym podglądzie różni się jednak numeracją rozdziałów od tego, co jest w
`materialy-branzowe-PV-2019/01-tresc.md`, więc **nie jest to na pierwszy rzut oka identyczny
duplikat** — wymaga porównania treść-po-treści, nie tylko tytułu.

## Zadanie dla następnej sesji

1. Porównać treść tego pliku z `docs/zrodla/materialy-branzowe-PV-2019/01-tresc.md` —
   sprawdzić, czy to inna edycja tej samej publikacji, i czy zawiera pełną (nieprzyciętą)
   listę norm, w tym 9 zgubionych pozycji (#2, #6, #10, #13, #17, #27, #29, #33, #37).
2. Jeśli tak — użyć tego pliku jako źródła prawdy dla tamtej listy, zamiast zgadywać.
3. Jeśli to inny materiał (mimo podobnego tytułu) — pełna ekstrakcja i indeksacja wg wzorca
   innych plików w `docs/zrodla/` (rozdziały: Podstawy systemów PV, Wymagania techniczne,
   Zagrożenia — łuk elektryczny DC, błędy projektowe/realizacyjne).

## Status wykorzystania

Dodany, nieprzeanalizowany, niewykorzystany w kodzie.

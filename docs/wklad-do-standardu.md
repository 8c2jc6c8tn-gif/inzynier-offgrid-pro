# docs/wklad-do-standardu.md — Inżynier Offgrid Pro

Rosnący log nietrywialnych spostrzeżeń z pracy nad **tym** projektem, wartych rozważenia dla całego pakietu `new-app-standards`/GOD BOOK — nie tylko tego repo. To **nie jest** źródło prawdy o standardzie — to surowy materiał zgłoszeniowy. AI dopisuje tu z własnej inicjatywy (analogicznie do Części U.2 GOD BOOK), gdy natrafi na coś nietrywialnego. **Nigdy nie edytuj stąd bezpośrednio plików w `new-app-standards`** — konsolidacja i decyzja o promocji do reguły dzieje się wyłącznie w sesji nad repo `new-app-standards` (Część Y.8 GOD BOOK).

Format i zasada aktualizacji: nie usuwamy wpisów, tylko dopisujemy — tak jak reszta Biblii (Część D GOD BOOK).

## Co zapisywać, i pod jaką kategorią

- **BŁĄD** — decyzja architektoniczna/procesowa (ze standardu albo z GOD BOOK), która okazała się zła w praktyce, i dlaczego. Nie literówka — coś, co kosztowało realny czas albo spowodowało realny problem.
- **DOBRA PRAKTYKA** — rozwiązanie, które się sprawdziło, nieoczywiste, warte powtórzenia w innych projektach (nie "użyłem X" — coś specyficznego, co inaczej trzeba by wymyślić od nowa).
- **POMYSŁ NA REGUŁĘ** — luka zauważona w standardzie/GOD BOOK, którą warto rozważyć jako nową, uniwersalną zasadę.

**Nie zapisuj tutaj:** rzeczy trywialnych; specyficznych wyłącznie dla domeny *tego* projektu (te idą do `docs/memory.md`, nie tutaj); jednorazowych literówek.

## Format wpisu

```
[DD.MM.RRRR] KATEGORIA: [BŁĄD / DOBRA PRAKTYKA / POMYSŁ NA REGUŁĘ] — [krótki opis]
Szczegóły: [co się stało / na czym polega]
Dlaczego warto zgłosić do new-app-standards: [uogólnienie — dlaczego to dotyczy więcej niż tego projektu]
Status: 🔎 nowe / ✅ przekazane do new-app-standards (DD.MM.RRRR)
```

---

## Wpisy

<!-- Pierwszy wpis powstaje, gdy AI natrafi na coś wartego zgłoszenia — nie czekaj na "koniec projektu". -->

[06.09.2026] KATEGORIA: POMYSŁ NA REGUŁĘ — brak w standardzie procedury przetwarzania dostarczonych materiałów źródłowych (normy, PDF, skany, .doc/.docx)

Szczegóły: W tej sesji przetworzono ~10 dokumentów źródłowych (normy PN/IEC/EN/HD, materiały
branżowe/szkoleniowe) dostarczonych przez właściciela projektu w różnych formatach: PDF z natywnym
tekstem, PDF-skan wymagający OCR, stary binarny `.doc` (Word 95/97 — LibreOffice/`soffice` odmawiał
otwarcia, wymagał `antiword`+`wv`), oraz `.docx` (w tym konwersje z `.pptx` zrobione przez
użytkownika). Standard nie miał dotąd żadnej wytycznej co robić w tej sytuacji — cała metodologia
(rozpoznanie formatu, dobór narzędzia ekstrakcji, dyscyplina weryfikacji) została wypracowana
ad-hoc w trakcie sesji, z kilkoma realnymi wpadkami po drodze zanim ustaliła się właściwa procedura:
- pierwszy pojedynczy spot-check jednej strony normy (5-52, Załącznik B) dał fałszywe poczucie
  bezpieczeństwa — pełne przejście przez wszystkie 26 stron tego załącznika znalazło **~35 błędów**,
  w tym całe brakujące kolumny/wiersze danych (niewidoczne przy losowym sprawdzeniu, bo nie
  wyglądają jak błąd — po prostu jest mniej liczb niż powinno);
- `antiword` bez jawnie podanej mapy znaków (`-m 8859-2.txt`) dawał mojibake na polskich znakach;
- `wvHtml` (a nie sam `antiword`) był potrzebny do odzyskania realnej struktury tabel i osadzonych
  obrazów WMF (wzory matematyczne) z plików `.doc`;
- `.docx` z zachowanymi natywnymi tabelami Worda okazał się czasem **bardziej** wiarygodny niż
  odczyt wizualny tego samego dokumentu jako PDF (dla tabel-jako-tabel), ale **mniej** wiarygodny
  dla treści, która w oryginale była diagramem/SmartArt (te wychodzą jako puste komórki) — czyli
  która metoda jest "lepsza" zależy od tego, czym dana treść była w oryginale, nie od samego
  formatu pliku.
Pełny, samodzielny opis kroków i komend: `docs/propozycje-do-new-app-standards/przetwarzanie-materialow-zrodlowych.md`
w tym repo — surowy szkic, **nie jest częścią standardu**, czeka na konsolidację przez sesję
pracującą bezpośrednio nad repo `new-app-standards` (Część Y.8 GOD BOOK). Ten plik zawiera na
samej górze osobną sekcję **"PROMPT — gotowy do skopiowania i przekazania dowolnej innej sesji/
projektowi"** — skrócony, samodzielny blok bez uzasadnień/przykładów, do wzięcia 1:1 i przekazania
dalej innym projektom rodziny (albo poza nią) bez czekania na formalną promocję do reguły
standardu — sesja `new-app-standards` może go od razu ściągnąć i redystrybuować.

Dlaczego warto zgłosić do new-app-standards: każda aplikacja tej rodziny prędzej czy później
dostanie od właściciela dokument źródłowy (normę, specyfikację, materiał branżowy) w jednym z tych
formatów — bez tej procedury każda kolejna sesja/projekt odkrywa te same pułapki (LibreOffice nie
otwiera starych .doc, OCR bez pełnej weryfikacji daje fałszywe poczucie bezpieczeństwa, mojibake bez
jawnej mapy znaków) od nowa, tracąc czas i ryzykując ciche błędy w danych bezpieczeństwa-krytycznych.

Status: 🔎 nowe

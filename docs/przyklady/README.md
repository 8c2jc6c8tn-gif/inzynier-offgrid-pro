# docs/przyklady/ — konkretne, sprawdzone przykłady dla reguł standardu

> **Status: nie moduł opcjonalny (w odróżnieniu od `docs/biblioteka-norm/` i
> `docs/playbooki-opcjonalne/`, GOD BOOK Y.10) — dotyczy każdego projektu rodziny.**
> Każdy projekt prędzej czy później buduje CI; każdy projekt z i18n prędzej czy później
> potrzebuje mechanizmu strażniczego przed regresją. Kopiuj/adaptuj przy zwykłej
> synchronizacji (Y.9), bez warunku dopasowania.

Źródło: `inzynier-offgrid-pro`, zgłoszenie 16.09.2026 (`docs/wklad-do-standardu.md`, kategoria
DOBRA PRAKTYKA). Powód powstania: standard opisywał **co** ma być prawdą (11.2/11.5 — CI z audytem
podatności; 17.9 — mechanizm strażniczy i18n), ale bez żadnego konkretnego, zweryfikowanego
przykładu **jak** to zbudować — każdy projekt odkrywał te same pułapki od zera.

**Ważne: to przykłady do adaptacji, nie gotowe rozwiązania 1:1.** Kod w tym katalogu pochodzi z
konkretnego stacku (Next.js/TypeScript/pnpm) i konkretnego projektu — transferowalny jest **kształt
decyzji**, nie dosłowna treść pliku, choć dosłowna treść jest tu specjalnie zachowana (nie
uproszczona), bo pokazuje realne, przetestowane rozwiązanie, nie szkielet.

## Zawartość

- [`ci/`](ci/) — referencyjny CI (11.6: dwa niezależne joby, próg audytu na `high`/`critical`,
  procedura włączania bramki bez obniżania progu).
- [`i18n/`](i18n/) — mechanizm strażniczy i18n (17.11: AST zamiast regex, explicit allowlist
  modułów już zmigrowanych, złapana pułapka z wyrażeniami warunkowymi).
- [`PROMPT.md`](PROMPT.md) — skrócony, samodzielny blok do wklejenia jako pierwsza wiadomość nowej
  sesji AI budującej to od zera w innym projekcie rodziny, bez czekania na przeczytanie całego
  uzasadnienia wyżej.

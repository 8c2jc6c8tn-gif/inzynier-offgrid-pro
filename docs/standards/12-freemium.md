# 12 — Freemium i płatności

Powiązane: [06 API i sieć](06-api-i-siec.md) · [07 Bezpieczeństwo](07-bezpieczenstwo.md)

---

## 12.1. Podział free/pro jako dane

**Reguła.** Podział free/pro jest definiowany danymi — mapą `feature → tier` — nigdy rozsypanymi warunkami `if` po kodzie aplikacji.

**Uzasadnienie.** Zmiana zakresu darmowego/płatnego to wtedy zmiana danych konfiguracyjnych, nie polowanie po całym kodzie za każdym miejscem, które sprawdza uprawnienia.

## 12.2. Egzekwowanie po stronie serwera

**Reguła.** Limit tier'u jest egzekwowany po stronie serwera, nigdy tylko w warstwie UI klienta. UI może (i powinno) prezentować ograniczenie użytkownikowi wcześniej, dla dobrego UX — ale rzeczywista blokada musi istnieć również (i przede wszystkim) po stronie serwera, bo ograniczenie widoczne tylko w kliencie jest trywialne do obejścia.

## 12.3. Płatności

**Reguła.** Integracja płatności (np. Stripe) z kluczami idempotency przy każdym żądaniu płatności (patrz rozdział 06.4) — zapobiega podwójnemu obciążeniu przy powtórzeniu żądania w niestabilnych warunkach sieciowych (typowe w zastosowaniach terenowych). Restore/subskrypcje sklepów natywnych (App Store/Google Play) dochodzą dopiero w wersji mobile, nie są wymagane na starcie web.

## 12.4. Podział tier'ów — decyzja per projekt

Konkretny podział funkcji między FREE i PRO jest decyzją biznesową właściciela każdego projektu, nie częścią tego standardu — zapisz ją i jej uzasadnienie w `docs/memory.md` tego projektu, z datą zatwierdzenia.

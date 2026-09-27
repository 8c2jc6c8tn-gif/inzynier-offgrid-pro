# PN-EN ISO 14683 — Mostki cieplne w budynkach. Liniowy współczynnik przenikania ciepła. Metody uproszczone i wartości orientacyjne

**Status: ✅ pełny tekst, natywny PDF (nie skan), przeczytany w całości.** 27 stron, jasny druk,
bez błędów OCR do poprawiania (dokument nie jest skanem). Wersja: `(R) PN-EN ISO 14683:2007`
("Projekt roboczy", tłumaczenie PKN, wprowadza `EN ISO 14683:2007` = `ISO 14683:2007` IDT).

Plik: `PN-EN-ISO-14683-1-mostki-cieplne.pdf`.

**Uwaga o numerze normy:** plik nosi w treści oznaczenie `PN-EN ISO 14683` (bez części „-1” — to
jedna, niepodzielona norma, nie seria wieloczęściowa). Nazwa folderu/pliku `…-14683-1…` to nazwa
nadana przy przyjęciu materiału od właściciela projektu — jeśli w przyszłości pojawi się osobna
norma `ISO 14683-2` (dziś nieznana z treści), nie mylić jej z tą pozycją.

## Zakres normy (Rozdział 1)

Uproszczone metody obliczania strumienia ciepła przepływającego przez **liniowe mostki cieplne**
na złączach elementów budowlanych — katalog wymagań co do metod ręcznych/tabelarycznych oraz
**Załącznik A** z wartościami orientacyjnymi Ψ (informacyjny, nie normatywny w sensie obliczeń
dokładnych — zastępowany obliczeniami komputerowymi wg ISO 10211, gdy dostępne).

## Definicje kluczowe (Rozdz. 3)

- **Liniowy współczynnik przenikania ciepła Ψ** [W/(m·K)] — strumień ciepła w stanie ustalonym / (długość × różnica temperatur) — to jest wielkość, której szuka M6/E7 „Mostki cieplne" (patrz `docs/normy-brakujace.md`).
- **Punktowy współczynnik przenikania ciepła χ** [W/K] — analogicznie, dla mostków punktowych (kotwy, śruby przebijające izolację) — zwykle można zaniedbać (Rozdz. 4.2), chyba że są znaczące.
- Równanie główne (Rozdz. 4.2): `H_D = Σ A_i·U_i + Σ l_k·Ψ_k + Σ χ_j` — współczynnik przenoszenia ciepła przez przenikanie = udział ścian/dachu/podłóg (bez mostków) + udział mostków liniowych + udział mostków punktowych.
- **Trzy systemy wymiarowe** (Rozdz. 4.3): wewnętrzny / całkowity wewnętrzny (Ψ_i, Ψ_oi) / zewnętrzny (Ψ_e) — wartość Ψ zależy od wybranego systemu, ale suma H_T wychodzi ta sama, jeśli konsekwentnie zastosowany.

## Załącznik A — wartości orientacyjne Ψ (Tablica A.2, dokładność od 0% do 50% — najsłabsza z 4 metod, ale jedyna użyteczna bez pełnego projektu budowlanego)

Tablica A.2 podaje Ψ_e / Ψ_oi / Ψ_i (W/(m·K)) dla ~9 kategorii typowych złączy budynku
mieszkalnego, każda w 4 wariantach izolacji (ściana pełna / ściana lekka / z warstwą izolacyjną —
położenie zewn./środek/wewn./na całej grubości):

| Kategoria | Oznaczenia | Zakres Ψ_e (typowe) |
|---|---|---|
| Dachy (ściana↔dach) | R1–R12 | −0,05 do 0,65 |
| Balkony | B1–B4 | 0,70 do 0,95 |
| Narożniki (ściana↔ściana) | C1–C8 | −0,20 do 0,15 |
| Stropy pośrednie | IF1–IF8 | 0,00 do 0,95 |
| Ściany wewnętrzne↔zewnętrzne | IW1–IW6 | 0,00 do 0,95 |
| Podłogi na gruncie | GF1–GF8 | −0,05 do 0,65 |
| Podłogi podwieszone | GF9–GF16 | −0,10 do 0,75 |
| Słupy w ścianie zewnętrznej | P1–P4 | 0,90 do 1,30 |
| Otwory okienne/drzwiowe (nadproże/ościeże/podokiennik) | W1–W18 | 0,00 do 1,00 |

Parametry obliczeniowe przyjęte w tablicy (Tablica A.1) — istotne, by ocenić, czy wartości
orientacyjne są zbliżone do konstrukcji off-gridowej: ściana zewn. `d=300mm`, ściana z izolacją
`U=0,343 W/(m²K)`, `R_izol=2,5 m²K/W`, dach `U=0,365 W/(m²K)`, ościeżnice `d=60mm`. **Parametry
dobrane celowo tak, by dać wartości bliskie maksymalnym (przeszacowanie „na bezpieczną stronę"),
nie średnie** — norma to mówi wprost (koniec Rozdz. 5.5/Tablica A.1).

## Załącznik B — przykład liczbowy (w pełni odtworzony w PDF)

Budynek 10×5×2,5 m z płaskim dachem, podłogą na gruncie, 1 ścianą działową, 2 oknami, 1 drzwiami:
mostki cieplne odpowiadają za **42% całkowitego H_D** (wymiary wewnętrzne) / **36%** (wymiary
zewnętrzne) współczynnika przenoszenia ciepła przez przenikanie budynku. Po poprawieniu dwóch
detali (IW2→IW5, W8→W11 — lepsza izolacja przy ściance działowej i oknach) udział mostków spada
o 41% (z 69,85 do 41,50 W/K), a H_D całkowity o 17%. **To bezpośrednio pokazuje skalę problemu:
mostki cieplne to nie kosmetyka, to ~1/3–2/5 strat ciepła budynku** — istotne dla M6/M7
(zapotrzebowanie na ogrzewanie, dobór mocy dogrzewania off-grid).

## Dlaczego to jest potrzebne w tym projekcie

`docs/normy-brakujace.md`, sekcja 🟡, wpis PN-EN 12831-1: „Norma nadal potrzebna do: mostków
cieplnych (Ψ, M6/E7) […] współczynników strat do gruntu, zysków i nadwyżki mocy na nagrzewanie —
ekran jawnie ostrzega o ich braku." Ta norma (14683) to właśnie brakujące źródło Ψ — metoda
uproszczona + wartości tabelaryczne, bez konieczności obliczeń komputerowych ISO 10211. Odblokowuje
częściowo M6/E7 „Straty ciepła budynku — mostki cieplne" (dziś ekran jawnie ostrzega o ich
braku wg `docs/memory.md`/`docs/normy-brakujace.md`).

**Status wykorzystania: pozyskana i przeanalizowana (ta sesja), jeszcze niewykorzystana w
kodzie** — implementacja w `lib/core/modules/ogrzewanie/` (M6) czeka na osobną sesję/zadanie.

# Indeks — PN-EN 1995-1-1:2010 (Eurokod 5 — Konstrukcje drewniane, Reguły ogólne)

Źródło: `document-download (kopia).pdf` (skan/kopia z obiegu studenckiego Studocu, Politechnika
Gdańska, 131 stron). Dokument tekstowy natywnie. Treść surowa:
[`01-tresc-surowa.txt`](01-tresc-surowa.txt) (~10 tys. linii, pełny tekst normy z uwagami
krajowymi PKN).

## Trafność w domenie off-grid PV — **wątpliwa, poza rdzeniem tego projektu**

Ten projekt to kalkulator systemów PV off-grid (panele, magazyn energii, ogrzewanie,
bezpieczeństwo instalacji elektrycznej) — Eurokod 5 to norma projektowania nośnych konstrukcji
**drewnianych** (belki, wiązary, elementy więźby dachowej). Jedyny realny punkt styku z tym
projektem: konstrukcja wsporcza pod panele PV montowana na drewnianej więźbie/dachu — ale to
zagadnienie inżynierii budowlanej, nie elektrycznej/energetycznej, i obecnie **żaden moduł
w `docs/rejestr-pokrycia.md` nie obejmuje doboru konstrukcji wsporczej wg Eurokodu**.

## Status wykorzystania

Przeanalizowany (ekstrakcja tekstu), **niewykorzystany w kodzie i najprawdopodobniej nie będzie
potrzebny w tym projekcie** — to ogólny standard konstrukcyjny, nie specyficzny dla off-grid PV.
Patrz rekomendacja końcowa w `docs/zrodla/README.md` ("Materiały z folderu New-info — rekomendacja
przekazania do new-app-standards").

## Weryfikacja ekstrakcji (25.09.2026)

Tekst natywny, poprawny. Symbole z fontów symbolicznych (216 znaków z prywatnego obszaru Unicode)
zamienione na greckie litery wg tablicy fontu (σ, β, α, γ, ρ, τ, μ, π, η, ψ, ν). **50 wystąpień znaku
U+F06C zostawiono jako `[λ|ℓ]`/`[ℓ?]`** — ten sam kod oznacza λ (font Symbol) albo ℓ (font MT-Extra),
a pozycja w pliku tekstowym nie pozwala rozstrzygnąć bez PDF. Złożone wzory (ułamki, pierwiastki)
rozsypane — przed użyciem sprawdzić w PDF. Poza rdzeniem projektu, pełna weryfikacja nie była celem.

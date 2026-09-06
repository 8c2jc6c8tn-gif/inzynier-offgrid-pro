# Indeks — PN-EN 60445:2010 ("Zasady podstawowe i bezpieczeństwa przy współdziałaniu człowieka z maszyną, znakowanie i identyfikacja — Identyfikacja zacisków urządzeń i zakończeń przewodów")

Źródło: `docs/zrodla/norma-PN-EN-60445/PN-EN-60445-2010-Identyfikacja-zaciskow-urzadzen.pdf`
(zakupiona, oficjalna licencja PKN dla Polskiej Izby Inżynierów Budownictwa, 16 stron, **skan**).
Metoda ekstrakcji: **bezpośredni odczyt wizualny wszystkich 16 stron** (dokument krótki — czytelniej
i pewniej niż OCR+weryfikacja dla tak małego pliku). Odpowiada IEC 60445 (4. wydanie).

## ✅ To jest dokładnie norma potrzebna dla M5/Ekran 20 ("Oznakowanie obwodów")

Potwierdzone w `docs/rejestr-pokrycia.md:163` jako "inna norma, PN-EN 60445" blokująca ten ekran.
Treść krótka i kompletna (11 stron merytorycznych + 1 strona bibliografii + załącznik ZA) —
zweryfikowana w całości, żadnych brakujących fragmentów.

## Treść

**Zakres:** identyfikacja i oznaczanie zacisków wyposażenia (rezystory, bezpieczniki topikowe,
przekaźniki, styczniki, transformatory, maszyny wirujące) oraz zakończeń przewodów.

**Definicje (rozdz. 3):** przewód wyrównawczy funkcjonalny, przewód uziemiający funkcjonalny,
przewód liniowy, przewód środkowy, przewód neutralny, przewód PEL/PEM/PEN, przewód połączenia
ochronnego (uziemiony PBE / nieuziemiony PBU), przewód ochronny (PE).

**Sposoby identyfikacji (rozdz. 4-5):** rozmieszczenie geometryczne zacisków; kodowanie kolorem
(zgodnie z IEC 60446); symbole graficzne (zgodne z IEC 60417/60617); kod alfanumeryczny (rozdz. 6).

**Zasady kodu alfanumerycznego (rozdz. 6):** wielkie litery łacińskie + cyfry arabskie; litery dla
elementów DC z pierwszej części alfabetu, dla AC z drugiej; nie stosować liter I oraz O (pomyłka z
1 i 0); dwa zakończenia elementu: liczba nieparzysta < parzysta (np. 1 i 2); punkty pośrednie:
liczby większe niż końcowe, kolejno rosnące (3, 4...); zestawy podobnych elementów: litery
poprzedzające liczby (U,V,W dla faz trójfazowych) albo liczby oddzielone kropką (1.1, 1.2 / 2.1,
2.2); podobne zestawy z tymi samymi oznaczeniami literowymi: liczby poprzedzające litery.

### Tablica 1 — Znakowanie zacisków urządzeń przeznaczonych do przyłączenia określonych żył przewodów

| Oznaczenie żyły przewodu | Oznakowanie zacisku urządzenia | Znak graficzny (nr IEC 60417) |
|---|---|---|
| Przewody a.c. (napięcie przemienne) | — | ∼ (5032) |
| — Faza 1 (L1) | U | |
| — Faza 2 (L2) | V ᵃ | |
| — Faza 3 (L3) | W ᵃ | |
| — Przewód środkowy (M) | M | |
| — Przewód neutralny (N) | N | |
| Przewody d.c. (napięcie stałe) | — | ⎓ (5031) |
| Przewód dodatni (L+) | + | ➕ (5005) |
| Przewód ujemny (L−) | − | ➖ (5006) |
| Przewód ochronny (PE) | PE | ⏚ (5019) |
| — przewód PEN | PEN | |
| — przewód PEL | PEL | |
| — przewód PEM | PEM | |
| Przewód połączenia ochronnego (PB) ᶜ | PB | (symbol trójkąta uziemienia, 5021) |
| — uziemiony (PBE) | PBE | |
| — nieuziemiony (PBU) | PBU | |
| Przewód uziemiający funkcjonalny (FE) ᵈ | FE | ⏚ z dodatkowym oznaczeniem (5018) |
| Przewód wyrównawczy funkcjonalny (FB) | FB | (symbol uziemienia bez trójkąta, 5020) |

ᵃ Wymagane tylko w systemach z więcej niż jedną fazą. ᶜ Przewód połączenia ochronnego jest w
większości przypadków przewodem uziemionym — nie jest konieczne oznaczanie PBE, chyba że trzeba
jednoznacznie odróżnić od PBU (wtedy zaleca się oba kody). ᵈ Żadne wyróżnienie FE ani znak graficzny
5018 nie powinny być stosowane dla przewodu/zacisku pełniącego funkcję ochronną.

**Rysunki 1-6 (przykłady):** pojedynczy element z 2 zaciskami (numeracja 1/2); element z 4 zaciskami
(2 końcowe + 2 pośrednie: 1,2 końcowe, 3,4 pośrednie); urządzenie trójfazowe z 6 zaciskami (U1,V1,W1
/ U2,V2,W2); urządzenie trójelementowe z 12 zaciskami (numeracja 1.1-1.4, 2.1-2.4, 3.1-3.4);
urządzenie z grupą elementów (1U,1V,1W/2U,2V,2W dla dwóch zestawów trójfazowych; 1C1,1D1/2C1,2D1
dla układu dwufazowego); połączenie zacisków urządzenia z oznakowanymi żyłami (schemat pełnej
instalacji: L1,L2,L3,N,PE → zaciski silnika trójfazowego przez falownik, z oznaczeniami PE1/PE2/PE,
N, W1/W2/W, V1/V2/V, U1/U2/U).

## Bibliografia

IEC 60050-195:1998 (Międzynarodowy słownik elektrotechniczny, część 195: uziemienia i ochrona przed
porażeniem); IEC 61666:1997 (Identyfikacja zacisków w systemie przemysłowym, zharmonizowana jako
EN 61666:1997 bez modyfikacji).

## Status wykorzystania w projekcie

Na 05.09.2026: dostarczony, przeanalizowany, kompletny (dokument krótki, w całości zweryfikowany
wizualnie). Niewykorzystany jeszcze w kodzie — odblokowuje M5/Ekran 20 ("Oznakowanie obwodów").

# Załącznik A (normatywny) — Metoda wyznaczania współczynnika k w 543.1.2

Zakres: str. 21-23 (PDF, liczone od 0). Patrz także IEC 60724 oraz IEC 60949. Metoda ekstrakcji:
tekst natywny PDF; wszystkie tabele zweryfikowane wizualnie względem `page_021.png`,
`page_022.png`, `page_023.png` (uwaga: ekstrakcja tekstu z tego dokumentu odczytuje grecką literę
ρ jako łacińskie „r” — poprawione tutaj na ρ).

## Wzór

Współczynnik k jest wyznaczony z następującej zależności:

**k = √[ (Q_c·(β+20°C) / ρ₂₀) · ln(1 + (θ_f − θ_i)/(β+θ_i)) ]**

gdzie:
- **Q_c** — pojemność cieplna objętościowa materiału przewodu (J/°C·mm³) w temperaturze 20 °C,
- **β** — odwrotność współczynnika temperaturowego rezystywności przewodu w temperaturze 0 °C,
- **ρ₂₀** — rezystywność materiału przewodu w temperaturze 20 °C (Ω·mm),
- **θ_i** — temperatura początkowa przewodu (°C),
- **θ_f** — temperatura końcowa przewodu (°C).

### Tablica A.54.1 — Wartości parametrów dla różnych materiałów

| Materiał | β, °C ᵃ | Q_c, J/°C·mm³ ᵇ | ρ₂₀, Ω·mm | √[Qc(β+20°C)/ρ₂₀] = A(√s), A/mm² |
|---|---|---|---|---|
| Miedź | 234,5 | 3,45 × 10⁻³ | 17,241 × 10⁻⁶ | 226 |
| Aluminium | 228 | 2,5 × 10⁻³ | 28,264 × 10⁻⁶ | 148 |
| Ołów | 230 | 1,45 × 10⁻³ | 214 × 10⁻⁶ | 41 |
| Stal | 202 | 3,8 × 10⁻³ | 138 × 10⁻⁶ | 78 |

ᵃ Wartości pochodzące z Tablicy 1 w IEC 60287-1-1. ᵇ Wartości pochodzące z Tablicy E2 w
IEC 60853-2.

### Tablica A.54.2 — Wartości k dla przewodów ochronnych izolowanych; nie stanowiących żyły przewodu i nie będących elementem wiązki innych przewodów

| Izolacja przewodu | Temp. początkowa, °C ᵇ | Temp. końcowa, °C ᵇ | k — Miedź | k — Aluminium | k — Stal |
|---|---|---|---|---|---|
| 70 °C PVC | 30 | 160/140 ᵃ | 143/133 ᵃ | 95/88 ᵃ | 52/49 ᵃ |
| 90 °C PVC | 30 | 160/140 ᵃ | 143/133 ᵃ | 95/88 ᵃ | 52/49 ᵃ |
| 90 °C termoutwardzalny (XLPE, EPR) | 30 | 250 | 176 | 116 | 64 |
| 60 °C guma | 30 | 200 | 159 | 105 | 58 |
| 85 °C guma | 30 | 220 | 166 | 110 | 60 |
| Guma silikonowa | 30 | 350 | 201 | 133 | 73 |

ᵃ Niższa wartość dotyczy przewodów izolowanych PVC o przekroju większym niż 300 mm². ᵇ
Temperatury graniczne dla różnych rodzajów izolacji podane są w IEC 60724.

### Tablica A.54.3 — Wartości k dla przewodów ochronnych gołych mających styczność z powłoką przewodu i nie będących elementem wiązki innych przewodów

| Powłoka przewodu | Temp. początkowa, °C ᵃ | Temp. końcowa, °C ᵃ | k — Miedź | k — Aluminium | k — Stal |
|---|---|---|---|---|---|
| PVC | 30 | 200 | 159 | 105 | 58 |
| Polietylen | 30 | 150 | 138 | 91 | 50 |
| CSP (guma odporna na olej) | 30 | 220 | 166 | 110 | 60 |

ᵃ Temperatury graniczne dla różnych rodzajów izolacji podane są w IEC 60724.

### Tablica A.54.4 — Wartości k dla przewodów ochronnych wykonanych jako rdzeń w przewodach lub stanowiących element wiązki z innymi przewodami, lub przewody izolowane

| Izolacja przewodu | Temp. początkowa, °C ᵇ | Temp. końcowa, °C ᵇ | k — Miedź | k — Aluminium | k — Stal |
|---|---|---|---|---|---|
| 70 °C PVC | 70 | 160/140 ᵃ | 115/103 ᵃ | 76/68 ᵃ | 42/37 ᵃ |
| 90 °C PVC | 90 | 160/140 ᵃ | 100/86 ᵃ | 66/57 ᵃ | 36/31 ᵃ |
| 90 °C termoutwardzalny (XLPE, EPR) | 90 | 250 | 143 | 94 | 52 |
| 60 °C guma | 60 | 200 | 141 | 93 | 51 |
| 85 °C guma | 85 | 220 | 134 | 89 | 48 |
| Guma silikonowa | 180 | 350 | 132 | 87 | 47 |

ᵃ Niższa wartość dotyczy przewodów izolowanych PVC o przekroju większym niż 300 mm². ᵇ
Temperatury graniczne dla różnych rodzajów izolacji podane są w IEC 60724.

### Tablica A.54.5 — Wartości k dla przewodów ochronnych wykonanych jako metalowa warstwa, np. pancerz, metalowa powłoka, przewód koncentryczny itp.

| Izolacja przewodu | Temp. początkowa, °C ᵃ | Temp. końcowa, °C | k — Miedź | k — Aluminium | k — Ołów | k — Stal |
|---|---|---|---|---|---|---|
| 70 °C PVC | 60 | 200 | 141 | 93 | 26 | 51 |
| 90 °C PVC | 80 | 200 | 128 | 85 | 23 | 46 |
| 90 °C termoutwardzalny (XLPE, EPR) | 80 | 200 | 128 | 85 | 23 | 46 |
| 60 °C guma | 55 | 200 | 144 | 95 | 26 | 52 |
| 85 °C guma | 75 | 220 | 140 | 93 | 26 | 51 |
| Mineralny kryty ᵇ PVC | 70 | 200 | 135 | – | – | – |
| Mineralna osłona | 105 | 250 | 135 | – | – | – |

ᵃ Ograniczenia temperatury dla różnych rodzajów izolacji podane są w IEC 60724. ᵇ Wartość ta może
być także stosowana dla gołych przewodów z możliwością ich dotknięcia i styku z materiałem
palnym.

### Tablica A.54.6 — Wartość k dla gołych przewodów, gdy nie ma ryzyka uszkodzenia sąsiedniego materiału na skutek podanej temperatury

| Warunki | Temp. początkowa, °C | k — Miedź | Temp. maksymalna — Miedź, °C | k — Aluminium | Temp. maksymalna — Aluminium, °C | k — Stal | Temp. maksymalna — Stal, °C |
|---|---|---|---|---|---|---|---|
| Widoczne i w ograniczonych obszarach | 30 | 228 | 500 | 125 | 300 | 82 | 500 |
| Warunki normalne | 30 | 159 | 200 | 105 | 200 | 58 | 200 |
| Niebezpieczeństwo pożaru | 30 | 138 | 150 | 91 | 150 | 50 | 150 |

## Uwaga o modyfikacjach nazw izolacji (Załącznik krajowy NA)

W wersji IEC 60364-5-54:2002 nazwy w kolumnie "Izolacja przewodu" wierszy 3 tabel A.54.2, A.54.4,
A.54.5 brzmiały krótko "90 °C termoutwardzalny" (bez dopisku), a w Tablicy A.54.3 wiersz 3 brzmiał
tylko "CSP" (bez rozwinięcia "guma odporna na olej"). HD dodał wyjaśniające dopiski — wartości
liczbowe identyczne, patrz `01-przedmowa-krajowa-zalacznik-NA-NB.md`.

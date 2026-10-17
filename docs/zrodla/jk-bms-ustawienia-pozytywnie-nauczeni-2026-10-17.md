# Ustawienia JK BMS — autor „Pozytywnie nauczeni” (dane źródłowe, 17.10.2026)

**Pochodzenie:** tabela „LiFePO4 314Ah — PARAMETRY BMS” pokazana na filmie autora „Pozytywnie nauczeni” (zrzut ekranu przesłany przez właściciela 17.10.2026; adresu filmu brak). Wartości przepisane ze zrzutu bez zmian. Zestaw dotyczy BMS typu **JK** (potwierdzone przez właściciela: „to dla JK BMS”). Dopisek na zrzucie (zielony, dodany na filmie): przy „Start balance volt” stoi **„3,45 V lub”** obok 3,40 V — autor dopuszcza 3,45 V jako wariant.

**Status danych:** dane autora, nie rekomendacja aplikacji. Aplikacja ich nie ocenia jako „poprawnych” — pokazuje je z oznaczeniem autora i porównuje z zakresami z `docs/zrodla/Uzupelnienie_Modul_11_Montaz_16S_Praktyczny.md` (Krok 3.3, tabela kontrolna).

| Parametr (nazwa jak w aplikacji JK) | Wartość | Jednostka | Uwaga |
|---|---|---|---|
| Cell Count | 16 | szt. | liczba ogniw w szeregu (16S) |
| Battery Capacity | 314 | Ah | |
| Start balance volt | 3,40 (alternatywa autora: 3,45) | V/ogniwo | próg startu balansowania |
| Max Balanced | 2,0 | A | prąd balansera |
| Cell OVP | 3,600 | V/ogniwo | zabezpieczenie nadnapięciowe ogniwa |
| VOL. Cell RCV | 3,525 | V/ogniwo | **do potwierdzenia w instrukcji JK** (prawdopodobnie „Cell Request Charge Voltage” — napięcie ładowania żądane od falownika) |
| SOC-100% | 3,450 | V/ogniwo | **do potwierdzenia w instrukcji JK** (napięcie, przy którym BMS ustawia SoC = 100%) |
| Cell OVPR | 3,400 | V/ogniwo | powrót po OVP (histereza 0,200 V) |
| CELL UVPR | 2,800 | V/ogniwo | powrót po UVP (histereza 0,150 V) |
| SOC-0% | 2,700 | V/ogniwo | **do potwierdzenia w instrukcji JK** (napięcie, przy którym BMS ustawia SoC = 0%) |
| Cell UVP | 2,650 | V/ogniwo | zabezpieczenie podnapięciowe ogniwa |
| Power Off Vol. | 2,600 | V/ogniwo | wyłączenie BMS |
| Vol. Cell RFV | 3,350 | V/ogniwo | **do potwierdzenia w instrukcji JK** (prawdopodobnie „Cell Request Float Voltage”) |
| Vol. Smart Sleep | 3,300 | V/ogniwo | **do potwierdzenia w instrukcji JK** (działanie progu uśpienia niepewne) |
| Continued Charge | 100,0 | A | ciągły prąd ładowania |
| Continued Discharge | 100,0 | A | ciągły prąd rozładowania |
| Charge UTPR | 5 | °C | powrót po zabezpieczeniu niskotemperaturowym ładowania |
| Charge UTP | 5 | °C | zabezpieczenie niskotemperaturowe ładowania |

**Wartości pochodne (do policzenia przez silnik, nie wpisane tutaj ręcznie):** napięcie pakietu = napięcie ogniwa × 16 (np. OVP 57,6 V, UVP 42,4 V); prąd ładowania 100 A / 314 Ah ≈ 0,32 C.

**Rozpoznane cechy zestawu (z oceny 17.10.2026, plik `analizy/ocena-ustawien-bms-lifepo4-314ah-2026-10-17.md` w folderze projektu):** kolejność progów poprawna; **Charge UTPR = Charge UTP = 5 °C (brak histerezy temperatury)**; zapas OVP − RCV = 75 mV; start balansu 3,40 V pokrywa się z OVPR 3,40 V.

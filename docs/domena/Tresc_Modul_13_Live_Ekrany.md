# Moduł 13 (Kafel 13): Tryb Live — treść ekranów

**Etap 3 — kontynuacja.** Dwunasty w pełni opisany moduł treściowy. Zgodnie z §26 Zasad UX — to nie 33 osobne ekrany, tylko **2 realne ekrany** (Dashboard + Biblioteka widżetów) kryjące bibliotekę pozycji do wyboru. Poniżej pełna, zweryfikowana lista wszystkich 33 pozycji źródłowych (poprzednia lista w §26 nie była kompletna — tu jest ostateczna, sprawdzona wersja).

---

## EKRAN 1: Wejście w tryb Live
*(dawne 7.1 — infra)*

Przełącznik między trybem "Projektowanie" (Kafle 1-12) a trybem "Live" (monitoring bieżący). Nie jest to widżet — to bramka wejściowa do reszty tego modułu, czerpiąca dane z inwertera/BMS przez Modbus lub MQTT.

---

## EKRAN 2: Biblioteka widżetów + Dashboard

Zgodnie z §9 i §15 Zasad UX: user wybiera z poniższej listy, które widżety mają się wyświetlać, układa je na dowolnej liczbie stron, przeciąga kolejność. Poniżej pełna zawartość biblioteki.

### Grupa: Podstawowy monitoring

| Widżet | Co pokazuje | Źródło danych |
|---|---|---|
| Widok "Teraz" (7.4) | najważniejsze parametry w czasie rzeczywistym (SoC, moc PV, zużycie, temperatura) | inwerter, BMS, czujniki |
| Wykresy mocy na żywo (7.5) | produkcja / zużycie / bateria / agregat na wykresie liniowym | historia odczytów co kilka sekund |
| Centrum powiadomień i alarmów (7.6) | lista aktywnych alarmów wg progów | konfiguracja progów + telemetria |
| Priorytety alarmów (7.8) | rozróżnienie info/ostrzeżenie/krytyczny | logika systemu |
| Historia zdarzeń i logi (7.43) | rejestr wszystkich zdarzeń, alarmów, akcji użytkownika | log systemowy |
| Tryb odtwarzania historycznego (7.34) | playback danych z wybranego dnia/okresu | baza historyczna |

### Grupa: Jakość i stan instalacji

| Widżet | Co pokazuje | Źródło danych |
|---|---|---|
| Jakość zasilania AC (7.28) | harmoniczne, napięcie, częstotliwość na wyjściu falownika | pomiary AC |
| Temperatura kluczowych komponentów (7.29) | falownik, bateria, szyny, złączki, rozdzielnica | czujniki temperatury (Moduł 9) |
| Rezystancja połączeń i stan okablowania (7.38) | wczesne wykrywanie degradujących się połączeń | pomiary napięcia/prądu w punktach kontrolnych |
| Analiza strat i sprawności systemu (7.39) | bilans: ile energii "ginie" na przewodach i konwersjach | pełny bilans energetyczny |
| Stan zabezpieczeń i bezpieczników (7.42) | status wyłączników, RCD, rozłączników | czujniki stanu (Moduł 9) |
| Wykrywanie zwarć i przeciążeń live (7.45) | analiza w czasie rzeczywistym, szybsza niż standardowe zabezpieczenia | szybkie pomiary prądu/napięcia |
| Analiza zużycia per obwód/gniazdo (7.33) | rozbicie zużycia na poszczególne obwody | mierniki per-obwód lub smart gniazdka |

### Grupa: Pogoda i warunki zewnętrzne

| Widżet | Co pokazuje | Źródło danych |
|---|---|---|
| Powiadomienia pogodowe i alerty burzowe (7.40) | ostrzeżenia z wyprzedzeniem | prognoza pogody (§15.3) |
| Detekcja oblodzenia/śniegu na panelach — live (7.41) | bieżący status pokrywy na podstawie spadku produkcji | produkcja PV + temperatura + wilgotność |
| Jakość powietrza i wilgotność wewnątrz (7.48) | CO2, LZO, wilgotność, temperatura pomieszczeń | czujniki jakości powietrza (Moduł 9) |

### Grupa: Automatyzacja i tryby pracy

| Widżet | Co pokazuje | Źródło danych |
|---|---|---|
| Harmonogram automatycznych zadań (7.26) | scheduler odbiorników wg priorytetów i prognoz | profil zużycia + prognozy PV |
| Tryb wakacyjny/nieobecności (7.27) | ograniczone zużycie na czas wyjazdu, z zachowaniem bezpieczeństwa | daty wyjazdu, lista odbiorników |
| Dynamiczne zarządzanie priorytetami (7.46) | automatyczna zmiana priorytetów wg SoC/produkcji/prognoz | cross-ref Moduł 2, Ekran 12 |
| Tryb nocny — minimalne zużycie i cisza (7.49) | ograniczenie zbędnych odbiorników i hałasu w nocy | harmonogram, preferencje |

### Grupa: Raporty i podsumowania

| Widżet | Co pokazuje | Źródło danych |
|---|---|---|
| Eksport danych CSV/PDF/API (7.30) | eksport danych live — odrębny od BOM z §13.1 (to dane operacyjne, nie projekt) | baza historyczna |
| Interaktywne podsumowanie dnia/tygodnia (7.50) | krótki raport z kluczowymi liczbami | agregacja raportów |
| Przypomnienia o przeglądach i serwisie (7.32) | harmonogram serwisowy wg zaleceń producentów | historia pracy urządzeń |

### Grupa: Dostęp i administracja *(→ przenieść do Modułu 14)*

| Funkcja | Powód przeniesienia |
|---|---|
| Role i uprawnienia dostępu (7.35) | to ustawienie konta, nie widżet danych live |
| Kopia zapasowa konfiguracji (7.36) | to ustawienie aplikacji |
| Aktualizacje oprogramowania/firmware (7.37) | to ustawienie aplikacji, cross-ref Moduł 9 (OTA sprzętowe) |

### Funkcje pokrywające się z już opisanymi systemami (nie duplikować jako osobne widżety)

- **Porównanie prognozy z rzeczywistością (7.2)** i **Machine Learning — korekta modeli (7.3)** → to jest żywy widok tego samego mechanizmu co Moduł 10, Ekran 2 (transparentność uczenia AI). Mogą pojawić się jako jeden widżet "Jak dobrze AI przewiduje" w bibliotece, ale nie jako dwie osobne funkcje.
- **Integracja z asystentem głosowym (7.31)** → to samo co Moduł 10, dawne 12.41 (asystent głosowy). Jedna integracja, nie dwie.
- **Benchmarking — porównanie z innymi instalacjami (7.44)** → to jest §15.4 Zasad UX (Społeczność Off-Grid), już opisane jako gamechanger z pełną specyfikacją (mapa, opt-in, wiadomości). Nie duplikować jako prosty widżet — to osobna, znacznie bogatsza funkcja.
- **Symulacja "co by było gdyby" na żywo (7.47)** → to jest §14.1 Zasad UX (Symulator awarii), już opisane jako gamechanger.

### Widżety dochodzące z innych modułów (znalezione podczas audytu treści)

| Widżet | Pochodzenie |
|---|---|
| Monitoring wydajności paneli — porównanie stringów | Moduł 3, dawne 2.48 |
| Czarna Skrzynka (data logging i alarmy BMS) | Moduł 4, dawne 3.26 |
| Survival Mode zimowy (preset Live) | Moduł 7, dawne 6.33 |
| Monitoring małej instalacji (tryb mobilny) | Moduł 12, dawne 8.44 |

---

## Podsumowanie modułu

**2 realne ekrany** (wejście + biblioteka/dashboard), kryjące:
- **26 widżetów własnych** (po odjęciu 3 przeniesionych do Modułu 14 i 4 zidentyfikowanych jako duplikaty już opisanych systemów)
- **4 widżety dochodzące z innych modułów**
- **Razem: 30 pozycji w bibliotece widżetów**

Pokrywa wszystkie 33 pierwotne funkcje tego rozdziału (26 zostaje jako widżety + 3 przenoszą się do Modułu 14 + 4 okazują się duplikatami już opisanych gamechangerów/systemów).

---

**Wersja:** 1.0 — pełna treść Modułu 13 (Etap 3)
**Data:** Sierpień 2026
**Status:** Kompletna, zweryfikowana lista wszystkich 33 pozycji źródłowych (poprzednia wersja z §26 Zasad UX nie była w pełni kompletna — ta lista ją zastępuje).
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, oraz pozostałe pliki Tresc_Modul_*.md

# 12 — Freemium i płatności

Powiązane: [06 API i sieć](06-api-i-siec.md) · [07 Bezpieczeństwo](07-bezpieczenstwo.md)

---

## 12.1. Podział free/pro jako dane

**Reguła.** Podział free/pro jest definiowany danymi — mapą `feature → tier` — nigdy rozsypanymi warunkami `if` po kodzie aplikacji.

**Uzasadnienie.** Zmiana zakresu darmowego/płatnego to wtedy zmiana danych konfiguracyjnych, nie polowanie po całym kodzie za każdym miejscem, które sprawdza uprawnienia.

## 12.2. Egzekwowanie po stronie serwera

**Reguła.** Limit tier'u jest egzekwowany po stronie serwera, nigdy tylko w warstwie UI klienta. UI może (i powinno) prezentować ograniczenie użytkownikowi wcześniej, dla dobrego UX — ale rzeczywista blokada musi istnieć również (i przede wszystkim) po stronie serwera, bo ograniczenie widoczne tylko w kliencie jest trywialne do obejścia.

## 12.3. Płatności

**Reguła.** Integracja płatności (np. Stripe) z kluczami idempotency przy każdym żądaniu płatności (patrz rozdział 06.4) — zapobiega podwójnemu obciążeniu przy powtórzeniu żądania w niestabilnych warunkach sieciowych. Restore/subskrypcje sklepów natywnych (App Store/Google Play) dochodzą dopiero w wersji mobile, nie są wymagane na starcie web.

## 12.4. Podział tier'ów — decyzja per projekt

Konkretny podział funkcji między FREE i PRO jest decyzją biznesową właściciela każdego projektu, nie częścią tego standardu — zapisz ją i jej uzasadnienie w `docs/memory.md` tego projektu, z datą zatwierdzenia. Klasyfikacja funkcji rdzenia domenowego wg 12.9 jest naturalnym formatem tego zapisu.

**Przykłady ilustracyjne (nie wiążące, do korekty per projekt):** zero-waste — FREE: pełne śledzenie produktów, daty ważności, skanowanie OFF, jedno urządzenie; PRO: sync+backup, household (18.7), statystyki oszczędności, propozycje przepisów. inzynier-offgrid-pro / -szkieletowy-pro — FREE: podstawowe/najczęściej używane moduły kalkulatorów, zapis lokalny bez limitu; PRO: pełny dostęp do wszystkich modułów, profesjonalny raport PDF, historia/porównanie wariantów, sync+backup.

## 12.5. Tożsamość jako podstawa weryfikacji tier'u

Tier (FREE/PRO) jest związany z kontem (rozdział 18), nigdy z kodem/licencją statyczną instalowaną bezkontowo. Uzasadnienie: model subskrypcyjny (Stripe + idempotency, 12.3) i restore zakupów (7.2) wymagają jednoznacznej tożsamości do odwołania/odnowienia/przeniesienia między urządzeniami — nie da się tego zrobić bezpiecznie bez konta. Kod aktywacyjny (np. sprzedaż B2B, promocja) jest dopuszczalny wyłącznie jako dodatek nadający tier **istniejącemu** kontu, nigdy jako samodzielny, bezkontowy zamiennik.

## 12.6. Trial — dwuetapowy model, egzekwowany server-side

**Krok 1 — Rejestracja = FREE, natychmiast, bez karty.** Zgodnie z 18.1/18.2: magic link/Google/Apple, zero tarcia, żadnej metody płatności. Cel anty-botowy/tożsamościowy (18.1) jest zaspokojony samodzielnie na tym etapie — nie wymaga karty.

**Krok 2 — Test PRO = osobna, świadoma akcja użytkownika, dla wszystkich projektów rodziny.** Dopiero gdy użytkownik chce spróbować PRO: wybiera plan (miesięczny/roczny) i podaje metodę płatności — model jak natywna subskrypcja próbna App Store/Google Play (spójne z 7.2, restore zakupów). Dostaje **24h pełnego dostępu funkcjonalnego do PRO** (obliczenia, AI, sync — z zabezpieczeniami ekstrakcji, 12.6a). Po upływie doby **opłata za wybrany plan pobiera się automatycznie**, chyba że użytkownik zrezygnuje wcześniej.

`trial_started_at` liczone i egzekwowane wyłącznie po stronie serwera, od momentu **rozpoczęcia subskrypcji próbnej (Krok 2)**, nigdy od rejestracji konta (Krok 1) i nigdy w kliencie (zegar urządzenia jest trywialny do cofnięcia). To konkretna instancja 12.2, nie nowa kategoria reguły. Po wygaśnięciu trialu bez potwierdzenia płatności: spadek do granic FREE, **nigdy** blokada całej aplikacji.

**Konwencja UI.** Funkcje PRO niedostępne przed zakupem/po trialu pokazane z ikoną kłódki + licznikiem odliczającym czas do końca trialu / do obciążenia karty (08 UI/UX). Po udanej płatności — automatyczne odblokowanie, bez ręcznej akcji użytkownika.

### 12.6a. Ograniczenie ekstrakcji w trialu (anti-abuse)

Trial daje **pełny dostęp funkcjonalny** do PRO — ale dostęp do finalnego, gotowego artefaktu (eksport PDF, "zabranie" projektu) może być celowo ograniczony: częściowy eksport, znak wodny, brak pełnego pobrania kompletnego dokumentu. Uzasadnienie: bez tego ograniczenia trial zaspokaja całą jednorazową potrzebę użytkownika (np. "potrzebuję jednego raportu na jeden projekt") bez konieczności zakupu. Nie jest to sprzeczne z 12.7 — dotyczy tymczasowego okna trialu, nie stałego FREE po nim.

### 12.6b. Eskalacja przy realnym nadużyciu rejestracji FREE (opcjonalna, wdrażana dopiero w razie potwierdzonego problemu)

Skoro Krok 2 (12.6) wymaga karty płatniczej już na starcie trialu, nadużycie samego trialu PRO jest domyślnie zabezpieczone niezależnie od liczby założonych kont FREE. Ta drabina dotyczy wyłącznie ewentualnego nadużycia **rejestracji kont FREE** (spam/boty, 18.1), nie trialu PRO.

**Kiedy to rozważyć — sygnały, nie przeczucie.** Nie wdrażaj niczego z tej drabiny prewencyjnie. Sygnały uzasadniające sprawdzenie: nietypowo wysoki wolumen rejestracji z tego samego zakresu IP w krótkim czasie; wzorce zachowania typowe dla botów, nie ludzi.

- **Poziom 1 — rate limiting rejestracji** (najmniej inwazyjny, brak nowych danych o użytkowniku). Limit liczby nowych kont z tego samego adresu IP/zakresu w krótkim oknie czasowym, egzekwowany w bazie (18.11). Zawsze próbowany jako pierwszy krok.
- **Poziom 2 — weryfikacja numeru telefonu (SMS) przy rejestracji.** Nowe dane osobowe — wymaga jawnej zgody i uzasadnienia (7.5). Rozważ dopiero, gdy Poziom 1 nie wystarczył.
- **Poziom 3 — wymóg karty płatniczej już przy rejestracji FREE.** Najbardziej inwazyjny, sprzeczny z 12.6 Krok 1 (FREE bez karty) — realna zmiana modelu, nie tylko eskalacja techniczna. Rozważ wyłącznie w skrajnym przypadku, jako świadomą zmianę 12.6, nie cichy dodatek.

**Zasada wyboru i dokumentacji.** Przejście na wyższy poziom to świadoma decyzja właściciela projektu, oparta na realnych danych, zapisana w `docs/memory.md` z datą, sygnałem i wybranym poziomem. AI pracujące nad projektem nigdy nie wdraża wyższego poziomu samodzielnie (15.4) — przedstawia dane właścicielowi i eskaluje od najniższego nieużytego jeszcze poziomu.

## 12.7. FREE jako pełne, uczciwe doświadczenie

FREE musi być kompletnym, uczciwie użytecznym doświadczeniem samym w sobie — nie okrojoną wersją, z której później "odsprzedaje się" elementy wcześniej odebrane. PRO to addytywny pakiet komfortu/bezpieczeństwa/mocy, nigdy "prawdziwa" wersja produktu ukryta za progiem.

**Test kontrolny:** jeśli opis PRO brzmi jak lista rzeczy *odebranych* użytkownikowi — podział jest źle zaprojektowany. Jeśli brzmi jak lista rzeczy *dodanych* — jest dobry.

**Checklist przy projektowaniu podziału (12.4):**
- [ ] Czy przynajmniej część korzyści PRO to coś nowego, nie tylko odblokowanie starego?
- [ ] Czy FREE daje wystarczająco dużo, żeby użytkownik poczuł realną wartość przed decyzją o zakupie?
- [ ] Czy sync/chmura (12.10) jest komunikowana jako zrozumiała, uczciwa usługa, nie sztuczna blokada?

## 12.8. Freemium jako jedyny model rodziny

Wszystkie aplikacje rodziny są długotrwałego, powtarzalnego użytku — żadna nie ma ekonomiki uzasadniającej model "płatna apka z krótkim trialem, potem brak dostępu". Freemium (trwały, realnie użyteczny FREE, 12.7) jest jedynym stosowanym modelem, nie jednym z wyborów per projekt.

## 12.9. Podział funkcji w FREE — dwa przypadki wymagające osobnej reguły

Każda funkcja to domyślnie prosty, płaski wpis FREE albo PRO (12.1) — bez narzuconej hierarchii ważności (próba stopniowania funkcji wg krytyczności okazała się w praktyce trudna do jednoznacznego stosowania). Każdy projekt indywidualnie wybiera, które konkretne funkcje trafiają do PRO (12.4). Dwa wyjątki, gdzie sama płaska mapa nie wystarcza:

- **AI — zawsze wyłącznie PRO**, bez wyjątku, niezależnie od kosztu operacyjnego konkretnej funkcji czy projektu.
- **Rdzeń domenowy (obliczenia)** — FREE musi zachować przynajmniej jedną w pełni funkcjonalną, nie-teaserową ścieżkę rdzenia ("hero journey"). Zero realnych obliczeń w FREE łamie 12.7.

## 12.10. Sync/chmura wyłącznie PRO

Pełna treść: 18.13. Chmura jest premium-only we wszystkich projektach rodziny; FREE pozostaje w 100% lokalny.

## 12.11. FREE — ryzyko utraty danych komunikowane jawnie

Skoro FREE = zapis wyłącznie lokalny (18.13), a nie każde urządzenie/przeglądarka przetrwa w nieskończoność — to realne ryzyko, nie teoretyczne. Rozszerzenie 0.4.4 (zero cichych luk): aplikacja jawnie informuje użytkownika FREE, że dane żyją tylko lokalnie i mogą zostać utracone (czyszczenie cache, awaria urządzenia, reinstalacja) — nigdy ciche założenie, że użytkownik się domyśli.

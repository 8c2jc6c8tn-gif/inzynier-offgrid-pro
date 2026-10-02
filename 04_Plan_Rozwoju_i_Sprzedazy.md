# 04. Plan rozwoju i sprzedaży — Inżynier Offgrid Pro (wzór dla rodziny „Inżynier … Pro”)

**Wersja:** 1.0 | **Filar:** C | **Data utworzenia:** 02.10.2026 | **Ostatnia aktualizacja:** 02.10.2026 | **Status:** Roboczy — granica PV postanowiona (D70), ceny i plan sprzedaży to rekomendacje czekające na decyzje właściciela
**Powiązane dokumenty:** `rejestr-decyzji.md` D70, `backlog-poza-v1.md`, `docs/standards/12-freemium.md`, `docs/lista-do-zrobienia.md`; analizy źródłowe z rozmowy z właścicielem: `/mnt/project-files/analizy/` (`granica-rozdzielnice-offgrid-vs-elektryk.md`, `ceny-apek-rodziny.md`, `strategia-startu-pierwszy-miesiac.md`, `plan-sprzedazy.md`)

TL;DR: Jeden plan, jak apka zarabia i rośnie. **Część I** jest uniwersalna: ten sam schemat ma działać dla każdej apki rodziny i to ją zgłosimy do `docs/wklad-do-standardu.md`, gdy będzie dopracowana. **Część II** to wartości dla Offgrid Pro. Cel właściciela: **minimum 5000 zł netto miesięcznie z każdej apki**, a w pierwszym miesiącu 5–10 tys. zł. Oznaczenia: ✅ postanowione przez właściciela · 💡 rekomendacja audytora, czeka na decyzję · 🔎 niezweryfikowane, sprawdzić przed wdrożeniem.

---

# CZĘŚĆ I — Schemat uniwersalny dla rodziny

## 1. Zasady nadrzędne

1. ✅ **Nie ukrywamy informacji, żeby sprzedać drugą apkę.** Każda apka jest kompletna w swoim zakresie. Druga apka jest polecana jako *inny zakres*, nigdy jako ukryta część tej samej wiedzy (D70 pkt 3–4).
2. ✅ **Bezpieczeństwo nigdy nie jest „w drugiej apce” ani za paywallem.** Twarde stopy i ostrzeżenia są w każdej apce, której dotyczą (D70 pkt 6, standard 12.7).
3. **Freemium jako jedyny model** (standard 12.8): FREE ma realne obliczenia, PRO dodaje komfort, moc i AI (AI wyłącznie w PRO, 12.9). Trial wymaga karty (12.6). Plan zawsze przypięty do konta (12.2), więc „kod aktywacyjny” to kod realizowany na koncie, nie licencja bez konta.
4. ✅ **Cel finansowy: min. 5000 zł netto miesięcznie z każdej apki.** Od niego liczy się ceny, nie odwrotnie.
5. 💡 **Apka ma być narzędziem cytowanym w branży.** Hojny FREE z eksportem z logo apki zamienia każdy zrzut ekranu na forum w reklamę.

## 2. Pozycja na rynku i ceny

**Obserwacja rynku (sprawdzone 02.10.2026, źródła w sekcji 9):** rynek ma dwie półki.
- Dolna to proste kalkulatory i tablice za 20–100 zł jednorazowo (np. Electrical Calc Elite 22,99 €, polski „Poradnik elektryka i schematy” 39,99 zł). Kursy SEP online kosztują ok. 299 zł.
- Górna to profesjonalne programy za tysiące złotych rocznie (PV*SOL ~845 €/rok, PVsyst 700 CHF/rok, HOMER Pro od 1 575 $/rok).
- Środka, czyli żywego doradcy z obliczeniami, twardymi stopami i AI za kilkaset złotych rocznie, praktycznie nie ma. To jest miejsce rodziny.

💡 **Model cenowy:**
- **Plan roczny jako główny produkt**, domyślnie zaznaczony, z kwotą oszczędności obok.
- **Plan miesięczny celowo drogi jako kotwica.** Roczny kosztuje tyle co 4–5 miesięcy.
- **Bez masowej ceny 19–29 zł/mies.** Spycha apkę na dolną półkę, wymaga 400–600 płacących miesięcznie, a koszt AI może zjeść marżę.
- Pakiet „wszystkie apki” dopiero przy co najmniej trzech apkach, za ok. 60% sumy cen rocznych.

**Wzór na liczbę klientów** (sprzedaż na własnej stronie: VAT 23%, ~2% prowizji płatności; w sklepie z aplikacjami 15% prowizji):
- zostaje z 1 sprzedaży ≈ cena / 1,23 × 0,98 (strona) albo × 0,85 (sklep);
- „5000 zł na rękę” ≈ 8000 zł przychodu po VAT i prowizji. Przyjęto, że ZUS, podatek i koszty zjedzą ~35–40%. 🔎 Musi to potwierdzić księgowa.
- Lejek: w freemium płaci ok. 2,1% instalujących (mediana RevenueCat 2026). Ok. 72% rocznych subskrybentów wyłącza automatyczne odnowienie w 1. roku; to średnia dla apek konsumenckich, dla narzędzi zawodowych może być lepiej (wniosek).

## 3. Drabina oferty (szablon)

| Opcja | Rola |
|---|---|
| FREE | Realne obliczenia, werdykt, eksport z logo apki |
| Roczny (domyślny) | Główny produkt |
| Miesięczny (drogi) | Kotwica, „chcę tylko spróbować” |
| Pakiet projektowy 3 mies., bez automatycznego odnowienia | Dla bojących się abonamentu; ludzie na budowie myślą projektami |
| Instalator / Firma (3 stanowiska, raport z logo firmy) | Klient zawodowy płaci więcej i sam pokazuje apkę swoim klientom |
| Członek założyciel (tylko na start, prawdziwy limit) | Szybka gotówka i ambasadorzy; cena gwarantowana przy odnowieniu |
| Kod podarunkowy | Święta, Black Friday |
| Plan dożywotni | Tylko z twardym limitem albo wcale: daje gotówkę, ale ci klienci już nie płacą |
| Zniżka krzyżowa 50% jednorazowo dla subskrybenta innej apki rodziny | Kod z własnej strony albo ten sam e‑mail; działa w obie strony |

## 4. Co sprawia, że kupują chętniej

1. Wynik przed paywallem: FREE widzi werdykt, PRO odblokowuje pełny raport, zapis projektu, AI i chmurę.
2. Plan roczny domyślnie zaznaczony, z kwotą oszczędności.
3. Gwarancja zwrotu 30 dni na plan roczny.
4. Polecenia: 3 miesiące gratis dla polecającego i poleconego (limit np. 24 miesiące). 6 miesięcy to połowa wartości planu rocznego za jedno polecenie.
5. Sprzedaż przez konkretny problem, nie listę funkcji. Apka zapobiega drogim błędom, więc sprzedajemy ją jako ochronę przed pomyłką.
6. Dowód społeczny od pierwszego dnia: opinie i studia przypadków z bety (za zgodą).

## 5. Pierwszy miesiąc: 5–10 tys. zł

- Plan roczny wpłaca 12 miesięcy naraz, więc cel pierwszego miesiąca to **30–50 kupujących, a nie setki**.
- **Uczciwe zastrzeżenie:** to przedpłata za rok. Od drugiego miesiąca trzeba stale dosprzedawać, żeby utrzymać średnią. Część pieniędzy z pierwszego miesiąca odłożyć jako zapas.
- **Harmonogram (S = dzień startu):**
  - **S − 6 tyg.:** strona z darmowym kalkulatorem i listą oczekujących, cel 600–1000 adresów. Z ciepłej listy kupuje kilka procent (reguła branżowa 🔎).
  - **S − 4 tyg.:** grupy, fora, twórcy, instalatorzy, sklepy (sekcja 6).
  - **S − 2 tyg.:** beta dla 20–50 osób w zamian za opinie.
  - **S:** mail z ofertą założycielską, przypomnienia w dniu 3 i 7 (tylko prawdziwe liczby miejsc).
  - **S + 1–4 tyg.:** cotygodniowy „przypadek z apki”, sezon prezentów i Black Friday.

## 6. Ścieżki sprzedaży (27)

**Własne kanały:**
1. Oficjalna strona z listą oczekujących, cennikiem i darmowym kalkulatorem.
2. Strony tematyczne pod konkretne frazy.
3. Reklamy Google na tanie, długie frazy, kierowane na strony tematyczne.
4. Retargeting dla odwiedzających, którzy nie kupili.
5. Oficjalna grupa na Facebooku i fanpage.
6. Lista e‑mail z sekwencją 5 maili po zapisie.
7. Darmowa checklista PDF za e‑mail.
8. Krótkie filmy „przypadek tygodnia”.
9. Webinary na żywo z liczeniem przypadku widza.
10. Eksport PDF z logo w FREE.

**Społeczności:**
11. Istniejące grupy na Facebooku i fora branżowe, z merytorycznymi odpowiedziami, bez spamu.
12. Osobne kanały dla segmentów niszowych.
13. Segment firm i rolników przez doradców.

**Partnerzy:**
14. Program partnerski dla twórców.
15. Program poleceń dla użytkowników.
16. Plan Instalator: zawodowiec pokazuje apkę klientom.
17. Sklepy branżowe: kod przy zamówieniu, licencje hurtowe.
18. Hurtownie: ulotka z kodem QR.
19. Dystrybutorzy sprzętu: wspólne webinary.
20. Szkoły i ośrodki kursowe: licencje edukacyjne.

**Sprzedaż i PR:**
21. Allegro: kody aktywacyjne. 🔎 Sprawdzić prowizję i zasady.
22. Kody podarunkowe.
23. Artykuły gościnne i komunikat prasowy do portali branżowych.
24. Targi i konferencje.
25. Sprzedaż krzyżowa z innymi apkami rodziny.
26. Studia przypadków z bety.
27. Mentorzy jako ambasadorzy.

**Strony tematyczne — zasady:**
- Każda strona ma własną treść i mały kalkulator, który odpowiada na jedno pytanie. Google karze masowe, prawie identyczne strony („doorway pages”).
- Strony są widocznie tą samą marką, najlepiej jako podstrony oficjalnej domeny. Różny styl graficzny pod różne grupy jest w porządku.
- Mini‑strony na osobnych domenach tylko z unikalną treścią. Nigdy jako „niezależne recenzje” własnej apki.

## 7. Program partnerski i polecenia

- **Polecenia użytkowników:** 3 miesiące gratis dla obu stron (sekcja 4).
- ✅/💡 **Partner‑założyciel** (pomysł właściciela, np. maks. 10–20 osób): 50% od pierwszej płatności pierwszych 50–100 klientów, potem 25% od każdego odnowienia, dopóki klient płaci.
- **Zwykły partner:** 25% od pierwszej płatności i od odnowień, dopóki klient płaci.
- ✅ **Próg wypłaty:** 499 zł.
- 💡 **Zasady:**
  - prowizja od kwoty bez VAT;
  - wypłata po 30 dniach na ewentualny zwrot;
  - wypłata przelewem, nie gotówką;
  - klient z linku partnera płaci pełną cenę albo dostaje do 10% rabatu. Nie łączyć 50% prowizji z ceną założycielską, bo wtedy zostaje ok. 154 zł z planu za 399 zł.
- 💡 **„Dożywotnio” w regulaminie:** „dopóki klient opłaca subskrypcję i partner przestrzega regulaminu”, z prawem zmiany stawek dla przyszłych poleceń.
- 🔎 Do ustalenia z księgową: forma umowy i rozliczenie prowizji wypłacanych osobom prywatnym.
- Twórcy muszą oznaczać współpracę jako reklamę (wytyczne UOKiK) — wpisać do regulaminu.
- 💡 **Pakiet partnera:**
  - jedna strona z parametrem partnera (zdjęcie i kod) zamiast osobnej strony dla każdego;
  - gotowe grafiki, filmy i teksty;
  - darmowe PRO.

## 8. Konta mentorów

- **Kto:** praktycy z doświadczeniem (uprawnienia, działające instalacje), przyjmowani na podstawie zgłoszenia i decyzji właściciela.
- **Co dostają:**
  - PRO za darmo albo symbolicznie, dopóki są aktywni;
  - tytuł „Mentor”;
  - wcześniejszy dostęp do nowych funkcji;
  - podziękowanie w apce (za zgodą).
- **Czego się od nich oczekuje:**
  - np. jedna sugestia, zgłoszenie błędu albo przegląd ekranu w miesiącu;
  - testy przed wydaniem;
  - przegląd aktywności co kwartał.
- **Regulamin mentora:** zgoda na wykorzystanie zgłoszonych pomysłów oraz poufność niewydanych funkcji.
- **Jakość:** wiedza mentora to poziom 🔎B. Jako wartość domyślna w obliczeniach trafia dopiero po potwierdzeniu w normie albo dokumencie.

## 9. Kolejność wdrażania (ścieżka krytyczna)

1. **Płatności, konta, mapa FREE/PRO, kody** (polecenia, partnerzy, prezenty, zniżka krzyżowa). Dziś zero implementacji (rozdział 12 standardu). Bez tego nie ma sprzedaży ani śledzenia poleceń.
2. Oficjalna strona z listą oczekujących, 3–5 stron tematycznych, oficjalna grupa.
3. Zaproszenia dla partnerów‑założycieli i pierwszych mentorów.
4. Beta, start, reklamy na tanie frazy, webinary.
5. 🔎 Przed startem sprawdzić zasady Apple i Google dotyczące kierowania z apki do zakupu na stronie. Najprościej na start sprzedawać przez stronę, a apkę udostępnić jako PWA.

**Źródła obserwacji rynku (02.10.2026):**
- apps.apple.com: Electrical Calc Elite, Electrodoc Pro, Poradnik elektryka i schematy;
- appbrain.com: Ugly's Electrical References;
- kurs-elektryczny.pl/cennik;
- heavengreenenergy.com: ceny programów PV;
- kielgo.pl: PV*SOL premium;
- homerenergy.com: HOMER Pro;
- revenuecat.com: State of Subscription Apps 2026 oraz program dla małych firm;
- gramwzielone.pl: 1,6 mln prosumentów.

---

# CZĘŚĆ II — Wartości dla Inżynier Offgrid Pro

## 10. Zakres i granica z Elektryk Pro (✅ D70)

- **Offgrid Pro:** kompletny w PV, magazynach energii i obliczeniach przejścia na off‑grid (dobór, bilans, zima, TCO, M14). Rozdzielnica AC za falownikiem i rozdzielnica u częściowo podłączonych do sieci tylko na poziomie wymagań, podziału obwodów rezerwowanych i twardych stopów.
- **Elektryk Pro** (osobna apka): pełne, techniczne PV oraz cała elektryka 230/400 V, rozdzielnice obwód po obwodzie, silniki, soft start, usterki i szkolenie. Bez doboru PV i magazynów pod off‑grid.
- Polecenia między apkami jako inny zakres. Ostrzeżenia bezpieczeństwa w obu.

## 11. Ceny i oferta (💡 rekomendacja; właściciel: „ceny są ok”, ostateczne kwoty do potwierdzenia)

| Opcja | Cena | Zostaje (strona) |
|---|---|---|
| Roczny | 599 zł (przedział 499–699) | ~477 zł |
| Miesięczny | 129–159 zł | ~103–127 zł |
| Pakiet projektowy 3 mies. | 299 zł | ~238 zł |
| Instalator / Firma | 1490 zł/rok | ~1187 zł |
| Członek założyciel | 399 zł/rok, limit 200 | ~318 zł |
| Elektryk Pro (dla porównania) | 299–349 zł/rok, 49 zł/mies. | — |

**Progi dla Offgrid Pro:**
- Utrzymanie 5000 zł na rękę przy 599 zł/rok to ok. 200–230 aktywnych rocznych klientów, czyli ok. 17–20 nowych planów miesięcznie.
- **Pierwszy miesiąc, 5 tys. na rękę:** np. 25 planów założycielskich.
- **Pierwszy miesiąc, 10 tys. na rękę:** np. 25 planów założycielskich, 5 planów Instalator i 10 pakietów projektowych.

## 12. Hasła i kanały specyficzne dla Offgrid

- **Hasło przewodnie:** „Sprawdź, czy Twój magazyn przetrwa styczeń, zanim wydasz 40 tys. zł”.
- **Frazy na strony tematyczne** (liczby wyszukiwań 🔎 do sprawdzenia w planerze słów kluczowych):
  - ile akumulatorów do domu off‑grid;
  - magazyn energii na zimę kalkulator;
  - czy opłaca się odłączyć od sieci;
  - dobór agregatu do domu;
  - falownik wyspowy jaki wybrać;
  - przekrój kabla do falownika;
  - SPD fotowoltaika jaki typ;
  - domek letniskowy prąd bez przyłącza;
  - instalacja 12 V kamper;
  - ogrzewanie domu off‑grid zimą;
  - ile paneli do domu bez sieci;
  - rachunek za prąd po net‑meteringu.
- **Segmenty:**
  - właściciele domów planujący off‑grid;
  - częściowo podłączeni i przechodzący (M14; ~1,6 mln prosumentów w PL jako szeroki rynek);
  - kampery, jachty, działki (M12);
  - firmy i rolnicy (M14‑F);
  - instalatorzy PV.
- **Partnerzy branżowi:** sklepy z magazynami i PV, hurtownie elektryczne, dystrybutorzy falowników, polscy twórcy off‑grid i PV.

## 13. Otwarte decyzje właściciela

1. Ostateczne kwoty planów (sekcja 11) i to, czy wprowadzić plan dożywotni.
2. Stawki i limity programu partnerskiego (50/25, liczba partnerów‑założycieli, 50 czy 100 klientów).
3. Polecenia: 3 czy 6 miesięcy.
4. Nazwa drugiej apki: rekomendacja „Elektryk Pro” (dostępność nazwy 🔎).
5. Kiedy zgłosić Część I do `docs/wklad-do-standardu.md` — właściciel: po dopracowaniu planu.

## Log zmian

| Data | Zmiana |
|---|---|
| 02.10.2026 | Utworzono — zebranie ustaleń z wątku z właścicielem (granica z Elektryk Pro D70, analiza cen, strategia pierwszego miesiąca, plan sprzedaży, program partnerski, mentorzy). Wersja 1.0. |

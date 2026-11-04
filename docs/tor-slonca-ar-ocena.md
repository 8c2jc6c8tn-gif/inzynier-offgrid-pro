# Tor słońca z nakładką na kamerę/zdjęcie/dron — ocena wykonalności

**Utworzono:** 04.11.2026, na prośbę właściciela (wątek „Dodać ścieżkę słońca z kamerą i PV”) po zrzutach z grupy „Fotowoltaika w Polsce” (widok AR toru słońca na tle domu i lasu). **Status:** ocena i propozycja kolejności, **nic nie zbudowane**; budowa dopiero po zatwierdzeniu planu przez właściciela (sekcja 9). Oznaczenia pochodzenia jak w `docs/perspektywy-projektow.md`: ✅ odczytane w kodzie/źródle w tej sesji · 🧮 wyliczenie własne · ❓ założenie lub szacunek · 🧠 wiedza ogólna, nie sprawdzona w tej sesji (do weryfikacji przed użyciem w kodzie).

## 1. Co to za aplikacja i do czego służy

- Zrzuty pokazują widok z kamery telefonu z nałożonymi łukami słońca: czerwony = 21 czerwca, zielony = 23 września, turkusowy = 21 grudnia, żółty = bieżący dzień, punkty godzinowe („7h Jun 21”), celownik z wysokością i azymutem („Ele: −5°, Azi: 94° (E)”), pasek narzędzi z przyciskiem „Done”. Na drugim zrzucie widać „Shadow Point”.
- **Najpewniej Sun Surveyor** (nie da się tego potwierdzić z samego zrzutu; napisu „Shadow Point” nie znalazłem w opisach). Opis w sklepie mówi o trybie AR pokazującym, kiedy słońce będzie w danym punkcie nieba i kiedy zasłoni je budynek, oraz o „shadow ratio”; wpis dewelopera z 2015 r. wprost wymienia ocenę ustawienia paneli (✅ [Google Developers Blog](https://developers.googleblog.com/sun-surveyor-brings-augmented-reality-to-photographers-using-google-maps-apis/), ✅ [App Store: Sun Tracker AR](https://apps.apple.com/us/app/id1460472433) — inna aplikacja o tej samej idei, w opisie wymienia instalatorów PV; ✅ [Sun Seeker Pro](https://apps.apple.com/vg/app/sun-seeker-pro/id1233920976?mt=12) — też celuje w instalatorów). Prawdopodobnie jedna z nich; wniosek dla nas taki sam.
- **Po co instalatorowi:** zobaczyć na miejscu, o której godzinie i w której porze roku konkretne drzewo, komin albo sąsiedni budynek zasłoni słońce na planowanym miejscu paneli, oraz dobrać orientację i kąt. W zawodowej wersji to samo robią przyrządy typu Solmetric SunEye lub Solar Pathfinder (🧠, nie sprawdzałem cen ani dokładności).
- **Dla off-grid to jest ważniejsze niż dla on-grid:** zimą słońce w Warszawie wznosi się w południe tylko do ok. 14,3° (🧮: 90° − 52,23° − 23,44°). Każda przeszkoda wyższa niż ok. 14° od strony południowej odcina cały grudniowy uzysk, a zima jest u nas wąskim gardłem systemu (M7, „Zima z ociepleniem”).

## 2. Co już mamy w repo (sprawdzone w kodzie, nie założone)

| Potrzeba | Jest? | Gdzie |
|---|---|---|
| Pozycja słońca z współrzędnych: azymut, wysokość (z refrakcją), deklinacja, równanie czasu | ✅ tak | `lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca.ts` — `pozycjaSlonca(lat, lon, czasUtcMs)`, algorytm NOAA/Meeus, testy na przykładach liczbowych z Meeusa |
| Kąt padania na płaszczyznę, masa powietrza, promieniowanie bezpośrednie przy czystym niebie (Meinel) | ✅ tak | ten sam plik |
| Godzinowe napromieniowanie płaszczyzny panelu (model Muneera, dane PVGIS TMY) | ✅ tak | `lokalizacja/orientacja-powierzchni/muneer.ts` |
| Godzinowa energia panelu (moc, temperatura, słabe światło) | ✅ tak | `pv/porownywarka-paneli/uzysk.ts` — `godzinowaEnergiaPanelu`, tablica na każdy rekord TMY |
| Zacienienie: profil horyzontu przeszkód i strata % rocznie/miesięcznie | ✅ tak | `lokalizacja/analiza-zacienienia/` (bryły i drzewa wpisane przez użytkownika, test „słońce poniżej horyzontu przeszkody”, ekran 3D) |
| Wykres toru słońca (łuki dat, punkty godzin) | ❌ nie | żaden ekran nie rysuje toru słońca |
| Kamera, czujniki orientacji, kompas, AR | ❌ nie | brak jakiegokolwiek użycia `getUserMedia`/`DeviceOrientation` w `app/`, `components/`, `lib/` |
| Wejście „zmierzony profil horyzontu” (bez wpisywania brył) | ❌ nie | kalkulator zacienienia zna tylko bryły/drzewa (`katPrzeszkodyDeg`); `profilHoryzontuDeg` zwraca profil, ale nie ma ścieżki odwrotnej |
| Zacienienie jako wejście Porównywarki paneli | ❌ nie | `pv/porownywarka-paneli/input.ts` nie ma pola zacienienia — przy realizacji sprawdzić, czy przyjmie współczynnik strat z Ekranu 3 |

**Odpowiedź na pytanie „czy mamy system, żeby liczyć tak samo względem współrzędnych”: tak.** Ten sam silnik, którego używa zacienienie i uzysk, da dokładnie te łuki; nic nie trzeba pisać od zera po stronie astronomii.

Dwie pułapki znalezione przy okazji:
1. **Polityka uprawnień blokuje kamerę:** `next.config.mjs:17` ma `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`. Dla AR i zdjęć trzeba zmienić na `camera=(self)`. To zmiana bezpieczeństwa, więc wymaga świadomej decyzji, nie ukrytego dopisku.
2. **three.js nie jest w precache offline** (decyzja właściciela z 30.09.2026, widać komentarz w `app/kalkulatory/analiza-zacienienia/page.tsx`). Widok 3D offline pokazuje komunikat zamiast błędu. Wniosek: wykres toru słońca musi być **2D (SVG/canvas) i działać offline**; 3D jest dodatkiem tylko online.

## 3. Odpowiedź (a): wykres toru słońca 2D/3D z animacją i godzinową produkcją PV

**Wykonalne, tanie, w pełni zgodne z naszymi obliczeniami.** Proponowany ekran „Tor słońca” (M1, obok Analizy zacienienia):

- **2D (główny, offline):** wykres azymut × wysokość z łukami 21 VI / 23 IX / 21 XII i dniem wybranym, punktami godzin w czasie urzędowym (mamy `godzinaLokalnaPl`), pozycją „teraz”, kolory jak na zrzutach (czerwony/zielony/turkusowy/żółty). Suwak godziny i przycisk animacji (słońce się porusza po łuku). Szary obszar = horyzont przeszkód z Ekranu 3, jeśli istnieje (słońce „znika” za przeszkodą).
- **Godzinowa produkcja PV pod wykresem:** słupki kWh na godzinę dla wybranego dnia, z podpisem „kiedy i ile”. Dla panelu o nachyleniu i azymucie wpisanych przez użytkownika, przez ten sam model co Porównywarka.
- **Uwaga merytoryczna (ważna):** TMY to rok typowy złożony z miesięcy z różnych lat, więc **konkretna data z TMY nie jest „typowym dniem”**. Do animacji użyć **średniego dnia miesiąca** (średnia godzinowa po dniach miesiąca) albo **dnia bezchmurnego** z modelu Meinela (to, co pokazują aplikacje AR). Ekran musi mówić, który z dwóch wariantów widać. Bez tego użytkownik zobaczy nierealnie poszarpany dzień.
- **3D (opcjonalnie, online):** półkula z torem, na istniejącym R3F (`components/lokalizacja/widok-3d.tsx`). Wartość głównie wizualna; mogę odłożyć.
- **Test spójności:** suma godzinowa miesiąca = `miesiecznaEnergiaPanelu` (ta sama liczba w dwóch ekranach, standard 03-jadro).
- **Koszt:** mały–średni (❓ jeden PR, jedna sesja). Pełna definicja ukończenia ekranu (autosave, PL/EN/RU, „?” przy polach, „i” przy tytule, narzędzie AI z „Użyj, gdy…”, strażnicy) dolicza się do kosztu — nie jest to tylko wykres.

## 4. Odpowiedź (b): nakładka AR na obraz z kamery w PWA

**Technicznie możliwa, ale najbardziej ryzykowna z trzech części.** Bez WebXR, na „wideo + canvas + czujniki”:

- **Kamera:** `getUserMedia` wymaga HTTPS i zgody użytkownika; dane nie muszą opuszczać telefonu (przetwarzamy lokalnie, nic nie wysyłamy). W PWA zainstalowanej na iPhonie działanie kamery 🧠 trzeba sprawdzić na prawdziwym urządzeniu.
- **Orientacja telefonu:** iOS wymaga jawnego `DeviceOrientationEvent.requestPermission()` po geście użytkownika (przycisk), a kompas daje właściwość `webkitCompassHeading`; Android Chrome daje kompas przez zdarzenie `deviceorientationabsolute` (✅ MDN i opisy wg wyszukiwania; wymaga bezpiecznego kontekstu HTTPS).
- **WebXR nie wchodzi w grę** (🧠 Safari na iPhonie nie wspiera trybu `immersive-ar`; nie zweryfikowałem w tej sesji). Dlatego rysujemy łuki sami: model kamery otworowej (pinhole), azymut i wysokość kamery z czujników, nakładka na `<canvas>` nad `<video>`.
- **Główne ryzyko — dokładność kierunku:** magnetometr w telefonie bywa o kilka–kilkanaście stopni obok (❓ rząd wielkości, 🧠), zakłócają go blacha dachowa, falownik, żelbet. Dodatkowo kompas pokazuje północ magnetyczną; trzeba poprawki deklinacji (w Polsce kilka stopni na wschód, 🧠 do policzenia modelem WMM, nie z pamięci). Pole widzenia kamery (FOV) zależy od obiektywu i zoomu i nie jest dostępne wprost w przeglądarce, więc trzeba **ręcznej kalibracji suwakiem**.
- **Jak to obejść (najlepszy trik):** kalibracja **na słońcu**. Gdy słońce jest widoczne, użytkownik dotyka go na ekranie; nasz silnik zna jego dokładny azymut i wysokość w tej chwili (czas + GPS), więc jedno dotknięcie zeruje błąd kompasu. Bez widocznego słońca (pochmurno) AR będzie obarczony błędem kompasu i ekran musi to mówić.
- **Koszt:** średni–duży (❓), plus testy na realnych telefonach (iOS i Android), których dziś nie mamy w CI (E2E nie zastąpi sensora).

## 5. Odpowiedź (c): pomiar zacienienia z kamery lub zdjęcia

**Wykonalne i to jest największa wartość całego pomysłu.** Dziś użytkownik musi wpisać wysokości i odległości drzew i budynków (Skaner działki + Ekran 3). Zamiast tego:

1. Użytkownik stoi (albo dron wisi) w miejscu planowanych paneli i robi serię zdjęć/panoramę dookoła.
2. Dla każdego zdjęcia zaznacza **linię horyzontu przeszkód** (rysuje palcem po koronach drzew i dachach). Z geometrii kamery każdy punkt linii daje parę (azymut, wysokość kątowa).
3. Z tych par powstaje **profil horyzontu** w tym samym formacie, który już liczy `profilHoryzontuDeg`.
4. Istniejący test „słońce poniżej horyzontu przeszkody” (cały rok, krok `KROK_MIN`) daje **stratę % rocznie i miesięcznie** — zimą osobno.

Wymaga **małej zmiany w silniku** (nowe wejście „zmierzony profil horyzontu” obok brył; sam model strat bez zmian). Drzewa liściaste zimą przepuszczają część światła (TD19) — użytkownik oznacza fragment jako „liściaste”, żeby uniknąć dwukrotnego zawyżenia zimowej straty. Dokładność ręcznego zaznaczania ❓ rzędu 2–3°, co wystarcza do oceny rzędu „strata 5% czy 25%”. Przesłanianie nieba w częściach (TD18) pozostaje poza modelem — jak dziś.

## 6. Dron: nakładanie toru na zdjęcia/film i podgląd na żywo

Właściciel zapytał o dwie rzeczy: nałożyć tor na nagranie z drona oraz pobierać obraz z drona na żywo.

**Zdjęcie z drona (import pliku) — tak, to jest sensowny MVP.**
- Z pliku odczytujemy **czas wykonania i współrzędne GPS (EXIF)**; z nich nasz silnik liczy dokładną pozycję słońca w chwili zdjęcia. Drony DJI zapisują też w metadanych XMP kierunek kamery (obrót i pochylenie gimbala) oraz wysokość względną (🧠 nazwy pól do potwierdzenia na próbce; **poproszę właściciela o 2–3 oryginalne pliki z drona + nazwę modelu**).
- **Kalibracja azymutu:** czas + GPS + kliknięcie w słońce (albo kierunek cienia) na zdjęciu = pewny kierunek, niezależny od kompasu drona. FOV z ogniskowej w EXIF (🧠 `FocalLengthIn35mmFilm`), z korektą ręczną; obiektywy dronów są szerokokątne i zniekształcają obraz, więc potrzebny suwak korekty.
- **Najlepszy scenariusz użycia drona (propozycja):** zawis **w punkcie planowanych paneli, na wysokości połaci**, obrót dookoła i kilka zdjęć z kamerą poziomą (co 30–45°) albo panorama. To daje prawdziwy horyzont z miejsca instalacji bez wchodzenia na dach — w praktyce to samo, co robi się przyrządem typu SunEye, ale z użyciem drona, który właściciel już ma.
- Zdjęcie z góry (nadir) nie daje horyzontu, ale nadaje się jako podkład do Skanera działki (osobny temat, nie ten raport).
- **Ostrzeżenie praktyczne:** zdjęcia wysłane przez komunikatory i Facebooka zwykle tracą EXIF (🧠). Import musi dotyczyć **oryginału z karty pamięci**; ekran ma to mówić i dawać ręczne wpisanie czasu, położenia i kierunku, gdy metadanych brak.

**Film z drona (nakładka klatka po klatce) — odradzam w MVP.** Wymaga śledzenia ruchu kamery (telemetria per klatka, 🧠 DJI zapisuje ją w pliku .SRT obok filmu) i obciążającego przetwarzania wideo w przeglądarce. Zacienienie jest zjawiskiem **statycznym**: wystarczy kilka klatek/zdjęć, żeby zmierzyć horyzont. Film nic nie dodaje do wyniku.

**Podgląd na żywo z drona w apce — niewykonalne w PWA, i niepotrzebne:**
- Przeglądarka **nie odbiera strumieni RTMP ani RTSP**, w które drony i aplikacje pilotów nadają (🧠). Potrzebny byłby **serwer medialny** pośredniczący (WebRTC/HLS): koszt, opóźnienie, konta, utrzymanie — i sprzeczność z założeniem „offline-first” oraz z brakiem własnego backendu na obraz.
- **SDK DJI** to biblioteki natywne iOS/Android (🧠), nie działają w PWA; po ewentualnym przejściu na Capacitor (plan mobile) byłoby to osobne, duże zadanie z rejestracją deweloperską i ograniczonym wsparciem modeli (🧠 do sprawdzenia).
- Telemetria z pilota po USB (WebUSB) nie jest dostępna w Safari na iPhonie (🧠).
- **Prywatność i prawo:** obraz z drona obejmuje posesje sąsiadów; przepuszczanie go przez serwer to dane osobowe/wizerunek (RODO) i obowiązek zabezpieczenia. Przepisy lotnicze (rejestracja operatora, strefy) dotyczą pilota, nie aplikacji, ale nie powinniśmy zachęcać do lotów w złych miejscach.
- **Wartość:** zero ponad import zdjęć, bo zacienienie się nie zmienia w czasie lotu.

## 7. Wartość, ryzyko, koszt

| Funkcja | Wartość dla użytkownika | Ryzyko | Koszt (❓ względny) |
|---|---|---|---|
| Wykres toru słońca 2D + godzinowe PV | Średnia–wysoka: pokazuje „kiedy i ile”, uczy zimy, dobry do reklamy (to widać na zrzutach grupy) | Niskie; trzeba uczciwie opisać „dzień średni vs bezchmurny” | Mały–średni |
| Horyzont ze zdjęcia (telefon/dron) → strata % | **Najwyższa:** zastępuje żmudne wpisywanie brył, mierzy to, co naprawdę zasłania zimą | Średnie: dokładność zaznaczania, kalibracja, EXIF; nowe wejście silnika | Średni–duży |
| AR na żywo (kamera + czujniki) | Wysoka wizualnie, mniejsza merytorycznie niż zdjęcie z kalibracją | **Wysokie:** kompas, FOV, iOS, urządzenia, uprawnienia | Duży + testy na sprzęcie |
| Nakładka na film z drona | Mała | Wysokie | Duży |
| Podgląd na żywo z drona | Żadna ponad zdjęcia | Bardzo wysokie (backend, prywatność) | Nie do zrobienia w PWA |

**Jak się to ma do apki:** fotowoltaika (M3) dostaje realną stratę zacienienia dla miejsca instalacji, M1 dostaje brakujący ekran, M7 (zima) dostaje najważniejszy czynnik zimowego uzysku. To zgodne z D70 (Offgrid pozostaje kompletny w PV). **Prywatność:** obrazu nie wysyłamy; przetwarzanie lokalne, w zapisie projektu zostaje profil horyzontu (liczby), a nie zdjęcie, chyba że użytkownik świadomie je zapisze.

## 8. FREE czy PRO

D2 (28.08.2026) przypisuje do PRO: wiele projektów, Tryb Inżyniera, stress-test zimowy, tryb Live, eksport, AI; do FREE: 1 projekt, tryb prosty, kalkulatory awaryjne. D79 (05.10.2026) zostawia moduły M1–M6 jako „nieprzypisane” (plakietka, bez blokady). **Propozycja do decyzji właściciela** (nic nie jest ustalone):
- **FREE:** wykres toru słońca 2D z godzinowym PV — tani, widowiskowy, przyciąga ruch (grupy, wyszukiwarka), prowadzi do reszty apki.
- **PRO:** horyzont ze zdjęcia/AR, zapis w projekcie, raport zacienienia do wydruku i wpływ na Porównywarkę.
Zgodnie z D79 wdrożenie na razie jako plakietka bez blokady. Wpływu na cel 5000 zł/mies. nie liczę — nie mam danych o konwersji, a nie zgaduję.

## 9. Proponowana kolejność i potrzebne decyzje

1. **Etap 1 (MVP):** ekran „Tor słońca” 2D z animacją, godzinowym PV (dzień średni miesiąca lub bezchmurny) i opcjonalnym horyzontem z Ekranu 3.
2. **Etap 2:** import zdjęcia (telefon/dron), kalibracja słońcem lub ręczna, rysowanie linii horyzontu → profil → strata % (nowe wejście silnika zacienienia; zmiana w `permissions-policy` niepotrzebna, bo to wybór pliku, nie kamera na żywo).
3. **Etap 3:** AR na żywo z kamery z kalibracją na słońcu (zmiana `camera=(self)` w polityce uprawnień; wymaga testów na iPhonie i Androidzie właściciela).
4. **Odradzam:** film z drona z nakładką klatka po klatce i podgląd na żywo.

Kolejność Etap 2 przed 3 jest świadoma: daje mierzalny wynik z mniejszą niepewnością, działa tak samo na iOS i Androidzie i nie zależy od kompasu.

**Do rozstrzygnięcia przez właściciela:** (A) zatwierdzenie kolejności 1→2→3; (B) FREE/PRO z sekcji 8; (C) 2–3 oryginalne zdjęcia z drona z karty pamięci + model drona (żeby sprawdzić metadane); (D) na jakich telefonach testujemy (model iPhone, Android); (E) zgoda na zmianę polityki kamery dopiero w Etapie 3.

## 10. Luki i niezweryfikowane

- Nie sprawdziłem aplikacji ze zrzutu u źródła (nazwa „najpewniej Sun Surveyor”); wniosek dla nas od tego nie zależy.
- Wszystkie punkty 🧠 (WebXR na iOS, metadane DJI, brak EXIF po komunikatorach, RTMP/RTSP w przeglądarce, SDK DJI, WebUSB, dokładność magnetometru, deklinacja) pochodzą z wiedzy ogólnej lub ze streszczeń wyszukiwania; przed budową Etapu 2–3 sprawdzić na próbkach i urządzeniach.
- Szacunki kosztu (❓) są względne, bez historii podobnych zadań w tym repo.
- Nie badałem prawa lotniczego ani RODO dla nagrań z drona; to wskazanie ryzyka, nie opinia prawna.
- Nie sprawdziłem, czy Porównywarka paneli przyjmie współczynnik strat zacienienia (brak pola w `input.ts`); to część pracy Etapu 2.

# Maskotka Bob — zestaw promptów do generowania ilustracji

**Status:** zatwierdzone przez właściciela 16.10.2026 (decyzja D84 w `rejestr-decyzji.md`). Zakres: 12 ilustracji kafli (10 nowych, 2 przeróbki) i 7 dodatkowych (pozycje C), razem **19 promptów**. Obrazy generuje właściciel w narzędziu graficznym (GPT), Claude przycina, wycina tło, konwertuje i podpina.

## Jak używać

1. Do **każdego** generowania wklej najpierw blok „BOB — niezmienny opis” (niżej), a po nim prompt sceny.
2. Dołącz jako referencję jeden istniejący obraz Boba (najlepiej `public/maskotki-bob/modul-05.webp`, bo ma wzorcowe ujęcie i wycięte tło). Bez referencji twarz i ubiór będą się zmieniać.
3. Dopisz regułę formatu (blok „Format i tło”) do każdego promptu.
4. Zapisz wynik pod nazwą z kolumny „Plik” i wyślij go w rozmowie. Claude zrobi resztę (przycięcie, WebP 600×900, wpis w `lib/pulpit/maskotki.ts`).
5. Jeśli narzędzie nie daje przezroczystego tła, zamień w bloku „Format i tło” zdanie o przezroczystości na „czysto białe tło #FFFFFF, bez cieni i bez gradientu” i napisz o tym; tło wytniemy u nas.

## Blok „BOB — niezmienny opis” (wklejaj dosłownie, po angielsku)

> BOB is a recurring friendly mascot character, an electrician and solar-installation engineer. A man in his early 30s, short dark brown hair, full well-groomed dark brown beard, warm confident smile, expressive eyes. He always wears: a bright yellow safety hard hat with a small white house-shaped logo on the front; a black hooded work sweatshirt; an orange hi-vis safety vest with silver reflective stripes and a small "BOB" name patch on the chest; black work gloves; brown work boots; a tool belt with pliers and screwdrivers. Style: semi-realistic 3D-animated cartoon, soft studio lighting, clean edges, natural vivid colours, exactly matching the attached reference image of Bob. Keep the face, proportions and outfit identical to the reference.

## Blok „Format i tło” (dopisuj do każdego promptu, po angielsku)

> Format: portrait 2:3, 1024x1536 px. Transparent background (PNG with alpha), only the character and his props, no sky, no room, no floor except a small ground patch under the feet if the scene needs it, no frame, no border. Framing: from the knees up, face in the upper third of the image, character fills about 80% of the height. One large hero prop that reads clearly at 112 px, at most two small secondary props. No text anywhere except "BOB" on the vest patch; screens and displays show only graphics (bars, curves, icons), never words or numbers.

## Mapa istniejących plików

| Kafel | Plik | Stan |
|---|---|---|
| 3 PV | `modul-03.webp` | do przeróbki: miękki owal zamiast wyciętego tła |
| 5 Okablowanie | `modul-05.webp` | dobry, wzorzec referencyjny |
| 6 Ogrzewanie | `modul-06.webp` | dobry |
| 7 Zima | `modul-07.webp` | do przeróbki: pełna scena, brak przezroczystości |
| 9 ESP32 | `modul-09.webp` | dobry |
| 11 Montaż baterii | `modul-11.webp` | dobry |

## A. Nowe ilustracje kafli (10)

Każdy prompt: **BOB-blok + prompt sceny + Format i tło.**

### A1. Kafel 1, Lokalizacja i teren — plik `modul-01.png`
Rozdział: klimat, nasłonecznienie, skaner działki, zacienienie, bryła budynku.
> Scene: Bob stands on a small grassy mound, holding a rugged tablet showing a map with a blue location pin and a sun path arc (graphics only). Beside him a survey tripod with a total station instrument. Looking at the viewer, one hand pointing at the horizon. Hero prop: the tablet with the map. Secondary: the survey tripod.

### A2. Kafel 2, Zapotrzebowanie energetyczne — plik `modul-02.png`
Rozdział: bilans obciążeń, profil dobowy, dni autonomii.
> Scene: Bob holds a clipboard with a checklist (ticks and bars, no words) in one hand and a plug-in watt meter in the other. Next to him, small household appliances stacked like a bar chart: a refrigerator, a kettle, a washing machine. Hero prop: the clipboard and watt meter. Secondary: the appliances.

### A3. Kafel 4, Magazyn energii / baterie — plik `modul-04.png`
Rozdział: dobór pojemności, czas ładowania, BMS, mróz. Różnica wobec kafla 11 (montaż): tu gotowa, pracująca szafa.
> Scene: Bob stands beside a finished floor-standing home battery cabinet with a rack of LiFePO4 modules and a row of green LED bars, cables neatly connected. One hand rests on the cabinet, the other holds a tablet showing a battery level graphic and a charge curve (graphics only). Hero prop: the battery cabinet with green LED bars.

### A4. Kafel 8, Bezpieczeństwo i sytuacje awaryjne — plik `modul-08.png`
Rozdział: pożar, ewakuacja, gaszenie, syreny.
> Scene: Bob holds a red fire extinguisher in one hand, ready to use, and a ceiling smoke detector in the other. Beside him a green emergency-exit sign with the running-man pictogram (no words). Serious but reassuring expression. Hero prop: the red fire extinguisher. Secondary: exit sign, smoke detector.

### A5. Kafel 10, AI i prognozy — plik `modul-10.png`
Rozdział: prognozy produkcji i zużycia, rekomendacje, anomalie.
> Scene: Bob holds a tablet, and above it floats a soft glowing holographic chart: a rising line curve with a small sun and cloud icon (graphics only, no numbers). Subtle blue-violet glow around the hologram. Bob looks pleased and curious. Hero prop: the holographic forecast chart.

### A6. Kafel 12, Szybki kalkulator / tryb mobilny — plik `modul-12.png`
Rozdział: małe instalacje 12/24 V, kamper, powerbank, garaż.
> Scene: Bob stands next to the rear corner of a small camper van with a small solar panel on its roof and a 12 V battery with clamps at his feet. He holds a smartphone showing a calculator-style screen (graphics only). Hero prop: the camper van corner with the small solar panel. Secondary: the 12 V battery, the phone.

### A7. Kafel 13, Tryb Live — plik `modul-13.png`
Rozdział: wejście w tryb Live, źródła telemetrii, pomiary i alarmy, historia, eksport. Dziś kafel ma tylko animowaną ikonę SVG, bez Boba.
> Scene: Bob holds a smartphone showing live graphs, a green waveform and a round gauge (graphics only). Small glowing sensor nodes float around him connected by thin wifi-like arcs to the phone. Alert-ready, attentive expression. Hero prop: the phone with the live waveform. Secondary: the floating sensor nodes.

### A8. Kafel 14, Ustawienia — plik `modul-14.png`
Rozdział: ustawienia aplikacji, wygląd, język, profil obiektu. Dziś ikona SVG, a na pulpicie kafel jest poza siatką (skrót w pasku górnym).
> Scene: Bob holds a large adjustable wrench and leans toward a small control panel with three horizontal sliders and two toggle switches (no labels). A single large gear icon behind the panel. Friendly, focused expression. Hero prop: the control panel with sliders. Secondary: the wrench, the gear.

### A9. Kafel 15, Dom – sieć — plik `modul-15.png`
Rozdział: rachunek za prąd, taryfa G, prosument, a potem opcja przejścia na off-grid. Dziś tylko emoji 🏠.
> Scene: Bob stands next to a small single-family house with a pitched roof, an electricity meter with a round dial mounted on its wall and a power line pole with a cable to the house. He holds an electricity bill sheet with a bar chart on it (graphics only, no words). Hero prop: the house with the meter. Secondary: the bill, the power pole.

### A10. Kafel 16, Firma – sieć — plik `modul-16.png`
Rozdział: taryfy C, moc bierna, moc umowna, opłata mocowa, a potem opcja przejścia. Dziś tylko emoji 🏭.
> Scene: Bob stands next to a grey steel industrial switchgear cabinet with a three-phase meter and a reactive-power compensation bank (several round capacitor units visible through an open door). He holds a tablet showing a power curve with a peak and a dashed limit line (graphics only). A small industrial hall corner in the background as a cut-out shape. Hero prop: the switchgear cabinet. Secondary: the tablet.

## B. Przeróbki istniejących (2)

### B1. Kafel 3, Instalacja PV — plik `modul-03.png`
Cel: ta sama scena, ale z prawdziwym wycięciem zamiast owalu.
> Scene: Bob kneels on a small section of a tiled roof, installing a dark blue solar panel with a frame on mounting rails, smiling at the viewer, one hand on the panel edge. Show only a cut-out slice of the roof and 2-3 panels, no sky, no trees. Hero prop: the solar panel on the roof section.

### B2. Kafel 7, Stress-test zimowy — plik `modul-07.png`
Cel: ta sama scena, ale bez pełnego tła; sam Bob, szafa z baterią i płat śniegu.
> Scene: Bob in the snow, wearing the same outfit, slightly hunched against the cold, one hand on a floor-standing battery cabinet whose display shows a full green battery bar and a snowflake icon (graphics only). Small snow mound under his feet and snow on the cabinet roof, a few soft snowflakes around. No night sky, no house, no window. Hero prop: the battery cabinet in the snow.

## C. Dodatkowe (7)

Format kwadratowy dla awatarów: zamiast „portrait 2:3, 1024x1536” użyj „square 1:1, 1024x1024”, ujęcie od ramion w górę; reszta bloku bez zmian.

### C1. Awatar asystenta AI — plik `bob-asystent-ai.png`
> Scene: Bob, head and shoulders, slightly tilted head, friendly attentive expression as if listening, one hand raised in a small helpful gesture. Wearing a slim single-ear headset. Nothing else in the frame.

### C2. Werdykt zielony — plik `bob-werdykt-ok.png`
Kolory werdyktów 🟢🟡🔴 są nietykalne (`docs/opis-ekranow-dla-ai.md`, sekcja 7), więc znaczenie niesie gest i mina, bez kolorowego tła i bez zielonej poświaty.
> Scene: Bob, head and shoulders, big confident smile, thumbs up. No coloured glow, no coloured background shapes.

### C3. Werdykt żółty — plik `bob-werdykt-uwaga.png`
> Scene: Bob, head and shoulders, raised eyebrows, one palm raised in a "wait, check this" gesture, slightly concerned but calm. No coloured glow, no coloured background shapes.

### C4. Werdykt czerwony — plik `bob-werdykt-blad.png`
> Scene: Bob, head and shoulders, serious firm expression, arms crossed in front of the chest in a stop gesture. No coloured glow, no coloured background shapes.

### C5. Pusty stan — plik `bob-pusty.png`
> Scene: Bob, head and shoulders plus hands, holding an empty open cardboard box toward the viewer with a light shrug and a friendly "nothing here yet" expression.

### C6. Błąd / brak strony — plik `bob-blad-strony.png`
> Scene: Bob, head and shoulders plus hands, scratching his head under the hard hat, puzzled expression, holding a loose unplugged power cable in the other hand.

### C7. Ikona aplikacji (PWA) — plik `bob-ikona.png`
Tło zrobimy u nas (kolor z wyglądu aplikacji), potrzebna jest sama głowa z dużym zapasem na brzegach (ikona maskable ma bezpieczną strefę 80%).
> Scene: Bob's face and yellow hard hat only, centered, front view, big warm smile, shoulders barely visible. The whole head sits inside the central 70% of the square so nothing is cut when the icon is cropped to a circle.

## Kolejność generowania

Najpierw A7 (kafel 13), A8 (14), A9 (15), A10 (16), bo to cztery kafle bez Boba na pulpicie. Potem A1–A6, B1, B2, na końcu C. Pierwszy wygenerowany obraz wyślij mi do oceny: jeśli twarz lub strój odbiegają od referencji, poprawię blok „BOB” zanim wygenerujesz resztę.

## D. Zestaw ikon 3D „zamiast Boba” (D87)

Zestaw dla osób, które nie chcą widzieć maskotki. Wzorcem stylu jest arkusz 16 ikon właściciela z 16.10.2026 (4x4, miękkie 3D, wyraźny jeden motyw, ciepłe światło). Używaj **jako referencji tego arkusza**, nie obrazu Boba.

### Blok „Format i tło” dla ikon (dopisz do każdego promptu)

> Format: square 1:1, 1024x1024 px, PNG with real alpha channel. Transparent background, no tile, no rounded square, no frame, no shadow plate, no glow halo and no light bloom outside the icon edges. One single icon centered, filling about 80% of the canvas. Soft 3D style, clean edges, same lighting direction (from upper left), same level of detail and same outline weight as the attached reference sheet. No text, no letters, no numbers.

### Co dostarczyć

1. **Cały istniejący arkusz** ponownie, jako 16 osobnych plików z powyższym formatem i tłem (bez kafla i poświaty). Nazwy: `ikona-01.png` … `ikona-16.png` wg mapy niżej.
2. **Trzy brakujące ikony** (prompty niżej).

Mapa arkusza na kafle: 1 pinezka na mapie, 2 błyskawica ze słupkami, 3 panel ze słońcem, 4 bateria, 5 wtyczka z kablem, 6 dom z ogrzewaniem, 7 dom z płatkiem śniegu, 9 układ ESP32 z falą wifi, 10 robot ze słupkami, 11 klucz i śrubokręt, 13 antena satelitarna, 14 koło zębate, 15 dom z siecią. Dwie ikony arkusza nie mają kafla (słońce z chmurą, bojler z kroplą) i przydadzą się jako ikony ekranów w modułach, więc też je zapisz jako `ikona-dodatkowa-pogoda.png` i `ikona-dodatkowa-bojler.png`.

### D1. Kafel 8, Bezpieczeństwo i awarie — plik `ikona-08.png`
Dotychczasowa tarcza z haczykiem znaczy „zweryfikowane”, a rozdział dotyczy pożaru i ewakuacji.
> Icon: a red fire extinguisher with a black hose and a small round pressure gauge, standing upright, with a small orange flame icon above it. Warm red and orange accents, silver metal parts.

### D2. Kafel 12, Szybki kalkulator / tryb mobilny — plik `ikona-12.png`
> Icon: a compact handheld calculator with a bright display showing a small bar graphic, tilted slightly, with a tiny camper van silhouette and a small solar panel on top of the calculator body. Blue, silver and yellow accents.

### D3. Kafel 16, Firma – sieć — plik `ikona-16.png`
Parowana z ikoną kafla 15 (dom z siecią).
> Icon: a small industrial building with a sawtooth roof and one chimney, with a cable and a plug on the left and three small glowing nodes connected by thin lines above it, same composition as the house-with-network icon of the reference sheet, but with a factory instead of a house. Grey, blue and orange accents.

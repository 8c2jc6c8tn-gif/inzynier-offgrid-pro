/**
 * M14 — D11 „Przełącznik sieć/wyspa i bezpieczeństwo” (`app/kalkulatory/przelacznik-siec-wyspa/page.tsx`).
 */
export const pl = {
  "UI-PSW-TYTUL": "Przełącznik sieć/wyspa i bezpieczeństwo",
  "UI-PSW-OPIS":
    "Instalacja wyspowa ani agregat nie mogą nigdy podać napięcia do sieci — monter na „wyłączonej” linii może zginąć. Tu sprawdzisz, czy styk z siecią jest bezpieczny. M14, ekran D11 (wspólny dla domu i firmy).",
  "UI-PSW-K1-T": "Przełącznik z pozycją 0",
  "UI-PSW-K1-O":
    "Sieć – 0 – wyspa z blokadą mechaniczną albo stycznikowy układ SZR z blokadą elektryczną i mechaniczną. Pozycja 0 rozłącza oba źródła, zanim połączy drugie.",
  "UI-PSW-K2-T": "Przełączane fazy i przewód neutralny N",
  "UI-PSW-K2-O":
    "Zgodnie z układem sieci w budynku. Szczegół normowy (HD 60364-5-551) jest do doprecyzowania — ustal go z elektrykiem z uprawnieniami.",
  "UI-PSW-K3-T": "Agregat zawsze przez przełącznik",
  "UI-PSW-K3-O":
    "Nigdy „przez gniazdko” ani wtyczką z dwoma bolcami — to podaje napięcie na bolce wtyczki i do sieci. Agregat spalinowy tylko na zewnątrz albo w wydzielonym, wentylowanym miejscu (czad).",
  "UI-PSW-K4-T": "Praca równoległa to co innego",
  "UI-PSW-K4-O":
    "Falownik pracujący równolegle z siecią (scenariusze A i B, także „zero oddawania”) to źródło przyłączone do sieci — wymaga zgłoszenia mikroinstalacji do OSD i certyfikatu NC RfG. Instalacja wyłącznie przełączana zwykle nie jest pracą równoległą (zależy od konfiguracji falownika).",
  "UI-PSW-SPRAWDZ": "Sprawdź swoją instalację",
  "UI-PSW-TRYB": "Jak instalacja styka się z siecią",
  "UI-PSW-TRYB-PRZELACZANY": "Przełączana: sieć albo wyspa (bez synchronizacji)",
  "UI-PSW-TRYB-ROWNOLEGLE": "Równolegle z siecią (falownik hybrydowy / sieciowy)",
  "UI-PSW-TRYB-BEZ-SIECI": "Bez sieci (pełne odłączenie)",
  "UI-PSW-PRZELACZNIK": "Przełącznik",
  "UI-PSW-PRZ-RECZNY": "Ręczny sieć – 0 – wyspa z blokadą mechaniczną",
  "UI-PSW-PRZ-SZR": "SZR z blokadą elektryczną i mechaniczną",
  "UI-PSW-PRZ-BRAK": "Brak, zwykły wyłącznik albo bez blokady",
  "UI-PSW-N": "Czy przełączany jest też przewód N?",
  "UI-PSW-N-NIE-WIEM": "nie wiem",
  "UI-PSW-N-TAK": "tak, fazy i N",
  "UI-PSW-N-NIE": "nie, tylko fazy",
  "UI-PSW-ZGLOSZENIE": "Mikroinstalacja zgłoszona do OSD?",
  "UI-PSW-MA-AGREGAT": "Agregat zasila instalację budynku",
  "UI-PSW-ODPOWIEDZ": "Odpowiedz na pytania powyżej",
  "UI-PSW-STOP": "STOP — {n} zagrożenie(a) życia",
  "UI-PSW-BEZ-STOPOW": "Styk z siecią bez twardych stopów",
  "UI-PSW-POWIAZANE": "Powiązane:",
  "UI-PSW-L-AGREGAT": "agregat prądotwórczy (Moduł 2)",
  "UI-PSW-L-PROCEDURA": "procedura rezygnacji",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-PSW-TYTUL": "Grid/island switch and safety",
  "UI-PSW-OPIS":
    "Neither an island installation nor a generator may ever feed voltage into the grid — a line worker on a “switched-off” line can be killed. Here you check whether the connection to the grid is safe. M14, screen D11 (shared by home and business).",
  "UI-PSW-K1-T": "Switch with a 0 position",
  "UI-PSW-K1-O":
    "Grid – 0 – island with a mechanical interlock, or a contactor-based automatic transfer switch with electrical and mechanical interlocks. Position 0 disconnects both sources before connecting the other one.",
  "UI-PSW-K2-T": "Switched phases and the neutral conductor N",
  "UI-PSW-K2-O":
    "According to the earthing system in the building. The standard's detail (HD 60364-5-551) still needs to be specified — settle it with a licensed electrician.",
  "UI-PSW-K3-T": "Generator always through the switch",
  "UI-PSW-K3-O":
    "Never “through a socket” or with a plug with two pins — that puts voltage on the plug pins and into the grid. A combustion generator only outdoors or in a separate, ventilated place (carbon monoxide).",
  "UI-PSW-K4-T": "Parallel operation is something else",
  "UI-PSW-K4-O":
    "An inverter operating in parallel with the grid (scenarios A and B, including “zero export”) is a grid-connected source — it requires notifying the DSO of the microinstallation and an NC RfG certificate. A purely switched installation is usually not parallel operation (it depends on the inverter configuration).",
  "UI-PSW-SPRAWDZ": "Check your installation",
  "UI-PSW-TRYB": "How the installation meets the grid",
  "UI-PSW-TRYB-PRZELACZANY": "Switched: grid or island (no synchronisation)",
  "UI-PSW-TRYB-ROWNOLEGLE": "In parallel with the grid (hybrid / grid-tie inverter)",
  "UI-PSW-TRYB-BEZ-SIECI": "Without the grid (full disconnection)",
  "UI-PSW-PRZELACZNIK": "Switch",
  "UI-PSW-PRZ-RECZNY": "Manual grid – 0 – island with a mechanical interlock",
  "UI-PSW-PRZ-SZR": "Automatic transfer switch with electrical and mechanical interlocks",
  "UI-PSW-PRZ-BRAK": "None, an ordinary breaker, or no interlock",
  "UI-PSW-N": "Is the N conductor switched too?",
  "UI-PSW-N-NIE-WIEM": "I don't know",
  "UI-PSW-N-TAK": "yes, phases and N",
  "UI-PSW-N-NIE": "no, phases only",
  "UI-PSW-ZGLOSZENIE": "Microinstallation notified to the DSO?",
  "UI-PSW-MA-AGREGAT": "A generator supplies the building installation",
  "UI-PSW-ODPOWIEDZ": "Answer the questions above",
  "UI-PSW-STOP": "STOP — {n} life hazard(s)",
  "UI-PSW-BEZ-STOPOW": "Grid connection without hard stops",
  "UI-PSW-POWIAZANE": "Related:",
  "UI-PSW-L-AGREGAT": "power generator (Module 2)",
  "UI-PSW-L-PROCEDURA": "procedure for giving up the connection",
}

export const ru: Record<Klucz, string> = {
  "UI-PSW-TYTUL": "Переключатель сеть/автономия и безопасность",
  "UI-PSW-OPIS":
    "Ни автономная установка, ни генератор никогда не должны подавать напряжение в сеть — монтёр на «отключённой» линии может погибнуть. Здесь вы проверите, безопасна ли точка соединения с сетью. M14, экран D11 (общий для дома и фирмы).",
  "UI-PSW-K1-T": "Переключатель с положением 0",
  "UI-PSW-K1-O":
    "Сеть – 0 – автономия с механической блокировкой или контакторная схема АВР с электрической и механической блокировкой. Положение 0 отключает оба источника, прежде чем подключить второй.",
  "UI-PSW-K2-T": "Переключаемые фазы и нейтральный проводник N",
  "UI-PSW-K2-O":
    "В соответствии с системой заземления в здании. Нормативная деталь (HD 60364-5-551) требует уточнения — определите её с аттестованным электриком.",
  "UI-PSW-K3-T": "Генератор всегда через переключатель",
  "UI-PSW-K3-O":
    "Никогда «через розетку» или вилкой с двумя штырями — это подаёт напряжение на штыри вилки и в сеть. Двигательный генератор только снаружи или в отдельном вентилируемом месте (угарный газ).",
  "UI-PSW-K4-T": "Параллельная работа — это другое",
  "UI-PSW-K4-O":
    "Инвертор, работающий параллельно с сетью (сценарии A и B, в том числе «нулевая отдача»), — это источник, подключённый к сети: требуется уведомление ОСР о микроустановке и сертификат NC RfG. Исключительно переключаемая установка обычно не является параллельной работой (зависит от конфигурации инвертора).",
  "UI-PSW-SPRAWDZ": "Проверьте свою установку",
  "UI-PSW-TRYB": "Как установка соединяется с сетью",
  "UI-PSW-TRYB-PRZELACZANY": "Переключаемая: сеть или автономия (без синхронизации)",
  "UI-PSW-TRYB-ROWNOLEGLE": "Параллельно с сетью (гибридный / сетевой инвертор)",
  "UI-PSW-TRYB-BEZ-SIECI": "Без сети (полное отключение)",
  "UI-PSW-PRZELACZNIK": "Переключатель",
  "UI-PSW-PRZ-RECZNY": "Ручной сеть – 0 – автономия с механической блокировкой",
  "UI-PSW-PRZ-SZR": "АВР с электрической и механической блокировкой",
  "UI-PSW-PRZ-BRAK": "Нет, обычный выключатель или без блокировки",
  "UI-PSW-N": "Переключается ли также проводник N?",
  "UI-PSW-N-NIE-WIEM": "не знаю",
  "UI-PSW-N-TAK": "да, фазы и N",
  "UI-PSW-N-NIE": "нет, только фазы",
  "UI-PSW-ZGLOSZENIE": "Микроустановка заявлена в ОСР?",
  "UI-PSW-MA-AGREGAT": "Генератор питает установку здания",
  "UI-PSW-ODPOWIEDZ": "Ответьте на вопросы выше",
  "UI-PSW-STOP": "СТОП — {n} угроз(а) жизни",
  "UI-PSW-BEZ-STOPOW": "Соединение с сетью без жёстких остановок",
  "UI-PSW-POWIAZANE": "Связанные:",
  "UI-PSW-L-AGREGAT": "электрогенератор (модуль 2)",
  "UI-PSW-L-PROCEDURA": "процедура отказа",
}

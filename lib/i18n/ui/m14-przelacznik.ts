/**
 * M14 — D11 „Przełącznik sieć/wyspa i bezpieczeństwo” (`app/kalkulatory/przelacznik-siec-wyspa/page.tsx`).
 */
// English: ./m14-przelacznik.en.ts, Russian: ./m14-przelacznik.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
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

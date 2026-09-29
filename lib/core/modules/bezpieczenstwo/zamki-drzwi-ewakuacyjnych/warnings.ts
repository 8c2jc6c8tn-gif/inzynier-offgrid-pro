import type { Warning } from "@/lib/core/calc-result"

export function zamekBlokujeBezZasilaniaAwaryjnego(): Warning {
  return {
    code: "ZAMEK-BLOKUJE-BEZ-ZASILANIA-AWARYJNEGO",
    level: "critical",
    i18nKey: "ZAMEK-BLOKUJE-BEZ-ZASILANIA-AWARYJNEGO",
    technicalMessage:
      "zachowaniePrzyZanikuZasilania != otwiera && maZasilanieAwaryjne = false && maOtwarcieReczneMechaniczne = false (Tresc_Modul_8, Ekran 3 — twardy stop źródła; D53)",
    field: "maZasilanieAwaryjne",
  }
}

export function zamekFailSecure(): Warning {
  return {
    code: "ZAMEK-FAIL-SECURE",
    level: "warning",
    i18nKey: "ZAMEK-FAIL-SECURE",
    technicalMessage:
      "zachowaniePrzyZanikuZasilania != otwiera && (maZasilanieAwaryjne || maOtwarcieReczneMechaniczne) — zasada fail-safe (Tresc_Modul_8, Ekran 3, D) niespełniona, drzwi zależą od UPS albo ręcznego otwarcia (D53)",
    field: "zachowaniePrzyZanikuZasilania",
  }
}

export function zachowanieNieznane(): Warning {
  return {
    code: "ZAMEK-ZACHOWANIE-NIEZNANE",
    level: "info",
    i18nKey: "ZAMEK-ZACHOWANIE-NIEZNANE",
    technicalMessage: "zachowaniePrzyZanikuZasilania = nie-wiem — traktowane jak fail-secure (bezpieczniejsza strona)",
    field: "zachowaniePrzyZanikuZasilania",
  }
}

export function brakPrzyciskuEwakuacyjnego(): Warning {
  return {
    code: "ZAMEK-BRAK-PRZYCISKU",
    level: "warning",
    i18nKey: "ZAMEK-BRAK-PRZYCISKU",
    technicalMessage: "maPrzyciskEwakuacyjny = false (Tresc_Modul_8, Ekran 3, B: zwolnienie po pożarze LUB przycisku)",
    field: "maPrzyciskEwakuacyjny",
  }
}

export function brakZwalnianiaPoAlarmie(): Warning {
  return {
    code: "ZAMEK-BRAK-ZWALNIANIA-PO-ALARMIE",
    level: "warning",
    i18nKey: "ZAMEK-BRAK-ZWALNIANIA-PO-ALARMIE",
    technicalMessage: "zwalnianiePoAlarmiePozarowym = false (Tresc_Modul_8, Ekran 3, B)",
    field: "zwalnianiePoAlarmiePozarowym",
  }
}

export function brakKontaktronu(): Warning {
  return {
    code: "ZAMEK-BRAK-KONTAKTRONU",
    level: "info",
    i18nKey: "ZAMEK-BRAK-KONTAKTRONU",
    technicalMessage: "maKontaktron = false — stan otwarcia drzwi niepotwierdzony (Tresc_Modul_8, Ekran 3, B)",
    field: "maKontaktron",
  }
}

import type { Warning } from "@/lib/core/calc-result"

export function wentylacjaNieWylaczana(): Warning {
  return {
    code: "KLAPY-WENTYLACJA-NIE-WYLACZANA",
    level: "warning",
    i18nKey: "KLAPY-WENTYLACJA-NIE-WYLACZANA",
    technicalMessage: "wentylacjaWylaczanaPrzyPozarze = false — rekuperacja tłoczy dym po domu (Tresc_Modul_8, Ekran 8, B.1)",
    field: "wentylacjaWylaczanaPrzyPozarze",
  }
}

export function klapyNieZamykane(): Warning {
  return {
    code: "KLAPY-NIE-ZAMYKANE",
    level: "warning",
    i18nKey: "KLAPY-NIE-ZAMYKANE",
    technicalMessage: "klapyZamykanePrzyPozarze = false — dym i ogień przechodzą kanałami (Tresc_Modul_8, Ekran 8, B.1)",
    field: "klapyZamykanePrzyPozarze",
  }
}

export function brakSygnalizacjiKlap(): Warning {
  return {
    code: "KLAPY-BRAK-SYGNALIZACJI",
    level: "info",
    i18nKey: "KLAPY-BRAK-SYGNALIZACJI",
    technicalMessage: "sygnalizacjaStanuKlap = false (Biblia v2.0 §8.8)",
    field: "sygnalizacjaStanuKlap",
  }
}

export function brakOddymiania(): Warning {
  return {
    code: "KLAPY-BRAK-ODDYMIANIA",
    level: "info",
    i18nKey: "KLAPY-BRAK-ODDYMIANIA",
    technicalMessage: "maOddymianie = false (Tresc_Modul_8, Ekran 8, A/B.1)",
    field: "maOddymianie",
  }
}

export function brakWentylacjiMechanicznej(): Warning {
  return {
    code: "KLAPY-BRAK-WENTYLACJI-MECHANICZNEJ",
    level: "info",
    i18nKey: "KLAPY-BRAK-WENTYLACJI-MECHANICZNEJ",
    technicalMessage: "wentylacja = brak — klapy i wyłączanie rekuperacji nie dotyczą",
    field: "wentylacja",
  }
}

import type { Warning } from "@/lib/core/calc-result"

export function rs485BezTransceivera(nazwa: string, indeks: number): Warning {
  return {
    code: "KOM-RS485-BEZ-TRANSCEIVERA",
    level: "critical",
    i18nKey: "KOM-RS485-BEZ-TRANSCEIVERA",
    params: { nazwa },
    technicalMessage: `polaczenia[${indeks}]: rs485, maTransceiver=false (Tresc_Modul_9, Ekran 4, 🔴)`,
    field: `polaczenia.${indeks}`,
  }
}

export function canBezTransceivera(nazwa: string, indeks: number): Warning {
  return {
    code: "KOM-CAN-BEZ-TRANSCEIVERA",
    level: "warning",
    i18nKey: "KOM-CAN-BEZ-TRANSCEIVERA",
    params: { nazwa },
    technicalMessage: `polaczenia[${indeks}]: can, maTransceiver=false (Tresc_Modul_9, Ekran 4, B/D — adapter wymagany; 🔴 źródło daje tylko dla RS485)`,
    field: `polaczenia.${indeks}`,
  }
}

export function konfliktAdresu(adres: number, nazwy: string): Warning {
  return {
    code: "KOM-KONFLIKT-ADRESU",
    level: "warning",
    i18nKey: "KOM-KONFLIKT-ADRESU",
    params: { adres, nazwy },
    technicalMessage: `adres ${adres} powtórzony na magistrali RS485 (Biblia §9.4)`,
  }
}

export function roznePredkosci(protokol: string, predkosci: string): Warning {
  return {
    code: "KOM-ROZNE-PREDKOSCI",
    level: "warning",
    i18nKey: "KOM-ROZNE-PREDKOSCI",
    params: { protokol, predkosci },
    technicalMessage: `różne prędkości na magistrali ${protokol}: ${predkosci} (Biblia §9.4)`,
  }
}

export function adresNiepoprawny(indeks: number, value: number): Warning {
  return {
    code: "KOM-ADRES-NIEPOPRAWNY",
    level: "critical",
    i18nKey: "KOM-ADRES-NIEPOPRAWNY",
    technicalMessage: `polaczenia[${indeks}].adres = ${value}, oczekiwano liczby całkowitej >= 1`,
    field: `polaczenia.${indeks}`,
  }
}

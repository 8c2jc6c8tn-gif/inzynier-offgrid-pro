import type { Warning } from "@/lib/core/calc-result"

export function awariaCentrali(): Warning {
  return {
    code: "SSP-AWARIA-CENTRALI",
    level: "critical",
    i18nKey: "SSP-AWARIA-CENTRALI",
    technicalMessage: "stanCentrali = awaria (Tresc_Modul_8, Ekran 5, C — status traktowany priorytetowo)",
    field: "stanCentrali",
  }
}

export function brakSygnaluAlarmu(): Warning {
  return {
    code: "SSP-BRAK-SYGNALU-ALARMU",
    level: "warning",
    i18nKey: "SSP-BRAK-SYGNALU-ALARMU",
    technicalMessage: "odbieraAlarm = false (Tresc_Modul_8, Ekran 5, B)",
    field: "odbieraAlarm",
  }
}

export function brakSygnaluAwarii(): Warning {
  return {
    code: "SSP-BRAK-SYGNALU-AWARII",
    level: "warning",
    i18nKey: "SSP-BRAK-SYGNALU-AWARII",
    technicalMessage: "odbieraAwarie = false — awaria centrali niewidoczna dla systemu (Tresc_Modul_8, Ekran 5, B/C)",
    field: "odbieraAwarie",
  }
}

export function brakSygnaluRozbrojenia(): Warning {
  return {
    code: "SSP-BRAK-SYGNALU-ROZBROJENIA",
    level: "info",
    i18nKey: "SSP-BRAK-SYGNALU-ROZBROJENIA",
    technicalMessage: "odbieraRozbrojenie = false (Tresc_Modul_8, Ekran 5, B)",
    field: "odbieraRozbrojenie",
  }
}

export function brakLogowania(): Warning {
  return {
    code: "SSP-BRAK-LOGOWANIA",
    level: "info",
    i18nKey: "SSP-BRAK-LOGOWANIA",
    technicalMessage: "logujeZdarzenia = false (Tresc_Modul_8, Ekran 5, B)",
    field: "logujeZdarzenia",
  }
}

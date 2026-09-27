import type { Warning } from "@/lib/core/calc-result"

export function pvcPonizejProgu(tempC: number, progC: number): Warning {
  return {
    code: "MROZ-PVC-PONIZEJ-PROGU",
    level: "critical",
    i18nKey: "MROZ-PVC-PONIZEJ-PROGU",
    params: { temp: tempC, prog: progC },
    technicalMessage: `material=PVC, temperaturaMinimalnaC=${tempC} < ${progC} (Tresc_Modul_7, Ekran 13)`,
    field: "materialy",
  }
}

export function xlpePonizejProgu(tempC: number, progC: number): Warning {
  return {
    code: "MROZ-XLPE-PONIZEJ-PROGU",
    level: "warning",
    i18nKey: "MROZ-XLPE-PONIZEJ-PROGU",
    params: { temp: tempC, prog: progC },
    technicalMessage: `material=XLPE, temperaturaMinimalnaC=${tempC} < ${progC} — poza zakresem podanym w źródle; źródło nie wpisuje tego jako 🔴`,
    field: "materialy",
  }
}

export function gumaBezProgu(): Warning {
  return {
    code: "MROZ-GUMA-BEZ-PROGU",
    level: "info",
    i18nKey: "MROZ-GUMA-BEZ-PROGU",
    technicalMessage: "material=guma — źródło nie podaje progu temperatury",
  }
}

export function aluminiumKurczenie(): Warning {
  return {
    code: "MROZ-ALUMINIUM-KURCZENIE",
    level: "info",
    i18nKey: "MROZ-ALUMINIUM-KURCZENIE",
    technicalMessage: "material=aluminium — kurczenie na mrozie, ryzyko poluzowania połączeń (źródło, bez progu)",
  }
}

import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function liczbaSekcjiPozaZakresem(value: number): Warning {
  return {
    code: "LICZBA-SEKCJI-POZA-ZAKRESEM",
    level: "critical",
    message: "Liczba zacienionych sekcji musi być liczbą całkowitą od 0 do 3.",
    technicalMessage: `liczbaZacienionychSekcji = ${value}, oczekiwano 0-3 (liczba całkowita)`,
    field: "liczbaZacienionychSekcji",
  }
}

export function brakZacienienia(): Warning {
  return {
    code: "BRAK-ZACIENIENIA",
    level: "info",
    message: "Panel nie jest zacieniony — brak strat mocy z tego tytułu.",
    technicalMessage: "liczbaZacienionychSekcji = 0",
  }
}

export function zacienienieJednejSekcji(strataPct: number): Warning {
  return {
    code: "ZACIENIENIE-1-SEKCJA",
    level: "warning",
    message: `Zacienienie 1 sekcji obniża moc tego panelu o ok. ${strataPct.toFixed(0)}%. W stringu połączonym szeregowo strata całego stringu może być znacznie większa niż strata samego panelu (zależnie od konfiguracji) — przy regularnym/częściowym zacienieniu rozważ mikroinwertery lub optymalizatory mocy (Ekran 18).`,
    technicalMessage: `liczbaZacienionychSekcji = 1, strataPaneluPct = ${strataPct.toFixed(1)}`,
  }
}

export function zacienienieDwochSekcji(strataPct: number): Warning {
  return {
    code: "ZACIENIENIE-2-SEKCJE",
    level: "critical",
    message: `Zacienienie 2 sekcji obniża moc tego panelu o ok. ${strataPct.toFixed(0)}%. To poważna strata — jeden zacieniony panel potrafi "położyć" produkcję całego szeregowego stringu, nie tylko siebie. Rozważ mikroinwertery lub optymalizatory mocy (Ekran 18).`,
    technicalMessage: `liczbaZacienionychSekcji = 2, strataPaneluPct = ${strataPct.toFixed(1)}`,
  }
}

export function zacienieniePelnegoPanelu(strataPct: number): Warning {
  return {
    code: "ZACIENIENIE-PELNY-PANEL",
    level: "critical",
    message: `Panel jest zacieniony we wszystkich 3 sekcjach — diody bocznikujące pomijają go niemal całkowicie (strata ok. ${strataPct.toFixed(0)}%). Praktycznie nie wnosi mocy do stringu; rozważ mikroinwertery lub optymalizatory mocy (Ekran 18).`,
    technicalMessage: `liczbaZacienionychSekcji = 3, strataPaneluPct = ${strataPct.toFixed(1)}`,
  }
}

/**
 * Set templates of Screen 3 (M12, dawne 8.3 + 8.16). Each template carries only the NAMES of typical loads
 * (and whether a load counts per person) — never powers or hours (Directive #1; the Bible's "domyślna moc
 * i czas pracy" would be guessed numbers, D33 allows example powers only as hints). Sources: kamper — Biblia
 * §12.3 ("lodówka 12V, oświetlenie LED, ładowarka USB, pompa wody, wentylator"); kemping — Tresc E3 C
 * ("telefon, lodówka turystyczna, oświetlenie LED, radio"); jacht, domek letniskowy, warsztat — expert
 * lists ✅🤖 (the source names the categories only).
 */
export type SzablonZestawu = "kamper" | "jacht" | "domek" | "warsztat" | "kemping"

export type PozycjaSzablonu = { nazwa: string; naOsobe: boolean }

export const SZABLONY: Record<SzablonZestawu, PozycjaSzablonu[]> = {
  kamper: [
    { nazwa: "UI-M12-SZ-U-LODOWKA-12V", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-OSWIETLENIE-LED", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-LADOWARKA-USB", naOsobe: true },
    { nazwa: "UI-M12-SZ-U-POMPA-WODY", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-WENTYLATOR", naOsobe: false },
  ],
  jacht: [
    { nazwa: "UI-M12-SZ-U-SWIATLA-NAWIGACYJNE", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-PLOTER-GPS", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-RADIO-VHF", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-LODOWKA-12V", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-POMPA-ZEZOWA", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-LADOWARKA-USB", naOsobe: true },
  ],
  domek: [
    { nazwa: "UI-M12-SZ-U-LODOWKA", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-OSWIETLENIE-LED", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-ROUTER", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-POMPA-WODY", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-TELEWIZOR", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-LADOWARKA-USB", naOsobe: true },
  ],
  warsztat: [
    { nazwa: "UI-M12-SZ-U-OSWIETLENIE-LED", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-ELEKTRONARZEDZIA", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-LADOWARKA-NARZEDZI", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-RADIO", naOsobe: false },
  ],
  kemping: [
    { nazwa: "UI-M12-SZ-U-TELEFON", naOsobe: true },
    { nazwa: "UI-M12-SZ-U-LODOWKA-TURYSTYCZNA", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-OSWIETLENIE-LED", naOsobe: false },
    { nazwa: "UI-M12-SZ-U-RADIO", naOsobe: false },
  ],
}

export const KOLEJNOSC_SZABLONOW: SzablonZestawu[] = ["kamper", "jacht", "domek", "warsztat", "kemping"]

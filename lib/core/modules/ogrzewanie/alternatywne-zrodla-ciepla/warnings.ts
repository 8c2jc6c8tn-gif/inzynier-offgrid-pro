import type { Warning } from "@/lib/core/calc-result"

/**
 * Source warning (5.32): without power the circulation pump stops — with no gravity cooling the water jacket
 * overheats and can boil and burst. 🔴 by owner decision D69 (01.10.2026; the source only calls it a warning).
 */
export function kominekPrzegrzanieBezPradu(): Warning {
  return {
    code: "ALT-KOMINEK-PRZEGRZANIE",
    level: "critical",
    i18nKey: "ALT-KOMINEK-PRZEGRZANIE",
    technicalMessage: "kominek z płaszczem wodnym bez zabezpieczenia przed przegrzaniem przy braku prądu (schładzanie grawitacyjne)",
    field: "kominekZabezpieczenieBezPradu",
  }
}

/** Source warning (5.34): IR is spot heating — it will not replace full heating on a frosty night. */
export function irNieZastapiOgrzewania(): Warning {
  return {
    code: "ALT-IR-PUNKTOWE",
    level: "warning",
    i18nKey: "ALT-IR-PUNKTOWE",
    technicalMessage: "grzejniki IR planowane jako ogrzewanie podstawowe — źródło: ogrzewanie punktowe",
    field: "irJakoPodstawowe",
  }
}

/** Source warning (5.35): a ceiling with mats must be insulated, otherwise you heat the floor slab above. */
export function matyStropNieizolowany(): Warning {
  return {
    code: "ALT-MATY-STROP",
    level: "warning",
    i18nKey: "ALT-MATY-STROP",
    technicalMessage: "maty kapilarne na suficie pod nieizolowanym stropem",
    field: "matyStropNieizolowany",
  }
}

/** Source warning (5.36): PCM costs more than water — use it where space is short. */
export function pcmDrozszyOdWody(): Warning {
  return {
    code: "ALT-PCM-KOSZT",
    level: "info",
    i18nKey: "ALT-PCM-KOSZT",
    technicalMessage: "PCM droższy od wody — stosować tam, gdzie brakuje miejsca",
  }
}

/** The electric boiler (5.33) has its own screen. */
export function kociolOsobnyEkran(): Warning {
  return {
    code: "ALT-KOCIOL-OSOBNY-EKRAN",
    level: "info",
    i18nKey: "ALT-KOCIOL-OSOBNY-EKRAN",
    technicalMessage: "kocioł elektryczny liczony na osobnym ekranie /kalkulatory/kociol-elektryczny",
    field: "zrodlo",
  }
}

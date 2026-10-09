"use client"

/**
 * Rodzaj obiektu projektu (Ustawienia) — wspólny wybór dla całej aplikacji: budynek, kamper, altana lub domek ROD, garaż.
 * Mikroinstalacja liczy zużycie z listy odbiorników i miesięcy użytkowania (`lib/obiekt/`). Zapis autosave (draft `profil-obiektu`).
 */
import Link from "next/link"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import {
  czyMikroinstalacja,
  KLUCZ_NAZWY_OBIEKTU,
  KLUCZ_PROFILU_OBIEKTU,
  PROFIL_OBIEKTU_POCZATKOWY,
  RODZAJE_OBIEKTU,
  type ProfilObiektu,
  type RodzajObiektu,
} from "@/lib/obiekt/profil-obiektu"

const KLUCZE_MIESIECY = Array.from({ length: 12 }, (_, i) => `UI-MIES-${String(i + 1).padStart(2, "0")}`)

export function ObiektSekcja() {
  const t = useTranslate()
  const [profil, setProfil] = usePersistedDraft<ProfilObiektu>(KLUCZ_PROFILU_OBIEKTU, PROFIL_OBIEKTU_POCZATKOWY)
  const miesiace = profil.miesiaceUzytkowania.length === 12 ? profil.miesiaceUzytkowania : PROFIL_OBIEKTU_POCZATKOWY.miesiaceUzytkowania
  const mikro = czyMikroinstalacja(profil.rodzaj)

  return (
    <div className="flex flex-col gap-3 border-t pt-6">
      <div>
        <h2 className="text-h2 font-semibold">{t("UI-OBIEKT-TYTUL")}</h2>
        <p className="mt-1 text-small text-muted-foreground">{t("UI-OBIEKT-OPIS")}</p>
      </div>
      <PoleSelect
        label={t("UI-OBIEKT-RODZAJ")}
        value={profil.rodzaj}
        onChange={(e) => setProfil((prev) => ({ ...prev, rodzaj: e.target.value as RodzajObiektu | "" }))}
        pomoc={<PomocPola ekran="ustawienia-obiekt" pole="rodzaj" />}
      >
        <option value="">{t("UI-OBIEKT-WYBIERZ")}</option>
        {RODZAJE_OBIEKTU.map((r) => (
          <option key={r} value={r}>
            {t(KLUCZ_NAZWY_OBIEKTU[r])}
          </option>
        ))}
      </PoleSelect>
      {mikro && (
        <>
          <p className="text-small text-muted-foreground">{t("UI-OBIEKT-MIKRO-NOTA")}</p>
          <fieldset className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-3">
            <legend className="flex items-center gap-2 px-1 text-small font-medium">
              {t("UI-OBIEKT-MIESIACE")}
              <PomocPola ekran="ustawienia-obiekt" pole="miesiace" />
            </legend>
            {KLUCZE_MIESIECY.map((klucz, i) => (
              <PoleCheckbox
                key={klucz}
                id={`obiekt-miesiac-${i + 1}`}
                label={t(klucz)}
                checked={miesiace[i] ?? false}
                onChange={(e) =>
                  setProfil((prev) => ({
                    ...prev,
                    miesiaceUzytkowania: miesiace.map((v, j) => (j === i ? e.target.checked : v)),
                  }))
                }
              />
            ))}
          </fieldset>
          {!miesiace.some(Boolean) && (
            <p role="status" className="text-small text-muted-foreground">
              {t("UI-OBIEKT-BRAK-MIESIECY")}
            </p>
          )}
          <Link href="/kalkulatory/zuzycie-per-urzadzenie" className="text-small underline">
            {t("UI-OBIEKT-LINK-ODBIORNIKI")}
          </Link>
        </>
      )}
    </div>
  )
}

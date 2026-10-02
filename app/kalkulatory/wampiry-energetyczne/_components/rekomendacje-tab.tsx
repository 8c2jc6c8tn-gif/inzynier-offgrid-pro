"use client"

import { useMemo } from "react"
import { calculatePorownanieMetod, wybierzMetodeDlaKategorii } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/calculator"
import type { EtykietaRekomendacji } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/calculator"
import { KATEGORIE_URZADZEN, METODY_ODLACZANIA } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/constants"
import type { DoborMetodyInput, KategoriaUrzadzeniaId, MetodaOdlaczaniaId, PorownanieMetodInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/rekomendacje-sprzetowe/input"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { StanPusty } from "@/components/ui/stany"
import { KLUCZ_KATEGORII_URZADZEN, KLUCZ_METODY_ODLACZANIA, WPISY_METODY, etykieta, tlumaczParamsEtykiet } from "@/components/zapotrzebowanie/etykiety-stalych"
import { useTranslate } from "@/lib/i18n/language-context"

const ETYKIETA_REKOMENDACJI: Record<EtykietaRekomendacji, string> = {
  "listwa-z-wylacznikiem": "UI-WAMENE-COMREKTAB-LISTWA-WYLACZNIKIEM",
  "gniazdo-wifi": "UI-WAMENE-COMREKTAB-GNIAZDO-WIFI",
  "gniazdo-z-timerem": "UI-WAMENE-COMREKTAB-GNIAZDO-TIMEREM",
  "obwod-w-rozdzielni-ze-stycznikiem": "UI-WAMENE-COMREKTAB-OBWOD-ROZDZIELNI-STYCZNIKIEM",
}

export function RekomendacjeTab({
  porownanie,
  dobor,
  onChangePorownanie,
  onChangeDobor,
}: {
  porownanie: PorownanieMetodInput
  dobor: DoborMetodyInput
  onChangePorownanie: (v: PorownanieMetodInput) => void
  onChangeDobor: (v: DoborMetodyInput) => void
}) {
  const t = useTranslate()
  const wynikPorownanie = useMemo(() => calculatePorownanieMetod(porownanie), [porownanie])
  const wynikDobor = useMemo(() => wybierzMetodeDlaKategorii(dobor), [dobor])

  function dodajMetode(id: MetodaOdlaczaniaId) {
    if (porownanie.metody.some((m) => m.id === id)) return
    onChangePorownanie({ metody: [...porownanie.metody, { id, kosztZakupuZl: 0, rocznaOszczednoscZl: 0 }] })
  }

  function usunMetode(id: MetodaOdlaczaniaId) {
    onChangePorownanie({ metody: porownanie.metody.filter((m) => m.id !== id) })
  }

  function aktualizujMetode(id: MetodaOdlaczaniaId, patch: Partial<{ kosztZakupuZl: number; rocznaOszczednoscZl: number }>) {
    onChangePorownanie({ metody: porownanie.metody.map((m) => (m.id === id ? { ...m, ...patch } : m)) })
  }

  const dostepneMetody = METODY_ODLACZANIA.filter((m) => !porownanie.metody.some((wybrana) => wybrana.id === m.id))

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-small font-semibold">{t("UI-WAMENE-COMREKTAB-POROWNANIE-METOD-ODLACZANIA")}</h2>
        <p className="text-caption text-muted-foreground">
          {t("UI-WAMENE-COMREKTAB-WPISZ-KOSZT-ZAKUPU")}
        </p>

        <ul className="flex flex-col gap-2">
          {porownanie.metody.map((m) => {
            const def = METODY_ODLACZANIA.find((d) => d.id === m.id)
            return (
              <li key={m.id} className="flex flex-wrap items-center gap-2 rounded-md border p-3 text-small">
                <span className="min-w-24 flex-1 font-medium">{etykieta(t, KLUCZ_METODY_ODLACZANIA, m.id, def?.label ?? m.id)}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder={t("UI-WAMENE-COMREKTAB-KOSZT")}
                  value={m.kosztZakupuZl || ""}
                  onChange={(e) => aktualizujMetode(m.id, { kosztZakupuZl: Number(e.target.value) })}
                  className="min-h-10 w-24 rounded-md border border-input bg-background px-2"
                  aria-label={t("UI-WAMENE-COMREKTAB-KOSZT-ZAKUPU", { p: etykieta(t, KLUCZ_METODY_ODLACZANIA, m.id, def?.label ?? m.id) })}
                />
                <PomocPola ekran="wampiry-energetyczne" pole="koszt" />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder={t("UI-WAMENE-COMREKTAB-OSZCZ-ROK")}
                  value={m.rocznaOszczednoscZl || ""}
                  onChange={(e) => aktualizujMetode(m.id, { rocznaOszczednoscZl: Number(e.target.value) })}
                  className="min-h-10 w-28 rounded-md border border-input bg-background px-2"
                  aria-label={t("UI-WAMENE-COMREKTAB-ROCZNA-OSZCZEDNOSC", { p: etykieta(t, KLUCZ_METODY_ODLACZANIA, m.id, def?.label ?? m.id) })}
                />
                <PomocPola ekran="wampiry-energetyczne" pole="oszczednosc" />
                <button
                  type="button"
                  onClick={() => usunMetode(m.id)}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-WAMENE-COMREKTAB-USUN-2", { p: etykieta(t, KLUCZ_METODY_ODLACZANIA, m.id, def?.label ?? m.id) })}
                >
                  {t("UI-WAMENE-COMREKTAB-USUN")}
                </button>
              </li>
            )
          })}
        </ul>

        {dostepneMetody.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dostepneMetody.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => dodajMetode(m.id)}
                className="rounded-full border px-3 py-1 text-caption hover:bg-muted"
              >
                + {etykieta(t, KLUCZ_METODY_ODLACZANIA, m.id, m.label)}
              </button>
            ))}
          </div>
        )}

        {wynikPorownanie.status === "INCOMPLETE" ? (
          <StanPusty tytul={t("UI-WAMENE-COMREKTAB-DODAJ-PRZYNAJMNIEJ-JEDNA")} />
        ) : (
          <WerdyktPanel poziom={poziomZStatusu(wynikPorownanie.status)}>
            <ul className="flex flex-col gap-1 text-small">
              {wynikPorownanie.value.metody.map((m) => {
                const def = METODY_ODLACZANIA.find((d) => d.id === m.id)
                return (
                  <li key={m.id}>
                    <span className="font-medium">{etykieta(t, KLUCZ_METODY_ODLACZANIA, m.id, def?.label ?? m.id)}</span>:{" "}
                    {m.okresZwrotuMiesiecy === null ? t("UI-WAMENE-COMREKTAB-KOSZT-ZWROCI") : t("UI-WAMENE-COMREKTAB-ZWROT-MIES", { okresZwrotuMiesiecy: m.okresZwrotuMiesiecy.toFixed(1) })}
                  </li>
                )
              })}
            </ul>
            <WynikSzczegoly
              assumptions={wynikPorownanie.assumptions}
              warnings={wynikPorownanie.warnings.map((w) => ({ ...w, params: tlumaczParamsEtykiet(t, w.params, WPISY_METODY) }))}
              formula={wynikPorownanie.formula}
            />
          </WerdyktPanel>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t pt-6">
        <h2 className="text-small font-semibold">{t("UI-WAMENE-COMREKTAB-DOBOR-METODY-PER")}</h2>
        <PoleSelect
          label={t("UI-WAMENE-COMREKTAB-KATEGORIA-URZADZENIA")}
          value={dobor.kategoria}
          onChange={(e) => onChangeDobor({ kategoria: e.target.value as KategoriaUrzadzeniaId })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="kategoria" />}
        >
          {KATEGORIE_URZADZEN.map((k) => (
            <option key={k.id} value={k.id}>
              {etykieta(t, KLUCZ_KATEGORII_URZADZEN, k.id, k.label)}
            </option>
          ))}
        </PoleSelect>

        <WerdyktPanel poziom="ok" etykieta={t("UI-WAMENE-COMREKTAB-REKOMENDOWANA-METODA")}>
          <p className="mt-1 text-h1 font-semibold">{t(ETYKIETA_REKOMENDACJI[wynikDobor.metoda])}</p>
        </WerdyktPanel>
      </section>
    </div>
  )
}

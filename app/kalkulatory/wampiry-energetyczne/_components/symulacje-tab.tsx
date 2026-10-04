"use client"

import { useMemo } from "react"
import { calculateAutonomiaStandby, calculateKosztRocznyStandby, calculateWplywNaDobor } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/symulacje-i-raporty/calculator"
import type { AutonomiaStandbyInput, KosztRocznyStandbyInput, WplywNaDoborInput } from "@/lib/core/modules/zapotrzebowanie/wampiry-energetyczne/symulacje-i-raporty/input"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomZStatusu } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

function PrzyciskWpiszSume({ sumaStandbyW, onClick }: { sumaStandbyW: number; onClick: () => void }) {
  const t = useTranslate()
  if (sumaStandbyW <= 0) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className="self-start text-caption text-muted-foreground underline hover:text-foreground"
    >
      {t("UI-WAMENE-COMSYMTAB-WPISZ-SUME-KATALOGU", { sumaStandbyW: sumaStandbyW.toFixed(1) })}
    </button>
  )
}

export function SymulacjeTab({
  autonomia,
  kosztRoczny,
  wplywNaDobor,
  onChangeAutonomia,
  onChangeKosztRoczny,
  onChangeWplywNaDobor,
  sumaStandbyW,
}: {
  autonomia: AutonomiaStandbyInput
  kosztRoczny: KosztRocznyStandbyInput
  wplywNaDobor: WplywNaDoborInput
  onChangeAutonomia: (v: AutonomiaStandbyInput) => void
  onChangeKosztRoczny: (v: KosztRocznyStandbyInput) => void
  onChangeWplywNaDobor: (v: WplywNaDoborInput) => void
  sumaStandbyW: number
}) {
  const t = useTranslate()
  const wynikAutonomia = useMemo(() => calculateAutonomiaStandby(autonomia), [autonomia])
  const wynikKoszt = useMemo(() => calculateKosztRocznyStandby(kosztRoczny), [kosztRoczny])
  const wynikDobor = useMemo(() => calculateWplywNaDobor(wplywNaDobor), [wplywNaDobor])

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-small font-semibold">{t("UI-WAMENE-COMSYMTAB-AUTONOMIA-BATERII-POBORZE")}</h2>
        <PrzyciskWpiszSume sumaStandbyW={sumaStandbyW} onClick={() => onChangeAutonomia({ ...autonomia, standbyW: sumaStandbyW })} />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-POBOR-STANDBY")}
          unit="W"
          type="number"
          inputMode="decimal"
          value={autonomia.standbyW || ""}
          onChange={(e) => onChangeAutonomia({ ...autonomia, standbyW: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standby" />}
        />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-POBOR-REDUKCJI-OPCJONALNIE")}
          unit="W"
          type="number"
          inputMode="decimal"
          value={autonomia.standbyZredukowanyW || ""}
          onChange={(e) => onChangeAutonomia({ ...autonomia, standbyZredukowanyW: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standbyRedukcja" />}
        />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-POJEMNOSC-UZYTECZNA-BATERII")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={autonomia.pojemnoscUzytecznaKwh || ""}
          onChange={(e) => onChangeAutonomia({ ...autonomia, pojemnoscUzytecznaKwh: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-DOD-GLEBOKOSC-ROZLADOWANIA")}
          unit="%"
          type="number"
          inputMode="decimal"
          value={autonomia.dodPct || ""}
          onChange={(e) => onChangeAutonomia({ ...autonomia, dodPct: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="dod" />}
        />

        {wynikAutonomia.status === "INCOMPLETE" ? (
          <StanPusty tytul={t("UI-WAMENE-COMSYMTAB-WPISZ-POBOR-STANDBY")} />
        ) : (
          <WerdyktPanel poziom={poziomZStatusu(wynikAutonomia.status)}>
            <WynikGlowny>{wynikAutonomia.value.godzinyDoWyczerpania.toFixed(1)} h</WynikGlowny>
            {wynikAutonomia.value.godzinyDoWyczerpaniaZredukowany !== null && (
              <p className="mt-1 text-small">
                {t("UI-WAMENE-COMSYMTAB-REDUKCJI", { godzinyDoWyczerpaniaZredukowany: wynikAutonomia.value.godzinyDoWyczerpaniaZredukowany.toFixed(1) })}
              </p>
            )}
            <WynikSzczegoly assumptions={wynikAutonomia.assumptions} warnings={wynikAutonomia.warnings} formula={wynikAutonomia.formula} formulaKey={wynikAutonomia.formulaKey} formulaParams={wynikAutonomia.formulaParams} />
          </WerdyktPanel>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t pt-6">
        <h2 className="text-small font-semibold">{t("UI-WAMENE-COMSYMTAB-ROCZNY-KOSZT-POBORU")}</h2>
        <PrzyciskWpiszSume sumaStandbyW={sumaStandbyW} onClick={() => onChangeKosztRoczny({ ...kosztRoczny, standbyW: sumaStandbyW })} />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-POBOR-STANDBY")}
          unit="W"
          type="number"
          inputMode="decimal"
          value={kosztRoczny.standbyW || ""}
          onChange={(e) => onChangeKosztRoczny({ ...kosztRoczny, standbyW: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standby" />}
        />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-CENA-ENERGII")}
          unit={t("UI-J-ZL-KWH")}
          type="number"
          inputMode="decimal"
          value={kosztRoczny.cenaEnergiiZlZaKwh || ""}
          onChange={(e) => onChangeKosztRoczny({ ...kosztRoczny, cenaEnergiiZlZaKwh: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="cenaEnergii" />}
        />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-CALKOWITE-ROCZNE-ZUZYCIE")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={kosztRoczny.zapotrzebowanieCalkowiteRocznaKwh || ""}
          onChange={(e) => onChangeKosztRoczny({ ...kosztRoczny, zapotrzebowanieCalkowiteRocznaKwh: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="zuzycieRoczne" />}
        />

        {wynikKoszt.status === "INCOMPLETE" ? (
          <StanPusty tytul={t("UI-WAMENE-COMSYMTAB-WPISZ-POBOR-STANDBY-2")} />
        ) : (
          <WerdyktPanel poziom={poziomZStatusu(wynikKoszt.status)}>
            <WynikGlowny>{t("UI-WAMENE-COMSYMTAB-ROK", { kosztRocznyZl: wynikKoszt.value.kosztRocznyZl.toFixed(0) })}</WynikGlowny>
            <p className="mt-1 text-small">
              {t("UI-WAMENE-COMSYMTAB-KWH-ROK", { energiaRocznaKwh: wynikKoszt.value.energiaRocznaKwh.toFixed(0) })}
              {wynikKoszt.value.udzialProcentowy !== null && ` ${t("UI-WAMENE-COMSYMTAB-CALKOWITEGO-ZUZYCIA", { udzialProcentowy: wynikKoszt.value.udzialProcentowy.toFixed(1) })}`}
            </p>
            <WynikSzczegoly assumptions={wynikKoszt.assumptions} warnings={wynikKoszt.warnings} formula={wynikKoszt.formula} formulaKey={wynikKoszt.formulaKey} formulaParams={wynikKoszt.formulaParams} />
          </WerdyktPanel>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t pt-6">
        <h2 className="text-small font-semibold">{t("UI-WAMENE-COMSYMTAB-WPLYW-ELIMINACJI-STANDBY")}</h2>
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-DOBOWA-ENERGIA-STANDBY")}
          unit={t("UI-J-KWH-DOBA")}
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.standbyDobowaKwh || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, standbyDobowaKwh: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standbyDobowa" />}
        />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-PLANOWANA-ELIMINACJA-STANDBY")}
          unit="%"
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.eliminacjaPct || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, eliminacjaPct: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="eliminacja" />}
        />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-DNI-AUTONOMII")}
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.dniAutonomii || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, dniAutonomii: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="dniAutonomii" />}
        />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-SPRAWNOSC-FALOWNIKA")}
          unit="%"
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.sprawnoscFalownikaPct || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, sprawnoscFalownikaPct: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="sprawnosc" />}
        />
        <Pole
          label={t("UI-WAMENE-COMSYMTAB-DOD-GLEBOKOSC-ROZLADOWANIA")}
          unit="%"
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.dodPct || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, dodPct: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="dod" />}
        />

        {wynikDobor.status === "INCOMPLETE" ? (
          <StanPusty tytul={t("UI-WAMENE-COMSYMTAB-WPISZ-DOBOWA-ENERGIE")} />
        ) : (
          <WerdyktPanel poziom={poziomZStatusu(wynikDobor.status)}>
            <WynikGlowny>{t("UI-WAMENE-COMSYMTAB-KWH-MNIEJ", { redukcjaPojemnosciKwh: wynikDobor.value.redukcjaPojemnosciKwh.toFixed(2) })}</WynikGlowny>
            <p className="mt-1 text-small">{t("UI-WAMENE-COMSYMTAB-REDUKCJA-POBORU-KWH", { redukcjaDobowaKwh: wynikDobor.value.redukcjaDobowaKwh.toFixed(2) })}</p>
            <WynikSzczegoly assumptions={wynikDobor.assumptions} warnings={wynikDobor.warnings} formula={wynikDobor.formula} formulaKey={wynikDobor.formulaKey} formulaParams={wynikDobor.formulaParams} />
          </WerdyktPanel>
        )}
      </section>
    </div>
  )
}

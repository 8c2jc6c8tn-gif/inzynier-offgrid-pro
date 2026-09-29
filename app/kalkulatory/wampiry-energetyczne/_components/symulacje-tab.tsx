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

function PrzyciskWpiszSume({ sumaStandbyW, onClick }: { sumaStandbyW: number; onClick: () => void }) {
  if (sumaStandbyW <= 0) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className="self-start text-caption text-muted-foreground underline hover:text-foreground"
    >
      Wpisz sumę z Katalogu + Pomiaru ({sumaStandbyW.toFixed(1)} W)
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
  const wynikAutonomia = useMemo(() => calculateAutonomiaStandby(autonomia), [autonomia])
  const wynikKoszt = useMemo(() => calculateKosztRocznyStandby(kosztRoczny), [kosztRoczny])
  const wynikDobor = useMemo(() => calculateWplywNaDobor(wplywNaDobor), [wplywNaDobor])

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-small font-semibold">Autonomia baterii przy poborze standby</h2>
        <PrzyciskWpiszSume sumaStandbyW={sumaStandbyW} onClick={() => onChangeAutonomia({ ...autonomia, standbyW: sumaStandbyW })} />
        <Pole
          label="Pobór standby"
          unit="W"
          type="number"
          inputMode="decimal"
          value={autonomia.standbyW || ""}
          onChange={(e) => onChangeAutonomia({ ...autonomia, standbyW: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standby" />}
        />
        <Pole
          label="Pobór po redukcji (opcjonalnie)"
          unit="W"
          type="number"
          inputMode="decimal"
          value={autonomia.standbyZredukowanyW || ""}
          onChange={(e) => onChangeAutonomia({ ...autonomia, standbyZredukowanyW: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standbyRedukcja" />}
        />
        <Pole
          label="Pojemność użyteczna baterii"
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={autonomia.pojemnoscUzytecznaKwh || ""}
          onChange={(e) => onChangeAutonomia({ ...autonomia, pojemnoscUzytecznaKwh: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="pojemnosc" />}
        />
        <Pole
          label="DoD (głębokość rozładowania)"
          unit="%"
          type="number"
          inputMode="decimal"
          value={autonomia.dodPct || ""}
          onChange={(e) => onChangeAutonomia({ ...autonomia, dodPct: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="dod" />}
        />

        {wynikAutonomia.status === "INCOMPLETE" ? (
          <StanPusty tytul="Wpisz pobór standby i pojemność użyteczną baterii." />
        ) : (
          <WerdyktPanel poziom={poziomZStatusu(wynikAutonomia.status)}>
            <WynikGlowny>{wynikAutonomia.value.godzinyDoWyczerpania.toFixed(1)} h</WynikGlowny>
            {wynikAutonomia.value.godzinyDoWyczerpaniaZredukowany !== null && (
              <p className="mt-1 text-small">
                Po redukcji: {wynikAutonomia.value.godzinyDoWyczerpaniaZredukowany.toFixed(1)} h
              </p>
            )}
            <WynikSzczegoly assumptions={wynikAutonomia.assumptions} warnings={wynikAutonomia.warnings} formula={wynikAutonomia.formula} />
          </WerdyktPanel>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t pt-6">
        <h2 className="text-small font-semibold">Roczny koszt poboru standby</h2>
        <PrzyciskWpiszSume sumaStandbyW={sumaStandbyW} onClick={() => onChangeKosztRoczny({ ...kosztRoczny, standbyW: sumaStandbyW })} />
        <Pole
          label="Pobór standby"
          unit="W"
          type="number"
          inputMode="decimal"
          value={kosztRoczny.standbyW || ""}
          onChange={(e) => onChangeKosztRoczny({ ...kosztRoczny, standbyW: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standby" />}
        />
        <Pole
          label="Cena energii"
          unit="zł/kWh"
          type="number"
          inputMode="decimal"
          value={kosztRoczny.cenaEnergiiZlZaKwh || ""}
          onChange={(e) => onChangeKosztRoczny({ ...kosztRoczny, cenaEnergiiZlZaKwh: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="cenaEnergii" />}
        />
        <Pole
          label="Całkowite roczne zużycie domu (opcjonalnie)"
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={kosztRoczny.zapotrzebowanieCalkowiteRocznaKwh || ""}
          onChange={(e) => onChangeKosztRoczny({ ...kosztRoczny, zapotrzebowanieCalkowiteRocznaKwh: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="zuzycieRoczne" />}
        />

        {wynikKoszt.status === "INCOMPLETE" ? (
          <StanPusty tytul="Wpisz pobór standby i cenę energii." />
        ) : (
          <WerdyktPanel poziom={poziomZStatusu(wynikKoszt.status)}>
            <WynikGlowny>{wynikKoszt.value.kosztRocznyZl.toFixed(0)} zł/rok</WynikGlowny>
            <p className="mt-1 text-small">
              {wynikKoszt.value.energiaRocznaKwh.toFixed(0)} kWh/rok
              {wynikKoszt.value.udzialProcentowy !== null && ` · ${wynikKoszt.value.udzialProcentowy.toFixed(1)}% całkowitego zużycia`}
            </p>
            <WynikSzczegoly assumptions={wynikKoszt.assumptions} warnings={wynikKoszt.warnings} formula={wynikKoszt.formula} />
          </WerdyktPanel>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t pt-6">
        <h2 className="text-small font-semibold">Wpływ eliminacji standby na dobór systemu</h2>
        <Pole
          label="Dobowa energia standby"
          unit="kWh/dobę"
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.standbyDobowaKwh || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, standbyDobowaKwh: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="standbyDobowa" />}
        />
        <Pole
          label="Planowana eliminacja standby"
          unit="%"
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.eliminacjaPct || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, eliminacjaPct: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="eliminacja" />}
        />
        <Pole
          label="Dni autonomii"
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.dniAutonomii || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, dniAutonomii: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="dniAutonomii" />}
        />
        <Pole
          label="Sprawność falownika"
          unit="%"
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.sprawnoscFalownikaPct || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, sprawnoscFalownikaPct: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="sprawnosc" />}
        />
        <Pole
          label="DoD (głębokość rozładowania)"
          unit="%"
          type="number"
          inputMode="decimal"
          value={wplywNaDobor.dodPct || ""}
          onChange={(e) => onChangeWplywNaDobor({ ...wplywNaDobor, dodPct: Number(e.target.value) })}
          pomoc={<PomocPola ekran="wampiry-energetyczne" pole="dod" />}
        />

        {wynikDobor.status === "INCOMPLETE" ? (
          <StanPusty tytul="Wpisz dobową energię standby i procent planowanej eliminacji." />
        ) : (
          <WerdyktPanel poziom={poziomZStatusu(wynikDobor.status)}>
            <WynikGlowny>{wynikDobor.value.redukcjaPojemnosciKwh.toFixed(2)} kWh mniej</WynikGlowny>
            <p className="mt-1 text-small">Redukcja poboru: {wynikDobor.value.redukcjaDobowaKwh.toFixed(2)} kWh/dobę</p>
            <WynikSzczegoly assumptions={wynikDobor.assumptions} warnings={wynikDobor.warnings} formula={wynikDobor.formula} />
          </WerdyktPanel>
        )}
      </section>
    </div>
  )
}

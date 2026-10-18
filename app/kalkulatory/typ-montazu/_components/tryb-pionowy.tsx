"use client"

import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculatePionowy } from "@/lib/core/modules/pv/typ-montazu/pionowy"
import { BledyDanych, MIESIACE, n, PoleAzymutu, poziomZOstrzezen, useTabelaNapromieniowania, useFormaty } from "./wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

type Seed = { azymutDeg: string; wysokoscDolnejKrawedziM: string; wysokoscTrawySnieguCm: string }
const PUSTY: Seed = { azymutDeg: "", wysokoscDolnejKrawedziM: "", wysokoscTrawySnieguCm: "" }

/** Słupki różnicy pion − najlepszy kąt stały [%] dla 12 miesięcy; w górę = pion zbiera więcej. */
function WykresRoznicy({ wartosci }: { wartosci: (number | null)[] }) {
  const t = useTranslate()
  const { znak } = useFormaty()
  const W = 360
  const H = 150
  const max = Math.max(...wartosci.map((v) => Math.abs(v ?? 0)), 1)
  const zero = H / 2
  const szer = W / 12
  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full text-foreground" role="img" aria-label={t("UI-TYPMON-COMTRYPIO-ROZNICA-PION-MINUS")}>
      <line x1={0} y1={zero} x2={W} y2={zero} className="stroke-muted-foreground/60" strokeWidth={1} />
      {wartosci.map((v, m) => {
        if (v === null) return null
        const h = (Math.abs(v) / max) * (zero - 6)
        return (
          <g key={m}>
            <rect x={m * szer + 3} y={v >= 0 ? zero - h : zero} width={szer - 6} height={Math.max(h, 1)} rx={2} className={v >= 0 ? "fill-sky-500/80" : "fill-muted-foreground/50"}>
              <title>{`${t(MIESIACE[m])}: ${znak(v)}%`}</title>
            </rect>
            <text x={m * szer + szer / 2} y={H + 12} textAnchor="middle" className="fill-muted-foreground text-[9px]">
              {t(MIESIACE[m])}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function TrybPionowy() {
  const t = useTranslate()
  const { f0, f1, znak } = useFormaty()
  const [s, setS] = usePersistedDraft<Seed>("typ-montazu-pionowy", PUSTY)
  const ustaw = (p: keyof Seed, v: string) => setS((prev) => ({ ...prev, [p]: v }))
  const tab = useTabelaNapromieniowania(s.azymutDeg)
  const wynik = useMemo(
    () => calculatePionowy({ tabela: tab.tabela, wysokoscDolnejKrawedziM: n(s.wysokoscDolnejKrawedziM), wysokoscTrawySnieguCm: n(s.wysokoscTrawySnieguCm) }),
    [tab.tabela, s.wysokoscDolnejKrawedziM, s.wysokoscTrawySnieguCm],
  )
  const v = wynik.value

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        {t("UI-TYPMON-COMTRYPIO-PANELE-OGRODZENIU-SCIANIE")}
      </p>
      <PoleAzymutu wartosc={s.azymutDeg} ustaw={(x) => ustaw("azymutDeg", x)} tab={tab} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Pole
          label={t("UI-TYPMON-COMTRYPIO-DOLNA-KRAWEDZ-PANELI")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={s.wysokoscDolnejKrawedziM}
          onChange={(e) => ustaw("wysokoscDolnejKrawedziM", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="krawedzPionowy" />}
        />
        <Pole
          label={t("UI-TYPMON-COMTRYPIO-TRAWA-ZASPY-SNIEGU")}
          unit="cm"
          type="number"
          inputMode="decimal"
          min={0}
          value={s.wysokoscTrawySnieguCm}
          onChange={(e) => ustaw("wysokoscTrawySnieguCm", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="trawaSnieg" />}
        />
      </div>

      {wynik.status === "INVALID_INPUT" && <BledyDanych warnings={wynik.warnings} />}
      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">{t("UI-TYPMON-COMTRYPIO-WPISZ-AZYMUT-POLICZ")}</p>}
      {v && (
        <WerdyktPanel poziom={poziomZOstrzezen(wynik.warnings)} etykieta={t("UI-TYPMON-COMTRYPIO-PION-NAJLEPSZY-KAT", { optimumDeg: v.optimumDeg })}>
          <WynikGlowny>{t("UI-TYPMON-COMTRYPIO-ROCZNIE", { roznicaRocznaPct: znak(v.roznicaRocznaPct) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {v.miesiaceZysku.length > 0
              ? t("UI-TYPMON-COMTRYPIO-PION-ZBIERA-WIECEJ", { p: v.miesiaceZysku.map((m) => t(MIESIACE[m])).join(", "), zyskKwhM2: f1(v.zyskKwhM2), strataKwhM2: f1(v.strataKwhM2) })
              : t("UI-TYPMON-COMTRYPIO-PION-WYGRYWA-ZADNYM", { strataKwhM2: f1(v.strataKwhM2) })}
          </p>
          <p className="mt-1 text-small">
            {t("UI-TYPMON-COMTRYPIO-ROCZNIE-PION-KWH", { pionowyRocznieKwhM2: f0(v.pionowyRocznieKwhM2), optimumRocznieKwhM2: f0(v.optimumRocznieKwhM2) })}
          </p>
          <figure className="mt-3">
            <figcaption className="text-small font-medium">{t("UI-TYPMON-COMTRYPIO-ROZNICA-PION-KAT", { optimumDeg: v.optimumDeg })}</figcaption>
            <WykresRoznicy wartosci={v.miesiace.map((m) => m.roznicaPct)} />
          </figure>
          {v.zaspaZacienia === false && <p className="mt-1 text-small">{t("UI-TYPMON-COMTRYPIO-TRAWA-ZASPY-SIEGAJA")}</p>}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
        </WerdyktPanel>
      )}
    </div>
  )
}

"use client"

import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import type { StrefaSniegowa } from "@/lib/core/modules/pv/eurokod-1/snieg"
import { KATEGORIE_TERENU, type KategoriaTerenu } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import { TYPY_DACHU } from "@/lib/core/modules/pv/eurokod-1/wiatr-dachy"
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { ObciazeniaMiejsca, OcenaObciazenia, SytuacjaObciazenia } from "@/lib/core/modules/pv/porownywarka-paneli/obciazenia"
import { useTranslate } from "@/lib/i18n/language-context"
import type { ObciazeniaSeed } from "@/lib/porownywarka-paneli/stan"

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

const STREFY_SNIEGOWE: readonly StrefaSniegowa[] = [1, 2, 3, 4, 5]
const ETYKIETA_STREFY_SNIEGOWEJ: Record<StrefaSniegowa, string> = {
  1: "UI-OBCDACSNI-STREFA",
  2: "UI-OBCDACSNI-STREFA-2",
  3: "UI-OBCDACSNI-STREFA-3",
  4: "UI-OBCDACSNI-STREFA-4",
  5: "UI-OBCDACSNI-STREFA-5",
}
const OPIS_TERENU: Record<KategoriaTerenu, string> = {
  "0": "UI-TYPMON-COMWSP-MORZE",
  I: "UI-TYPMON-COMWSP-JEZIORA-TEREN-PLASKI",
  II: "UI-TYPMON-COMWSP-NISKA-ROSLINNOSC-POJEDYNCZE",
  III: "UI-TYPMON-COMWSP-III-WIES-PRZEDMIESCIA",
  IV: "UI-TYPMON-COMWSP-MIASTO-MIN-ZABUDOWY",
}
const ETYKIETA_TYPU_DACHU: Record<(typeof TYPY_DACHU)[number], string> = {
  jednospadowy: "UI-PORP-OBC-TYP-DACHU-JEDNOSPADOWY",
  dwuspadowy: "UI-PORP-OBC-TYP-DACHU-DWUSPADOWY",
  czterospadowy: "UI-PORP-OBC-TYP-DACHU-CZTEROSPADOWY",
  sciana: "UI-PORP-OBC-TYP-DACHU-SCIANA",
}
const ETYKIETA_SYTUACJI: Record<SytuacjaObciazenia, string> = {
  docisk: "UI-PORP-OBC-S-DOCISK",
  "docisk-srodek": "UI-PORP-OBC-S-DOCISK-SRODEK",
  "docisk-krawedz": "UI-PORP-OBC-S-DOCISK-KRAWEDZ",
  "odrywanie-srodek": "UI-PORP-OBC-S-ODRYWANIE-SRODEK",
  "odrywanie-krawedz": "UI-PORP-OBC-S-ODRYWANIE-KRAWEDZ",
}

/**
 * Zakładka „Obciążenia” (spec 32): śnieg i wiatr w miejscu wg Eurokodu zestawione z nośnością mechaniczną każdego panelu z karty.
 * Pola miejsca (strefy, wysokość, teren) wpisuje użytkownik — aplikacja nie wyznacza stref z mapy. Status zawsze słowem i znakiem, nie samym kolorem.
 */
export function ObciazeniaPaneli(p: {
  panele: WynikPanelu[]
  miejsce: ObciazeniaMiejsca | null
  obc: ObciazeniaSeed
  onObc: (zmiana: Partial<ObciazeniaSeed>) => void
  /** Wysokość miejsca z danych pogodowych (PVGIS) — tylko podpowiedź w polu, nigdy wartość ukryta. */
  wysokoscPodpowiedz: number | undefined
  nachylenieDeg: number | null
  /** Montaż miejsca: panele pochylone na konstrukcji (Tablica 7.6) albo równoległe do połaci (wybór rodzaju połaci, Tablice 7.3 i 7.4). */
  montaz: "rownolegly" | "pochylony-na-konstrukcji"
}) {
  const t = useTranslate()
  const m = p.miejsce
  const opisRodzaju = (rodzaj: "testowe" | "obliczeniowe") => t(rodzaj === "testowe" ? "UI-PORP-OBC-RODZAJ-TESTOWE" : "UI-PORP-OBC-RODZAJ-OBLICZENIOWE")
  const status = (o: OcenaObciazenia) =>
    o.przekroczone === null ? `– ${t("UI-PORP-OBC-BRAK-NOSNOSCI")}` : o.przekroczone ? `⚠ ${t("UI-PORP-OBC-PRZEKROCZONE")}` : `✓ ${t("UI-PORP-OBC-OK")}`
  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">{t("UI-PORP-OBC-OPIS")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <PoleSelect
          label={t("UI-OBCDACSNI-STREFA-OBCIAZENIA-SNIEGIEM")}
          value={p.obc.strefaSniegowa}
          onChange={(e) => p.onObc({ strefaSniegowa: e.target.value })}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="strefa" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {STREFY_SNIEGOWE.map((s) => (
            <option key={s} value={s}>
              {t(ETYKIETA_STREFY_SNIEGOWEJ[s])}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label={t("UI-ZLOSRO-STREFA-WIATROWA")}
          value={p.obc.strefaWiatrowa}
          onChange={(e) => p.onObc({ strefaWiatrowa: e.target.value })}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="strefa" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="1">{t("UI-ZLOSRO-STREFA")}</option>
          <option value="2">{t("UI-ZLOSRO-STREFA-2")}</option>
          <option value="3">{t("UI-ZLOSRO-STREFA-3")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-OBCDACSNI-WYSOKOSC-NAD-POZIOMEM")}
          unit="m"
          type="number"
          inputMode="decimal"
          step="any"
          value={p.obc.wysokoscNpm}
          onChange={(e) => p.onObc({ wysokoscNpm: e.target.value })}
          placeholder={p.wysokoscPodpowiedz !== undefined ? String(p.wysokoscPodpowiedz) : undefined}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="wysokosc" />}
        />
        <PoleSelect
          label={t("UI-OBCDACSNI-OTOCZENIE-BUDYNKU")}
          value={p.obc.ekspozycjaSniegu}
          onChange={(e) => p.onObc({ ekspozycjaSniegu: e.target.value as ObciazeniaSeed["ekspozycjaSniegu"] })}
          pomoc={<PomocPola ekran="obciazenie-dachu-sniegiem" pole="otoczenie" />}
        >
          <option value="wystawiony">{t("UI-OBCDACSNI-WYSTAWIONY-WIATR")}</option>
          <option value="normalny">{t("UI-OBCDACSNI-NORMALNY")}</option>
          <option value="osloniety">{t("UI-OBCDACSNI-OSLONIETY-WIATRU")}</option>
        </PoleSelect>
      </div>
      <PoleSelect
        label={t("UI-ZLOSRO-TEREN-WOKOL-KATEGORIA")}
        value={p.obc.kategoriaTerenu}
        onChange={(e) => p.onObc({ kategoriaTerenu: e.target.value })}
        pomoc={<PomocPola ekran="typ-montazu-pola" pole="teren" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        {KATEGORIE_TERENU.map((k) => (
          <option key={k} value={k}>
            {t(OPIS_TERENU[k])}
          </option>
        ))}
      </PoleSelect>
      <Pole
        label={t("UI-PORP-OBC-F-WYS-PANELI")}
        unit="m"
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        value={p.obc.wysokoscKonstrukcji}
        onChange={(e) => p.onObc({ wysokoscKonstrukcji: e.target.value })}
        pomoc={<PomocPola ekran="porownywarka-paneli" pole="obcWysokoscPaneli" />}
      />
      {p.montaz === "rownolegly" ? (
        <PoleSelect
          label={t("UI-PORP-OBC-F-TYP-DACHU")}
          value={p.obc.typDachu ?? ""}
          onChange={(e) => p.onObc({ typDachu: e.target.value as NonNullable<ObciazeniaSeed["typDachu"]> })}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="obcTypDachu" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {TYPY_DACHU.map((typ) => (
            <option key={typ} value={typ}>
              {t(ETYKIETA_TYPU_DACHU[typ])}
            </option>
          ))}
        </PoleSelect>
      ) : null}
      <p className="text-caption text-muted-foreground">{t("UI-PORP-OBC-STREFY-WSKAZOWKA")}</p>

      {m === null ? (
        <p className="text-small text-muted-foreground">{t("UI-PORP-OBC-BRAK-DANYCH")}</p>
      ) : (
        <>
          <div className="flex flex-col gap-1 text-small">
            {m.snieg ? (
              <p>
                {t("UI-PORP-OBC-SNIEG-WYNIK", { sk: f2(m.snieg.skKnM2), mu: f2(m.snieg.mu1), ce: f2(m.snieg.ce), s: f2(m.snieg.sKnM2), sn: f0(m.snieg.sNormalnaPa) })}
              </p>
            ) : (
              <p className="text-muted-foreground">{t("UI-PORP-OBC-SNIEG-BRAK-DANYCH")}</p>
            )}
            {m.wiatr ? (
              <p>
                {t(m.wiatr.zrodloCp === "polac" ? "UI-PORP-OBC-WIATR-WYNIK-POLAC" : m.wiatr.zrodloCp === "wlasne" ? "UI-PORP-OBC-WIATR-WYNIK-WLASNE" : "UI-PORP-OBC-WIATR-WYNIK", {
                  qb: f0(m.wiatr.qbPa),
                  h: p.obc.wysokoscKonstrukcji,
                  ce: f2(m.wiatr.ceZ),
                  qp: f0(m.wiatr.qpPa),
                  dS: f1(m.wiatr.cp.dociskSrodek),
                  dK: f1(m.wiatr.cp.dociskKrawedz),
                  oS: f1(m.wiatr.cp.odrywanieSrodek),
                  oK: f1(m.wiatr.cp.odrywanieKrawedz),
                })}
              </p>
            ) : (
              <p className="text-muted-foreground">
                {m.powodBrakuWiatru === "brak-typu-dachu"
                  ? t("UI-PORP-OBC-WIATR-BRAK-TYPU")
                  : m.powodBrakuWiatru === "kat-poza-zakresem"
                    ? t(p.montaz === "rownolegly" ? "UI-PORP-OBC-WIATR-KAT-POLAC" : "UI-PORP-OBC-WIATR-KAT", { kat: p.nachylenieDeg === null ? "" : f0(p.nachylenieDeg) })
                    : t("UI-PORP-OBC-WIATR-BRAK-DANYCH")}
              </p>
            )}
          </div>
          {p.panele.map((w) => {
            const o = w.obciazenia
            if (!o) return null
            return (
              <section key={w.id} className="flex flex-col gap-2 rounded-lg border p-3">
                <h3 className="text-small font-medium">{w.nazwa}</h3>
                <p className="text-caption text-muted-foreground">
                  {o.karta
                    ? t("UI-PORP-OBC-KARTA", {
                        przod: f0(o.karta.przodPa),
                        tyl: o.karta.tylPa === null ? t("UI-PORP-OBC-KARTA-TYL-BRAK") : f0(o.karta.tylPa),
                        rodzaj: opisRodzaju(o.karta.rodzaj),
                      })
                    : t("UI-PORP-OBC-KARTA-BRAK")}
                </p>
                <ul className="flex flex-col gap-2">
                  {o.oceny.map((x) => (
                    <li key={x.sytuacja} className="rounded-md border p-2 text-small">
                      <p className="font-medium">{t(ETYKIETA_SYTUACJI[x.sytuacja])}</p>
                      <dl className="mt-1 grid grid-cols-3 gap-x-3 gap-y-1">
                        <div>
                          <dt className="text-caption text-muted-foreground">{t("UI-PORP-OBC-KOL-ED")}</dt>
                          <dd className="tabular-nums">{f0(x.edPa)} Pa</dd>
                        </div>
                        <div>
                          <dt className="text-caption text-muted-foreground">{t("UI-PORP-OBC-KOL-RD")}</dt>
                          <dd className="tabular-nums">{x.rdPa === null ? "—" : `${f0(x.rdPa)} Pa`}</dd>
                        </div>
                        <div>
                          <dt className="text-caption text-muted-foreground">{t("UI-PORP-OBC-KOL-WYK")}</dt>
                          <dd className="tabular-nums">{x.wykorzystaniePct === null ? "—" : `${f0(x.wykorzystaniePct)}%`}</dd>
                        </div>
                      </dl>
                      <p className={x.przekroczone ? "mt-1 font-medium text-werdykt-blad-foreground" : "mt-1"}>{status(x)}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
          {m.wiatr?.zrodloCp === "polac" ? <p className="text-caption text-muted-foreground">{t("UI-PORP-OBC-NOTA-POLAC")}</p> : null}
          {m.wiatr?.zrodloCp === "wlasne" ? (
            <p role="note" className="rounded-md border border-werdykt-uwaga-border bg-werdykt-uwaga-bg p-2 text-small text-werdykt-uwaga-foreground">
              {t("UI-PORP-OBC-NOTA-WLASNE", { kat: p.nachylenieDeg === null ? "" : f0(p.nachylenieDeg) })}
            </p>
          ) : null}
          <p className="text-caption text-muted-foreground">{t("UI-PORP-OBC-NOTA")}</p>
        </>
      )}
    </div>
  )
}

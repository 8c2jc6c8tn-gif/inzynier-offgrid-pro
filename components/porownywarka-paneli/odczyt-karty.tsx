"use client"

/**
 * Odczyt karty katalogowej / naklejki panelu ze zdjęcia lub PDF (spec 33, Etap B, U22). Przebieg: użytkownik mówi, o jaki panel
 * chodzi, wybiera plik i jawnie zgadza się na wysłanie go do dostawcy AI; po odczycie sprawdza KAŻDĄ liczbę z oryginałem i
 * zatwierdza ją pole po polu — dopiero zatwierdzone trafiają do formularza (standard 9.5). Niska pewność i niespójności są wyróżnione
 * słowem i znakiem, nie samym kolorem.
 */
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { isAiAvailable } from "@/lib/ai/is-ai-available"
import type { BladOdczytu, WynikOdczytu } from "@/lib/ai/odczyt-karty/wykonaj"
import type { OdczytKarty, PewnoscOdczytu, PoleOdczytu, UwagaSpojnosci } from "@/lib/core/modules/pv/porownywarka-paneli/odczyt-karty"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"
import { pozycjaPoprawna, pozycjeOdczytu, poprawkaSeedZOdczytu, POLA_TEKSTOWE_ODCZYTU, type PozycjaOdczytu } from "@/lib/porownywarka-paneli/odczyt-karty"
import type { PanelSeed } from "@/lib/porownywarka-paneli/stan"
import { zmniejszObrazJesliTrzeba } from "@/lib/porownywarka-paneli/zmniejsz-obraz"

/** Etykieta, jednostka i „?” każdego pola odczytu — te same, co w formularzu panelu (jedno źródło tekstów). */
const OPIS_POLA = {
  nazwa: { label: "UI-PORP-NAZWA", unit: undefined, pomoc: "nazwa" },
  pmaxW: { label: "UI-PORP-MOC", unit: "W", pomoc: "moc" },
  vocV: { label: "UI-PORP-ELE-F-VOC", unit: "V", pomoc: "eleVoc" },
  vmpV: { label: "UI-PORP-ELE-F-VMP", unit: "V", pomoc: "eleVmp" },
  iscA: { label: "UI-PORP-ELE-F-ISC", unit: "A", pomoc: "eleIsc" },
  impA: { label: "UI-PORP-ELE-F-IMP", unit: "A", pomoc: "eleImp" },
  betaVocPctNaC: { label: "UI-PORP-ELE-F-BETA", unit: "%/°C", pomoc: "eleBeta" },
  gammaPctNaC: { label: "UI-PORP-GAMMA", unit: "%/°C", pomoc: "gamma" },
  noctC: { label: "UI-PORP-NOCT", unit: "°C", pomoc: "noct" },
  maxNapieciaSystemuV: { label: "UI-PORP-ELE-F-MAXV", unit: "V", pomoc: "eleMaxV" },
  maxBezpiecznikSzeregowyA: { label: "UI-PORP-ELE-F-MAXBEZP", unit: "A", pomoc: "eleMaxBezp" },
  dlugoscMm: { label: "UI-PORP-DLUGOSC-PANELU", unit: "mm", pomoc: "dlugoscPanelu" },
  szerokoscMm: { label: "UI-PORP-SZEROKOSC-PANELU", unit: "mm", pomoc: "szerokoscPanelu" },
  masaKg: { label: "UI-PORP-MASA-PANELU", unit: "kg", pomoc: "masaPanelu" },
  degradacjaPierwszyRokPct: { label: "UI-PORP-DEG1", unit: "%", pomoc: "degradacja1" },
  degradacjaLiniowaPctNaRok: { label: "UI-PORP-DEGLIN", unit: "UI-J-PROC-ROK", pomoc: "degradacjaLiniowa" },
  obciazeniePrzodPa: { label: "UI-PORP-OBC-F-PRZOD", unit: "Pa", pomoc: "obcPrzod" },
  obciazenieTylPa: { label: "UI-PORP-OBC-F-TYL", unit: "Pa", pomoc: "obcTyl" },
  bifacjalny: { label: "UI-PORP-BIFACJALNY", unit: undefined, pomoc: "bifacjalny" },
  obciazenieRodzaj: { label: "UI-PORP-OBC-F-RODZAJ", unit: undefined, pomoc: "obcRodzaj" },
} as const satisfies Record<PoleOdczytu, { label: string; unit: string | undefined; pomoc: string }>

const ZNAK_PEWNOSCI: Record<PewnoscOdczytu, { klucz: string; znak: string }> = {
  wysoka: { klucz: "UI-PORP-OCR-PEW-WYSOKA", znak: "✓" },
  srednia: { klucz: "UI-PORP-OCR-PEW-SREDNIA", znak: "⚠" },
  niska: { klucz: "UI-PORP-OCR-PEW-NISKA", znak: "⚠" },
}

type StanOdczytu =
  | { rodzaj: "brak" }
  | { rodzaj: "wysylanie" }
  | { rodzaj: "blad"; komunikat: string }
  | { rodzaj: "wynik"; odczyt: OdczytKarty; spojnosc: UwagaSpojnosci[]; pozycje: PozycjaOdczytu[] }
  | { rodzaj: "wpisano"; ile: number }

export function OdczytKarty({ idPanelu, nazwaPanelu, onZastosuj }: { idPanelu: string; nazwaPanelu: string; onZastosuj: (poprawka: Partial<PanelSeed>) => void }) {
  const t = useTranslate()
  const jezyk = useLanguage()
  const [dostepny, setDostepny] = useState(false)
  const [podpowiedz, setPodpowiedz] = useState(nazwaPanelu)
  const [plik, setPlik] = useState<File | null>(null)
  const [zgoda, setZgoda] = useState(false)
  const [stan, setStan] = useState<StanOdczytu>({ rodzaj: "brak" })

  // Offline or without a key the assistant cannot be reached, so the block stays hidden (9.0 — degrade silently).
  useEffect(() => {
    isAiAvailable().then(setDostepny).catch(() => setDostepny(false))
  }, [])

  const podglad = useMemo(() => (plik && plik.type.startsWith("image/") ? URL.createObjectURL(plik) : null), [plik])
  useEffect(() => () => { if (podglad) URL.revokeObjectURL(podglad) }, [podglad])

  if (!dostepny) return null

  async function odczytaj() {
    if (!plik || !zgoda) return
    setStan({ rodzaj: "wysylanie" })
    try {
      const doWyslania = await zmniejszObrazJesliTrzeba(plik)
      const forma = new FormData()
      forma.set("plik", doWyslania)
      forma.set("podpowiedz", podpowiedz)
      forma.set("jezyk", jezyk)
      forma.set("zgoda", "tak")
      const odpowiedz = await fetch("/api/odczyt-karty", { method: "POST", body: forma, signal: AbortSignal.timeout(90_000) })
      const dane = (await odpowiedz.json()) as WynikOdczytu | { ok: false; bladKey: string; ponowZaSekund?: number }
      if (dane.ok) {
        setStan({ rodzaj: "wynik", odczyt: dane.odczyt, spojnosc: dane.spojnosc, pozycje: pozycjeOdczytu(dane.odczyt) })
        return
      }
      const minuty = "ponowZaSekund" in dane && dane.ponowZaSekund ? Math.ceil(dane.ponowZaSekund / 60) : 0
      setStan({ rodzaj: "blad", komunikat: t(dane.bladKey as BladOdczytu, { minuty }) })
    } catch {
      setStan({ rodzaj: "blad", komunikat: t("UI-PORP-OCR-BLAD-SIEC") })
    }
  }

  const zmienPozycje = (pole: PoleOdczytu, zmiana: Partial<PozycjaOdczytu>) =>
    setStan((s) => (s.rodzaj === "wynik" ? { ...s, pozycje: s.pozycje.map((p) => (p.pole === pole ? { ...p, ...zmiana } : p)) } : s))

  const wynik = stan.rodzaj === "wynik" ? stan : null
  const zatwierdzonych = wynik ? wynik.pozycje.filter((p) => p.zatwierdzone && pozycjaPoprawna(p)).length : 0
  const polaSpojnosci = new Set(wynik?.spojnosc.flatMap((u) => u.pola) ?? [])

  function zatwierdzPewne() {
    setStan((s) =>
      s.rodzaj === "wynik"
        ? { ...s, pozycje: s.pozycje.map((p) => (p.pewnosc === "wysoka" && !polaSpojnosci.has(p.pole) && pozycjaPoprawna(p) ? { ...p, zatwierdzone: true } : p)) }
        : s,
    )
  }

  function wpisz() {
    if (!wynik) return
    onZastosuj(poprawkaSeedZOdczytu(wynik.pozycje))
    setStan({ rodzaj: "wpisano", ile: zatwierdzonych })
  }

  const nieodczytane = wynik ? Object.keys(OPIS_POLA).filter((p) => !wynik.pozycje.some((x) => x.pole === p)) as PoleOdczytu[] : []

  return (
    <details className="rounded-md border p-3">
      <summary className="cursor-pointer text-small font-medium">{t("UI-PORP-OCR-TYTUL")}</summary>
      <div className="mt-3 flex flex-col gap-3">
        <p className="text-caption text-muted-foreground">{t("UI-PORP-OCR-OPIS")}</p>
        <Pole
          label={t("UI-PORP-OCR-PODPOWIEDZ")}
          type="text"
          maxLength={200}
          placeholder={t("UI-PORP-OCR-PODPOWIEDZ-PRZYKLAD")}
          value={podpowiedz}
          onChange={(e) => setPodpowiedz(e.target.value)}
          pomoc={<PomocPola ekran="porownywarka-paneli" pole="ocrPodpowiedz" />}
        />
        <div className="flex flex-col gap-1 text-small">
          <div className="flex items-center gap-2">
            <label htmlFor={`ocr-plik-${idPanelu}`} className="font-medium">
              {t("UI-PORP-OCR-PLIK")}
            </label>
            <PomocPola ekran="porownywarka-paneli" pole="ocrPlik" />
          </div>
          <input
            id={`ocr-plik-${idPanelu}`}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="text-small"
            onChange={(e) => {
              setPlik(e.target.files?.[0] ?? null)
              setStan({ rodzaj: "brak" })
            }}
          />
          {podglad && (
            // eslint-disable-next-line @next/next/no-img-element -- a local blob preview; next/image cannot optimise it
            <img src={podglad} alt={t("UI-PORP-OCR-PODGLAD")} className="mt-1 max-h-48 w-auto self-start rounded border" />
          )}
        </div>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <PoleCheckbox id={`ocr-zgoda-${idPanelu}`} label={t("UI-PORP-OCR-ZGODA")} checked={zgoda} onChange={(e) => setZgoda(e.target.checked)} />
          </div>
          <PomocPola ekran="porownywarka-paneli" pole="ocrZgoda" />
        </div>
        <Button className="min-h-11 self-start" disabled={!plik || !zgoda || stan.rodzaj === "wysylanie"} onClick={odczytaj}>
          {stan.rodzaj === "wysylanie" ? t("UI-PORP-OCR-TRWA") : t("UI-PORP-OCR-PRZYCISK")}
        </Button>
        <p className="text-caption text-muted-foreground">{t("UI-PORP-OCR-NOTA")}</p>

        {stan.rodzaj === "blad" && (
          <p role="alert" className="rounded-md border border-werdykt-blad-foreground/40 p-3 text-small">
            ✕ {stan.komunikat}
          </p>
        )}
        {stan.rodzaj === "wpisano" && (
          <p role="status" className="rounded-md border p-3 text-small">
            ✓ {t("UI-PORP-OCR-WPISANO", { n: stan.ile })}
          </p>
        )}

        {wynik && (
          <div className="flex flex-col gap-3">
            <h4 className="text-small font-semibold">{t("UI-PORP-OCR-WYNIK-TYTUL")}</h4>
            <ul className="flex flex-col gap-1 text-small">
              <li>{wynik.odczyt.rozpoznany ? t("UI-PORP-OCR-ROZPOZNANO", { nazwa: wynik.odczyt.rozpoznany }) : t("UI-PORP-OCR-NIEROZPOZNANO")}</li>
              {wynik.odczyt.kolumnaMocy && <li>{t("UI-PORP-OCR-KOLUMNA", { kolumna: wynik.odczyt.kolumnaMocy })}</li>}
              {wynik.odczyt.zgodnoscZPodpowiedzia === "nie" && <li role="alert">⚠ {t("UI-PORP-OCR-INNY-PANEL")}</li>}
            </ul>
            {wynik.spojnosc.length > 0 && (
              <div role="alert" className="rounded-md border p-3 text-small">
                <p className="font-medium">⚠ {t("UI-PORP-OCR-SPOJ-TYTUL")}</p>
                <ul className="mt-1 list-disc pl-5">
                  {wynik.spojnosc.map((u) => (
                    <li key={u.kod + u.pola.join()}>{t(u.kod, u.params)}</li>
                  ))}
                </ul>
              </div>
            )}
            {wynik.odczyt.uwagi.length > 0 && (
              <div className="text-small">
                <p className="font-medium">{t("UI-PORP-OCR-UWAGI")}</p>
                <ul className="list-disc pl-5">
                  {wynik.odczyt.uwagi.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button variant="outline" className="min-h-11 self-start" onClick={zatwierdzPewne}>
              {t("UI-PORP-OCR-ZATWIERDZ-PEWNE")}
            </Button>
            <ul className="flex flex-col gap-2">
              {wynik.pozycje.map((p) => {
                const opis = OPIS_POLA[p.pole]
                const wymagaUwagi = p.pewnosc !== "wysoka" || polaSpojnosci.has(p.pole)
                const poprawna = pozycjaPoprawna(p)
                const pewnosc = ZNAK_PEWNOSCI[p.pewnosc]
                return (
                  <li key={p.pole} className={`flex flex-col gap-2 rounded-md border p-3 ${wymagaUwagi ? "border-2 border-dashed" : ""}`}>
                    {p.pole === "bifacjalny" || p.pole === "obciazenieRodzaj" ? (
                      <PoleSelect
                        label={t(opis.label)}
                        value={p.tekst}
                        onChange={(e) => zmienPozycje(p.pole, { tekst: e.target.value, zatwierdzone: false })}
                        pomoc={<PomocPola ekran="porownywarka-paneli" pole={opis.pomoc} />}
                      >
                        {p.pole === "bifacjalny" ? (
                          <>
                            <option value="tak">{t("UI-PORP-OCR-TAK")}</option>
                            <option value="nie">{t("UI-PORP-OCR-NIE")}</option>
                          </>
                        ) : (
                          <>
                            <option value="testowe">{t("UI-PORP-OBC-RODZAJ-TESTOWE")}</option>
                            <option value="obliczeniowe">{t("UI-PORP-OBC-RODZAJ-OBLICZENIOWE")}</option>
                          </>
                        )}
                      </PoleSelect>
                    ) : (
                      <Pole
                        label={t(opis.label)}
                        unit={opis.unit === "UI-J-PROC-ROK" ? t(opis.unit) : opis.unit}
                        type="text"
                        inputMode={POLA_TEKSTOWE_ODCZYTU.includes(p.pole) ? "text" : "decimal"}
                        value={p.tekst}
                        error={poprawna ? undefined : t("UI-PORP-OCR-NIEPOPRAWNE")}
                        onChange={(e) => zmienPozycje(p.pole, { tekst: e.target.value, zatwierdzone: false })}
                        pomoc={<PomocPola ekran="porownywarka-paneli" pole={opis.pomoc} />}
                      />
                    )}
                    <p className="text-caption">
                      {pewnosc.znak} {t(pewnosc.klucz)}
                    </p>
                    <PoleCheckbox
                      id={`ocr-zatw-${idPanelu}-${p.pole}`}
                      label={t("UI-PORP-OCR-ZATWIERDZAM")}
                      checked={p.zatwierdzone && poprawna}
                      disabled={!poprawna}
                      onChange={(e) => zmienPozycje(p.pole, { zatwierdzone: e.target.checked })}
                    />
                  </li>
                )
              })}
            </ul>
            {nieodczytane.length > 0 && (
              <p className="text-caption text-muted-foreground">{t("UI-PORP-OCR-NIEODCZYTANE", { lista: nieodczytane.map((p) => t(OPIS_POLA[p].label)).join(", ") })}</p>
            )}
            <Button className="min-h-11 self-start" disabled={zatwierdzonych === 0} onClick={wpisz}>
              {t("UI-PORP-OCR-WPISZ", { n: zatwierdzonych })}
            </Button>
          </div>
        )}
      </div>
    </details>
  )
}

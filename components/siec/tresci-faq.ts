/**
 * M14 — D14 „FAQ” (dom) and F13 „FAQ firm”, Wzorzec C. `03_M14_Dom_i_Firma_Siec.md` §1–3, §7–8,
 * opracowanie §3, §7, §8 — the firm questions are the material's part 8 corrected (✏️ K1, K3, K5–K7b,
 * K9, K13, K14). Prices from the material (BESS 1 400–2 500 zł/kWh, meter test 130–210 zł, „do 85%”)
 * are 🔎B / unconfirmed and are NOT stated as facts. Text in `lib/i18n/ui/m14-faq.ts` (PL/EN/RU),
 * here only the order, ids and links.
 */
/** `pytanie`, `odpowiedz` and `link.etykieta` are translation keys (`t()`). */
export type PytanieFaq = { id: string; pytanie: string; odpowiedz: string; link?: { href: string; etykieta: string } }

export const FAQ_DOM: PytanieFaq[] = [
  { id: "dom-cena-trzymania", pytanie: "UI-FAQ-DOM-CENA-TRZYMANIA-P", odpowiedz: "UI-FAQ-DOM-CENA-TRZYMANIA-O", link: { href: "/kalkulatory/rachunek-dom", etykieta: "UI-FAQ-DOM-CENA-TRZYMANIA-L" } },
  { id: "dom-net-metering", pytanie: "UI-FAQ-DOM-NET-METERING-P", odpowiedz: "UI-FAQ-DOM-NET-METERING-O", link: { href: "/kalkulatory/depozyt-prosumencki", etykieta: "UI-FAQ-DOM-NET-METERING-L" } },
  { id: "dom-1-23", pytanie: "UI-FAQ-DOM-1-23-P", odpowiedz: "UI-FAQ-DOM-1-23-O" },
  { id: "dom-zwrot-depozytu", pytanie: "UI-FAQ-DOM-ZWROT-DEPOZYTU-P", odpowiedz: "UI-FAQ-DOM-ZWROT-DEPOZYTU-O" },
  { id: "dom-jednokierunkowe", pytanie: "UI-FAQ-DOM-JEDNOKIERUNKOWE-P", odpowiedz: "UI-FAQ-DOM-JEDNOKIERUNKOWE-O" },
  { id: "dom-odlaczenie", pytanie: "UI-FAQ-DOM-ODLACZENIE-P", odpowiedz: "UI-FAQ-DOM-ODLACZENIE-O", link: { href: "/kalkulatory/scenariusze-dom", etykieta: "UI-FAQ-DOM-ODLACZENIE-L" } },
  { id: "dom-najpierw", pytanie: "UI-FAQ-DOM-NAJPIERW-P", odpowiedz: "UI-FAQ-DOM-NAJPIERW-O", link: { href: "/kalkulatory/rezygnacja-z-przylacza", etykieta: "UI-FAQ-DOM-NAJPIERW-L" } },
  { id: "dom-agregat", pytanie: "UI-FAQ-DOM-AGREGAT-P", odpowiedz: "UI-FAQ-DOM-AGREGAT-O", link: { href: "/kalkulatory/przelacznik-siec-wyspa", etykieta: "UI-FAQ-DOM-AGREGAT-L" } },
  { id: "dom-licznik", pytanie: "UI-FAQ-DOM-LICZNIK-P", odpowiedz: "UI-FAQ-DOM-LICZNIK-O", link: { href: "/kalkulatory/test-licznika", etykieta: "UI-FAQ-DOM-LICZNIK-L" } },
]

export const FAQ_FIRMA: PytanieFaq[] = [
  { id: "firma-regulowane", pytanie: "UI-FAQ-FIRMA-REGULOWANE-P", odpowiedz: "UI-FAQ-FIRMA-REGULOWANE-O" },
  { id: "firma-bierna-kto", pytanie: "UI-FAQ-FIRMA-BIERNA-KTO-P", odpowiedz: "UI-FAQ-FIRMA-BIERNA-KTO-O", link: { href: "/kalkulatory/moc-bierna", etykieta: "UI-FAQ-FIRMA-BIERNA-KTO-L" } },
  { id: "firma-bierna-jak", pytanie: "UI-FAQ-FIRMA-BIERNA-JAK-P", odpowiedz: "UI-FAQ-FIRMA-BIERNA-JAK-O" },
  { id: "firma-mocowa", pytanie: "UI-FAQ-FIRMA-MOCOWA-P", odpowiedz: "UI-FAQ-FIRMA-MOCOWA-O", link: { href: "/kalkulatory/oplata-mocowa", etykieta: "UI-FAQ-FIRMA-MOCOWA-L" } },
  { id: "firma-net-billing", pytanie: "UI-FAQ-FIRMA-NET-BILLING-P", odpowiedz: "UI-FAQ-FIRMA-NET-BILLING-O", link: { href: "/kalkulatory/pv-w-firmie", etykieta: "UI-FAQ-FIRMA-NET-BILLING-L" } },
  { id: "firma-depozyt", pytanie: "UI-FAQ-FIRMA-DEPOZYT-P", odpowiedz: "UI-FAQ-FIRMA-DEPOZYT-O", link: { href: "/kalkulatory/depozyt-prosumencki", etykieta: "UI-FAQ-FIRMA-DEPOZYT-L" } },
  { id: "firma-bess-cena", pytanie: "UI-FAQ-FIRMA-BESS-CENA-P", odpowiedz: "UI-FAQ-FIRMA-BESS-CENA-O", link: { href: "/kalkulatory/magazyn-firmy", etykieta: "UI-FAQ-FIRMA-BESS-CENA-L" } },
  { id: "firma-dotacje", pytanie: "UI-FAQ-FIRMA-DOTACJE-P", odpowiedz: "UI-FAQ-FIRMA-DOTACJE-O", link: { href: "/kalkulatory/dotacje-firma", etykieta: "UI-FAQ-FIRMA-DOTACJE-L" } },
  { id: "firma-licznik-test", pytanie: "UI-FAQ-FIRMA-LICZNIK-TEST-P", odpowiedz: "UI-FAQ-FIRMA-LICZNIK-TEST-O", link: { href: "/kalkulatory/test-licznika", etykieta: "UI-FAQ-FIRMA-LICZNIK-TEST-L" } },
  { id: "firma-licznik-reklamacja", pytanie: "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-P", odpowiedz: "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-O" },
  { id: "firma-zmiana-taryfy", pytanie: "UI-FAQ-FIRMA-ZMIANA-TARYFY-P", odpowiedz: "UI-FAQ-FIRMA-ZMIANA-TARYFY-O", link: { href: "/kalkulatory/taryfy-c", etykieta: "UI-FAQ-FIRMA-ZMIANA-TARYFY-L" } },
]

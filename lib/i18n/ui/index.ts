/**
 * Screen text — labels, headings and messages written by the UI itself (standard 17.1a). Engine
 * messages stay in `dictionary-*.ts`; the „?”/„i” help lives in `../pomoc`. One file per group of
 * screens: `pl` is the source, `en`/`ru` are typed with its keys, so a missing translation is a
 * compile error (17.1). Keys start with `UI-` and are merged into `dictionaries`, so screens use the
 * same `t()` as everything else. `pnpm check:i18n-guard` blocks new text written straight into JSX.
 */
import * as dopiskiStarychEkranow from "./dopiski-starych-ekranow"
import * as m09Esp32 from "./m09-esp32"
import * as m12Ekrany from "./m12-ekrany"
import * as m12Uziemienie from "./m12-uziemienie"
import * as m14Agregat from "./m14-agregat"
import * as m14Bess from "./m14-bess"
import * as m14Ekrany from "./m14-ekrany"
import * as m14Faq from "./m14-faq"
import * as m14Przejscie from "./m14-przejscie"
import * as m14PrzejscieEkrany from "./m14-przejscie-ekrany"
import * as m14Przelacznik from "./m14-przelacznik"
import * as m14Pv from "./m14-pv"
import * as m14Scenariusze from "./m14-scenariusze"
import * as m14Sciezka from "./m14-sciezka"
import * as m14Zima from "./m14-zima"
import * as m11MontazBaterii from "./m11-montaz-baterii"
import * as m08Bezpieczenstwo from "./m08-bezpieczenstwo"
import * as m12Mobilny from "./m12-mobilny"
import * as m04Baterie from "./m04-baterie"
import * as m06Ogrzewanie from "./m06-ogrzewanie"
import * as pulpit from "./pulpit"
import * as m05Elektryka from "./m05-elektryka"
import * as m02Zapotrzebowanie from "./m02-zapotrzebowanie"
import * as m07Zima from "./m07-zima"
import * as m07bZima from "./m07b-zima"
import * as m09Ekrany from "./m09-ekrany"
import * as ekranyRozne from "./ekrany-rozne"
import * as m15M16Siec from "./m15-m16-siec"
import * as pwa from "./pwa"
import * as wspolne from "./wspolne"
import * as wyglad from "./wyglad"

export const czesciUi = [wspolne, dopiskiStarychEkranow, m09Esp32, m12Ekrany, m12Uziemienie, m14Agregat, m14Bess, m14Ekrany, m14Faq, m14Przejscie, m14PrzejscieEkrany, m14Przelacznik, m14Pv, m14Scenariusze, m14Sciezka, m14Zima, m11MontazBaterii, m08Bezpieczenstwo, m12Mobilny, m04Baterie, pulpit, m05Elektryka, m02Zapotrzebowanie, m07Zima, m09Ekrany, ekranyRozne, m15M16Siec, pwa, wyglad, m06Ogrzewanie, m07bZima] as const

export const uiPl = Object.assign({}, ...czesciUi.map((c) => c.pl)) as Record<string, string>
export const uiEn = Object.assign({}, ...czesciUi.map((c) => c.en)) as Record<string, string>
export const uiRu = Object.assign({}, ...czesciUi.map((c) => c.ru)) as Record<string, string>

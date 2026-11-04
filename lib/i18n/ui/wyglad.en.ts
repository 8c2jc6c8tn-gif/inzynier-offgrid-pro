// English texts of ./wyglad.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./wyglad"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-WYGLAD-STYL-TYTUL": "Appearance style",
  "UI-WYGLAD-STYL-OPIS":
    "A ready set of colours, fonts and corner shapes for the whole app. The verdict colours 🟢🟡🔴 always stay readable. Your own colours below take precedence over the style. Your choice is saved automatically.",
  "UI-WYGLAD-STYL-DOMYSLNY": "Default",
  "UI-WYGLAD-STYL-DOMYSLNY-OPIS": "The current look of the app; light or dark according to the theme switch.",
  "UI-WYGLAD-GRUPA-PREMIUM": "Premium",
  "UI-WYGLAD-GRUPA-JASNE": "Light",
  "UI-WYGLAD-GRUPA-EKSPERYMENTALNE": "Experimental",
  "UI-WYGLAD-GRUPA-UKRYTE": "Hidden and seasonal",
  "UI-WYGLAD-GRUPA-PUSTA": "Styles in this group will come in later batches.",
  "UI-WYGLAD-POKAZ-UKRYTE": "Show hidden and seasonal styles",
  "UI-WYGLAD-IKONY-TYTUL": "Module illustrations",
  "UI-WYGLAD-IKONY-OPIS": "The picture on a dashboard tile and at the top of a module page. The choice is saved automatically and changes no calculation.",
  "UI-WYGLAD-IKONY-BOB": "Bob the mascot",
  "UI-WYGLAD-IKONY-BOB-OPIS": "Bob in a hard hat on every module (as before).",
  "UI-WYGLAD-IKONY-3D": "3D icons",
  "UI-WYGLAD-IKONY-3D-OPIS": "No mascot: one 3D icon per module, in the same place.",
  "UI-WYGLAD-SCHEMAT-CIEMNY": "This style is always dark. The theme switch works with the “Default” style.",
  "UI-WYGLAD-SCHEMAT-JASNY": "This style is always light. The theme switch works with the “Default” style.",
  "UI-STYL-GRAFIT-ZLOTO": "Graphite + gold",
  "UI-STYL-GRAFIT-ZLOTO-OPIS": "Dark graphite with a champagne-gold accent and serif headings. Elegant, with plenty of space.",
  "UI-STYL-GRANAT-MIEDZ": "Navy + copper",
  "UI-STYL-GRANAT-MIEDZ-OPIS": "Deep navy with a copper accent, a warmer sunset mood.",
  "UI-STYL-JASNY-ARCH": "Light architectural",
  "UI-STYL-JASNY-ARCH-OPIS": "Warm white with a gold accent. For bright sunlight and for showing a client on a tablet.",
  "UI-STYL-ROZDZIELNICA": "Switchboard",
  "UI-STYL-ROZDZIELNICA-OPIS":
    "Grey housing like an electrical distribution board (RAL 7035), numbers in a monospaced font, electric-blue accent.",
  "UI-STYL-OLED": "OLED saver",
  "UI-STYL-OLED-OPIS":
    "Pure black and thin grey lines. On OLED screens black pixels are switched off, so the style saves phone battery (not on LCD screens).",
  "UI-STYL-TYTAN": "Titanium",
  "UI-STYL-TYTAN-OPIS":
    "Cool graphite with platinum frames. Technical luxury, like measuring equipment.",
  "UI-STYL-LAS-MOSIADZ": "Forest + brass",
  "UI-STYL-LAS-MOSIADZ-OPIS":
    "Dark forest green and brass, the mood of a house in the woods. The warmest of the dark styles.",
  "UI-STYL-KRESLARSKI": "Blueprint",
  "UI-STYL-KRESLARSKI-OPIS":
    "Navy with a faint drafting grid and thin white frames, like a technical drawing.",
  "UI-STYL-NOC-POLARNA": "Polar night",
  "UI-STYL-NOC-POLARNA-OPIS":
    "Very dark navy and ice blue. For the “winter, −20 °C, 3 days without sun” scenario.",
  "UI-STYL-ROZOWE-ZLOTO": "Rose gold",
  "UI-STYL-ROZOWE-ZLOTO-OPIS":
    "Graphite with a hint of plum, frames and accents in rose gold. Elegant, yet still dark and technical.",
  "UI-STYL-POMARANCZ": "Signal orange",
  "UI-STYL-POMARANCZ-OPIS":
    "Black graphite with orange card edges, like power-tool housings. Orange only on edges and buttons.",
  "UI-STYL-ZACHOD": "Sunset",
  "UI-STYL-ZACHOD-OPIS":
    "Deep night violet with peach frames. A calm dark style in warm colours.",
  "UI-STYL-PUDROWY-ROZ": "Powder pink",
  "UI-STYL-PUDROWY-ROZ-OPIS":
    "Light warm pink like writing paper, with a plum-raspberry accent. The gentlest style.",
  "UI-STYL-SLONECZNY": "Sunny morning",
  "UI-STYL-SLONECZNY-OPIS":
    "Light sky at the top fading into warm white, navy buttons and text.",
  "UI-STYL-EINK": "E-ink",
  "UI-STYL-EINK-OPIS":
    "The look of an e-book reader: grey background, black ink, no decoration. Only the verdicts have colour. A look, not support for e-ink readers.",
  "UI-STYL-MARMUR": "Marble and gold",
  "UI-STYL-MARMUR-OPIS":
    "White marble with faint veins and a gold accent. Luxurious, like a hotel lobby.",
  "UI-STYL-ZEN": "Zen",
  "UI-STYL-ZEN-OPIS":
    "Washi paper, black ink and plenty of empty space. Japanese indigo accent.",
  "UI-STYL-HOLO": "Holographic",
  "UI-STYL-HOLO-OPIS":
    "Dark background and card frames like holographic foil, with a slowly shifting rainbow sheen. Verdicts stay rainbow-free.",
  "UI-STYL-HUD": "Cockpit HUD",
  "UI-STYL-HUD-OPIS":
    "A cockpit display: black, thin turquoise lines, scan lines, headings and numbers in a monospaced font.",
  "UI-STYL-SZKLO": "Glass",
  "UI-STYL-SZKLO-OPIS":
    "Frosted-glass cards on a dark, softly lit background. On weaker phones the cards are not blurred.",
  "UI-STYL-BRUTALIZM": "Brutalism",
  "UI-STYL-BRUTALIZM-OPIS":
    "Raw like a building plan: black frames, hard shadows, no rounded corners, a monospaced font and one electric blue.",
  "UI-STYL-ORBITA": "Orbit",
  "UI-STYL-ORBITA-OPIS":
    "Black space with stars and a violet accent. Cosmic, but calm.",
  "UI-STYL-NEUMORFIZM": "Neumorphism",
  "UI-STYL-NEUMORFIZM-OPIS":
    "Light grey, soft interface: cards embossed from the background with shadow and light, clearly outlined fields, indigo accent.",
  "UI-STYL-NOTATNIK": "Engineer's notebook",
  "UI-STYL-NOTATNIK-OPIS":
    "Squared paper, handwritten headings and result, as if written with a pen. Numbers in tables and forms in a regular font.",
  "UI-STYL-PLYNNY": "Fluid gradient",
  "UI-STYL-PLYNNY-OPIS":
    "A background of soft violet, teal and blue blobs that slowly flow, on the dashboard only. Translucent cards.",
  "UI-STYL-SYNTHWAVE": "Synthwave",
  "UI-STYL-SYNTHWAVE-OPIS":
    "1980s retro-futurism: violet night, a neon grid at the bottom of the screen, turquoise frames. Never neon on verdicts.",
  "UI-STYL-DOS": "DOS terminal",
  "UI-STYL-DOS-OPIS":
    "A blue screen like a 1990s file manager, a monospaced font everywhere. The result is always white.",
  "UI-WYGLAD-KOLOR-TLO": "Application background",
  "UI-WYGLAD-KOLOR-TLO-OPIS": "Main page background",
  "UI-WYGLAD-KOLOR-KARTY": "Cards and panels",
  "UI-WYGLAD-KOLOR-KARTY-OPIS": "Background of cards, popovers, lists",
  "UI-WYGLAD-KOLOR-TEKST": "Text",
  "UI-WYGLAD-KOLOR-TEKST-OPIS": "Text colour on the background and cards",
  "UI-WYGLAD-KOLOR-AKCENT": "Accent (buttons, active states)",
  "UI-WYGLAD-KOLOR-AKCENT-OPIS": "Main UI colour",
  "UI-WYGLAD-KOLOR-SUKCES": "Verdict 🟢 Recommended",
  "UI-WYGLAD-KOLOR-SUKCES-OPIS": "Safe, with margin",
  "UI-WYGLAD-KOLOR-UWAGA": "Verdict 🟡 Acceptable",
  "UI-WYGLAD-KOLOR-UWAGA-OPIS": "Close to the limit",
  "UI-WYGLAD-KOLOR-BLAD": "Verdict 🔴 Forbidden",
  "UI-WYGLAD-KOLOR-BLAD-OPIS": "Risk of damage/fire",
}

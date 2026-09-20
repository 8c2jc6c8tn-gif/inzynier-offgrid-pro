import "./kafle-ikony.css"

/**
 * Definicje <symbol> dla animowanych ikon kafli pulpitu (kafle 1–14). Renderowane raz
 * (KafleIkonySymbole w app/page.tsx), instancjonowane wielokrotnie przez <use href="#tile-x..."/>
 * w ikona.tsx — ten sam wzorzec co w artefakcie roboczym "Off-Grid Tile Set", z którego pochodzi
 * ten markup 1:1 (kafel 01 zablokowany tam jako finalny; 02/04/06/07 po ostatniej rundzie poprawek;
 * 03/05 bez zmian; 08–14 z artefaktu "Off-Grid Tile Set 08–14", zaakceptowane 20.09.2026 — nazwy
 * klas/gradientów zmienione z roboczych `k8-`/`g-x` na konwencję tego pliku, reszta 1:1).
 * Wstrzyknięte przez dangerouslySetInnerHTML: to statyczna, ręcznie autoryzowana treść SVG, nie
 * dane użytkownika — ręczna konwersja tej ilości atrybutów na JSX (stroke-width→strokeWidth, itd.)
 * byłaby wyższym ryzykiem literówki niż wklejenie ze źródła.
 * Kolejny zablokowany kafel dopisać tu jako kolejny <symbol> + wpis w ikona.tsx.
 */
const DEFS_MARKUP = `
<svg width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true">
  <defs id="kafle-ikony-defs">

    <linearGradient id="ki-sky-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#BFE3F0"/><stop offset="100%" stop-color="#FBF1D8"/>
    </linearGradient>
    <linearGradient id="ki-sky-grad-evening" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7B77A"/><stop offset="100%" stop-color="#7B4B8A"/>
    </linearGradient>
    <linearGradient id="ki-sky-grad-night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#16213A"/><stop offset="100%" stop-color="#0B1220"/>
    </linearGradient>
    <linearGradient id="ki-sky-grad-dawn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8FB6D9"/><stop offset="100%" stop-color="#F6C9C0"/>
    </linearGradient>
    <linearGradient id="ki-sky-grad-winter" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C7D9E8"/><stop offset="100%" stop-color="#EDF3F5"/>
    </linearGradient>
    <linearGradient id="ki-pcb-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1B2E33"/><stop offset="100%" stop-color="#2A4A44"/>
    </linearGradient>
    <linearGradient id="ki-ai-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4C3B78"/><stop offset="100%" stop-color="#7B5FD9"/>
    </linearGradient>
    <linearGradient id="ki-settings-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#DDE4EC"/><stop offset="100%" stop-color="#EFF3F7"/>
    </linearGradient>

    <!-- shared day/night backdrop: sky layers + sun + moon/stars, one 20s clock -->
    <symbol id="ki-scene-daynight" viewBox="0 0 256 256">
      <rect class="sky-day" x="0" y="0" width="256" height="256" fill="url(#ki-sky-grad)"/>
      <rect class="sky-evening" x="0" y="0" width="256" height="256" fill="url(#ki-sky-grad-evening)"/>
      <rect class="sky-night" x="0" y="0" width="256" height="256" fill="url(#ki-sky-grad-night)"/>
      <rect class="sky-dawn" x="0" y="0" width="256" height="256" fill="url(#ki-sky-grad-dawn)"/>

      <g class="phase-sun">
        <circle cx="188" cy="46" r="16" fill="#FFD873"/>
        <g class="sun-glow" stroke="#FFD873" stroke-width="2.5" stroke-linecap="round">
          <line x1="188" y1="16" x2="188" y2="24"/>
          <line x1="188" y1="68" x2="188" y2="76"/>
          <line x1="158" y1="46" x2="166" y2="46"/>
          <line x1="210" y1="46" x2="218" y2="46"/>
          <line x1="167" y1="25" x2="172" y2="30"/>
          <line x1="209" y1="25" x2="204" y2="30"/>
        </g>
      </g>

      <g class="phase-moon">
        <circle cx="68" cy="42" r="14" fill="#E9EEF7"/>
        <circle cx="73" cy="37" r="12" fill="url(#ki-sky-grad-night)"/>
        <circle class="star" cx="100" cy="30" r="1.6" fill="#E9EEF7" style="animation-delay:0s"/>
        <circle class="star" cx="120" cy="60" r="1.3" fill="#E9EEF7" style="animation-delay:.7s"/>
        <circle class="star" cx="40" cy="70" r="1.4" fill="#E9EEF7" style="animation-delay:1.4s"/>
        <circle class="star" cx="150" cy="34" r="1.2" fill="#E9EEF7" style="animation-delay:2s"/>
      </g>
    </symbol>

    <!-- ================= KAFEL 01 — lokalizacja i teren ================= -->
    <symbol id="tile-terrain-symbol" viewBox="0 0 256 256">
      <rect x="0" y="0" width="256" height="256" fill="url(#ki-sky-grad)"/>
      <g class="cloud" fill="#FFFFFF" opacity=".85" style="animation-delay:0s"><ellipse cx="196" cy="46" rx="22" ry="10"/><ellipse cx="212" cy="40" rx="16" ry="9"/><ellipse cx="182" cy="40" rx="14" ry="8"/></g>
      <g class="cloud" fill="#FFFFFF" opacity=".7" style="animation-delay:-7s"><ellipse cx="52" cy="34" rx="17" ry="8"/><ellipse cx="64" cy="30" rx="12" ry="7"/></g>
      <g fill="#EAF6FF"><circle class="particle" cx="34" cy="184" r="2.2" style="animation-delay:0s"/><circle class="particle" cx="222" cy="120" r="1.8" style="animation-delay:1.1s"/><circle class="particle" cx="238" cy="150" r="1.6" style="animation-delay:.6s"/></g>
      <path d="M0 196 C 48 176, 92 132, 140 118 C 176 108, 214 150, 256 168 L 256 256 L 0 256 Z" fill="#5C9E56"/>
      <path d="M0 226 C 60 214, 96 176, 150 190 C 190 200, 220 232, 256 226 L 256 256 L 0 256 Z" fill="#83C46E"/>
      <ellipse cx="176" cy="150" rx="20" ry="8" fill="#D9B679" opacity=".7"/>
      <path class="contour" style="animation-delay:0s" d="M14 200 C 60 182, 96 146, 140 132 C 176 122, 210 158, 246 176" fill="none" stroke="#3E7A3B" stroke-width="2" stroke-linecap="round"/>
      <path class="contour" style="animation-delay:1.3s" d="M10 214 C 58 200, 100 168, 146 156 C 182 146, 214 176, 250 192" fill="none" stroke="#3E7A3B" stroke-width="2" stroke-linecap="round"/>
      <g transform="translate(210,34)">
        <rect x="-7" y="-6" width="14" height="12" rx="2" fill="#EDF1F5" stroke="#A9B4C2" stroke-width="1.5"/>
        <rect x="-22" y="-2" width="12" height="5" rx="1" fill="#F5B942"/>
        <rect x="10" y="-2" width="12" height="5" rx="1" fill="#F5B942"/>
        <circle class="sat-light" cx="0" cy="0" r="2" fill="#4B8CF5"/>
      </g>
      <path d="M210 40 C 196 62, 182 84, 170 108" fill="none" stroke="#4B8CF5" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" class="signal"/>
      <circle r="3.2" fill="#4B8CF5" class="packet" style="offset-path:path('M210 40 C 196 62, 182 84, 170 108');animation-delay:0s"/>
      <circle r="3.2" fill="#4B8CF5" class="packet" style="offset-path:path('M210 40 C 196 62, 182 84, 170 108');animation-delay:1.5s"/>
      <g transform="translate(170,112)">
        <circle class="gps-ring" cx="0" cy="0" r="12" fill="none" stroke="#4B8CF5" stroke-width="2.5"/>
        <path d="M0 -18 C 9 -18, 15 -11, 15 -3 C 15 9, 0 24, 0 24 C 0 24, -15 9, -15 -3 C -15 -11, -9 -18, 0 -18 Z" fill="#4B8CF5"/>
        <circle cx="0" cy="-3" r="5" fill="#FFF6E4"/>
      </g>
      <g transform="translate(58,58)">
        <circle r="30" fill="#FFF7E8" stroke="#D9B679" stroke-width="3"/>
        <g stroke="#8A7F63" stroke-width="2" stroke-linecap="round"><line x1="0" y1="-30" x2="0" y2="-24"/><line x1="0" y1="30" x2="0" y2="24"/><line x1="-30" y1="0" x2="-24" y2="0"/><line x1="30" y1="0" x2="24" y2="0"/></g>
        <g class="needle"><path d="M0 -20 L6 4 L0 -1 L-6 4 Z" fill="#4B8CF5"/><path d="M0 20 L6 -4 L0 1 L-6 -4 Z" fill="#8A7F63"/></g>
        <circle r="3" fill="#2A2118"/>
      </g>
    </symbol>

    <!-- ================= KAFEL 02 — zapotrzebowanie energetyczne (dzień/noc) ================= -->
    <symbol id="tile-energy-symbol" viewBox="0 0 256 256">
      <use href="#ki-scene-daynight"/>
      <rect x="0" y="206" width="256" height="50" fill="#7CBE64"/>
      <rect x="0" y="206" width="256" height="10" fill="#8FCB78"/>

      <path d="M40 150 L92 110 L144 150 L144 210 L40 210 Z" fill="#FFF6E4" stroke="#E4D4AE" stroke-width="2"/>
      <path d="M30 156 L92 104 L154 156 L144 156 L92 116 L40 156 Z" fill="#F5C065"/>
      <rect x="58" y="168" width="26" height="42" rx="2" fill="#B9855A"/>
      <g class="window-phase">
        <rect x="104" y="168" width="24" height="22" rx="2" fill="#4B8CF5" opacity=".18"/>
        <rect x="104" y="168" width="24" height="22" rx="2" fill="none" stroke="#B9855A" stroke-width="2"/>
        <rect class="window-glow" x="107" y="171" width="18" height="16" rx="1" fill="#FFD873"/>
      </g>

      <g transform="translate(150,150)"><rect x="-10" y="-10" width="20" height="20" rx="4" fill="#2C3440"/></g>
      <path d="M158 146 C 170 138, 178 136, 188 142" fill="none" stroke="#2FAE60" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" class="flow"/>
      <circle r="3" fill="#2FAE60" class="flow-packet" style="offset-path:path('M158 146 C 170 138, 178 136, 188 142');animation-delay:0s"/>
      <circle r="3" fill="#2FAE60" class="flow-packet" style="offset-path:path('M158 146 C 170 138, 178 136, 188 142');animation-delay:.9s"/>

      <g class="bars-scale-demand" transform="translate(0,0)">
        <line x1="176" y1="210" x2="246" y2="210" stroke="#4B8CF5" stroke-width="2" stroke-linecap="round"/>
        <rect class="bar" x="178" y="188" width="10" height="22" rx="2" fill="#4B8CF5" style="animation-delay:0s"/>
        <rect class="bar" x="192" y="176" width="10" height="34" rx="2" fill="#4B8CF5" style="animation-delay:.3s"/>
        <rect class="bar" x="206" y="164" width="10" height="46" rx="2" fill="#4B8CF5" style="animation-delay:.6s"/>
        <rect class="bar" x="220" y="180" width="10" height="30" rx="2" fill="#4B8CF5" style="animation-delay:.15s"/>
        <rect class="bar" x="234" y="170" width="10" height="40" rx="2" fill="#4B8CF5" style="animation-delay:.45s"/>
      </g>

      <g transform="translate(211,142)">
        <rect x="-32" y="-13" width="64" height="22" rx="11" fill="#1B2430"/>
        <path class="bolt" transform="translate(-22,0) scale(.85)" d="M2 -8 L-5 2 L-1 2 L-3 9 L6 -1 L1 -1 Z" fill="#F5C065"/>
        <text class="kw-day" x="6" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">0.6 kW</text>
        <text class="kw-evening" x="6" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">2.6 kW</text>
        <text class="kw-night" x="6" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">1.3 kW</text>
        <text class="kw-dawn" x="6" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">0.9 kW</text>
      </g>
    </symbol>

    <!-- ================= KAFEL 03 — instalacja PV (dzień/noc, lustrzane) ================= -->
    <symbol id="tile-pv-symbol" viewBox="0 0 256 256">
      <use href="#ki-scene-daynight"/>
      <rect x="0" y="206" width="256" height="50" fill="#7CBE64"/>
      <rect x="0" y="206" width="256" height="10" fill="#8FCB78"/>

      <!-- house, side profile -->
      <path d="M40 150 L40 210 L172 210 L172 150 L106 108 Z" fill="#FFF6E4" stroke="#E4D4AE" stroke-width="2"/>
      <rect x="58" y="168" width="22" height="42" rx="2" fill="#B9855A"/>
      <rect x="118" y="172" width="24" height="20" rx="2" fill="#4B8CF5" opacity=".16"/>
      <rect x="118" y="172" width="24" height="20" rx="2" fill="none" stroke="#B9855A" stroke-width="2"/>

      <!-- panels on the roof slope -->
      <g stroke="#8FA3C2" stroke-width="1">
        <path d="M50 148 L104 112 L118 121 L64 158 Z" fill="#27324A"/>
        <path d="M66 159 L120 122 L134 131 L80 169 Z" fill="#2E3B57"/>
        <path d="M57 153 L111 117" stroke-width="1.4"/>
        <path d="M73 164 L127 128" stroke-width="1.4"/>
      </g>

      <!-- inverter + PV badge -->
      <g transform="translate(150,150)"><rect x="-11" y="-9" width="22" height="18" rx="3" fill="#2C3440"/>
        <text class="bolt" x="0" y="4" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" font-weight="500" fill="#F5B942">PV</text>
      </g>

      <g class="phase-production">
        <path d="M100 118 C 118 130, 132 138, 148 146" fill="none" stroke="#2FAE60" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" class="flow"/>
        <circle r="3" fill="#2FAE60" class="flow-packet" style="offset-path:path('M100 118 C 118 130, 132 138, 148 146');animation-delay:0s"/>
        <circle r="3" fill="#2FAE60" class="flow-packet" style="offset-path:path('M100 118 C 118 130, 132 138, 148 146');animation-delay:.9s"/>
      </g>

      <g class="bars-scale-production">
        <line x1="176" y1="210" x2="246" y2="210" stroke="#4B8CF5" stroke-width="2" stroke-linecap="round"/>
        <rect class="bar" x="178" y="188" width="10" height="22" rx="2" fill="#4B8CF5" style="animation-delay:0s"/>
        <rect class="bar" x="192" y="176" width="10" height="34" rx="2" fill="#4B8CF5" style="animation-delay:.3s"/>
        <rect class="bar" x="206" y="164" width="10" height="46" rx="2" fill="#4B8CF5" style="animation-delay:.6s"/>
        <rect class="bar" x="220" y="180" width="10" height="30" rx="2" fill="#4B8CF5" style="animation-delay:.15s"/>
        <rect class="bar" x="234" y="170" width="10" height="40" rx="2" fill="#4B8CF5" style="animation-delay:.45s"/>
      </g>

      <g transform="translate(211,96)">
        <rect x="-30" y="-13" width="60" height="22" rx="11" fill="#1B2430"/>
        <text class="kw-day" x="2" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">3.8 kW</text>
        <text class="kw-evening" x="2" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">0.7 kW</text>
        <text class="kw-night" x="2" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">0.0 kW</text>
        <text class="kw-dawn" x="2" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">0.5 kW</text>
      </g>
    </symbol>

    <!-- ================= KAFEL 04 — magazyn energii (12 ogniw LiFePO4) ================= -->
    <symbol id="tile-battery-symbol" viewBox="0 0 256 256">
      <rect x="0" y="0" width="256" height="256" fill="url(#ki-sky-grad)"/>
      <rect x="0" y="206" width="256" height="50" fill="#7CBE64"/>
      <rect x="0" y="206" width="256" height="10" fill="#8FCB78"/>

      <g transform="translate(128,66)">
        <rect x="-34" y="-15" width="68" height="24" rx="12" fill="#1B2430"/>
        <path class="bolt" transform="translate(-22,0) scale(.8)" d="M2 -8 L-5 2 L-1 2 L-3 9 L6 -1 L1 -1 Z" fill="#F5C065"/>
        <text class="pack-a" x="6" y="3" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">68%</text>
        <text class="pack-b" x="6" y="3" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">94%</text>
        <text class="pack-c" x="6" y="3" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#EAF1FF">45%</text>
      </g>

      <!-- one enclosure, twelve cells inside -->
      <rect x="52" y="86" width="152" height="104" rx="10" fill="#EAE5F6" stroke="#9D7BF0" stroke-width="2.5"/>
      <rect x="88" y="80" width="18" height="9" rx="2" fill="#6A5AC8"/>
      <rect x="150" y="80" width="18" height="9" rx="2" fill="#6A5AC8"/>

      <line x1="64" y1="100" x2="176" y2="100" stroke="#4B8CF5" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 6" class="flow"/>
      <circle r="2.6" fill="#4B8CF5" class="bus-packet" style="offset-path:path('M64 100 L176 100');animation-delay:0s"/>
      <circle r="2.6" fill="#4B8CF5" class="bus-packet" style="offset-path:path('M64 100 L176 100');animation-delay:1.4s;animation-direction:reverse;"/>

      <g stroke="#9D7BF0" stroke-width="1.4" fill="#3B3252">
        <rect x="64" y="100" width="18" height="24" rx="4"/>
        <rect x="95" y="100" width="18" height="24" rx="4"/>
        <rect x="127" y="100" width="18" height="24" rx="4"/>
        <rect x="158" y="100" width="18" height="24" rx="4"/>
        <rect x="64" y="126" width="18" height="24" rx="4"/>
        <rect x="95" y="126" width="18" height="24" rx="4"/>
        <rect x="127" y="126" width="18" height="24" rx="4"/>
        <rect x="158" y="126" width="18" height="24" rx="4"/>
        <rect x="64" y="152" width="18" height="24" rx="4"/>
        <rect x="95" y="152" width="18" height="24" rx="4"/>
        <rect x="127" y="152" width="18" height="24" rx="4"/>
        <rect x="158" y="152" width="18" height="24" rx="4"/>
      </g>
      <g>
        <rect class="cell-level" x="67" y="112" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:0s"/>
        <rect class="cell-level" x="98" y="112" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-.6s"/>
        <rect class="cell-level" x="130" y="112" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-1.2s"/>
        <rect class="cell-level" x="161" y="112" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-1.8s"/>
        <rect class="cell-level" x="67" y="138" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-2.4s"/>
        <rect class="cell-level" x="98" y="138" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-3s"/>
        <rect class="cell-level" x="130" y="138" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-3.6s"/>
        <rect class="cell-level" x="161" y="138" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-4.2s"/>
        <rect class="cell-level" x="67" y="164" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-4.8s"/>
        <rect class="cell-level" x="98" y="164" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-5.4s"/>
        <rect class="cell-level" x="130" y="164" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-6s"/>
        <rect class="cell-level" x="161" y="164" width="12" height="12" rx="2" fill="#2FAE60" style="animation-delay:-6.6s"/>
      </g>

      <path d="M204 138 C 218 138, 230 144, 246 150" fill="none" stroke="#2FAE60" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" class="flow"/>
      <circle r="3" fill="#2FAE60" class="flow-packet" style="offset-path:path('M204 138 C 218 138, 230 144, 246 150');animation-delay:0s"/>
      <circle r="3" fill="#2FAE60" class="flow-packet" style="offset-path:path('M204 138 C 218 138, 230 144, 246 150');animation-delay:.9s"/>
    </symbol>

    <!-- ================= KAFEL 05 — okablowanie i zabezpieczenia ================= -->
    <symbol id="tile-cabling-symbol" viewBox="0 0 256 256">
      <rect x="0" y="0" width="256" height="256" fill="#EFF3F0"/>
      <rect x="0" y="0" width="256" height="256" fill="#4B8CF5" opacity=".03"/>

      <g transform="translate(46,140)"><rect x="-18" y="-24" width="36" height="48" rx="5" fill="#F7F9FA" stroke="#B9C2CE" stroke-width="2"/><circle cx="0" cy="0" r="4" fill="#9D7BF0"/></g>
      <g transform="translate(210,140)"><rect x="-18" y="-24" width="36" height="48" rx="5" fill="#F7F9FA" stroke="#B9C2CE" stroke-width="2"/><circle cx="0" cy="0" r="4" fill="#2FAE60"/></g>

      <path d="M64 140 C 92 118, 108 118, 128 140" fill="none" stroke="#8B96A8" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M128 140 C 148 162, 164 162, 192 140" fill="none" stroke="#8B96A8" stroke-width="2.5" stroke-linecap="round"/>
      <g class="flow-gate">
        <path d="M64 140 C 92 118, 108 118, 128 140" fill="none" stroke="#2FAE60" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" class="flow"/>
        <path d="M128 140 C 148 162, 164 162, 192 140" fill="none" stroke="#2FAE60" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" class="flow"/>
        <circle r="3" fill="#2FAE60" class="flow-packet" style="offset-path:path('M64 140 C 92 118, 108 118, 128 140 C 148 162, 164 162, 192 140');animation-delay:0s;animation-duration:3s;"/>
        <circle r="3" fill="#2FAE60" class="flow-packet" style="offset-path:path('M64 140 C 92 118, 108 118, 128 140 C 148 162, 164 162, 192 140');animation-delay:1.5s;animation-duration:3s;"/>
      </g>

      <g transform="translate(128,140)">
        <rect x="-22" y="-30" width="44" height="60" rx="6" fill="#DCE3E8" stroke="#AEB9C4" stroke-width="2"/>
        <g class="breaker-lever" style="transform-origin:0px -6px;">
          <rect x="-4" y="-22" width="8" height="20" rx="3" fill="#404B5E"/>
        </g>
        <circle class="breaker-light" cx="0" cy="18" r="4" fill="#FB923C"/>
        <g class="shield-confirm" transform="translate(0,-46)">
          <path d="M0 -12 L11 -6 L11 6 C11 15, 0 20, 0 20 C0 20, -11 15, -11 6 L-11 -6 Z" fill="#2FAE60"/>
          <path d="M-5 0 L-1 5 L6 -6" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </g>
    </symbol>

    <!-- ================= KAFEL 06 — pompa ciepła ================= -->
    <symbol id="tile-heatpump-symbol" viewBox="0 0 256 256">
      <rect x="0" y="0" width="256" height="256" fill="url(#ki-sky-grad)"/>
      <rect x="0" y="206" width="256" height="50" fill="#7CBE64"/>
      <rect x="0" y="206" width="256" height="10" fill="#8FCB78"/>

      <!-- real house, standing next to the unit -->
      <path d="M140 150 L192 110 L244 150 L244 210 L140 210 Z" fill="#FFF6E4" stroke="#E4D4AE" stroke-width="2"/>
      <path d="M130 156 L192 104 L254 156 L244 156 L192 116 L140 156 Z" fill="#F5C065"/>
      <rect x="158" y="168" width="26" height="42" rx="2" fill="#B9855A"/>
      <rect x="204" y="168" width="24" height="22" rx="2" fill="#4B8CF5" opacity=".16"/>
      <rect x="204" y="168" width="24" height="22" rx="2" fill="none" stroke="#B9855A" stroke-width="2"/>

      <!-- underfloor heating, inside the house -->
      <path class="floor-heat" d="M150 204 L160 196 L172 204 L184 196 L196 204 L208 196 L220 204 L232 196" fill="none" stroke="#F5A93C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- outdoor unit: casing + fan, nothing else -->
      <g transform="translate(76,180)">
        <rect x="-28" y="-28" width="56" height="56" rx="8" fill="#DCE3E8" stroke="#AEB9C4" stroke-width="2.5"/>
        <g class="fan-spin">
          <circle r="16" fill="none" stroke="#8B96A8" stroke-width="2"/>
          <path d="M0 -14 C 6 -6, 6 6, 0 14 M0 -14 C -6 -6, -6 6, 0 14" stroke="#4B8CF5" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>
      </g>

      <g transform="translate(192,132)">
        <rect x="-30" y="-13" width="60" height="22" rx="11" fill="#1B2430"/>
        <text class="ind-a" x="0" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#FFD3A8">18°C</text>
        <text class="ind-b" x="0" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#FFD3A8">21°C</text>
        <text class="ind-c" x="0" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#FFD3A8">24°C</text>
      </g>
    </symbol>

    <!-- ================= KAFEL 07 — stress-test zimowy ================= -->
    <symbol id="tile-winter-symbol" viewBox="0 0 256 256">
      <rect x="0" y="0" width="256" height="256" fill="url(#ki-sky-grad-winter)"/>
      <rect x="0" y="216" width="256" height="40" fill="#EEF4F7"/>
      <rect x="0" y="216" width="256" height="8" fill="#FFFFFF"/>

      <g fill="#FFFFFF" stroke="#8FAEC9" stroke-width=".8">
        <circle class="snowflake" cx="20" cy="-10" r="3" style="animation-delay:0s"/>
        <circle class="snowflake" cx="60" cy="-10" r="2.3" style="animation-delay:1.1s"/>
        <circle class="snowflake" cx="100" cy="-10" r="3.2" style="animation-delay:.4s"/>
        <circle class="snowflake" cx="140" cy="-10" r="2.5" style="animation-delay:1.8s"/>
        <circle class="snowflake" cx="180" cy="-10" r="3" style="animation-delay:.9s"/>
        <circle class="snowflake" cx="220" cy="-10" r="2.3" style="animation-delay:1.5s"/>
        <circle class="snowflake" cx="40" cy="-10" r="2.1" style="animation-delay:2.2s"/>
        <circle class="snowflake" cx="160" cy="-10" r="2.1" style="animation-delay:2.6s"/>
        <circle class="snowflake" cx="235" cy="-10" r="2.7" style="animation-delay:.2s"/>
      </g>

      <g transform="translate(120,150)">
        <path d="M-40 60 L-40 0 L12 -42 L64 0 L64 60 Z" fill="#F3F7FA" stroke="#C9D6E0" stroke-width="2"/>
        <path d="M-46 4 L12 -46 L70 4 L64 4 L12 -36 L-40 4 Z" fill="#FFFFFF" stroke="#E4EDF2" stroke-width="1.5"/>
        <rect x="-8" y="18" width="22" height="20" rx="2" fill="#4B8CF5" opacity=".18"/>
        <rect x="-8" y="18" width="22" height="20" rx="2" fill="none" stroke="#9FB4C4" stroke-width="2"/>
        <rect class="window-glow" x="-5" y="21" width="16" height="14" rx="1" fill="#FFD873"/>
        <rect x="4" y="-40" width="10" height="16" fill="#C9D6E0"/>
        <g class="heat-wave" style="animation-delay:0s"><path d="M9 -46 q6 -8 0 -16 q-6 -8 0 -16" fill="none" stroke="#F5A93C" stroke-width="2.2" stroke-linecap="round"/></g>
        <g class="heat-wave" style="animation-delay:1s"><path d="M16 -46 q6 -8 0 -16 q-6 -8 0 -16" fill="none" stroke="#F5A93C" stroke-width="2.2" stroke-linecap="round"/></g>
        <path class="floor-heat" d="M-20 52 L-12 44 L0 52 L12 44 L24 52 L36 44 L44 52" fill="none" stroke="#F5A93C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <g transform="translate(38,182)">
        <rect x="-2" y="-30" width="12" height="6" rx="1" fill="#6A5AC8"/>
        <rect x="-10" y="-24" width="28" height="52" rx="6" fill="#3B3252" stroke="#9D7BF0" stroke-width="2"/>
        <rect class="cell-level-single" x="-6" y="18" width="20" height="42" rx="3" fill="#2FAE60"/>
      </g>
      <path d="M54 178 C 66 176, 72 172, 80 168" fill="none" stroke="#2FAE60" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" class="flow"/>
      <circle r="2.8" fill="#2FAE60" class="flow-packet" style="offset-path:path('M54 178 C 66 176, 72 172, 80 168');animation-delay:0s"/>

      <g transform="translate(206,104)">
        <rect x="-42" y="-14" width="84" height="24" rx="12" fill="#132033"/>
        <g transform="translate(-28,0)">
          <rect x="-2.5" y="-9" width="5" height="13" rx="2.5" fill="#EAF6FF" stroke="#8FD3F5" stroke-width="1.2"/>
          <circle cx="0" cy="7" r="4.5" fill="#4B8CF5"/>
          <rect x="-1.2" y="-6" width="2.4" height="11" rx="1.2" fill="#4B8CF5"/>
        </g>
        <text class="temp-a" x="8" y="3" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#BFE3F0">-5°C</text>
        <text class="temp-b" x="8" y="3" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#BFE3F0">-14°C</text>
        <text class="temp-c" x="8" y="3" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#BFE3F0">-22°C</text>
        <text class="temp-d" x="8" y="3" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#BFE3F0">-30°C</text>
      </g>
      <g transform="translate(206,66)">
        <rect x="-32" y="-13" width="64" height="22" rx="11" fill="#132B1E"/>
        <text class="itemp-a" x="0" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#B7EFC9">15°C</text>
        <text class="itemp-b" x="0" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#B7EFC9">17°C</text>
        <text class="itemp-c" x="0" y="2" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="500" fill="#B7EFC9">20°C</text>
      </g>
    </symbol>

    <!-- ================= KAFEL 08 — bezpieczeństwo i sytuacje awaryjne ================= -->
    <symbol id="tile-safety-symbol" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="url(#ki-sky-grad)"/>
      <path d="M40 180 L40 120 L128 62 L216 120 L216 180 Z" fill="#F4EFE3" stroke="#D8CFB8" stroke-width="3"/>
      <rect x="70" y="130" width="40" height="50" fill="#C9BE9E"/>
      <g class="alarm-ring" transform="translate(128,110)">
        <circle r="34" fill="none" stroke="#E2574C" stroke-width="3" opacity=".55"/>
      </g>
      <g transform="translate(128,110)">
        <path d="M-22 -6 C-22 -22, -10 -30, 0 -30 C10 -30, 22 -22, 22 -6 L22 6 L28 14 L-28 14 L-22 6 Z" fill="#E2574C"/>
        <path d="M-6 14 C-6 20, 6 20, 6 14" fill="none" stroke="#F4EFE3" stroke-width="2.5"/>
      </g>
      <g class="alarm-bell" transform="translate(128,66)" stroke="#B14337" stroke-width="3" stroke-linecap="round">
        <line x1="0" y1="0" x2="0" y2="-16"/>
      </g>
      <path class="alarm-check" d="M110 116 L122 130 L148 100" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    </symbol>

    <!-- ================= KAFEL 09 — elektronika / ESP32 / sensoryka ================= -->
    <symbol id="tile-electronics-symbol" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="url(#ki-pcb-grad)"/>
      <g stroke="#3FBF9B" stroke-width="2.5" fill="none" opacity=".8">
        <path d="M30 60 H90 V100"/>
        <path d="M226 70 H180 V110"/>
        <path d="M30 200 H80 V150"/>
        <path d="M226 190 H190 V150"/>
        <circle cx="90" cy="100" r="3" fill="#3FBF9B"/>
        <circle cx="180" cy="110" r="3" fill="#3FBF9B"/>
        <circle cx="80" cy="150" r="3" fill="#3FBF9B"/>
        <circle cx="190" cy="150" r="3" fill="#3FBF9B"/>
      </g>
      <rect x="86" y="96" width="84" height="64" rx="6" fill="#101B1E" stroke="#3FBF9B" stroke-width="2"/>
      <text x="128" y="133" text-anchor="middle" font-family="monospace" font-size="13" fill="#3FBF9B" font-weight="700">ESP32</text>
      <g class="led-a" fill="#5FE0C6"><circle cx="100" cy="112" r="3.4"/></g>
      <g class="led-b" fill="#F2C464"><circle cx="112" cy="112" r="3.4"/></g>
      <g class="led-c" fill="#E2574C"><circle cx="124" cy="112" r="3.4"/></g>
      <path d="M170 128 C 190 128, 190 128, 208 128" fill="none" stroke="#5FE0C6" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" class="signal"/>
      <circle r="3" fill="#5FE0C6" class="packet" style="offset-path:path('M170 128 C 190 128, 190 128, 208 128');animation-delay:0s"/>
      <path d="M212 118 A 18 18 0 0 1 212 138" fill="none" stroke="#5FE0C6" stroke-width="2.5" stroke-linecap="round" opacity=".6" class="esp-wave"/>
      <path d="M218 112 A 26 26 0 0 1 218 144" fill="none" stroke="#5FE0C6" stroke-width="2.5" stroke-linecap="round" opacity=".35" class="esp-wave" style="animation-delay:.5s"/>
    </symbol>

    <!-- ================= KAFEL 10 — AI i prognozy ================= -->
    <symbol id="tile-ai-forecast-symbol" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="url(#ki-ai-grad)"/>
      <g stroke="#C9BCFF" stroke-width="1.6" opacity=".55">
        <line x1="70" y1="76" x2="118" y2="100"/>
        <line x1="118" y1="100" x2="176" y2="70"/>
        <line x1="118" y1="100" x2="150" y2="150"/>
      </g>
      <g fill="#EDE7FF">
        <circle class="ai-node" cx="70" cy="76" r="5"/>
        <circle class="ai-node" cx="176" cy="70" r="5" style="animation-delay:.6s"/>
        <circle class="ai-node ai-node-main" cx="118" cy="100" r="7"/>
        <circle class="ai-node" cx="150" cy="150" r="5" style="animation-delay:1.2s"/>
      </g>
      <g transform="translate(60,164)">
        <rect class="bar" x="0" y="20" width="16" height="40" rx="2" fill="#EDE7FF" opacity=".9" style="animation-delay:0s"/>
        <rect class="bar" x="24" y="10" width="16" height="50" rx="2" fill="#EDE7FF" opacity=".9" style="animation-delay:-.6s"/>
        <rect class="bar" x="48" y="0" width="16" height="60" rx="2" fill="#FFD873" style="animation-delay:-1.2s"/>
        <rect class="bar" x="72" y="16" width="16" height="44" rx="2" fill="#EDE7FF" opacity=".9" style="animation-delay:-.3s"/>
        <rect class="bar" x="96" y="26" width="16" height="34" rx="2" fill="#EDE7FF" opacity=".7" style="animation-delay:-.9s"/>
        <line x1="0" y1="61" x2="112" y2="61" stroke="#EDE7FF" stroke-width="1.4" opacity=".4"/>
      </g>
    </symbol>

    <!-- ================= KAFEL 11 — montaż baterii ================= -->
    <symbol id="tile-battery-mount-symbol" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="url(#ki-sky-grad)"/>
      <rect x="70" y="80" width="116" height="96" rx="8" fill="none" stroke="#3B6E8F" stroke-width="3"/>
      <rect x="118" y="70" width="20" height="12" rx="2" fill="#3B6E8F"/>
      <rect class="cell-level" x="82" y="88" width="28" height="80" rx="3" fill="#5FA6D1"/>
      <rect class="cell-level" x="114" y="88" width="28" height="80" rx="3" fill="#5FA6D1" style="animation-delay:-2.6s"/>
      <rect class="cell-level" x="146" y="88" width="28" height="80" rx="3" fill="#5FA6D1" style="animation-delay:-5.2s"/>
      <g class="wrench-tighten" transform="translate(196,150)">
        <path d="M-10 -22 L10 -2 M4 -16 L-2 -10" stroke="#5B4636" stroke-width="7" stroke-linecap="round"/>
        <circle cx="-14" cy="-26" r="9" fill="none" stroke="#5B4636" stroke-width="6"/>
        <circle cx="12" cy="0" r="7" fill="#5B4636"/>
      </g>
    </symbol>

    <!-- ================= KAFEL 12 — szybki kalkulator / tryb mobilny ================= -->
    <symbol id="tile-quick-calc-symbol" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="url(#ki-sky-grad)"/>
      <rect x="94" y="52" width="68" height="132" rx="14" fill="#233240" stroke="#0F1720" stroke-width="3"/>
      <rect x="102" y="66" width="52" height="90" rx="3" fill="#EAF3FA"/>
      <circle cx="128" cy="170" r="4" fill="#0F1720"/>
      <g class="bolt" transform="translate(128,108)">
        <path d="M-6 -22 L8 -22 L-2 -2 L10 -2 L-8 24 L-2 2 L-12 2 Z" fill="#F5B942"/>
      </g>
      <g class="tap-ripple" transform="translate(128,204)">
        <circle r="6" fill="none" stroke="#4B8CF5" stroke-width="3"/>
      </g>
      <g class="tap-ripple" transform="translate(128,204)" style="animation-delay:.9s">
        <circle r="6" fill="none" stroke="#4B8CF5" stroke-width="3"/>
      </g>
    </symbol>

    <!-- ================= KAFEL 13 — tryb Live ================= -->
    <symbol id="tile-live-symbol" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="url(#ki-sky-grad-night)"/>
      <g class="star" fill="#E9EEF7"><circle cx="40" cy="40" r="1.4" style="animation-delay:0s"/></g>
      <g class="star" fill="#E9EEF7"><circle cx="210" cy="50" r="1.2" style="animation-delay:.8s"/></g>
      <g class="star" fill="#E9EEF7"><circle cx="200" cy="150" r="1.5" style="animation-delay:1.6s"/></g>
      <g transform="translate(120,150)">
        <path d="M-40 30 L0 -10 L40 30 Z" fill="#3A4A63" stroke="#5A6E8C" stroke-width="2.5"/>
        <line x1="0" y1="-10" x2="0" y2="-52" stroke="#5A6E8C" stroke-width="4" stroke-linecap="round"/>
        <circle cx="0" cy="-56" r="5" fill="#E2574C" class="live-dot"/>
      </g>
      <path d="M120 96 A 36 36 0 0 1 156 132" fill="none" stroke="#5FA0E0" stroke-width="3" stroke-linecap="round" opacity=".7" class="signal"/>
      <path d="M120 78 A 54 54 0 0 1 174 132" fill="none" stroke="#5FA0E0" stroke-width="3" stroke-linecap="round" opacity=".4" class="signal" style="animation-delay:.5s"/>
      <circle r="3.4" fill="#8BC4FF" class="packet" style="offset-path:path('M120 96 A 36 36 0 0 1 156 132');animation-delay:.2s"/>
    </symbol>

    <!-- ================= KAFEL 14 — ustawienia ================= -->
    <symbol id="tile-settings-symbol" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="url(#ki-settings-grad)"/>
      <g class="gear-spin" transform="translate(112,120)" fill="#6B7A8C">
        <circle r="30" fill="none" stroke="#6B7A8C" stroke-width="10"/>
        <g>
          <rect x="-4" y="-42" width="8" height="16" rx="2"/>
          <rect x="-4" y="26" width="8" height="16" rx="2"/>
          <rect x="-42" y="-4" width="16" height="8" rx="2"/>
          <rect x="26" y="-4" width="16" height="8" rx="2"/>
          <rect x="-34" y="-34" width="8" height="16" rx="2" transform="rotate(45 -30 -26)"/>
          <rect x="22" y="-34" width="8" height="16" rx="2" transform="rotate(-45 26 -26)"/>
          <rect x="-34" y="18" width="8" height="16" rx="2" transform="rotate(-45 -30 26)"/>
          <rect x="22" y="18" width="8" height="16" rx="2" transform="rotate(45 26 26)"/>
        </g>
        <circle r="11" fill="#F5F7F9"/>
      </g>
      <g transform="translate(178,168)">
        <rect x="-26" y="-11" width="52" height="22" rx="11" fill="#B9C4CF"/>
        <circle class="toggle-slide" cx="-9" cy="0" r="9" fill="#F5F7F9"/>
      </g>
    </symbol>

  </defs>
</svg>
`

export function KafleIkonySymbole() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      dangerouslySetInnerHTML={{ __html: DEFS_MARKUP }}
    />
  )
}

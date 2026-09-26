// Tally of docs/rejestr-pokrycia.md statuses per module — input for mapa-wdrozenia.md resyncs (14.3: by
// recount, not from memory). Rows are assigned to modules per section: "## Moduł N" headings, or a
// "Moduł" column in mixed sections. Raw counts: duplicates across sections and screen denominators
// (from the Tresc_* summaries) still need a human pass — see mapa-wdrozenia.md, 26.09.2026 entry.
// Usage: pnpm rejestr:licz [module] — with a module number, also lists its rows.
import { readFileSync } from "node:fs"
const lines = readFileSync("docs/rejestr-pokrycia.md", "utf8").split("\n")
let secMod = null, header = null, section = ""
const rows = []
const cells = (l) => l.split("|").slice(1, -1).map((c) => c.trim())
for (const l of lines) {
  const h = l.match(/^#{2,3} (.*)/)
  if (h) { section = h[1]; const m = h[1].match(/^Moduł (\d+)\b/); secMod = m ? Number(m[1]) : null; header = null; continue }
  if (!l.startsWith("|")) { header = null; continue }
  const c = cells(l)
  if (!header) { header = c; continue }
  if (c[0].startsWith("---")) continue
  const si = header.findIndex((x) => /^Status/.test(x)); if (si < 0) continue
  let mod = secMod
  const mi = header.findIndex((x) => /^Moduł/.test(x))
  if (mi >= 0) { const m = c[mi].match(/(?:Moduł )?(\d+)/); if (m) mod = Number(m[1]) }
  const st = c[si]
  const kind = /\*\*done/.test(st) ? (/częściowo|bez |tylko/.test(st) ? "done-cz" : "done") : /blocked/.test(st) ? "blocked" : /in-progress/.test(st) ? "in-progress" : /^todo/.test(st) ? "todo" : "inne"
  const id = c[header.findIndex((x) => /^ID/.test(x))] ?? ""
  rows.push({ mod, kind, st, id, name: c[header.findIndex((x) => /^(Nazwa|Widżet)/.test(x))] ?? c[0], section, note: c[si + 1] ?? "" })
}
const by = {}
for (const r of rows) { const k = r.mod ?? "?"; by[k] ??= { done: 0, "done-cz": 0, todo: 0, blocked: 0, "in-progress": 0, inne: 0, n: 0 }; by[k][r.kind]++; by[k].n++ }
console.table(by)
if (process.argv[2]) for (const r of rows.filter((r) => String(r.mod) === process.argv[2])) console.log(r.kind.padEnd(11), (r.id || "").slice(0, 28).padEnd(28), (r.name || "").slice(0, 60), "|", r.st.slice(0, 40), "|", r.section.slice(0, 30))

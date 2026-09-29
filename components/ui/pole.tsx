import { isValidElement, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react"
import { PomocPole } from "@/components/ui/chmurka"
import { PomocPola } from "@/components/ui/pomoc"
import { cn } from "@/lib/utils"

/**
 * Pole formularza — jeden reużywalny komponent zamiast kopiowanego w every ekranie stringa
 * `inputClass` + ręcznego `<label><input>` (docs/brief-dla-v0.md, sekcja 8: stany hover/focus/
 * disabled muszą być zdefiniowane raz, nie ad-hoc na ekran). Warstwy stanu:
 *  - default:      border-input bg-background
 *  - hover:        border ciemnieje lekko (tylko gdy nie disabled)
 *  - focus-visible: ring-2 ring-ring + border-ring (ten sam token co reszta apki, w tym Chmurka)
 *  - disabled:     opacity + kursor, bez hover/focus
 *  - błąd:         aria-invalid=true → obrys i ring w kolorze werdyktu 🔴 (--werdykt-blad), nie
 *                   generycznego --destructive — jeden słownik kolorów błędu w całej apce.
 */
const STAN_KLASY =
  "w-full min-h-11 rounded-md border border-input bg-background px-3 text-base outline-none transition-colors " +
  "hover:not-disabled:border-foreground/30 " +
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input " +
  "aria-invalid:border-werdykt-blad-border aria-invalid:focus-visible:ring-werdykt-blad/30"

function Etykieta({
  label,
  unit,
  pomoc,
  htmlFor,
}: {
  label: string
  unit?: string
  pomoc?: ReactNode
  htmlFor?: string
}) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1.5 text-small font-medium">
        <label htmlFor={htmlFor}>
          {label} {unit && <span className="text-muted-foreground">[{unit}]</span>}
        </label>
        {/* A translated <PomocPola> is already the „?” trigger (D51); plain content is wrapped once. */}
        {pomoc && (isValidElement(pomoc) && pomoc.type === PomocPola ? pomoc : <PomocPole tresc={pomoc} />)}
      </span>
    </span>
  )
}

type PoleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> & {
  label: string
  unit?: string
  pomoc?: ReactNode
  error?: string
  className?: string
  id?: string
}

/** Pole tekstowe/liczbowe. Zastępuje duplikowany `Field`/`inputClass` z ekranów kalkulatorów. */
export function Pole({ label, unit, pomoc, error, className, id, ...props }: PoleProps) {
  // Standard 8.10: id from useId(), never from the label text (repeated labels in lists).
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className="flex flex-col gap-1 text-small">
      <Etykieta label={label} unit={unit} pomoc={pomoc} htmlFor={inputId} />
      <input
        id={inputId}
        className={cn(STAN_KLASY, className)}
        aria-invalid={Boolean(error) || props["aria-invalid"]}
        {...props}
      />
      {error && (
        <span role="alert" className="text-caption text-werdykt-blad-foreground">
          {error}
        </span>
      )}
    </div>
  )
}

type PoleSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "id"> & {
  label: string
  pomoc?: ReactNode
  className?: string
  id?: string
  children: ReactNode
}

/** Pole wyboru (select) w tym samym stylu co `Pole` — ta sama skala stanów. */
export function PoleSelect({ label, pomoc, className, id, children, ...props }: PoleSelectProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  return (
    <div className="flex flex-col gap-1 text-small">
      <Etykieta label={label} pomoc={pomoc} htmlFor={selectId} />
      <select id={selectId} className={cn(STAN_KLASY, "cursor-pointer", className)} {...props}>
        {children}
      </select>
    </div>
  )
}

type PoleCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id" | "type"> & {
  label: ReactNode
  hint?: string
  className?: string
  id: string
}

/** Checkbox z etykietą i pełnym obszarem klikalnym — używany w checklistach (wzorzec E) i listach
 * odbiorników krytycznych. Wspólny stan focus-visible/disabled zamiast gołego `<input type="checkbox">`. */
export function PoleCheckbox({ label, hint, className, id, ...props }: PoleCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 rounded-md border p-3 text-small transition-colors",
        "hover:not-has-disabled:bg-muted/60",
        "has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-primary outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
        )}
        {...props}
      />
      <span className="flex-1">
        {label}
        {hint && <span className="mt-0.5 block text-caption text-muted-foreground">{hint}</span>}
      </span>
    </label>
  )
}

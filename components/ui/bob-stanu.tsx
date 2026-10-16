import { BOB_STANY, type BobStan } from "@/lib/pulpit/maskotki"
import { cn } from "@/lib/utils"

/**
 * Maskotka Bob jako ozdoba stanu interfejsu (D88). Zawsze dekoracyjna: znaczenie niesie tekst
 * i kolor werdyktu obok, więc obraz jest ukryty przed czytnikami ekranu (`alt=""`, `aria-hidden`).
 */
export function BobStanu({ stan, className }: { stan: BobStan; className?: string }) {
  return (
    <img
      src={BOB_STANY[stan]}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      decoding="async"
      className={cn("object-contain", className)}
    />
  )
}

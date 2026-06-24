import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type MockScoreDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: (score: number) => void
}

/**
 * Modal dialog for logging a mock exam score (0–100%).
 * Traps focus, closes on Escape, and closes on backdrop click.
 */
export function MockScoreDialog({
  open,
  onClose,
  onConfirm,
}: MockScoreDialogProps) {
  const [raw, setRaw] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset local state each time the dialog opens
  useEffect(() => {
    if (open) {
      setRaw('')
      setError('')
      // Give the browser a frame to mount/show before focusing
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const n = Number(raw.replace(',', '.'))
    if (raw.trim() === '' || isNaN(n)) {
      setError('Digite um valor entre 0 e 100.')
      return
    }
    if (n < 0 || n > 100) {
      setError('O percentual deve estar entre 0 e 100.')
      return
    }
    onConfirm(Math.round(n))
    onClose()
  }

  if (!open) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}>
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mock-dialog-title"
        className="w-full max-w-sm rounded-lg border bg-card text-card-foreground shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 id="mock-dialog-title" className="text-base font-semibold">
            Registrar simulado
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Fechar">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <p className="text-sm text-muted-foreground">
            Informe o percentual de acerto obtido no simulado de hoje. A nota
            mínima para aprovação é{' '}
            <span className="font-medium text-foreground">75%</span>.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="mock-score" className="text-sm font-medium">
              Percentual de acerto
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="mock-score"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step={1}
                placeholder="ex: 78"
                value={raw}
                onChange={(e) => {
                  setRaw(e.target.value)
                  setError('')
                }}
                className={cn(
                  'flex h-10 w-full rounded-md border bg-background px-3 py-2 pr-8 text-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  error ? 'border-destructive' : 'border-input',
                )}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            {error && (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Score preview */}
          {raw !== '' && !isNaN(Number(raw)) && (
            <ScorePreview score={Number(raw)} />
          )}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Score preview pill
// ---------------------------------------------------------------------------

function ScorePreview({ score }: { score: number }) {
  const clamped = Math.min(Math.max(score, 0), 100)
  const level =
    clamped >= 75
      ? {
          label: 'Aprovado!',
          color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
        }
      : clamped >= 60
        ? {
            label: 'Quase lá',
            color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
          }
        : {
            label: 'Precisa melhorar',
            color: 'bg-red-500/15 text-red-600 dark:text-red-400',
          }

  return (
    <div
      className={cn('rounded-md px-3 py-2 text-sm font-medium', level.color)}>
      {clamped}% — {level.label}
    </div>
  )
}

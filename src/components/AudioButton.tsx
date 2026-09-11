import { speak } from '../services/voice'

type AudioButtonProps = {
  text: string
  label?: string
  className?: string
}

export function AudioButton({ text, label = 'Écoute', className = '' }: AudioButtonProps) {
  return (
    <button className={`audio-button ${className}`} type="button" onClick={() => speak(text)} aria-label={label}>
      <span aria-hidden="true">🔊</span>
      <span>{label}</span>
    </button>
  )
}

let cachedVoice: SpeechSynthesisVoice | null = null

function chooseVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  cachedVoice =
    voices.find((voice) => voice.lang.toLowerCase() === 'fr-ca') ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith('fr-fr')) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith('fr')) ??
    null
  return cachedVoice
}

export function canSpeak(): boolean {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

export function speak(text: string): void {
  if (!canSpeak()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-CA'
  utterance.rate = 0.86
  utterance.pitch = 1.08
  utterance.voice = cachedVoice ?? chooseVoice()
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

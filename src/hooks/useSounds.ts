import { useCallback } from 'react'

type SoundType = 'tin' | 'shing' | 'ching'

// Sound effect functions using Web Audio API
const playSound = (type: SoundType): void => {
  try {
    if (typeof window === 'undefined' || !window.AudioContext) {
      return
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Sound configurations
    const soundConfigs = {
      tin: {
        frequency: 1200,      // Higher pitch for 'ting'
        duration: 0.05,        // Quick sound
        type: 'sine' as OscillatorType
      },
      shing: {
        frequency: 400,       // Lower pitch for 'shing'
        duration: 0.08,        // Slightly longer
        type: 'sawtooth' as OscillatorType
      },
      ching: {
        frequency: 800,       // Medium-high pitch
        duration: 0.03,        // Very short
        type: 'sine' as OscillatorType
      }
    }

    const config = soundConfigs[type]

    // Configure oscillator
    oscillator.frequency.value = config.frequency
    oscillator.type = config.type
    gainNode.gain.value = 0.1  // Volume control

    // Play sound
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + config.duration)

  } catch (error) {
    // Silently fail if audio is not supported
    console.debug('Sound effect failed:', error)
  }
}

// Hook for playing sounds
export const useSounds = () => {
  const playTin = useCallback(() => playSound('tin'), [])
  const playShing = useCallback(() => playSound('shing'), [])
  const playChing = useCallback(() => playSound('ching'), [])

  return {
    playTin,
    playShing,
    playChing
  }
}


import { useState, useEffect } from 'react'

interface AnimationState {
  isPaperFolding: boolean
  isWriting: boolean
  isInkDry: boolean
}

export const usePaperAnimations = (isFormOpen: boolean = false) => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isPaperFolding: false,
    isWriting: false,
    isInkDry: false
  })

  // Trigger animations based on form state
  useEffect(() => {
    if (isFormOpen) {
      // Paper folding animation when form opens
      setAnimationState(prev => ({ ...prev, isPaperFolding: true }))

      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, isPaperFolding: false, isWriting: true }))
      }, 300)

      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, isWriting: false }))
      }, 800)
    }
  }, [isFormOpen])

  // Trigger ink dry animation after writing
  useEffect(() => {
    if (!animationState.isWriting && animationState.isPaperFolding === false) {
      const timer = setTimeout(() => {
        setAnimationState(prev => ({ ...prev, isInkDry: true }))

        setTimeout(() => {
          setAnimationState(prev => ({ ...prev, isInkDry: false }))
        }, 2000)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [animationState.isWriting, animationState.isPaperFolding])

  // Animation class names
  const getAnimationClasses = () => {
    const classes: string[] = []

    if (animationState.isPaperFolding) {
      classes.push('animate-paper-fold')
    }

    if (animationState.isWriting) {
      classes.push('animate-writing')
    }

    if (animationState.isInkDry) {
      classes.push('animate-ink-dry')
    }

    return classes.join(' ')
  }

  return {
    animationState,
    getAnimationClasses
  }
}
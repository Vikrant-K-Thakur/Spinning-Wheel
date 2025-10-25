"use client"

import React, { useState, useCallback, useRef } from "react"
import Header from "./Header"
import "./SpinningWheel.css"

const SpinningWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const audioCtxRef = useRef(null)
  const tikIntervalRef = useRef(null)

  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  const sectorAngle = 360 / letters.length

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  const playTikSound = useCallback(() => {
    try {
      const audioContext = getAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.type = "square"
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.05)
    } catch (error) {
      console.log("Audio not supported", error)
    }
  }, [])

  const startTikSound = useCallback(() => {
    let tikCount = 0
    const totalTiks = 30

    const playTiks = () => {
      if (tikCount < totalTiks) {
        playTikSound()
        tikCount++
        const progress = tikCount / totalTiks
        const nextInterval = 50 + progress * progress * 400
        tikIntervalRef.current = setTimeout(playTiks, nextInterval)
      }
    }

    playTiks()
  }, [playTikSound])

  const stopTikSound = useCallback(() => {
    if (tikIntervalRef.current) {
      clearInterval(tikIntervalRef.current)
      clearTimeout(tikIntervalRef.current)
      tikIntervalRef.current = null
    }
  }, [])

  const playStopSound = useCallback(() => {
    try {
      const audioContext = getAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log("Audio not supported", error)
    }
  }, [])

  // Function to calculate which letter the pointer is pointing to
  const getLetterAtPointer = (finalRotation) => {
    // Normalize the rotation to be between 0 and 360
    const normalizedRotation = ((finalRotation % 360) + 360) % 360
    
    // The pointer is at the top (0 degrees)
    // We need to find which sector is at the pointer position
    // Since the wheel rotates clockwise, we need to account for that
    const effectiveAngle = (360 - normalizedRotation) % 360
    
    // Calculate which sector the pointer is pointing to
    // The first sector (A) starts at 0 degrees and goes to sectorAngle
    let letterIndex = Math.floor(effectiveAngle / sectorAngle)
    
    // Ensure index is within bounds
    letterIndex = letterIndex % letters.length
    
    return { letter: letters[letterIndex], index: letterIndex }
  }

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setSelectedLetter(null)
    setSelectedIndex(null)
    startTikSound()

    // Generate random spins and a random target sector
    const spins = 5 + Math.random() * 3
    const randomIndex = Math.floor(Math.random() * letters.length)
    
    // Calculate the target rotation that will make the pointer land on the random sector
    // The pointer is at top (0°), so we want the target sector to be at the pointer
    // Each sector's center is at: index * sectorAngle + sectorAngle/2
    // We need to rotate so that this center aligns with the pointer (0°)
    const targetSectorCenter = randomIndex * sectorAngle + sectorAngle / 2
    
    // To align the sector center with the pointer, we need to rotate by:
    // full spins + adjustment to make the sector center land at pointer position
    const finalRotation = rotation + 360 * spins - targetSectorCenter
    
    const duration = 3

    setRotation(finalRotation)

    setTimeout(() => {
      stopTikSound()
      setIsSpinning(false)

      // Calculate which letter the pointer is actually pointing to
      const result = getLetterAtPointer(finalRotation)
      setSelectedLetter(result.letter)
      setSelectedIndex(result.index)
      playStopSound()
      
      console.log(`Final rotation: ${finalRotation}, Normalized: ${((finalRotation % 360) + 360) % 360}`)
      console.log(`Pointer is at letter: ${result.letter}, Index: ${result.index}`)
    }, duration * 1000)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      spinWheel()
    }
  }

  const colors = [
    "#FFD6A5",
    "#FECACA",
    "#E2F0CB",
    "#CFE8FF",
    "#E8D0FF",
    "#FDE2B8",
    "#C7F9CC",
    "#D7E8FF",
    "#F6D6FF",
    "#FAD9C1",
    "#C6F6F1",
    "#FFDFD3",
    "#EEDCFF",
    "#CFE9D8",
    "#FFD7E2",
    "#FFF3B0",
    "#D0E9FF",
    "#E8E2FF",
    "#DFF7D8",
    "#F7E6FD",
    "#EAE2F8",
    "#FCE7D6",
    "#D6F0FF",
    "#F0EAD6",
    "#E6EEF8",
    "#F2EDE6",
  ]

  return (
    <div className="spinning-wheel-container">
      <Header />
      <div className="wheel-wrapper" aria-hidden={false}>
        <div className="pointer" aria-hidden="true" />

        <div
          className={`wheel ${isSpinning ? "spinning" : ""}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? `transform 3s cubic-bezier(0.23, 1, 0.32, 1)` : "none",
          }}
          role="img"
          aria-label="Alphabet spinning wheel"
        >
          {/* Render colored wedge sectors (visuals) */}
          {letters.map((_, index) => {
            const startAngle = index * sectorAngle
            const endAngle = (index + 1) * sectorAngle
            const startRadians = (startAngle * Math.PI) / 180
            const endRadians = (endAngle * Math.PI) / 180
            
            const x1 = 50 + 50 * Math.sin(startRadians)
            const y1 = 50 - 50 * Math.cos(startRadians)
            const x2 = 50 + 50 * Math.sin(endRadians)
            const y2 = 50 - 50 * Math.cos(endRadians)
            
            return (
              <div
                key={`sector-${index}`}
                className={`sector ${selectedIndex === index ? 'selected' : ''}`}
                style={{
                  backgroundColor: colors[index],
                  clipPath: `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`,
                }}
                aria-hidden="true"
              />
            )
          })}

          {/* Letters layer - using SVG for perfect positioning */}
          <svg className="letters-layer" viewBox="0 0 100 100" aria-hidden="true">
            {letters.map((letter, index) => {
              const angle = index * sectorAngle + sectorAngle / 2
              const radians = (angle * Math.PI) / 180
              const radius = 35 // Slightly reduced radius for better centering
              
              // Convert polar to cartesian coordinates with proper orientation
              const x = 50 + radius * Math.sin(radians)
              const y = 50 - radius * Math.cos(radians)
              
              return (
                <text
                  key={`letter-${letter}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="letter"
                  transform={`rotate(${angle + 90}, ${x}, ${y})`} // Added 90 degrees to make letters upright
                >
                  {letter}
                </text>
              )
            })}
          </svg>

          <button
            className={`spin-button ${isSpinning ? "spinning" : ""}`}
            onClick={spinWheel}
            onKeyDown={handleKeyDown}
            disabled={isSpinning}
            aria-pressed={isSpinning}
            aria-label={isSpinning ? "Wheel is spinning" : "Spin the wheel"}
          >
            {isSpinning ? "SPINNING..." : "SPIN"}
          </button>
        </div>
      </div>

      {selectedLetter && (
        <div className="result" aria-live="polite">
          <h2>Selected Letter:</h2>
          <div className="selected-letter">{selectedLetter}</div>
        </div>
      )}
    </div>
  )
}

export default SpinningWheel
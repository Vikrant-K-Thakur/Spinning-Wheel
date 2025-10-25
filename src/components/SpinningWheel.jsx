import React, { useState, useCallback, useRef } from 'react';
import Header from './Header';
import './SpinningWheel.css';

const SpinningWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const audioCtxRef = useRef(null);

  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const sectorAngle = 360 / letters.length;

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playSpinSound = useCallback(() => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 2);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 2);
    } catch (error) {
      console.log('Audio not supported', error);
    }
  }, []);

  const playStopSound = useCallback(() => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported', error);
    }
  }, []);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedLetter(null);
    playSpinSound();

    // Pick a deterministic random index
    const randomIndex = Math.floor(Math.random() * letters.length);

    // number of full spins (randomish)
    const spins = 5 + Math.random() * 3; // 5 to 8 spins

    // We want the wheel's final transform (clockwise rotation) such that the sector center
    // for `randomIndex` sits under the top pointer.
    // Add sectorAngle/2 to center the sector under the pointer.
    const degreesForIndex = randomIndex * sectorAngle + sectorAngle / 2;

    // Final rotation will be current rotation + full spins + degreesForIndex
    // (we add degreesForIndex so the chosen sector's center faces pointer)
    const finalRotation = rotation + 360 * spins + degreesForIndex;

    // duration in seconds (keep aligned with CSS transition)
    const duration = 3; // seconds

    setRotation(finalRotation);

    // Use timeout matching the animation duration to finish
    setTimeout(() => {
      setIsSpinning(false);
      // Because we selected randomIndex earlier, we can directly set the chosen letter
      setSelectedLetter(letters[randomIndex]);
      playStopSound();
    }, duration * 1000);
  };

  // keyboard support for accessibility (Enter / Space)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      spinWheel();
    }
  };

  return (
    <div className="spinning-wheel-container">
      <Header />
      <div className="wheel-wrapper" aria-hidden={false}>
        <div className="pointer" aria-hidden="true"></div>

        <div
          className={`wheel ${isSpinning ? 'spinning' : ''}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? `transform 3s cubic-bezier(0.23, 1, 0.32, 1)` : 'none'
          }}
          role="img"
          aria-label="Alphabet spinning wheel"
        >
          {letters.map((letter, index) => {
            const colors = [
              '#FFD6A5', '#FECACA', '#E2F0CB', '#CFE8FF', '#E8D0FF', '#FDE2B8',
              '#C7F9CC', '#D7E8FF', '#F6D6FF', '#FAD9C1', '#C6F6F1', '#FFDFD3',
              '#EEDCFF', '#CFE9D8', '#FFD7E2', '#FFF3B0', '#D0E9FF', '#E8E2FF',
              '#DFF7D8', '#F7E6FD', '#EAE2F8', '#FCE7D6', '#D6F0FF', '#F0EAD6',
              '#E6EEF8', '#F2EDE6'
            ];

            const angle = index * sectorAngle;
            const nextAngle = (index + 1) * sectorAngle;
            const x1 = 50 + 50 * Math.cos((angle - 90) * Math.PI / 180);
            const y1 = 50 + 50 * Math.sin((angle - 90) * Math.PI / 180);
            const x2 = 50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180);
            const y2 = 50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180);
            const clipPath = `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`;

            // rotate each sector so the clipPath wedge points to the correct slice
            const sectorStyle = {
              backgroundColor: colors[index],
              clipPath,
              transform: `rotate(${angle}deg)`
            };

            return (
              <div
                key={letter}
                className="sector"
                style={sectorStyle}
                aria-hidden="true"
              >
                <span
                  className="letter"
                  style={{
                    transform: `rotate(${angle + sectorAngle / 2}deg) translateY(calc(-1 * var(--letter-distance))) rotate(-${angle + sectorAngle / 2}deg)`
                  }}
                >
                  {letter}
                </span>
              </div>
            );
          })}

          <button
            className={`spin-button ${isSpinning ? 'spinning' : ''}`}
            onClick={spinWheel}
            onKeyDown={handleKeyDown}
            disabled={isSpinning}
            aria-pressed={isSpinning}
            aria-label={isSpinning ? 'Wheel is spinning' : 'Spin the wheel'}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN'}
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
  );
};

export default SpinningWheel;

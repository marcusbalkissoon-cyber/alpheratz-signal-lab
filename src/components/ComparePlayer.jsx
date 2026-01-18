import { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react'
import './ComparePlayer.css'

/**
 * ComparePlayer - Split-screen video comparison with slider control
 * 
 * Features:
 * - Touch + Mouse slider support for mobile and desktop
 * - Slider controls visual clip-path reveal AND audio cross-fade
 * - Videos stay synced (play/pause together)
 * - Exposes audio control via ref for parent component
 * - Poster images prevent black screen on mobile
 */
const ComparePlayer = forwardRef(({ srcA, srcB, posterA = '/images/spec_organic.jpeg', posterB = '/images/spec_synthetic.jpeg' }, ref) => {
    const [sliderValue, setSliderValue] = useState(50)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [isDragging, setIsDragging] = useState(false)
    const videoARef = useRef(null)
    const videoBRef = useRef(null)
    const containerRef = useRef(null)

    // Calculate position from mouse or touch event
    const calculatePosition = useCallback((clientX) => {
        const container = containerRef.current
        if (!container) return 50

        const rect = container.getBoundingClientRect()
        const x = clientX - rect.left
        const percentage = (x / rect.width) * 100

        // Clamp between 0 and 100
        return Math.max(0, Math.min(100, percentage))
    }, [])

    // Touch event handlers
    const handleTouchStart = useCallback((e) => {
        e.preventDefault()
        setIsDragging(true)
        const touch = e.touches[0]
        const position = calculatePosition(touch.clientX)
        setSliderValue(position)
    }, [calculatePosition])

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return
        e.preventDefault()
        const touch = e.touches[0]
        const position = calculatePosition(touch.clientX)
        setSliderValue(position)
    }, [isDragging, calculatePosition])

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false)
    }, [])

    // Mouse event handlers (for desktop)
    const handleMouseDown = useCallback((e) => {
        // Only start drag if clicking on divider area
        if (e.target.closest('.compare-divider') || e.target.classList.contains('compare-slider')) {
            setIsDragging(true)
            const position = calculatePosition(e.clientX)
            setSliderValue(position)
        }
    }, [calculatePosition])

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return
        const position = calculatePosition(e.clientX)
        setSliderValue(position)
    }, [isDragging, calculatePosition])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    // Global mouse/touch event listeners for drag
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            window.addEventListener('touchmove', handleTouchMove, { passive: false })
            window.addEventListener('touchend', handleTouchEnd)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleTouchEnd)
        }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

    // Expose audio control methods to parent via ref
    useImperativeHandle(ref, () => ({
        toggleMuted: () => {
            const videoA = videoARef.current
            const videoB = videoBRef.current
            const newMuted = !isMuted

            // iOS requires explicit play() on user interaction
            if (!newMuted && videoA && videoB) {
                videoA.play().catch(() => { })
                videoB.play().catch(() => { })
            }

            setIsMuted(newMuted)
            return !newMuted // Return true if audio is now ON
        },
        setMuted: (muted) => {
            setIsMuted(muted)
        },
        isMuted: () => isMuted,
        // Expose explicit play for iOS unlock
        playVideos: () => {
            const videoA = videoARef.current
            const videoB = videoBRef.current
            if (videoA && videoB) {
                videoA.play().catch(() => { })
                videoB.play().catch(() => { })
                setIsPlaying(true)
            }
        }
    }))

    // Sync videos on play/pause
    useEffect(() => {
        const videoA = videoARef.current
        const videoB = videoBRef.current

        if (!videoA || !videoB) return

        const syncVideos = () => {
            if (Math.abs(videoA.currentTime - videoB.currentTime) > 0.1) {
                videoB.currentTime = videoA.currentTime
            }
        }

        videoA.addEventListener('timeupdate', syncVideos)
        return () => videoA.removeEventListener('timeupdate', syncVideos)
    }, [])

    // Handle play/pause sync
    useEffect(() => {
        const videoA = videoARef.current
        const videoB = videoBRef.current

        if (!videoA || !videoB) return

        if (isPlaying) {
            videoA.play().catch(() => { })
            videoB.play().catch(() => { })
        } else {
            videoA.pause()
            videoB.pause()
        }
    }, [isPlaying])

    // Sync muted state to both videos
    useEffect(() => {
        const videoA = videoARef.current
        const videoB = videoBRef.current

        if (videoA && videoB) {
            videoA.muted = isMuted
            videoB.muted = isMuted
        }
    }, [isMuted])

    // Audio cross-fade based on slider position
    useEffect(() => {
        const videoA = videoARef.current
        const videoB = videoBRef.current

        if (videoA && videoB && !isMuted) {
            // Slider left (0) = Simulation loud, Reality quiet
            // Slider right (100) = Reality loud, Simulation quiet
            const safeValue = isNaN(sliderValue) ? 50 : sliderValue
            const realityVolume = safeValue / 100
            const simulationVolume = 1 - realityVolume

            videoA.volume = simulationVolume
            videoB.volume = realityVolume
        }
    }, [sliderValue, isMuted])

    // Auto-play on mount
    useEffect(() => {
        const videoA = videoARef.current
        const videoB = videoBRef.current

        if (videoA && videoB) {
            // Set initial volumes (centered = 50/50)
            videoA.volume = 0.5
            videoB.volume = 0.5

            // Ensure videos start playing
            const playVideos = () => {
                videoA.play().catch(() => { })
                videoB.play().catch(() => { })
                setIsPlaying(true)
            }

            // Try to play immediately
            playVideos()

            // Also try after a short delay for browser quirks
            setTimeout(playVideos, 100)
        }
    }, [])

    const handleSliderChange = (e) => {
        e.stopPropagation()
        setSliderValue(Number(e.target.value))
    }

    const togglePlayback = (e) => {
        // Don't toggle if dragging or clicking on slider
        if (isDragging || e.target.classList.contains('compare-slider')) return
        setIsPlaying(!isPlaying)
    }

    // Safe slider value (never NaN or undefined)
    const safeSliderValue = isNaN(sliderValue) || sliderValue === undefined ? 50 : sliderValue

    // Calculate clip-path for top video (srcB / Reality)
    const clipPercentage = 100 - safeSliderValue
    const clipPath = `inset(0 ${clipPercentage}% 0 0)`

    return (
        <div
            ref={containerRef}
            className="compare-player"
            onClick={togglePlayback}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {/* Bottom Video (A - Simulation) - Always visible */}
            <video
                ref={videoARef}
                className="compare-video compare-video-bottom"
                src={srcA}
                poster={posterA}
                autoPlay
                loop
                muted={isMuted}
                playsInline
            />

            {/* Top Video (B - Reality) - Clipped based on slider */}
            <video
                ref={videoBRef}
                className="compare-video compare-video-top"
                src={srcB}
                poster={posterB}
                style={{ clipPath }}
                autoPlay
                loop
                muted={isMuted}
                playsInline
            />

            {/* Divider Line */}
            <div
                className="compare-divider"
                style={{ left: `${safeSliderValue}%` }}
            >
                <div className="compare-divider-line" />
                <div className="compare-divider-handle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 6l-4 6 4 6" />
                        <path d="M16 6l4 6-4 6" />
                    </svg>
                </div>
            </div>

            {/* Labels */}
            <div className="compare-labels">
                <span className="compare-label compare-label-left">SIMULATION</span>
                <span className="compare-label compare-label-right">REALITY</span>
            </div>

            {/* Slider Control (invisible, for accessibility) */}
            <input
                type="range"
                min="0"
                max="100"
                value={safeSliderValue}
                onChange={handleSliderChange}
                onClick={(e) => e.stopPropagation()}
                className="compare-slider"
                aria-label="Compare videos"
            />

            {/* Play/Pause Indicator */}
            <div className={`compare-play-indicator ${isPlaying ? 'hidden' : ''}`}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
            </div>

            {/* Audio Indicator */}
            {!isMuted && (
                <div className="audio-indicator">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                </div>
            )}
        </div>
    )
})

ComparePlayer.displayName = 'ComparePlayer'

export default ComparePlayer

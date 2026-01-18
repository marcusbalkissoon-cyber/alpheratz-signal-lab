import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import './ComparePlayer.css'

/**
 * ComparePlayer - Split-screen video comparison with slider control
 * 
 * Features:
 * - Slider controls visual clip-path reveal
 * - Videos stay synced (play/pause together)
 * - Exposes audio control via ref for parent component
 * - Muted by default for iOS autoplay compatibility
 */
const ComparePlayer = forwardRef(({ srcA, srcB, aspectRatio = '16/9' }, ref) => {
    const [sliderValue, setSliderValue] = useState(50)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const videoARef = useRef(null)
    const videoBRef = useRef(null)
    const containerRef = useRef(null)

    // Expose audio control methods to parent via ref
    useImperativeHandle(ref, () => ({
        toggleMuted: () => {
            const newMuted = !isMuted
            setIsMuted(newMuted)
            return !newMuted // Return true if audio is now ON
        },
        setMuted: (muted) => {
            setIsMuted(muted)
        },
        isMuted: () => isMuted
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

    // Sync muted state to videos
    useEffect(() => {
        const videoA = videoARef.current
        const videoB = videoBRef.current

        if (videoA && videoB) {
            // Only the top video (B) plays audio - it's the "Reality" layer
            videoA.muted = true // Background always muted
            videoB.muted = isMuted
        }
    }, [isMuted])

    // Auto-play on mount (muted for iOS autoplay compatibility)
    useEffect(() => {
        const videoA = videoARef.current
        const videoB = videoBRef.current

        if (videoA && videoB) {
            videoA.play().catch(() => { })
            videoB.play().catch(() => { })
            setIsPlaying(true)
        }
    }, [])

    const handleSliderChange = (e) => {
        setSliderValue(Number(e.target.value))
    }

    const togglePlayback = () => {
        setIsPlaying(!isPlaying)
    }

    // Calculate clip-path for top video (srcB)
    // Slider at 0 = fully hidden (inset from right 100%)
    // Slider at 100 = fully visible (inset from right 0%)
    const clipPercentage = 100 - sliderValue
    const clipPath = `inset(0 ${clipPercentage}% 0 0)`

    return (
        <div
            ref={containerRef}
            className="compare-player"
            style={{ aspectRatio }}
            onClick={togglePlayback}
        >
            {/* Bottom Video (A) - Always visible, always muted */}
            <video
                ref={videoARef}
                className="compare-video compare-video-bottom"
                src={srcA}
                loop
                muted
                playsInline
            />

            {/* Top Video (B) - Clipped based on slider, audio source */}
            <video
                ref={videoBRef}
                className="compare-video compare-video-top"
                src={srcB}
                style={{ clipPath }}
                loop
                playsInline
            />

            {/* Divider Line */}
            <div
                className="compare-divider"
                style={{ left: `${sliderValue}%` }}
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

            {/* Slider Control */}
            <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                className="compare-slider"
                aria-label="Compare videos"
            />

            {/* Play/Pause Indicator */}
            <div className={`compare-play-indicator ${isPlaying ? 'hidden' : ''}`}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
            </div>

            {/* Muted Indicator */}
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

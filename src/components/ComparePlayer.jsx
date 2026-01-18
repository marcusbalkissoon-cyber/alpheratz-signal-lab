import { useRef, useState, useEffect } from 'react'
import './ComparePlayer.css'

/**
 * ComparePlayer - Split-screen video comparison with slider control
 * 
 * Physics:
 * - Slider 0 (Left): Top Video Hidden (Volume 0%)
 * - Slider 100 (Right): Top Video Fully Visible (Volume 100%)
 * - Both videos stay synced (play/pause together)
 */
const ComparePlayer = ({ srcA, srcB, aspectRatio = '16/9' }) => {
    const [sliderValue, setSliderValue] = useState(50)
    const [isPlaying, setIsPlaying] = useState(false)
    const videoARef = useRef(null)
    const videoBRef = useRef(null)
    const containerRef = useRef(null)

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

    // Update volume based on slider position
    useEffect(() => {
        const videoB = videoBRef.current
        if (videoB) {
            videoB.volume = sliderValue / 100
        }
    }, [sliderValue])

    // Auto-play on mount (muted to comply with browser policies)
    useEffect(() => {
        const videoA = videoARef.current
        const videoB = videoBRef.current

        if (videoA && videoB) {
            videoA.muted = true
            videoB.muted = false
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
            {/* Bottom Video (A) - Always visible */}
            <video
                ref={videoARef}
                className="compare-video compare-video-bottom"
                src={srcA}
                loop
                muted
                playsInline
            />

            {/* Top Video (B) - Clipped based on slider */}
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
        </div>
    )
}

export default ComparePlayer

import { useState, useRef, useEffect, cloneElement, isValidElement, Children } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, ExternalLink, ChevronDown } from 'lucide-react'
import './MissionLog.css'

/**
 * MissionLog - Expandable card component
 * 
 * Features:
 * - Collapsed (Title Only) vs. Expanded (2-Column Grid Layout)
 * - Framer Motion animations for smooth expansion
 * - Video-focused design with rich info panel
 * - Scientific hierarchy: Service, Project, Material, Log, Result
 * - Functional audio playback with progress bar
 * - Compare mode: controls video audio via ref
 * - Album art with Spotify link
 * - External Spotify link button
 */
const MissionLog = ({
    title,
    logNumber,
    service,
    project,
    material,
    architectLog,
    result,
    videoSrc,
    audioSrc,
    albumArt,
    spotifyUrl,
    children // For custom content like ComparePlayer
}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isVideoAudioOn, setIsVideoAudioOn] = useState(false)
    const [audioDuration, setAudioDuration] = useState(0)
    const [audioProgress, setAudioProgress] = useState(0)
    const audioRef = useRef(null)
    const comparePlayerRef = useRef(null)
    const clickSoundRef = useRef(null)

    // Check if we're in compare mode (has children like ComparePlayer)
    const isCompareMode = !!children

    // Initialize click sound once on mount
    useEffect(() => {
        clickSoundRef.current = new Audio('/ui/ui_click.mp3')
        clickSoundRef.current.volume = 0.3
        // Preload the sound
        clickSoundRef.current.load()

        return () => {
            if (clickSoundRef.current) {
                clickSoundRef.current.pause()
                clickSoundRef.current = null
            }
        }
    }, [])

    const playClickSound = () => {
        if (clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0
            clickSoundRef.current.play().catch(() => { })
        }
    }

    const toggleExpanded = () => {
        playClickSound()
        setIsExpanded(!isExpanded)
    }

    const toggleAudio = (e) => {
        e.stopPropagation()
        playClickSound()

        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) {
            audio.pause()
        } else {
            audio.play().catch(() => { })
        }
        setIsPlaying(!isPlaying)
    }

    // Toggle video audio for compare mode (with iOS unlock)
    const toggleVideoAudio = (e) => {
        e.stopPropagation()
        playClickSound()

        if (comparePlayerRef.current) {
            // Call playVideos first for iOS user interaction requirement
            if (comparePlayerRef.current.playVideos) {
                comparePlayerRef.current.playVideos()
            }

            if (comparePlayerRef.current.toggleMuted) {
                const audioIsNowOn = comparePlayerRef.current.toggleMuted()
                setIsVideoAudioOn(audioIsNowOn)
            }
        }
    }

    const handleSpotifyClick = (e) => {
        e.stopPropagation()
        playClickSound()
        window.open(spotifyUrl, '_blank', 'noopener,noreferrer')
    }

    // Audio event handlers (inline for reliability)
    const handleLoadedMetadata = (e) => {
        setAudioDuration(e.target.duration)
    }

    const handleTimeUpdate = (e) => {
        setAudioProgress(e.target.currentTime)
    }

    const handleAudioEnded = () => {
        setIsPlaying(false)
        setAudioProgress(0)
    }

    // Seek functionality
    const handleProgressClick = (e) => {
        const audio = audioRef.current
        if (!audio || audioDuration === 0) return

        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const percentage = clickX / rect.width
        const newTime = percentage * audioDuration

        audio.currentTime = newTime
        setAudioProgress(newTime)
    }

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progressPercent = audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0

    // Check if we have rich content (service, project, etc.)
    const hasRichContent = service || project || material || architectLog || result

    // Clone children to pass ref to ComparePlayer
    const childrenWithRef = Children.map(children, (child) => {
        if (isValidElement(child)) {
            return cloneElement(child, { ref: comparePlayerRef })
        }
        return child
    })

    return (
        <motion.div
            className={`mission-log ${isExpanded ? 'expanded' : ''}`}
            layout
        >
            {/* Header - Always Visible */}
            <motion.div
                className="mission-log-header"
                onClick={toggleExpanded}
                layout="position"
            >
                <div className="mission-log-title-group">
                    <span className="mission-log-number">LOG {logNumber}</span>
                    <h3 className="mission-log-title">PROTOCOL: {title}</h3>
                </div>
                <motion.div
                    className="mission-log-chevron"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown size={24} />
                </motion.div>
            </motion.div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="mission-log-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Custom Content (like ComparePlayer) */}
                        {isCompareMode ? (
                            <>
                                <div className="mission-log-custom">
                                    {childrenWithRef}
                                </div>

                                {/* Controls for Compare Mode */}
                                <div className="mission-log-compare-controls">
                                    <button
                                        className={`btn ${isVideoAudioOn ? 'btn-primary' : 'btn-ghost'} btn-audio-toggle`}
                                        onClick={toggleVideoAudio}
                                        aria-label={isVideoAudioOn ? 'Mute video' : 'Unmute video'}
                                    >
                                        {isVideoAudioOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                        <span>{isVideoAudioOn ? 'SOUND ON' : 'PLAY TRANSMISSION'}</span>
                                    </button>
                                </div>

                                {/* Rich Content Below ComparePlayer */}
                                {hasRichContent && (
                                    <div className="mission-log-rich-content">
                                        {service && (
                                            <div className="rich-field">
                                                <span className="field-label">SERVICE</span>
                                                <span className="field-value">{service}</span>
                                            </div>
                                        )}
                                        {project && (
                                            <div className="rich-field">
                                                <span className="field-label">PROJECT</span>
                                                <span className="field-value field-project">{project}</span>
                                            </div>
                                        )}
                                        {material && (
                                            <div className="rich-field">
                                                <span className="field-label">MATERIAL</span>
                                                <strong className="field-value">{material}</strong>
                                            </div>
                                        )}
                                        {architectLog && (
                                            <div className="rich-field rich-field-log">
                                                <span className="field-label">ARCHITECT'S LOG</span>
                                                <em className="field-value field-log">{architectLog}</em>
                                            </div>
                                        )}
                                        {result && (
                                            <div className="rich-field rich-field-result">
                                                <span className="field-label">RESULT</span>
                                                <strong className="field-value field-result">{result}</strong>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* 2-Column Grid: Video Left, Info Right */
                            <div className="mission-log-grid">
                                {/* Left: Visual Panel (Video + Album Art) */}
                                <div className="mission-log-visual-column">
                                    <div className="mission-log-visual">
                                        <video
                                            className="mission-log-video"
                                            src={videoSrc}
                                            loop
                                            muted
                                            autoPlay
                                            playsInline
                                        />
                                    </div>

                                    {/* Album Art */}
                                    {albumArt && (
                                        <a
                                            href={spotifyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="album-art-link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img
                                                src={albumArt}
                                                alt={`${project} album artwork`}
                                                className="album-art-image"
                                            />
                                            <div className="album-art-overlay">
                                                <ExternalLink size={24} />
                                                <span>Open in Spotify</span>
                                            </div>
                                        </a>
                                    )}
                                </div>

                                {/* Right: Info Panel */}
                                <div className="mission-log-info">
                                    <div className="info-header">
                                        {service && (
                                            <span className="info-service">{service}</span>
                                        )}
                                        {project && (
                                            <h4 className="info-project">{project}</h4>
                                        )}
                                        {material && (
                                            <div className="info-material">
                                                <span className="material-label">Material:</span>
                                                <strong className="material-value">{material}</strong>
                                            </div>
                                        )}
                                    </div>

                                    {architectLog && (
                                        <div className="info-log">
                                            <span className="log-label">Architect's Log</span>
                                            <em className="log-content">{architectLog}</em>
                                        </div>
                                    )}

                                    {result && (
                                        <div className="info-result">
                                            <span className="result-label">Result:</span>
                                            <strong className="result-value">{result}</strong>
                                        </div>
                                    )}

                                    {/* Controls in Info Panel */}
                                    {audioSrc && (
                                        <div className="info-controls">
                                            {/* Audio Element with inline handlers */}
                                            <audio
                                                ref={audioRef}
                                                src={audioSrc}
                                                preload="metadata"
                                                onLoadedMetadata={handleLoadedMetadata}
                                                onTimeUpdate={handleTimeUpdate}
                                                onEnded={handleAudioEnded}
                                            />

                                            {/* Clickable Progress Bar */}
                                            <div
                                                className="audio-progress"
                                                onClick={handleProgressClick}
                                                role="slider"
                                                aria-label="Audio progress"
                                                aria-valuenow={audioProgress}
                                                aria-valuemin={0}
                                                aria-valuemax={audioDuration}
                                            >
                                                <div
                                                    className="audio-progress-fill"
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                                <div
                                                    className="audio-progress-handle"
                                                    style={{ left: `${progressPercent}%` }}
                                                />
                                            </div>

                                            {/* Time Display */}
                                            <span className="audio-time">
                                                {formatTime(audioProgress)} / {formatTime(audioDuration)}
                                            </span>

                                            {/* Buttons */}
                                            <div className="info-buttons">
                                                <button
                                                    className="btn btn-primary btn-play"
                                                    onClick={toggleAudio}
                                                    aria-label={isPlaying ? 'Pause transmission' : 'Play transmission'}
                                                >
                                                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                                    <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                                                </button>

                                                {spotifyUrl && (
                                                    <button
                                                        className="btn btn-ghost btn-icon"
                                                        onClick={handleSpotifyClick}
                                                        aria-label="Open on Spotify"
                                                        title="External Uplink - Spotify"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default MissionLog

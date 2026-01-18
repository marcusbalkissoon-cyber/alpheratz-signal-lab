import { useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import MissionLog from './MissionLog'
import ComparePlayer from './ComparePlayer'
import Starfield from './Starfield'
import './SignalLab.css'

/**
 * SignalLab - The Main Feed
 * 
 * Renders 3 Mission Logs in a vertical stack:
 * - LOG 01: ORGANIC - Bio-Acoustic Preservation
 * - LOG 02: VISCERAL - Visual Grounding (ComparePlayer)
 * - LOG 03: SYNTHETIC - Sonic Architecture
 */
const SignalLab = () => {
    // Persistent UI click sound ref
    const clickSound = useRef(null)

    // Initialize click sound ONCE on mount
    useEffect(() => {
        clickSound.current = new Audio('/ui/ui_click.mp3')
        clickSound.current.preload = 'auto'
        clickSound.current.volume = 0.3
        // Force load
        clickSound.current.load()

        return () => {
            if (clickSound.current) {
                clickSound.current.pause()
                clickSound.current = null
            }
        }
    }, [])

    const playClickSound = () => {
        if (clickSound.current) {
            clickSound.current.currentTime = 0
            clickSound.current.play().catch(() => { })
        }
    }

    const handleIntakeClick = () => {
        playClickSound()
        window.open('https://tally.so/r/J9lZad', '_blank', 'noopener,noreferrer')
    }

    // Content data for logs
    const log01 = {
        architectLog: `The directive was Transparency. In a digital age, the luxury of Folk music is its "flaws"—the squeak of the fretboard, the breath of the room, the friction of skin on steel. We approached this not as cleaning the audio, but as Bio-Acoustic Preservation. We stripped away digital saturation to honor the physics of the instruments. We engineered the room tone to make the listener feel like they are sitting inside the circle.`
    }

    const log02 = {
        architectLog: `The visual data was high-fidelity, but silent. It felt like a hallucination. The directive was to give it Gravity. We synthesized the physics from scratch—layering organic sounds (thunder and water displacement) with sub-harmonic frequencies. We tricked the brain into believing the digital entity had physical mass.`
    }

    const log03 = {
        architectLog: `The client brought a melody (The Blueprint). We constructed the world it lives in. We engineered a custom sonic environment, prioritizing Atmosphere Design over standard beat-making. We stabilized the low-end physics for large-system playback and designed a bespoke textural palette that defines the artist identity.`
    }

    return (
        <div className="signal-lab">
            {/* Cosmic Background */}
            <Starfield starCount={120} />

            {/* Page Header */}
            <header className="signal-lab-header">
                <div className="header-emblem">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1" opacity="0.7" />
                        <circle cx="24" cy="24" r="4" fill="currentColor" />
                    </svg>
                </div>
                <h1 className="header-title">
                    <span className="title-prefix">The</span>
                    <span className="title-main glow-text">Signal Lab</span>
                </h1>
                <p className="header-subtitle">Alpheratz Technologies • Signal Archive</p>
                <div className="header-status">
                    <span className="status-indicator" />
                    <span className="status-text">TRANSMISSION ACTIVE</span>
                </div>
            </header>

            <div className="divider" />

            {/* Mission Logs Feed */}
            <main className="signal-lab-feed container">

                {/* LOG 01: ORGANIC */}
                <MissionLog
                    logNumber="01"
                    title="BIO-ACOUSTIC PRESERVATION"
                    service="Signal Calibration (Mixing & Mastering)"
                    project="DEER TRAILS BY FERNANDA"
                    material="Wood, Nylon, Room Tone"
                    architectLog={log01.architectLog}
                    result="100% Organic Fidelity. A mix that breathes."
                    videoSrc="/visuals/log1_organic.mp4"
                    audioSrc="/audio/Organic .wav"
                    albumArt="/images/DEER TRAILS.png"
                    spotifyUrl="https://open.spotify.com/album/5DUMG8ycCO4D7ObO3MLxdp?si=wZYPLbbNS4ui-VmMDwPkLQ"
                />

                {/* LOG 02: VISCERAL */}
                <MissionLog
                    logNumber="02"
                    title="VISUAL GROUNDING"
                    service="Visual Grounding (Sound Design for Video)"
                    project="HUSK BOT"
                    material="Light, Motion, Silence"
                    architectLog={log02.architectLog}
                    result="The Uncanny Valley bridged by sound."
                >
                    <ComparePlayer
                        srcA="/visuals/log2_sim.mp4"
                        srcB="/visuals/log2_real.mp4"
                        posterA="/images/spec_organic.jpeg"
                        posterB="/images/spec_synthetic.jpeg"
                    />
                </MissionLog>

                {/* LOG 03: SYNTHETIC */}
                <MissionLog
                    logNumber="03"
                    title="SONIC ARCHITECTURE"
                    service="Sonic Architecture (Full Production)"
                    project="GUIDED BY THE ANGELS BY MARKUS COLE"
                    material="Voltage, Sub-Bass, Texture"
                    architectLog={log03.architectLog}
                    result="A high-impact sonic environment optimized for immersion."
                    videoSrc="/visuals/log3_synthetic.mp4"
                    audioSrc="/audio/Synthetic .wav"
                    albumArt="/images/Guided By The Angels.jpg"
                    spotifyUrl="https://open.spotify.com/track/0zN02VE62oHXeMCr8YBHzt?si=4ca8d8626d444616"
                />

            </main>

            {/* CTA Section */}
            <section className="intake-section">
                <div className="divider" />
                <div className="intake-container container">
                    <div className="intake-terminal">
                        <div className="terminal-header">
                            <span className="terminal-dot" />
                            <span className="terminal-dot" />
                            <span className="terminal-dot" />
                            <span className="terminal-title">SIGNAL_LAB_TERMINAL</span>
                        </div>
                        <div className="terminal-body">
                            <p className="terminal-prompt">
                                <span className="prompt-symbol">&gt;</span>
                                <span className="prompt-text">READY TO TRANSMIT YOUR SIGNAL?</span>
                            </p>
                            <button
                                className="intake-button"
                                onClick={handleIntakeClick}
                                aria-label="Open intake form"
                            >
                                <span className="button-text">INITIATE PROJECT</span>
                                <span className="button-separator">//</span>
                                <span className="button-action">OPEN INTAKE FORM</span>
                                <ArrowRight size={20} className="button-arrow" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="signal-lab-footer">
                <div className="divider" />
                <div className="footer-content container">
                    <div className="footer-logo">
                        <span className="logo-text">ALPHERATZ</span>
                        <span className="logo-suffix">TECHNOLOGIES</span>
                    </div>
                    <div className="footer-meta">
                        <span className="meta-text">SIGNAL LAB v1.0</span>
                        <span className="meta-separator">•</span>
                        <span className="meta-text">© 2026</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default SignalLab

import { useRef, useEffect } from 'react'
import MissionLog from './MissionLog'
import ComparePlayer from './ComparePlayer'
import Starfield from './Starfield'
import './SignalLab.css'

/**
 * SignalLab - Commercial Landing Page
 * 
 * The Signal Lab: Audio Engineering & Sound Design
 * - Hero: Resonance Weaver product showcase
 * - Split-stream CTAs: Try Tool vs Hire Creator
 * - Archive: Portfolio/Mission Logs proving competence
 */
const SignalLab = () => {
    // Persistent UI click sound ref
    const clickSound = useRef(null)

    // Initialize click sound ONCE on mount
    useEffect(() => {
        clickSound.current = new Audio('/ui/ui_click.mp3')
        clickSound.current.preload = 'auto'
        clickSound.current.volume = 0.3
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

    const handleArtifactClick = () => {
        playClickSound()
        window.open('https://resonance-weaver-2.vercel.app/', '_blank', 'noopener,noreferrer')
    }

    const handleCommissionClick = () => {
        playClickSound()
        window.open('https://www.markuscolemusic.com/contact', '_blank', 'noopener,noreferrer')
    }

    // Content data for archived logs
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

            {/* ====== GLOBAL BRAND HEADER ====== */}
            <header className="brand-header">
                <div className="brand-container">
                    <h2 className="brand-title">THE SIGNAL LAB</h2>
                    <p className="brand-subtitle">ALPHERATZ TECHNOLOGIES // EST. 2026</p>
                </div>
                <div className="brand-divider" />
            </header>

            {/* ====== HERO SECTION ====== */}
            <section className="hero-section">
                <div className="hero-container">
                    {/* Emblem */}
                    <div className="hero-emblem">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="30" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.3" />
                            <circle cx="32" cy="32" r="22" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.5" />
                            <circle cx="32" cy="32" r="14" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.7" />
                            <circle cx="32" cy="32" r="6" fill="var(--accent-gold)" />
                        </svg>
                    </div>

                    {/* Headlines */}
                    <h1 className="hero-headline">THE RESONANCE WEAVER</h1>
                    <p className="hero-subtitle">VISUAL RESONANCE ENGINE // v1.0</p>

                    {/* Description */}
                    <p className="hero-description">
                        PASSIVE LISTENING IS DEAD. THIS ENGINE ALLOWS YOU TO PHYSICALLY
                        MANIPULATE THE GEOMETRY OF THE AUDIO SIGNAL. TOUCH THE WAVEFORM.
                        DISTORT THE FREQUENCY.
                    </p>

                    {/* Split-Stream Buttons */}
                    <div className="hero-buttons">
                        <button
                            className="btn-artifact"
                            onClick={handleArtifactClick}
                            aria-label="Initialize Artifact - Try the tool"
                        >
                            [ INITIALIZE ARTIFACT ]
                        </button>

                        <button
                            className="btn-commission"
                            onClick={handleCommissionClick}
                            aria-label="Initiate Commission - Hire the creator"
                        >
                            [ INITIATE COMMISSION ]
                        </button>
                    </div>
                </div>
            </section>

            {/* ====== ARCHIVE DIVIDER ====== */}
            <div className="archive-divider">
                <span className="archive-label">// ARCHIVED SIGNAL PROTOCOLS</span>
            </div>

            {/* ====== MISSION LOGS ARCHIVE ====== */}
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

            {/* ====== FOOTER ====== */}
            <footer className="signal-lab-footer">
                <div className="divider" />
                <div className="footer-content container">
                    <span className="footer-text">ENGINEERED BY THE SIGNAL LAB © 2026</span>
                </div>
            </footer>
        </div>
    )
}

export default SignalLab

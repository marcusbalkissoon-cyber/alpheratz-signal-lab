import { useEffect, useRef } from 'react'
import './Starfield.css'

/**
 * Starfield - Subtle cosmic background with twinkling stars
 * 
 * Creates a deep space atmosphere with:
 * - Randomly positioned stars
 * - Gentle twinkling animation
 * - Very slow drift movement
 * - Low opacity to not distract from content
 */
const Starfield = ({ starCount = 150 }) => {
    const canvasRef = useRef(null)
    const animationRef = useRef(null)
    const starsRef = useRef([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        let width = window.innerWidth
        let height = window.innerHeight

        // Set canvas size
        const setCanvasSize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }
        setCanvasSize()

        // Generate stars
        const generateStars = () => {
            starsRef.current = []
            for (let i = 0; i < starCount; i++) {
                starsRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.2,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinklePhase: Math.random() * Math.PI * 2,
                    driftX: (Math.random() - 0.5) * 0.05,
                    driftY: (Math.random() - 0.5) * 0.02,
                })
            }
        }
        generateStars()

        // Animation loop
        let time = 0
        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            starsRef.current.forEach((star) => {
                // Update position (very slow drift)
                star.x += star.driftX
                star.y += star.driftY

                // Wrap around edges
                if (star.x < 0) star.x = width
                if (star.x > width) star.x = 0
                if (star.y < 0) star.y = height
                if (star.y > height) star.y = 0

                // Calculate twinkle
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase)
                const currentOpacity = star.opacity * (0.6 + twinkle * 0.4)

                // Draw star
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
                ctx.fill()

                // Add subtle glow for larger stars
                if (star.size > 1) {
                    ctx.beginPath()
                    ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.1})`
                    ctx.fill()
                }
            })

            time++
            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        // Handle resize
        const handleResize = () => {
            setCanvasSize()
            generateStars()
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [starCount])

    return (
        <canvas
            ref={canvasRef}
            className="starfield-canvas"
            aria-hidden="true"
        />
    )
}

export default Starfield

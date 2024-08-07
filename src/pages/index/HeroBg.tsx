import { usePageContext } from "$/context/pageContext"
import { useEffect, useRef } from "kaioken"

type Vec2 = {
  x: number
  y: number
}

type Ball = {
  pos: Vec2
  vel: Vec2
  size: number
  sizeDir: number
}
const minSize = 20
const maxSize = 60
const speed = 1
function randomSpeed() {
  return -speed + Math.random() * speed || (Math.random() > 0.5 ? 1 : -1)
}

export function HeroBg() {
  const { isClient } = usePageContext()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const balls = useRef<Ball[]>([])
  const intervalRef = useRef(-1)

  useEffect(() => {
    if (!isClient || !canvasRef.current) return
    ctxRef.current = canvasRef.current.getContext("2d")
    if (!("requestAnimationFrame" in window)) {
      // @ts-ignore
      window.requestAnimationFrame = (callback) =>
        window.setTimeout(callback, 1000 / 60)
    }

    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight

    window.addEventListener("resize", handleResize)

    setup()

    intervalRef.current = window.requestAnimationFrame(tick)

    return cleanup
  }, [canvasRef.current])

  function handleResize() {
    if (!canvasRef.current) return
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
  }

  function setup() {
    balls.current = Array.from({ length: 10 }).map(() => {
      return {
        pos: {
          x: Math.floor(Math.random() * window.innerWidth),
          y: Math.floor(Math.random() * window.innerHeight),
        },
        vel: {
          x: randomSpeed(),
          y: randomSpeed(),
        },
        size: maxSize / 2,
        sizeDir: Math.random() > 0.5 ? 1 : -1,
      }
    })
  }

  function cleanup() {
    if (intervalRef.current) {
      const w = window
      if (!("cancelAnimationFrame" in window)) {
        w.clearTimeout(intervalRef.current)
      } else {
        w.cancelAnimationFrame(intervalRef.current)
      }
    }
    window.removeEventListener("resize", handleResize)
  }

  function tick() {
    const c = ctxRef.current
    if (!c) {
      console.error("failed to obtain canvas rendering context")
      cleanup()
      return
    }
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
    c.fillStyle = "crimson"
    const b = balls.current ?? []
    for (let i = 0; i < b.length; i++) {
      const ball = b[i]
      ball.pos.x += ball.vel.x
      ball.pos.y += ball.vel.y
      if (ball.pos.x > window.innerWidth || ball.pos.x < 0) {
        ball.vel.x *= -1
      }
      if (ball.pos.y > window.innerHeight || ball.pos.y < 0) {
        ball.vel.y *= -1
      }

      ball.size += ball.sizeDir * 0.125
      if (ball.size < minSize) {
        ball.sizeDir = 1
      } else if (ball.size > maxSize) {
        ball.sizeDir = -1
      } else if (Math.random() > 0.995) {
        ball.sizeDir *= -1
      }

      c.beginPath()
      const sizeMulti = Math.min(0.1 + window.innerWidth / 460, 2)
      c.arc(
        ball.pos.x,
        ball.pos.y,
        ball.size * sizeMulti,
        0,
        Math.PI * 2,
        false
      )
      c.closePath()
      c.fill()
    }

    intervalRef.current = window.requestAnimationFrame(tick)
  }
  return <canvas ref={canvasRef} id="hero-background" />
}

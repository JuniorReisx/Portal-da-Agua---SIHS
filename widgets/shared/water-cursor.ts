export function bindWaterCursor (
  hero: HTMLElement,
  canvas: HTMLCanvasElement,
  cursor: HTMLElement,
  activeClass: string
) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
  if (window.matchMedia('(pointer: coarse)').matches) return undefined

  const context = canvas.getContext('2d')
  if (!context) return undefined

  hero.classList.add(activeClass)

  let width = 0
  let height = 0
  let frame = 0
  let originX = 0
  let originY = 0
  let lastX = 0
  let lastY = 0
  let active = false
  let movedAt = 0
  let level = 0
  let pulse = 0

  const resize = () => {
    const rect = hero.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    width = rect.width
    height = rect.height
    canvas.width = Math.max(1, Math.floor(width * ratio))
    canvas.height = Math.max(1, Math.floor(height * ratio))
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  const draw = (now: number) => {
    context.clearRect(0, 0, width, height)

    const sinceMove = now - movedAt
    const moving = active && movedAt > 0 && sinceMove < 140
    const target = moving ? 1 : 0
    const ease = target > level ? 0.028 : 0.012
    level += (target - level) * ease
    if (level < 0.01) {
      level = 0
      pulse = 0
    } else {
      pulse += 16 * (0.4 + level * 0.6)
      const period = 1700
      const reach = 36 + level * 140
      for (let ring = 0; ring < 3; ring += 1) {
        const progress = ((pulse + ring * (period / 3)) % period) / period
        const radius = 6 + progress * reach
        const alpha = (1 - progress) * 0.8 * level
        context.beginPath()
        context.arc(originX, originY, radius, 0, Math.PI * 2)
        context.strokeStyle = `rgba(214, 246, 255, ${alpha})`
        context.lineWidth = 0.6 + level * 0.9
        context.stroke()
      }
    }

    frame = requestAnimationFrame(draw)
  }

  const onMove = (event: PointerEvent) => {
    const rect = hero.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (Math.hypot(x - lastX, y - lastY) > 2) movedAt = performance.now()
    lastX = x
    lastY = y
    originX = x
    originY = y
    const onControl = (event.target as Element | null)?.closest?.('button, a')
    active = !onControl
    cursor.style.opacity = active ? '1' : '0'
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`
  }

  const onLeave = () => {
    active = false
    movedAt = 0
    cursor.style.opacity = '0'
  }

  resize()
  hero.addEventListener('pointermove', onMove)
  hero.addEventListener('pointerleave', onLeave)
  window.addEventListener('resize', resize)
  frame = requestAnimationFrame(draw)

  return () => {
    cancelAnimationFrame(frame)
    hero.removeEventListener('pointermove', onMove)
    hero.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('resize', resize)
    hero.classList.remove(activeClass)
  }
}

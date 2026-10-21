import { React, type AllWidgetProps } from 'jimu-core'
import { PROJETOS } from './projetos'
import './style.css'

const KindIcon = ({ kind }: { kind: string }) => {
  if (kind === 'Mapa') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 1.4c-2.3 0-4.1 1.8-4.1 4.1 0 3 4.1 8.9 4.1 8.9s4.1-5.9 4.1-8.9c0-2.3-1.8-4.1-4.1-4.1z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="5.5" r="1.35" fill="currentColor" />
      </svg>
    )
  }
  if (kind === 'Site') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="1.8" y="2.2" width="12.4" height="8.2" rx="1.3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 13.4h4M8 10.4v3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'Inventário') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 3.2h10M3 8h10M3 12.8h6.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.2 12.6V8.2M6.1 12.6V5.4M10 12.6V3.2M13.8 12.6V6.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const Widget = (props: AllWidgetProps<any>) => {
  const [ready, setReady] = React.useState(false)
  const [activeApp, setActiveApp] = React.useState(0)
  const [dragPx, setDragPx] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const dragRef = React.useRef({ active: false, startX: 0, startY: 0, delta: 0, moved: false, axis: '', pointerType: 'mouse' })
  const appCount = PROJETOS.length
  const shiftMemory = React.useRef<Record<string, number>>({})
  const [, settleCarousel] = React.useState(0)

  const shiftOf = (index: number) => {
    let shift = index - activeApp
    if (shift > appCount / 2) shift -= appCount
    if (shift < -appCount / 2) shift += appCount
    return shift
  }

  React.useLayoutEffect(() => {
    let jumped = false
    const next: Record<string, number> = {}
    PROJETOS.forEach((app, index) => {
      const shift = shiftOf(index)
      const prev = shiftMemory.current[app.id]
      if (prev !== undefined && Math.abs(shift - prev) > 1) jumped = true
      next[app.id] = shift
    })
    shiftMemory.current = next
    if (jumped) settleCarousel((value) => value + 1)
  }, [activeApp, appCount])

  const stepApp = (direction: number) => {
    setActiveApp((current) => (current + direction + appCount) % appCount)
  }

  const finishCarouselDrag = () => {
    if (!dragRef.current.active) return
    const delta = dragRef.current.delta
    const threshold = dragRef.current.pointerType === 'touch' ? 36 : 48
    dragRef.current.active = false
    dragRef.current.delta = 0
    dragRef.current.axis = ''
    setDragging(false)
    setDragPx(0)
    if (delta > threshold) stepApp(-1)
    else if (delta < -threshold) stepApp(1)
  }

  const onCarouselPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      delta: 0,
      moved: false,
      axis: '',
      pointerType: event.pointerType
    }

    const move = (pointerEvent: PointerEvent) => {
      if (!dragRef.current.active) return
      const dx = pointerEvent.clientX - dragRef.current.startX
      const dy = pointerEvent.clientY - dragRef.current.startY
      if (!dragRef.current.axis) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
        dragRef.current.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
        if (dragRef.current.axis === 'y') {
          dragRef.current.active = false
          dragRef.current.delta = 0
          setDragging(false)
          setDragPx(0)
          return
        }
        setDragging(true)
      }
      if (dragRef.current.axis !== 'x') return
      const delta = Math.max(-280, Math.min(280, dx))
      dragRef.current.delta = delta
      if (Math.abs(delta) > 8) dragRef.current.moved = true
      setDragPx(delta)
      pointerEvent.preventDefault()
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      finishCarouselDrag()
    }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  React.useEffect(() => {
    const id = 'mr-font'
    const href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,500;0,8..60,600;1,8..60,500;1,8..60,600&display=swap'
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = href
    setReady(true)
  }, [])

  return (
    <div className="mr-page jimu-widget">
      <section className="mr-apps" id="mr-apps" aria-labelledby="mr-apps-title">
        <div className="mr-apps__inner">
          <div className="mr-apps__head">
            <div>
              <p className="mr-apps__kicker">
                <span />
                Área restrita
              </p>
              <h2 id="mr-apps-title">Aplicações de uso interno</h2>
            </div>
          </div>

          <div
            className={`mr-carousel${appCount < 3 ? ' is-pair' : ''}${dragging ? ' is-dragging' : ''}`}
            style={{ '--drag': `${dragPx}px` } as React.CSSProperties}
            onPointerDown={appCount < 3 ? undefined : onCarouselPointerDown}
            onClickCapture={(event) => {
              if (appCount < 3 || !dragRef.current.moved) return
              event.preventDefault()
              event.stopPropagation()
              dragRef.current.moved = false
            }}
          >
            {PROJETOS.map((app, index) => {
              const shift = shiftOf(index)
              const distance = Math.abs(shift)
              const prev = shiftMemory.current[app.id]
              const jump = prev !== undefined && Math.abs(shift - prev) > 1
              return (
                <a
                  key={app.id}
                  className={`mr-app${index === activeApp ? ' is-active' : ''}${jump ? ' is-jump' : ''}`}
                  data-distance={distance}
                  data-tone={index % 5}
                  style={{ '--shift': shift } as React.CSSProperties}
                  href={app.href}
                  draggable={false}
                  target="_blank"
                  rel="noopener noreferrer"
                  onDragStart={(event) => event.preventDefault()}
                  onClick={(event) => {
                    if (appCount < 3 || index === activeApp) return
                    event.preventDefault()
                    setActiveApp(index)
                  }}
                >
                  <span className={`mr-app__rise${ready ? ' is-in' : ''}`} style={{ transitionDelay: `${distance * 110}ms` }}>
                    <span className="mr-app__mark" aria-hidden="true">
                      <svg viewBox="0 0 160 160">
                        <circle cx="118" cy="118" r="26" />
                        <circle cx="118" cy="118" r="48" />
                        <circle cx="118" cy="118" r="72" strokeDasharray="3 7" />
                        <path d="M118 118 L156 86" />
                        <path d="M6 132c24-16 46 8 74-6" />
                      </svg>
                    </span>
                    <span className="mr-app__media">
                      <img
                        className="mr-app__cover"
                        src={`${props.context.folderUrl}dist/runtime/assets/${app.image}`}
                        alt=""
                      />
                    </span>
                    <span className="mr-app__body">
                      <span className="mr-app__kind">
                        <span className="mr-app__rule" />
                        <span className="mr-app__badge">
                          <KindIcon kind={app.kind} />
                        </span>
                        {app.kind}
                      </span>
                      <h3>{app.title}</h3>
                      <p>{app.summary}</p>
                      <span className="mr-app__foot">
                        <span className="mr-app__open">Acessar aplicação</span>
                        <span className="mr-app__arrow" aria-hidden="true">
                          <svg viewBox="0 0 16 16">
                            <path d="M3.5 8h8M8.2 4.6 11.6 8 8.2 11.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </span>
                    </span>
                  </span>
                </a>
              )
            })}
          </div>

          {appCount >= 3 && <div className="mr-carousel__dots">
            {PROJETOS.map((app, index) => (
              <button
                key={app.id}
                type="button"
                className={index === activeApp ? 'is-active' : ''}
                aria-label={app.title}
                aria-current={index === activeApp ? 'true' : undefined}
                onClick={() => setActiveApp(index)}
              />
            ))}
          </div>}
        </div>
      </section>
    </div>
  )
}

export default Widget

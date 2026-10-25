import { React, type AllWidgetProps } from 'jimu-core'
import { PROJETOS } from './projetos'
import { bindWaterCursor } from '../../../shared/water-cursor'
import LightWater from '../../../shared/light-water'
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

const PUBLIC_PORTAL_URL = 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=6a467fd31cf1445aa87edcba2575de76'

const NOTAS = [
  {
    title: 'Uso interno',
    text: 'As aplicações desta tela não entram na consulta pública. Elas ficam só para o trabalho da SIHS.'
  },
  {
    title: 'Quem acessa',
    text: 'Entra quem tem permissão concedida pela Secretaria de Infraestrutura Hídrica e Saneamento.'
  },
  {
    title: 'O que continua público',
    text: 'Reservatórios, poços, abastecimento e inventário seguem abertos no portal público.'
  }
]

const Widget = (props: AllWidgetProps<any>) => {
  const heroRef = React.useRef<HTMLElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const cursorRef = React.useRef<HTMLDivElement>(null)
  const [ready, setReady] = React.useState(false)
  const [activeApp, setActiveApp] = React.useState(0)
  const [kind, setKind] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [dragPx, setDragPx] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const dragRef = React.useRef({ active: false, startX: 0, startY: 0, delta: 0, moved: false, axis: '', pointerType: 'mouse' })
  const kinds = PROJETOS.reduce<string[]>((list, app) => (
    list.includes(app.kind) ? list : list.concat(app.kind)
  ), [])
  const needle = query.trim().toLocaleLowerCase('pt-BR')
  const apps = PROJETOS.filter((app) => {
    if (kind && app.kind !== kind) return false
    if (!needle) return true
    return `${app.title} ${app.summary} ${app.kind}`.toLocaleLowerCase('pt-BR').includes(needle)
  })
  const appCount = apps.length
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
    apps.forEach((app, index) => {
      const shift = shiftOf(index)
      const prev = shiftMemory.current[app.id]
      if (prev !== undefined && Math.abs(shift - prev) > 1) jumped = true
      next[app.id] = shift
    })
    shiftMemory.current = next
    if (jumped) settleCarousel((value) => value + 1)
  }, [activeApp, appCount, kind, query])

  const resetCarousel = () => {
    shiftMemory.current = {}
    setActiveApp(0)
  }

  const chooseKind = (next: string) => {
    resetCarousel()
    setKind(next)
  }

  const changeQuery = (value: string) => {
    resetCarousel()
    setQuery(value)
  }

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

  React.useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.mr-page [data-reveal]'))
    if (!nodes.length) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('mr-reveal--in'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('mr-reveal--in')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    const cursor = cursorRef.current
    if (!hero || !canvas || !cursor) return undefined
    return bindWaterCursor(hero, canvas, cursor, 'mr-hero--water')
  }, [])

  return (
    <div className="mr-page jimu-widget">
      <header className="mr-hero" ref={heroRef}>
        <canvas ref={canvasRef} className="mr-hero__trail" aria-hidden="true" />
        <div ref={cursorRef} className="mr-water-cursor" aria-hidden="true" />
        <div className="mr-hero__inner">
          <p className="mr-hero__kicker mr-reveal" data-reveal="hero-kicker">Uso interno</p>
          <h1 className="mr-reveal" data-reveal="hero-title">Área restrita da SIHS</h1>
          <p className="mr-hero__lead mr-reveal" data-reveal="hero-lead">
            Gestão interna da infraestrutura hídrica e do saneamento da Bahia.
          </p>
        </div>
      </header>
      <section className="mr-apps" id="mr-apps" aria-labelledby="mr-apps-title">
        <LightWater motif="spray" />
        <div className="mr-apps__inner">
          <div className="mr-apps__head mr-reveal" data-reveal="apps-head">
            <div>
              <p className="mr-apps__kicker">
                <span />
                Área restrita
              </p>
              <h2 id="mr-apps-title">Aplicações de uso interno</h2>
            </div>
          </div>

          <div className="mr-filters">
            <label className="mr-search">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10.2 10.2 13.2 13.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                placeholder="Pesquisar"
                aria-label="Pesquisar aplicação"
                onChange={(event) => changeQuery(event.target.value)}
              />
            </label>
            <div className="mr-filters__kinds" role="group" aria-label="Filtrar pelo tipo da aplicação">
            <button type="button" className={kind === '' ? 'is-on' : ''} aria-pressed={kind === ''} onClick={() => chooseKind('')}>
              Todas
            </button>
            {kinds.map((item) => (
              <button
                key={item}
                type="button"
                className={kind === item ? 'is-on' : ''}
                aria-pressed={kind === item}
                onClick={() => chooseKind(item)}
              >
                {item}
              </button>
            ))}
            </div>
          </div>

          {appCount === 0 && <p className="mr-filters__empty">Nenhuma aplicação encontrada.</p>}

          {appCount > 0 && <>
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
            {apps.map((app, index) => {
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
                      <span className="mr-app__use">Uso interno</span>
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
            {apps.map((app, index) => (
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
          </>}
        </div>
      </section>

      <section className="mr-notes" aria-labelledby="mr-notes-title">
        <LightWater motif="grain" />
        <div className="mr-notes__inner">
          <div className="mr-reveal" data-reveal="notes-head">
            <p className="mr-notes__kicker">Antes de abrir</p>
            <h2 id="mr-notes-title">Como esta área funciona</h2>
          </div>
          <ul>
            {NOTAS.map((item, index) => (
              <li
                key={item.title}
                className="mr-reveal"
                data-reveal={`note-${index}`}
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <a className="mr-notes__public mr-reveal" data-reveal="notes-link" href={PUBLIC_PORTAL_URL}>
            Abrir o portal público
          </a>
        </div>
      </section>
    </div>
  )
}

export default Widget

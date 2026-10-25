import { React, type AllWidgetProps, UrlManager, getAppStore } from 'jimu-core'
import { APPLICATIONS } from './aplicacoes'
import HomeInfo from './home-info'
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

const Widget = (props: AllWidgetProps<any>) => {
  const rootRef = React.useRef<HTMLElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const cursorRef = React.useRef<HTMLDivElement>(null)
  const heroUrl = `${props.context.folderUrl}dist/runtime/assets/hero.jpg?v=3`
  const heroMapUrl = `${props.context.folderUrl}dist/runtime/assets/hero-bahia.jpg?v=1`
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({})
  const [activeApp, setActiveApp] = React.useState(0)
  const [kind, setKind] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [dragPx, setDragPx] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const carouselPaused = React.useRef(false)
  const dragRef = React.useRef({ active: false, startX: 0, startY: 0, delta: 0, moved: false, axis: '', pointerType: 'mouse' })
  const kinds = APPLICATIONS.reduce<string[]>((list, app) => (
    list.includes(app.kind) ? list : list.concat(app.kind)
  ), [])
  const needle = query.trim().toLocaleLowerCase('pt-BR')
  const apps = APPLICATIONS.filter((app) => {
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

  const show = (id: string, className: string) => {
    return `${className} mp-reveal${revealed[id] ? ' mp-reveal--in' : ''}`
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
    carouselPaused.current = false
    if (delta > threshold) stepApp(-1)
    else if (delta < -threshold) stepApp(1)
  }

  const onCarouselPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    carouselPaused.current = true
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
          carouselPaused.current = false
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

  const openApplications = () => {
    document.getElementById('mp-apps')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openSobrePage = () => {
    const pages = getAppStore().getState()?.appConfig?.pages
    if (!pages) return
    const pageId = Object.keys(pages).find((id) => {
      return String(pages[id]?.label || '').trim().toLowerCase() === 'sobre'
    }) || (pages.page_2 ? 'page_2' : undefined)
    if (!pageId) return
    UrlManager.getInstance().changePage(pageId)
    window.scrollTo({ top: 0, left: 0 })
  }

  React.useEffect(() => {
    const id = 'mp-hero-font'
    const href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,500;0,8..60,600;1,8..60,500;1,8..60,600&display=swap'
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = href
    return undefined
  }, [])

  React.useEffect(() => {
    if (window.jimuConfig?.isInBuilder) return undefined
    const hero = rootRef.current
    if (!hero) return undefined

    const touched: Array<{ el: HTMLElement, overflow: string }> = []
    let node = hero.parentElement
    while (node && node !== document.body) {
      if (
        node.classList.contains('page') ||
        node.classList.contains('footer') ||
        node.querySelector('.hp-header')
      ) break
      const style = getComputedStyle(node)
      const clips = style.overflowX !== 'visible' || style.overflowY !== 'visible'
      if (clips) {
        touched.push({ el: node, overflow: node.style.overflow })
        node.style.overflow = 'visible'
      }
      node = node.parentElement
    }

    return () => {
      touched.forEach(({ el, overflow }) => {
        el.style.overflow = overflow
      })
    }
  }, [])

  React.useEffect(() => {
    const hero = rootRef.current
    const canvas = canvasRef.current
    const cursor = cursorRef.current
    if (!hero || !canvas || !cursor) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (window.matchMedia('(pointer: coarse)').matches) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    hero.classList.add('mp-hero--water')

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
      hero.classList.remove('mp-hero--water')
    }
  }, [])

  React.useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!nodes.length) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const all: Record<string, boolean> = {}
      nodes.forEach((node) => {
        const id = node.getAttribute('data-reveal')
        if (id) all[id] = true
      })
      setRevealed(all)
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      const found: Record<string, boolean> = {}
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const id = entry.target.getAttribute('data-reveal')
        if (id) found[id] = true
        observer.unobserve(entry.target)
      })
      if (Object.keys(found).length) {
        setRevealed((current) => ({ ...current, ...found }))
      }
    }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' })

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="mp-page jimu-widget">
    <section ref={rootRef} className="mp-hero">
      <div
        className="mp-hero__photo"
        style={{ backgroundImage: `url("${heroMapUrl}")` }}
        aria-hidden="true"
      />
      <div className="mp-hero__veil" aria-hidden="true" />
      <canvas ref={canvasRef} className="mp-hero__trail" aria-hidden="true" />
      <div ref={cursorRef} className="mp-water-cursor" aria-hidden="true" />
      <div className="mp-hero__layout">
        <div className="mp-hero__copy">
          <p data-reveal="hero-kicker" className={show('hero-kicker', 'mp-hero__kicker')}>
            Informação · Gestão · Sustentabilidade
          </p>
          <h1 data-reveal="hero-title" className={show('hero-title', 'mp-hero__title')}>
            Plataforma de Apoio à Gestão Integrada da Infraestrutura Hídrica e Saneamento da Bahia
          </h1>
          <p data-reveal="hero-lead" className={show('hero-lead', 'mp-hero__lead')}>
            Dados, tecnologia e planejamento para a infraestrutura hídrica
            e o saneamento da Bahia.
          </p>
          <div data-reveal="hero-actions" className={show('hero-actions', 'mp-hero__actions')}>
            <button type="button" className="mp-hero__btn mp-hero__btn--solid" onClick={openApplications}>
              Explorar o Portal da Água
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section className="mp-about" id="mp-about" aria-labelledby="mp-about-title">
      <LightWater motif="ripple" />
      <div className="mp-about__inner">
        <div
          className="mp-about__photo"
          style={{ backgroundImage: `url("${heroUrl}")` }}
          role="img"
          aria-label="Litoral da Bahia"
        />
        <div className="mp-about__copy">
          <p data-reveal="about-kicker" className={show('about-kicker', 'mp-about__kicker')}>
            Sobre o instituto
          </p>
          <h2 id="mp-about-title" data-reveal="about-title" className={show('about-title', 'mp-about__title')}>
            Trabalhando por um futuro mais seguro
          </h2>
          <p data-reveal="about-lead" className={show('about-lead', 'mp-about__lead')}>
            A Secretaria de Infraestrutura Hídrica e Saneamento reúne no Portal da Água
            os mapas, painéis e aplicações que acompanham a água do estado.
          </p>
          <p data-reveal="about-text" className={show('about-text', 'mp-about__text')}>
            Reservatórios, redes, poços e sistemas de abastecimento passam a contar
            a mesma história, com a leitura geográfica que a gestão precisa para
            planejar, operar e decidir.
          </p>
          <button type="button" className="mp-about__more" onClick={openSobrePage}>
            Saiba mais sobre o Portal
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <section className="mp-feature" aria-labelledby="mp-feature-title">
      <div className="mp-feature__card">
        <a
          className="mp-feature__shot"
          href="https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=64cac37233d342e98fab036d397a93cd&page=Inicio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir Inventário de Infraestrutura Hídrica e Saneamento"
        >
          <img src={`${props.context.folderUrl}dist/runtime/assets/inventario.jpg?v=2`} alt="" />
        </a>
        <div className="mp-feature__copy">
          <p data-reveal="feature-kicker" className={show('feature-kicker', 'mp-feature__kicker')}>
            Aplicação em Destaque
          </p>
          <h2 id="mp-feature-title" data-reveal="feature-title" className={show('feature-title', '')}>
            Inventário de Infraestrutura Hídrica e Saneamento
          </h2>
          <p data-reveal="feature-text" className={show('feature-text', 'mp-feature__text')}>
            Reúne barragens, sistemas de abastecimento e poços da Bahia num só painel.
            Territórios, municípios e a região semiárida aparecem junto da infraestrutura
            hídrica do estado.
          </p>
          <a
            data-reveal="feature-link"
            className={show('feature-link', 'mp-feature__go')}
            href="https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=64cac37233d342e98fab036d397a93cd&page=Inicio"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acessar aplicação
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <section className="mp-apps" id="mp-apps" aria-labelledby="mp-apps-title">
      <LightWater motif="contour" />
      <div
        className="mp-apps__inner"
        onMouseEnter={() => { carouselPaused.current = true }}
        onMouseLeave={() => { carouselPaused.current = false }}
      >
        <div className="mp-apps__head">
          <div>
            <p data-reveal="apps-kicker" className={show('apps-kicker', 'mp-apps__kicker')}>
              <span />
              Portal da Água
            </p>
            <h2 id="mp-apps-title" data-reveal="apps-title" className={show('apps-title', '')}>Aplicações desenvolvidas</h2>
          </div>
        </div>

        <div className="mp-filters">
          <label className="mp-search">
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
          <div className="mp-filters__kinds" role="group" aria-label="Filtrar pelo tipo da aplicação">
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

        {appCount === 0 && <p className="mp-filters__empty">Nenhuma aplicação encontrada.</p>}

        {appCount > 0 && <>
        <div
          className={`mp-carousel${appCount < 3 ? ' is-pair' : ''}${dragging ? ' is-dragging' : ''}`}
          data-reveal="apps-cards"
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
                className={`mp-app${index === activeApp ? ' is-active' : ''}${jump ? ' is-jump' : ''}`}
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
                <span
                  className={`mp-app__rise${revealed['apps-cards'] ? ' is-in' : ''}`}
                  style={{ transitionDelay: `${distance * 110}ms` }}
                >
                <span className="mp-app__mark" aria-hidden="true">
                  <svg viewBox="0 0 160 160">
                    <circle cx="118" cy="118" r="26" />
                    <circle cx="118" cy="118" r="48" />
                    <circle cx="118" cy="118" r="72" strokeDasharray="3 7" />
                    <path d="M118 118 L156 86" />
                    <path d="M6 132c24-16 46 8 74-6" />
                  </svg>
                </span>
                <span className="mp-app__media">
                  <img
                    className="mp-app__cover"
                    src={`${props.context.folderUrl}dist/runtime/assets/${app.image}`}
                    alt=""
                  />
                </span>
                <span className="mp-app__body">
                  <span className="mp-app__kind">
                    <span className="mp-app__rule" />
                    <span className="mp-app__badge">
                      <KindIcon kind={app.kind} />
                    </span>
                    {app.kind}
                  </span>
                  <h3>{app.title}</h3>
                  <p>{app.summary}</p>
                  <span className="mp-app__foot">
                    <span className="mp-app__open">Acessar aplicação</span>
                    <span className="mp-app__arrow" aria-hidden="true">
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

        {appCount >= 3 && <div className="mp-carousel__dots">
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
    <HomeInfo show={show} />
    </div>
  )
}

export default Widget

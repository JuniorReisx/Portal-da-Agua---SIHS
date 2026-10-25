import { React, type AllWidgetProps } from 'jimu-core'
import './style.css'

const PORTAL_SITE_URL = 'https://portaldaagua.sihs.ba.gov.br/'

const Widget = (props: AllWidgetProps<any>) => {
  const portalLogoUrl = `${props.context.folderUrl}dist/runtime/assets/portal.png`
  const heroLogoUrl = `${props.context.folderUrl}dist/runtime/assets/portal-hero.png`
  const brasaoUrl = `${props.context.folderUrl}dist/runtime/assets/brasao.png`
  const [scrolled, setScrolled] = React.useState(false)
  const scrolledRef = React.useRef(false)

  React.useEffect(() => {
    const ENTER = 48
    const EXIT = 12
    let frame = 0

    const topFrom = (target: EventTarget | null) => {
      if (target instanceof Element) return target.scrollTop || 0
      if (target instanceof Document) return target.scrollingElement?.scrollTop || 0
      return 0
    }

    const update = (explicitTop = 0) => {
      const top = Math.max(
        explicitTop,
        window.scrollY || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      )
      const next = scrolledRef.current ? top > EXIT : top > ENTER
      if (next === scrolledRef.current) return
      scrolledRef.current = next
      setScrolled(next)
    }

    const onScroll = (event: Event) => {
      const fromTarget = topFrom(event.target)
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => update(fromTarget))
    }

    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    update(0)

    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className={`hp-header jimu-widget${scrolled ? ' hp-header--scrolled' : ''}`}>
      <header className="hp-header__bar">
        <div className="hp-header__brand">
          <a
            className="hp-header__logos"
            href={PORTAL_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir Portal da Água"
            title="Portal da Água"
          >
            <span className="hp-header__portal-slot">
              <img
                className="hp-header__portal hp-header__portal--hero"
                src={heroLogoUrl}
                alt="Portal da Água"
              />
              <img
                className="hp-header__portal hp-header__portal--bar"
                src={portalLogoUrl}
                alt=""
              />
            </span>
            <img
              className="hp-header__brasao"
              src={brasaoUrl}
              alt="Brasão do Estado da Bahia"
            />
          </a>
          <span className="hp-header__divider" aria-hidden="true" />
          <span className="hp-header__titles">
            <span className="hp-header__eyebrow">Secretaria de</span>
            <span className="hp-header__title">Infraestrutura Hídrica e Saneamento</span>
          </span>
        </div>
      </header>
    </div>
  )
}

export default Widget

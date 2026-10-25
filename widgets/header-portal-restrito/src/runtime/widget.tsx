import { React, type AllWidgetProps, UrlManager, getAppStore } from 'jimu-core'
import './style.css'

const HOME_PAGE_ID = 'page_45'
const PORTAL_SITE_URL = 'https://portaldaagua.sihs.ba.gov.br/'
const PUBLIC_PORTAL_URL = 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=6a467fd31cf1445aa87edcba2575de76'

const getPages = () => getAppStore().getState()?.appConfig?.pages

const findPageIdByLabel = (label: string): string | undefined => {
  const pages = getPages()
  if (!pages) return undefined
  const target = label.trim().toLowerCase()
  return Object.keys(pages).find((id) => {
    return String(pages[id]?.label || '').trim().toLowerCase() === target
  })
}

const pageExists = (pageId?: string): boolean => {
  if (!pageId) return false
  const pages = getPages()
  return !!(pages && pages[pageId])
}

const scrollPageToTop = () => {
  const preferSmooth =
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = preferSmooth ? 'smooth' : 'auto'

  window.scrollTo({ top: 0, left: 0, behavior })
  document.documentElement.scrollTo?.({ top: 0, left: 0, behavior })
  document.body.scrollTo?.({ top: 0, left: 0, behavior })
}

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

  const goHome = () => {
    const pageId =
      findPageIdByLabel('Início') ||
      findPageIdByLabel('Ínicio') ||
      findPageIdByLabel('Inicio') ||
      (pageExists(HOME_PAGE_ID) ? HOME_PAGE_ID : undefined)
    if (!pageId) return
    UrlManager.getInstance().changePage(pageId)
    requestAnimationFrame(() => scrollPageToTop())
    setTimeout(scrollPageToTop, 120)
  }

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
          <button
            type="button"
            className="hp-header__titles-btn"
            onClick={goHome}
            aria-label="Voltar para a tela inicial"
            title="Voltar para a tela inicial"
          >
            <span className="hp-header__titles">
              <span className="hp-header__eyebrow">Secretaria de</span>
              <span className="hp-header__title">Infraestrutura Hídrica e Saneamento</span>
            </span>
          </button>
        </div>

        <a
          className="hp-header__restricted"
          href={PUBLIC_PORTAL_URL}
          aria-label="Abrir o Portal público"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 6H6v12h12v-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M10 14 18 6M13 6h5v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hp-header__restricted-label">Portal público</span>
        </a>
      </header>
    </div>
  )
}

export default Widget

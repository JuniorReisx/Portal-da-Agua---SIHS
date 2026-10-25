import { React, type AllWidgetProps, UrlManager, getAppStore } from 'jimu-core'
import { createPortal } from 'react-dom'
import './style.css'

const HOME_PAGE_ID = 'page_45'
const PORTAL_SITE_URL = 'https://portaldaagua.sihs.ba.gov.br/'
const RESTRICTED_URL = 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience?id=881ff68da9ff4f2ab32eb141a0eccf7b'

const getPages = () => getAppStore().getState()?.appConfig?.pages

const findPageIdByLabel = (label: string): string | undefined => {
  const pages = getPages()
  if (!pages || typeof pages !== 'object') return undefined
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

const findDefaultPageId = (): string | undefined => {
  const pages = getPages()
  if (!pages || typeof pages !== 'object') return undefined
  return Object.keys(pages).find((id) => pages[id]?.isDefault)
}

const homePageId = (): string | undefined => {
  return (
    findPageIdByLabel('Início') ||
    findPageIdByLabel('Ínicio') ||
    findPageIdByLabel('Inicio') ||
    findPageIdByLabel('Main') ||
    findDefaultPageId() ||
    (pageExists(HOME_PAGE_ID) ? HOME_PAGE_ID : undefined) ||
    (pageExists('page_0') ? 'page_0' : undefined)
  )
}

const aboutPageId = (): string | undefined => {
  return findPageIdByLabel('Sobre') || (pageExists('page_2') ? 'page_2' : undefined)
}

const assistantPageId = (): string | undefined => {
  return findPageIdByLabel('Assistente') || findPageIdByLabel('Assistente pessoal')
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
  const [currentPageId, setCurrentPageId] = React.useState<string | undefined>(
    () => getAppStore().getState()?.appRuntimeInfo?.currentPageId
  )
  const [menuOpen, setMenuOpen] = React.useState(false)
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

  React.useEffect(() => {
    let current = getAppStore().getState()?.appRuntimeInfo?.currentPageId
    setCurrentPageId(current)
    return getAppStore().subscribe(() => {
      const next = getAppStore().getState()?.appRuntimeInfo?.currentPageId
      if (next === current) return
      current = next
      setCurrentPageId(next)
    })
  }, [])

  const openPage = (pageId?: string) => {
    setMenuOpen(false)
    if (!pageId || !pageExists(pageId)) return
    if (pageId === currentPageId) {
      scrollPageToTop()
      return
    }
    UrlManager.getInstance().changePage(pageId)
    requestAnimationFrame(() => scrollPageToTop())
    setTimeout(scrollPageToTop, 120)
  }

  const homeId = homePageId()
  const sobreId = aboutPageId()
  const assistenteId = assistantPageId()

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
            onClick={() => openPage(homeId)}
            aria-label="Voltar para a tela inicial"
            title="Voltar para a tela inicial"
          >
            <span className="hp-header__titles">
              <span className="hp-header__eyebrow">Secretaria de</span>
              <span className="hp-header__title">Infraestrutura Hídrica e Saneamento</span>
            </span>
          </button>
        </div>

        <div className="hp-header__end">
          <nav className="hp-header__nav" aria-label="Páginas">
            <button
              type="button"
              className={`hp-header__link${homeId && currentPageId === homeId ? ' is-active' : ''}`}
              aria-current={homeId && currentPageId === homeId ? 'page' : undefined}
              onClick={() => openPage(homeId)}
            >
              Início
            </button>
            <button
              type="button"
              className={`hp-header__link${sobreId && currentPageId === sobreId ? ' is-active' : ''}`}
              aria-current={sobreId && currentPageId === sobreId ? 'page' : undefined}
              onClick={() => openPage(sobreId)}
            >
              Sobre
            </button>
            <button
              type="button"
              className={`hp-header__link${assistenteId && currentPageId === assistenteId ? ' is-active' : ''}`}
              aria-current={assistenteId && currentPageId === assistenteId ? 'page' : undefined}
              onClick={() => openPage(assistenteId)}
            >
              Assistente
            </button>
          </nav>
          <button
            type="button"
            className={`hp-header__menu-btn${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
          </button>
        <a
          className="hp-header__restricted"
          href={RESTRICTED_URL}
          aria-label="Área Restrita"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="hp-header__restricted-label">Área Restrita</span>
        </a>
        </div>
      </header>
      {window.jimuConfig?.isInBuilder ? null : createPortal(
        <>
          {menuOpen && (
            <button
              type="button"
              className="hp-header__backdrop"
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
            />
          )}
          <nav className={`hp-header__drawer${menuOpen ? ' is-open' : ''}`} aria-label="Menu">
            <div className="hp-header__drawer-head">
              <strong>Menu</strong>
              <button type="button" className="hp-header__drawer-close" aria-label="Fechar" onClick={() => setMenuOpen(false)}>
                ×
              </button>
            </div>
            <button
              type="button"
              className={`hp-header__link${homeId && currentPageId === homeId ? ' is-active' : ''}`}
              onClick={() => openPage(homeId)}
            >
              Início
            </button>
            <button
              type="button"
              className={`hp-header__link${sobreId && currentPageId === sobreId ? ' is-active' : ''}`}
              onClick={() => openPage(sobreId)}
            >
              Sobre
            </button>
            <button
              type="button"
              className={`hp-header__link${assistenteId && currentPageId === assistenteId ? ' is-active' : ''}`}
              onClick={() => openPage(assistenteId)}
            >
              Assistente
            </button>
          </nav>
        </>,
        document.body
      )}
    </div>
  )
}

export default Widget

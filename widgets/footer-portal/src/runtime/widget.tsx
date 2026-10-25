import { React, type AllWidgetProps, UrlManager, getAppStore } from 'jimu-core'
import { APPLICATIONS } from '../../../main-portal/src/runtime/aplicacoes'
import '../../../shared/footer.css'

const PORTAL_SITE_URL = 'https://www.ba.gov.br/sihs/'
const RESTRICTED_URL = 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience?id=881ff68da9ff4f2ab32eb141a0eccf7b'

const SHORT_NAME: Record<string, string> = {
  reservatorios: 'Reservatórios',
  ativos: 'Ativos hídricos',
  abastecimento: 'Abastecimento',
  dfisc: 'Fiscalização',
  pocos: 'Poços',
  inventario: 'Inventário'
}

const getPages = () => getAppStore().getState()?.appConfig?.pages

const findPageIdByLabel = (label: string) => {
  const pages = getPages()
  if (!pages || typeof pages !== 'object') return undefined
  const target = label.trim().toLowerCase()
  return Object.keys(pages).find((id) => String(pages[id]?.label || '').trim().toLowerCase() === target)
}

const pageExists = (pageId?: string) => {
  if (!pageId) return false
  const pages = getPages()
  return !!(pages && pages[pageId])
}

const homePageId = () => {
  return (
    findPageIdByLabel('Início') ||
    findPageIdByLabel('Inicio') ||
    findPageIdByLabel('Main') ||
    (pageExists('page_0') ? 'page_0' : undefined)
  )
}

const aboutPageId = () => findPageIdByLabel('Sobre') || (pageExists('page_2') ? 'page_2' : undefined)

const assistantPageId = () => findPageIdByLabel('Assistente') || findPageIdByLabel('Assistente pessoal')

const Widget = (props: AllWidgetProps<any>) => {
  const year = new Date().getFullYear()
  const portalUrl = `${props.context.folderUrl}dist/runtime/assets/portal-hero.png`
  const brasaoUrl = `${props.context.folderUrl}dist/runtime/assets/brasao.png`
  const [currentPageId, setCurrentPageId] = React.useState<string | undefined>(
    () => getAppStore().getState()?.appRuntimeInfo?.currentPageId
  )

  React.useEffect(() => {
    let current = getAppStore().getState()?.appRuntimeInfo?.currentPageId
    return getAppStore().subscribe(() => {
      const next = getAppStore().getState()?.appRuntimeInfo?.currentPageId
      if (next === current) return
      current = next
      setCurrentPageId(next)
    })
  }, [])

  const openPage = (pageId?: string) => {
    if (!pageId || !pageExists(pageId)) return
    if (pageId !== currentPageId) UrlManager.getInstance().changePage(pageId)
    window.scrollTo({ top: 0, left: 0 })
  }

  const pages = [
    { id: homePageId(), label: 'Início' },
    { id: aboutPageId(), label: 'Sobre' },
    { id: assistantPageId(), label: 'Assistente' }
  ].filter((item) => item.id)

  return (
    <div className="fp-footer jimu-widget">
      <footer className="fp-footer__shell">
        <div className="fp-footer__main">
          <section className="fp-footer__brand">
            <div className="fp-footer__logos">
              <img className="fp-footer__portal" src={portalUrl} alt="Portal da Água" />
              <img className="fp-footer__brasao" src={brasaoUrl} alt="Brasão do Estado da Bahia" />
            </div>
            <div>
              <p className="fp-footer__eyebrow">Governo do Estado da Bahia</p>
              <h2 className="fp-footer__title">Secretaria de Infraestrutura Hídrica e Saneamento</h2>
              <p className="fp-footer__desc">
                Portal público com mapas, painéis e aplicações da água e do saneamento da Bahia.
              </p>
            </div>
          </section>

          <nav aria-label="Páginas do portal">
            <h3 className="fp-footer__col-title">O portal</h3>
            <ul className="fp-footer__links">
              {pages.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`fp-footer__link${item.id === currentPageId ? ' is-active' : ''}`}
                    onClick={() => openPage(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <a className="fp-footer__link" href={RESTRICTED_URL}>Área restrita</a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Aplicações públicas">
            <h3 className="fp-footer__col-title">Aplicações</h3>
            <ul className="fp-footer__links">
              {APPLICATIONS.map((app) => (
                <li key={app.id}>
                  <a className="fp-footer__link" href={app.href} target="_blank" rel="noopener noreferrer">
                    {SHORT_NAME[app.id] || app.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section>
            <h3 className="fp-footer__col-title">Contato</h3>
            <div className="fp-footer__info">
              <p>
                <a href="tel:+557131156062">(71) 3115-6062</a>
                <br />
                Ouvidoria <a href="tel:+557131156222">(71) 3115-6222</a>
              </p>
              <p>
                3ª Avenida, nº 390, Ala Norte, 2º andar — CAB
                <br />
                CEP 41.745-005 — Salvador — Bahia
              </p>
              <a className="fp-footer__link" href={PORTAL_SITE_URL} target="_blank" rel="noopener noreferrer">Site da SIHS</a>
              <a className="fp-footer__link" href="https://www.ba.gov.br/sihs/ouvidoria" target="_blank" rel="noopener noreferrer">Ouvidoria</a>
              <a className="fp-footer__link" href="https://www.ba.gov.br/sihs/fale-conosco" target="_blank" rel="noopener noreferrer">Fale conosco</a>
            </div>
          </section>
        </div>

        <div className="fp-footer__bottom">
          <p className="fp-footer__copy">© {year} SIHS — Secretaria de Infraestrutura Hídrica e Saneamento — Bahia</p>
          <p className="fp-footer__tag">Portal público</p>
        </div>
      </footer>
    </div>
  )
}

export default Widget

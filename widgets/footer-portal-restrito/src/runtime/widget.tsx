import { React, type AllWidgetProps } from 'jimu-core'
import { PROJETOS } from '../../../main-portal-restrito/src/runtime/projetos'
import '../../../shared/footer.css'

const PUBLIC_PORTAL_URL = 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=6a467fd31cf1445aa87edcba2575de76'
const PORTAL_SITE_URL = 'https://www.ba.gov.br/sihs/'

const SHORT_NAME: Record<string, string> = {
  sanerural: 'Saneamento rural',
  investimentos: 'Investimentos'
}

const Widget = (props: AllWidgetProps<any>) => {
  const year = new Date().getFullYear()
  const portalUrl = `${props.context.folderUrl}dist/runtime/assets/portal-hero.png`
  const brasaoUrl = `${props.context.folderUrl}dist/runtime/assets/brasao.png`

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
              <p className="fp-footer__use">Uso interno</p>
              <p className="fp-footer__eyebrow">Governo do Estado da Bahia</p>
              <h2 className="fp-footer__title">Secretaria de Infraestrutura Hídrica e Saneamento</h2>
              <p className="fp-footer__desc">
                Área interna da gestão da infraestrutura hídrica e do saneamento da Bahia.
              </p>
            </div>
          </section>

          <nav aria-label="Aplicações de uso interno">
            <h3 className="fp-footer__col-title">Nesta área</h3>
            <ul className="fp-footer__links">
              {PROJETOS.map((app) => (
                <li key={app.id}>
                  <a className="fp-footer__link" href={app.href} target="_blank" rel="noopener noreferrer">
                    {SHORT_NAME[app.id] || app.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Portal público">
            <h3 className="fp-footer__col-title">Portal público</h3>
            <ul className="fp-footer__links">
              <li>
                <a className="fp-footer__link" href={PUBLIC_PORTAL_URL}>Abrir o portal público</a>
              </li>
            </ul>
            <p className="fp-footer__desc">
              Reservatórios, poços, abastecimento e inventário continuam abertos no portal público.
            </p>
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
          <p className="fp-footer__tag">Uso interno</p>
        </div>
      </footer>
    </div>
  )
}

export default Widget

import { React, type AllWidgetProps } from 'jimu-core'
import './style.css'

const ENCONTRA = [
  'Mapas interativos para localização e visualização das informações;',
  'Reservatórios, com informações territorializadas;',
  'Poços, com localização e informações disponíveis nas bases institucionais;',
  'Sistemas de abastecimento de água e respectivas estruturas;',
  'Consulta por município e Território de Identidade;',
  'Painéis temáticos para organização e visualização das informações;',
  'Dados georreferenciados, permitindo a análise das informações associadas ao território.'
]

const PARCEIROS = [
  {
    id: 'agersa',
    image: 'agersa.png',
    alt: 'AGERSA, Agência Reguladora de Saneamento Básico do Estado da Bahia'
  },
  {
    id: 'cerb',
    image: 'cerb.png',
    alt: 'CERB, Companhia de Engenharia Hídrica e de Saneamento da Bahia'
  },
  {
    id: 'embasa',
    image: 'embasa.jpg',
    alt: 'Embasa'
  }
]

const Widget = (props: AllWidgetProps<any>) => {
  React.useEffect(() => {
    const id = 'sp-font'
    const href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,500;0,8..60,600;1,8..60,500&display=swap'
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = href
  }, [])

  return (
    <div className="sp-page jimu-widget">
      <article className="sp-wrap">
        <header className="sp-intro">
          <div className="sp-intro__brand">
            <img
              className="sp-mark"
              src={`${props.context.folderUrl}dist/runtime/assets/logo-portal.png`}
              alt="Portal da Água"
            />
            <div>
              <p className="sp-kicker">
                <span />
                Portal da Água
              </p>
              <h1>Sobre o Portal da Água</h1>
            </div>
          </div>
          <p className="sp-lead">
            O Portal da Água é uma plataforma digital de informação e gestão territorial que reúne e disponibiliza informações georreferenciadas relacionadas aos recursos hídricos e à infraestrutura de abastecimento de água do Estado da Bahia.
          </p>
          <p>
            Por meio de mapas interativos, bases de dados georreferenciadas e painéis temáticos, o Portal permite consultar, visualizar e analisar informações sobre diferentes componentes da infraestrutura hídrica, proporcionando uma visão territorial integrada das estruturas existentes no Estado.
          </p>
          <p>
            Entre as informações disponibilizadas estão reservatórios associados a diferentes órgãos e instituições parceiras, incluindo CERB, Embasa, DNOCS, CODEVASF e CHESF, além de informações sobre sistemas de abastecimento de água e poços implantados pela CERB.
          </p>
          <p>
            As informações podem ser consultadas e espacializadas por município, Território de Identidade e outros recortes territoriais, permitindo uma melhor compreensão da distribuição da infraestrutura hídrica no território baiano.
          </p>
        </header>

        <section className="sp-find" aria-labelledby="sp-find-title">
          <p className="sp-kicker">
            <span />
            No portal
          </p>
          <h2 id="sp-find-title">O que você encontra no portal</h2>
          <ul>
            {ENCONTRA.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="sp-evolve" aria-labelledby="sp-evolve-title">
          <p className="sp-kicker">
            <span />
            Em evolução
          </p>
          <h2 id="sp-evolve-title">Um portal em constante evolução</h2>
          <p>
            O Portal da Água está em processo contínuo de integração, atualização, padronização e qualificação das informações, buscando ampliar a disponibilidade e a confiabilidade dos dados geoespaciais relacionados à infraestrutura hídrica.
          </p>
          <p>
            Ao reunir informações de diferentes bases institucionais em uma plataforma territorial integrada, o Portal da Água contribui para o planejamento, a gestão, o monitoramento e a tomada de decisão, além de ampliar a transparência e o acesso às informações sobre a infraestrutura hídrica do Estado da Bahia.
          </p>
        </section>

        <section className="sp-partners" aria-labelledby="sp-partners-title">
          <p className="sp-kicker">
            <span />
            Instituições
          </p>
          <h2 id="sp-partners-title">Parceiros</h2>
          <ul>
            {PARCEIROS.map((parceiro) => (
              <li key={parceiro.id}>
                <img
                  src={`${props.context.folderUrl}dist/runtime/assets/${parceiro.image}`}
                  alt={parceiro.alt}
                />
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  )
}

export default Widget

import { React, type AllWidgetProps } from 'jimu-core'
import { bindWaterCursor } from '../../../shared/water-cursor'
import LightWater from '../../../shared/light-water'
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

const CANAIS = [
  {
    title: 'Site da SIHS',
    text: 'Página oficial da Secretaria de Infraestrutura Hídrica e Saneamento.',
    href: 'https://www.ba.gov.br/sihs/',
    label: 'Abrir ba.gov.br/sihs'
  },
  {
    title: 'Telefone e endereço',
    text: '(71) 3115-6062. 3ª Avenida, nº 390, Ala Norte, 2º andar, CAB, Salvador. Segunda a sexta, 8h30–12h e 13h30–18h.',
    href: 'https://www.ba.gov.br/sihs/9/telefone-e-endereco',
    label: 'Ver telefone e endereço'
  },
  {
    title: 'Ouvidoria',
    text: 'Reclamações, sugestões e denúncias. Ouvidoria da SIHS: (71) 3115-6222. Também há a Ouvidoria Geral do Estado.',
    href: 'https://www.ba.gov.br/sihs/ouvidoria',
    label: 'Abrir Ouvidoria da SIHS'
  },
  {
    title: 'Pedido de informação',
    text: 'Pedido pela Lei de Acesso à Informação, no sistema da Ouvidoria Geral do Estado. O atendimento presencial é no endereço da secretaria.',
    href: 'https://www.tag.ouvidoriageral.ba.gov.br/tag/TagHub.dll',
    label: 'Fazer pedido online'
  },
  {
    title: 'Carta de serviços',
    text: 'Serviços que a SIHS oferece ao cidadão e como solicitá-los.',
    href: 'https://www.ba.gov.br/sihs/carta-de-servicos',
    label: 'Abrir carta de serviços'
  },
  {
    title: 'Consulta pública',
    text: 'Espaço para acompanhar consultas e participar das discussões abertas pela secretaria.',
    href: 'https://www.ba.gov.br/sihs/20/consulta-publica',
    label: 'Ver consultas públicas'
  },
  {
    title: 'Fale conosco',
    text: 'Formulário de contato publicado no site da SIHS.',
    href: 'https://www.ba.gov.br/sihs/fale-conosco',
    label: 'Abrir fale conosco'
  },
  {
    title: 'Perguntas da SIHS',
    text: 'Perguntas frequentes já publicadas no site oficial da secretaria.',
    href: 'https://www.ba.gov.br/sihs/faq',
    label: 'Abrir FAQ da SIHS'
  }
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
  const introRef = React.useRef<HTMLElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const cursorRef = React.useRef<HTMLDivElement>(null)
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

  React.useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.sp-page [data-reveal]'))
    if (!nodes.length) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('sp-reveal--in'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('sp-reveal--in')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const intro = introRef.current
    const canvas = canvasRef.current
    const cursor = cursorRef.current
    if (!intro || !canvas || !cursor) return undefined
    return bindWaterCursor(intro, canvas, cursor, 'sp-intro--water')
  }, [])

  return (
    <div className="sp-page jimu-widget">
      <header className="sp-intro" ref={introRef}>
        <canvas ref={canvasRef} className="sp-intro__trail" aria-hidden="true" />
        <div ref={cursorRef} className="sp-water-cursor" aria-hidden="true" />
        <div className="sp-inner">
          <div className="sp-intro__brand sp-reveal" data-reveal="intro-brand">
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
          <p className="sp-lead sp-reveal" data-reveal="intro-lead">
            O Portal da Água é uma plataforma digital de informação e gestão territorial que reúne e disponibiliza informações georreferenciadas relacionadas aos recursos hídricos e à infraestrutura de abastecimento de água do Estado da Bahia.
          </p>
          <div className="sp-intro__copy">
            <p className="sp-reveal" data-reveal="intro-a">
              Por meio de mapas interativos, bases de dados georreferenciadas e painéis temáticos, o Portal permite consultar, visualizar e analisar informações sobre diferentes componentes da infraestrutura hídrica, proporcionando uma visão territorial integrada das estruturas existentes no Estado.
            </p>
            <p className="sp-reveal" data-reveal="intro-b">
              Entre as informações disponibilizadas estão reservatórios associados a diferentes órgãos e instituições parceiras, incluindo CERB, Embasa, DNOCS, CODEVASF e CHESF, além de informações sobre sistemas de abastecimento de água e poços implantados pela CERB.
            </p>
            <p className="sp-reveal" data-reveal="intro-c">
              As informações podem ser consultadas e espacializadas por município, Território de Identidade e outros recortes territoriais, permitindo uma melhor compreensão da distribuição da infraestrutura hídrica no território baiano.
            </p>
          </div>
        </div>
      </header>

      <section className="sp-find" aria-labelledby="sp-find-title">
        <LightWater motif="current" />
        <div className="sp-inner">
          <div className="sp-reveal" data-reveal="find-head">
            <p className="sp-kicker">
              <span />
              No portal
            </p>
            <h2 id="sp-find-title">O que você encontra no portal</h2>
          </div>
          <ul>
            {ENCONTRA.map((item, index) => (
              <li
                key={item}
                className="sp-reveal"
                data-reveal={`find-${index}`}
                style={{ transitionDelay: `${(index % 2) * 0.12}s` }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sp-evolve" aria-labelledby="sp-evolve-title">
        <LightWater motif="dune" />
        <div className="sp-inner">
          <div className="sp-reveal" data-reveal="evolve-head">
            <p className="sp-kicker">
              <span />
              Em evolução
            </p>
            <h2 id="sp-evolve-title">Um portal em constante evolução</h2>
          </div>
          <p className="sp-reveal" data-reveal="evolve-a">
            O Portal da Água está em processo contínuo de integração, atualização, padronização e qualificação das informações, buscando ampliar a disponibilidade e a confiabilidade dos dados geoespaciais relacionados à infraestrutura hídrica.
          </p>
          <p className="sp-reveal" data-reveal="evolve-b" style={{ transitionDelay: '0.12s' }}>
            Ao reunir informações de diferentes bases institucionais em uma plataforma territorial integrada, o Portal da Água contribui para o planejamento, a gestão, o monitoramento e a tomada de decisão, além de ampliar a transparência e o acesso às informações sobre a infraestrutura hídrica do Estado da Bahia.
          </p>
        </div>
      </section>

      <section className="sp-partners" aria-labelledby="sp-partners-title">
        <LightWater motif="orbit" />
        <div className="sp-inner">
          <div className="sp-reveal" data-reveal="partners-head">
            <p className="sp-kicker">
              <span />
              Instituições
            </p>
            <h2 id="sp-partners-title">Parceiros</h2>
          </div>
          <ul>
            {PARCEIROS.map((parceiro, index) => (
              <li
                key={parceiro.id}
                className="sp-reveal"
                data-reveal={`partner-${index}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <img
                  src={`${props.context.folderUrl}dist/runtime/assets/${parceiro.image}`}
                  alt={parceiro.alt}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sp-channels" aria-labelledby="sp-channels-title">
        <div className="sp-inner">
          <div className="sp-reveal" data-reveal="channels-head">
            <p className="sp-kicker">
              <span />
              Participação
            </p>
            <h2 id="sp-channels-title">Canais de atendimento e participação</h2>
            <p className="sp-channels__lead">
              Contato, ouvidoria, pedido de informação e as outras formas de falar com a SIHS estão no site oficial.
            </p>
          </div>
          <ul>
            {CANAIS.map((item, index) => (
              <li
                key={item.title}
                className="sp-reveal"
                data-reveal={`channel-${index}`}
                style={{ transitionDelay: `${(index % 2) * 0.12}s` }}
              >
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                  <em>{item.label}</em>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Widget

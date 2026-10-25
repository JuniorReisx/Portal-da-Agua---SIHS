import { React, type AllWidgetProps } from 'jimu-core'
import './style.css'

const APPS = [
  {
    id: 'reservatorios',
    kind: 'Dashboard',
    title: 'Acompanhamento Operacional de Reservatórios',
    summary: 'Volume, gestão e medição dos reservatórios monitorados na Bahia.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/dashboards/d2aa366ea7a9490b849708a90daf0ee2'
  },
  {
    id: 'ativos',
    kind: 'Mapa',
    title: 'Ativos Hídricos Geoespacializados',
    summary: 'Mapa dos ativos hídricos geoespacializados do Portal da Água.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portalagua/'
  },
  {
    id: 'abastecimento',
    kind: 'Dashboard',
    title: 'Sistemas de Abastecimento de Água',
    summary: 'Mapa e distribuição dos sistemas de abastecimento de água na Bahia.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=092b6dc2b68749eea248e62943a5935e'
  },
  {
    id: 'dfisc',
    kind: 'Site',
    title: 'Plataforma Integrada de Fiscalização',
    summary: 'Site da AGERSA para a fiscalização e a publicação de dados.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/sites/#/dfisc'
  },
  {
    id: 'pocos',
    kind: 'Dashboard',
    title: 'Distribuição da Rede de Poços',
    summary: 'Mapa e indicadores da rede de poços da Bahia.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=34d001de6b934da9af41d41b91cfd72f'
  },
  {
    id: 'inventario',
    kind: 'Inventário',
    title: 'Inventário de Infraestrutura Hídrica e Saneamento',
    summary: 'Barragens, sistemas de abastecimento e poços da Bahia num só painel.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=64cac37233d342e98fab036d397a93cd&page=Inicio'
  }
]

const STARTERS = ['pocos', 'reservatorios', 'abastecimento', 'inventario', 'comecar']

const QUESTIONS = [
  {
    id: 'pocos',
    ask: 'Onde vejo os poços da Bahia?',
    answer: 'O mapa e os indicadores da rede de poços estão no painel Distribuição da Rede de Poços.',
    appId: 'pocos',
    next: ['reservatorios', 'inventario', 'ativos']
  },
  {
    id: 'reservatorios',
    ask: 'Como acompanho o volume dos reservatórios?',
    answer: 'Volume, gestão e medição dos reservatórios monitorados ficam no Acompanhamento Operacional de Reservatórios.',
    appId: 'reservatorios',
    next: ['pocos', 'abastecimento', 'inventario']
  },
  {
    id: 'abastecimento',
    ask: 'Onde estão os sistemas de abastecimento?',
    answer: 'O mapa dos sistemas que levam água às cidades está em Sistemas de Abastecimento de Água.',
    appId: 'abastecimento',
    next: ['reservatorios', 'inventario', 'ativos']
  },
  {
    id: 'ativos',
    ask: 'Tem um mapa com todos os ativos hídricos?',
    answer: 'Sim. Reservatórios, poços e demais estruturas mapeadas aparecem em Ativos Hídricos Geoespacializados.',
    appId: 'ativos',
    next: ['reservatorios', 'pocos', 'dfisc']
  },
  {
    id: 'inventario',
    ask: 'Onde consulto barragens, poços e abastecimento juntos?',
    answer: 'Os três aparecem no Inventário de Infraestrutura Hídrica e Saneamento, no mesmo painel.',
    appId: 'inventario',
    next: ['reservatorios', 'pocos', 'abastecimento']
  },
  {
    id: 'dfisc',
    ask: 'Onde fica a fiscalização?',
    answer: 'A fiscalização e a publicação de dados da AGERSA ficam na Plataforma Integrada de Fiscalização.',
    appId: 'dfisc',
    next: ['inventario', 'reservatorios', 'comecar']
  },
  {
    id: 'comecar',
    ask: 'Por onde eu começo?',
    answer: 'Comece pelo inventário: ele junta barragens, abastecimento e poços. Se quiser um tema só, escolha a próxima pergunta.',
    appId: 'inventario',
    next: ['reservatorios', 'pocos', 'abastecimento', 'dfisc']
  }
]

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  appId?: string
}

const GREETING = 'Olá, eu sou o Gil. Escolha uma pergunta e eu indico a aplicação pública certa.'

const findApp = (id?: string) => APPS.find((app) => app.id === id)

const Widget = (props: AllWidgetProps<any>) => {
  const logoUrl = `${props.context.folderUrl}dist/runtime/assets/logo-portal.png`
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: GREETING
    }
  ])
  const [askedId, setAskedId] = React.useState('')
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const id = 'ap-font'
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
    const list = listRef.current
    if (!list) return
    list.scrollTop = list.scrollHeight
  }, [messages])

  const asked = QUESTIONS.find((item) => item.id === askedId)
  const visible = (asked ? asked.next : STARTERS)
    .map((id) => QUESTIONS.find((item) => item.id === id))
    .filter((item): item is typeof QUESTIONS[number] => Boolean(item))

  const started = askedId !== '' || messages.length > 1

  const reset = () => {
    setAskedId('')
    setMessages([{ role: 'assistant', content: GREETING }])
  }

  const ask = (questionId: string) => {
    const question = QUESTIONS.find((item) => item.id === questionId)
    if (!question || questionId === askedId) return
    setAskedId(questionId)
    setMessages((current) => [
      ...current,
      { role: 'user', content: question.ask },
      { role: 'assistant', content: question.answer, appId: question.appId }
    ])
  }

  return (
    <div className="ap-page jimu-widget">
      <div className="ap-shell">
        <section className="ap-chat" aria-label="Perguntas do assistente Gil">
          <header className="ap-chat__bar">
            <img src={logoUrl} alt="" />
            <div>
              <strong>Gil</strong>
              <span>Assistente do Portal da Água</span>
            </div>
            <button className="ap-reset" type="button" onClick={reset} disabled={!started}>
              Limpar conversa
            </button>
          </header>

          <div className="ap-log" ref={listRef}>
            {messages.map((item, index) => {
              const app = item.role === 'assistant' ? findApp(item.appId) : undefined
              return (
                <article key={`${item.role}-${index}`} className={`ap-msg ap-msg--${item.role}`}>
                  {item.role === 'assistant' && <img className="ap-msg__mark" src={logoUrl} alt="" />}
                  <div className="ap-msg__body">
                    {item.role === 'assistant' && <span className="ap-msg__who">Gil</span>}
                    <p>{item.content}</p>
                    {app && (
                      <a className="ap-suggest" href={app.href} target="_blank" rel="noopener noreferrer">
                        <span className="ap-suggest__kind">{app.kind}</span>
                        <strong>{app.title}</strong>
                        <em>{app.summary}</em>
                        <span className="ap-suggest__go">
                          Acessar aplicação
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M3.5 8h8M8.2 4.6 11.6 8 8.2 11.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          <div className="ap-questions">
            <p className="ap-questions__label" id="ap-questions-label">
              {asked ? 'Agora você pode perguntar' : 'Perguntas'}
            </p>
            <div className="ap-starters" role="group" aria-labelledby="ap-questions-label">
              {visible.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => ask(item.id)}
                >
                  {item.ask}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Widget

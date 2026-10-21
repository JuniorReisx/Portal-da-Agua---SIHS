import { React, type AllWidgetProps } from 'jimu-core'
import './style.css'

const API_URL = 'https://sihs-ia-inventario.onrender.com/api/chat'

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

const STARTERS = [
  'Quero ver os poços da Bahia',
  'Onde acompanho o volume dos reservatórios?',
  'Preciso dos sistemas de abastecimento',
  'Não sei por onde começar'
]

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  appId?: string
}

const findApp = (id?: string) => APPS.find((app) => app.id === id)

const readReply = (text: string) => {
  const match = text.match(/SUGESTAO:\s*([a-z0-9-]+)/i)
  const content = text.replace(/\n?SUGESTAO:\s*\S+\s*$/i, '').trim()
  const id = match?.[1]?.toLowerCase()
  return {
    content: content || text.trim(),
    appId: id && id !== 'nenhuma' ? id : undefined
  }
}

const Widget = (props: AllWidgetProps<any>) => {
  const logoUrl = `${props.context.folderUrl}dist/runtime/assets/logo-portal.png`
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá, eu sou o Gil. Me diga o que você quer consultar na Bahia e eu indico a aplicação pública mais adequada.'
    }
  ])
  const [draft, setDraft] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')
  const listRef = React.useRef<HTMLDivElement>(null)
  const userSpoke = messages.some((item) => item.role === 'user')

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
  }, [messages, busy])

  const send = async (text: string) => {
    const message = text.trim()
    if (!message || busy) return
    const history = messages.slice(-8).map((item) => ({
      role: item.role,
      content: item.content
    }))
    setMessages((current) => [...current, { role: 'user', content: message }])
    setDraft('')
    setError('')
    setBusy(true)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Falha ao consultar o assistente.')
      const reply = readReply(String(data?.response || ''))
      setMessages((current) => [...current, { role: 'assistant', ...reply }])
    } catch {
      setError('Não consegui responder agora. Tente de novo em instantes.')
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    send(draft)
  }

  return (
    <div className="ap-page jimu-widget">
      <div className="ap-shell">
        <section className="ap-chat" aria-label="Conversa com o Gil">
          <header className="ap-chat__bar">
            <img src={logoUrl} alt="" />
            <div>
              <strong>Gil</strong>
              <span>Assistente do Portal da Água</span>
            </div>
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

            {!userSpoke && (
              <div className="ap-starters">
                {STARTERS.map((item) => (
                  <button key={item} type="button" onClick={() => send(item)} disabled={busy}>
                    {item}
                  </button>
                ))}
              </div>
            )}

            {busy && (
              <article className="ap-msg ap-msg--assistant">
                <img className="ap-msg__mark" src={logoUrl} alt="" />
                <div className="ap-msg__body">
                  <span className="ap-msg__who">Gil</span>
                  <p className="ap-typing" aria-label="Gil está respondendo">
                    <span />
                    <span />
                    <span />
                  </p>
                </div>
              </article>
            )}
          </div>

          {error && <p className="ap-error">{error}</p>}

          <form className="ap-form" onSubmit={onSubmit}>
            <label className="ap-sr" htmlFor="ap-question">Sua pergunta</label>
            <input
              id="ap-question"
              value={draft}
              placeholder="Pergunte sobre poços, reservatórios, abastecimento..."
              onChange={(event) => setDraft(event.target.value)}
              disabled={busy}
            />
            <button type="submit" disabled={busy || !draft.trim()} aria-label="Enviar">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Widget

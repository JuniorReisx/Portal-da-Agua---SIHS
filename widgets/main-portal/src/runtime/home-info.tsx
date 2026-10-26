import { React } from 'jimu-core'
import LightWater from '../../../shared/light-water'

const PERGUNTAS = [
  {
    q: 'Como entro em contato?',
    a: 'A SIHS atende de segunda a sexta, das 8h30 às 12h e das 13h30 às 18h, pelo telefone (71) 3115-6062. O endereço é a 3ª Avenida, nº 390, Ala Norte, 2º andar, CAB, Salvador, CEP 41745-005. O site oficial é ba.gov.br/sihs.'
  },
  {
    q: 'O que é o Portal da Água?',
    a: 'É a plataforma da SIHS que reúne mapas e painéis sobre reservatórios, poços e sistemas de abastecimento de água da Bahia.'
  },
  {
    q: 'Preciso de cadastro para consultar?',
    a: 'As aplicações públicas abrem sem entrar na área restrita. A área restrita é o acesso interno, para quem tem permissão.'
  },
  {
    q: 'Como vejo os dados do meu município?',
    a: 'Abra o inventário ou os mapas de poços, reservatórios e abastecimento. A consulta pode ser feita por município e por Território de Identidade.'
  },
  {
    q: 'De onde vêm as informações?',
    a: 'Das bases da SIHS e de parceiros como CERB, Embasa, AGERSA, DNOCS, CODEVASF e CHESF. O portal segue em atualização.'
  }
]

const GLOSSARIO = [
  {
    termo: 'Reservatório',
    texto: 'Lugar que guarda água, como uma barragem ou um açude. O volume e a medição mostram quanta água ainda tem.'
  },
  {
    termo: 'Poço',
    texto: 'Abertura no solo para retirar água debaixo da terra.'
  },
  {
    termo: 'Sistema de abastecimento',
    texto: 'O conjunto que capta, trata e leva a água até as pessoas e as cidades.'
  },
  {
    termo: 'Barragem',
    texto: 'Obra que segura a água de um rio e forma um reservatório.'
  },
  {
    termo: 'Infraestrutura hídrica',
    texto: 'Obras e equipamentos usados para guardar, levar e distribuir água no estado.'
  },
  {
    termo: 'Saneamento básico',
    texto: 'Os serviços de água, esgoto, drenagem e limpeza.'
  },
  {
    termo: 'Bacia hidrográfica',
    texto: 'A área de terra por onde a chuva escorre até um mesmo rio.'
  },
  {
    termo: 'Território de Identidade',
    texto: 'Recorte usado pelo governo da Bahia para agrupar municípios.'
  },
  {
    termo: 'Indicador',
    texto: 'Um número que resume uma situação, como o volume de um reservatório ou a quantidade de poços numa região.'
  },
  {
    termo: 'Ativo hídrico',
    texto: 'Cada estrutura mapeada, como um reservatório, um poço ou um sistema de abastecimento.'
  }
]

const Faq = ({ show }: { show: (id: string, className: string) => string }) => (
  <section className="mp-faq" aria-labelledby="mp-faq-title">
    <div data-reveal="faq-head" className={show('faq-head', 'mp-faq__head')}>
      <p className="mp-info__kicker">Ajuda</p>
      <h2 id="mp-faq-title">Perguntas frequentes</h2>
    </div>
    <div className={show('faq-list', 'mp-faq__list')} data-reveal="faq-list">
      {PERGUNTAS.map((item, index) => (
        <article className="mp-faq__card" key={item.q}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{item.q}</h3>
          <p>{item.a}</p>
        </article>
      ))}
    </div>
  </section>
)

const HomeInfo = ({ show }: { show: (id: string, className: string) => string }) => (
  <>
    <section className="mp-glossary" aria-labelledby="mp-glossary-title">
      <div className="mp-glossary__water" aria-hidden="true">
        <span className="mp-glossary__drop" />
        <span className="mp-glossary__drop" />
        <span className="mp-glossary__drop" />
        <span className="mp-glossary__drop" />
        <span className="mp-glossary__drop" />
        <span className="mp-glossary__drop" />
        <div className="mp-glossary__waves">
          <svg viewBox="0 0 1440 160" preserveAspectRatio="none">
            <path fill="rgba(143,212,230,0.16)" d="M0 90c120 36 240-36 360 0s240 36 360 0 240-36 360 0 240 36 360 0v70H0z" />
            <path fill="rgba(255,255,255,0.07)" d="M0 112c160-28 280 28 440 0s280-28 440 0 280 28 440 0 80-16 120 0v48H0z" />
          </svg>
          <svg viewBox="0 0 1440 160" preserveAspectRatio="none">
            <path fill="rgba(143,212,230,0.16)" d="M0 90c120 36 240-36 360 0s240 36 360 0 240-36 360 0 240 36 360 0v70H0z" />
            <path fill="rgba(255,255,255,0.07)" d="M0 112c160-28 280 28 440 0s280-28 440 0 280 28 440 0 80-16 120 0v48H0z" />
          </svg>
        </div>
      </div>
      <div className="mp-glossary__inner">
        <div data-reveal="glossary-head" className={show('glossary-head', '')}>
          <p className="mp-glossary__kicker">Glossário</p>
          <h2 id="mp-glossary-title">Água e saneamento</h2>
        </div>
        <dl className="mp-glossary__list">
          {GLOSSARIO.map((item, index) => (
            <div
              className={show(`glossary-${index}`, 'mp-glossary__item')}
              data-reveal={`glossary-${index}`}
              key={item.termo}
              style={{ transitionDelay: `${(index % 2) * 0.12}s` }}
            >
              <dt>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.termo}</strong>
              </dt>
              <dd>{item.texto}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    <div className="mp-info">
      <LightWater motif="bubbles" />
      <Faq show={show} />
    </div>
  </>
)

export default HomeInfo

// COMO CRIAR UM CARD
//
// 1. Salve a foto nesta pasta:
//    src/runtime/assets
//    O nome do arquivo entra no campo image. Exemplo: minha-foto.jpg
//
// 2. Copie o bloco COMECE AQUI, cole antes do ] final e troque os textos.
//    kind só pode ser um destes: Painel, Dashboard, Mapa ou Site.
//    Não esqueça a vírgula depois do } do card anterior.
//
// 3. Salve este arquivo e atualize a página.

export const PROJETOS = [
  {
    id: 'sanerural',
    kind: 'Painel',
    title: 'Painel Integrado de Saneamento Rural',
    summary: 'Atendimento de água e esgoto no meio rural da Bahia, por polo, microrregião e município.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=357e765947bc4fc2af89e8e61d8e5437',
    image: 'sanerural.jpg'
  },
  {
    id: 'investimentos',
    kind: 'Dashboard',
    title: 'Acompanhamento de Investimentos - Bahia',
    summary: 'Entregas, status e executores dos investimentos em infraestrutura hídrica e saneamento.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=7ffbc7a11a364ae5b875cb371a8a00ae',
    image: 'investimentos.jpg'
  },

  // COMECE AQUI — copie daqui até o fim do bloco, cole acima e apague as barras //
  // {
  //   id: 'meu-card',
  //   kind: 'Painel',
  //   title: 'Nome que aparece no card',
  //   summary: 'Uma frase curta sobre o projeto.',
  //   href: 'https://cole-o-link-aqui',
  //   image: 'minha-foto.jpg'
  // }
]

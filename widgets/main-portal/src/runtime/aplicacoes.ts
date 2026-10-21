// COMO CRIAR UM CARD
//
// 1. Salve a foto nesta pasta:
//    src/runtime/assets
//    O nome do arquivo entra no campo image. Exemplo: minha-foto.jpg
//
// 2. Copie o bloco COMECE AQUI, cole antes do ] final e troque os textos.
//    kind só pode ser um destes: Dashboard, Mapa ou Site.
//    Não esqueça a vírgula depois do } do card anterior.
//
// 3. Salve este arquivo e atualize a página.

export const APPLICATIONS = [
  {
    id: 'reservatorios',
    kind: 'Dashboard',
    title: 'Acompanhamento Operacional de Reservatórios',
    summary: 'Volume, gestão e medição dos reservatórios monitorados na Bahia.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/dashboards/d2aa366ea7a9490b849708a90daf0ee2',
    image: 'reservatorios.png'
  },
  {
    id: 'ativos',
    kind: 'Mapa',
    title: 'Ativos Hídricos Geoespacializados',
    summary: 'Mapa dos ativos hídricos geoespacializados do Portal da Água.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portalagua/',
    image: 'ativos.jpg'
  },
  {
    id: 'abastecimento',
    kind: 'Dashboard',
    title: 'Sistemas de Abastecimento de Água',
    summary: 'Mapa e distribuição dos sistemas de abastecimento de água na Bahia.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=092b6dc2b68749eea248e62943a5935e',
    image: 'abastecimento.jpg'
  },
  {
    id: 'dfisc',
    kind: 'Site',
    title: 'Plataforma Integrada de Fiscalização',
    summary: 'Site da AGERSA para a fiscalização e a publicação de dados.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/sites/#/dfisc',
    image: 'dfisc.jpg'
  },
  {
    id: 'pocos',
    kind: 'Dashboard',
    title: 'Distribuição da Rede de Poços',
    summary: 'Mapa e indicadores da rede de poços da Bahia.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=34d001de6b934da9af41d41b91cfd72f',
    image: 'pocos.jpg'
  },
  {
    id: 'inventario',
    kind: 'Inventário',
    title: 'Inventário de Infraestrutura Hídrica e Saneamento',
    summary: 'Barragens, sistemas de abastecimento e poços da Bahia num só painel.',
    href: 'https://portaldaagua.sihs.ba.gov.br/portal/apps/experiencebuilder/experience/?id=64cac37233d342e98fab036d397a93cd&page=Inicio',
    image: 'inventario.jpg'
  },

  // COMECE AQUI — copie daqui até o fim do bloco, cole acima e apague as barras //
  // {
  //   id: 'meu-card',
  //   kind: 'Dashboard',
  //   title: 'Nome que aparece no card',
  //   summary: 'Uma frase curta sobre a aplicação.',
  //   href: 'https://cole-o-link-aqui',
  //   image: 'minha-foto.jpg'
  // }
]

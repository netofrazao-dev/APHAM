// ============================================================================
//  CONTEÚDO DO SITE DA APHAM
//  Tudo que aparece no site está centralizado aqui para facilitar a edição.
//
//  Conteúdo real trazido do site atual (handebolmarajo.org) e das imagens
//  enviadas pela associação. Onde algo ainda é exemplo, está marcado como
//  "provisório" — é só substituir.
// ============================================================================

export const site = {
  nome: 'APHAM',
  // Domínio oficial (sem barra no final). Também está em index.html, public/robots.txt e public/sitemap.xml.
  url: 'https://www.handebolmarajo.org',
  nomeCompleto: 'Associação de Praticantes de Handebol do Marajó',
  cidade: 'Breves',
  estado: 'Pará',
  fundacao: '27 de fevereiro de 2009',
  endereco: 'Rua Justo Chermont, Centro — Breves/PA',
  email: 'apham.cvmf@gmail.com',
  telefone: '(91) 99178-9031',
  whatsapp: 'https://wa.me/5591991789031',
  // Número oficial (só dígitos, com DDI) — usado para os pedidos da loja.
  whatsappNumero: '5591991789031',
  instagram: 'https://www.instagram.com/handebolmarajo/',
  facebook: 'https://www.facebook.com/Apham2009',
  youtube: 'https://www.youtube.com/@handebolmarajo',
  // Link da futura loja — por enquanto aponta para o bloco "Loja em breve".
  lojaUrl: '#loja',
  // Loja pausada até ficar pronta: esconde o botão/bloco da loja e mostra "em breve".
  lojaPausada: true,
}

// Sumário do site — cada item abre uma subpágina própria (conteúdo mais fixo).
// O conteúdo que muda com frequência (novidades, eventos) fica rolando na home.
export const nav = [
  { label: 'Projetos', to: '/projetos' },
  { label: 'Participar', to: '/participar' },
  { label: 'Equipes', to: '/equipes' },
  { label: 'Competições e Eventos', to: '/competicoes' },
  { label: 'Marajó Solidário', to: '/marajo-solidario' },
  { label: 'Galeria', to: '/galeria' },
  { label: 'Fale Conosco', to: '/contato' },
]

// Sumário do MENU MOBILE (hambúrguer) — lista mais completa que a barra do desktop.
// Itens com '#' levam a uma âncora na home; os demais abrem subpáginas.
export const sumario = [
  { label: 'Início', to: '/' },
  { label: 'Projetos', to: '/projetos' },
  { label: 'Participar', to: '/participar' },
  { label: 'Equipes', to: '/equipes' },
  { label: 'Competições e Eventos', to: '/competicoes' },
  { label: 'Marajó Solidário', to: '/marajo-solidario' },
  { label: 'Galeria', to: '/galeria' },
  { label: 'Fale Conosco', to: '/contato' },
]

// Redes sociais que aparecem no header (ao lado dos links).
export const redesHeader = [
  { nome: 'YouTube', icone: 'Youtube', url: 'youtube' },
  { nome: 'Facebook', icone: 'Facebook', url: 'facebook' },
  { nome: 'Instagram', icone: 'Instagram', url: 'instagram' },
]

export const hero = {
  tagline: 'Mais que uma Associação...',
  titulo: 'Muito mais que handebol',
  // Assinatura script que aparece ao lado da logo no topo.
  assinatura: 'Handebol · Marajó · Pará!',
  ctaApoie: { label: 'Apoie o nosso projeto', href: '/apoie' },
  ctaQuemSomos: { label: 'Quem somos', href: '/quem-somos' },
}

// Selos/credenciais (quadro clicável, no lugar do antigo quadro de números).
// href: âncora (#secao), link externo (https...) ou '#' (sem destino ainda).
// Troque href pelo link do documento de cada um quando tiver.
// Cada selo abre a SUA própria página (conteúdo fixo), abrindo no topo.
export const credenciais = [
  { titulo: 'Prêmios Nacionais e Certificações', cor: 'amarelo', href: '/reconhecimentos' },
  { titulo: 'Lei de Incentivo ao Esporte', cor: 'verdeBandeira', href: '/incentivo' },
  { titulo: 'Cooperativa Social', cor: 'azul', href: '/cooperativa' },
  { titulo: 'Documentário', cor: 'laranja', href: '/documentario' },
]

export const sobre = {
  eyebrow: 'Sobre a APHAM',
  titulo: 'Quem somos',
  paragrafos: [
    'A APHAM – Associação de Praticantes de Handebol do Marajó – foi fundada em 27 de fevereiro de 2009. É uma Organização da Sociedade Civil que, desde sua fundação, tem como principais objetivos promover o Desenvolvimento, o Fortalecimento e a Afirmação do Esporte Escolar e Amador, com enfoque especial ao nosso amado Handebol nesta Região de Integração da Amazônia Marajoara.',
    'O foco central da nossa Pedagogia Sócio-Formativa está na promoção, pela prática esportiva, da Inclusão Social e da construção de valores socialmente significativos — contribuindo para uma sociedade com mais justiça social e mais oportunidades para todos e todas.',
  ],
  missao:
    'Edificar nossa Associação como instrumento de promoção e valorização do ser humano; fazendo e refazendo nossas práticas em busca do fortalecimento e da afirmação do Esporte Escolar e, em especial, do Handebol em nossa região. Assim, a partir do uso ético e responsável desse nosso amado esporte, contribuímos para a construção de valores socialmente significativos, para a inclusão social e para a garantia de direitos de crianças, adolescentes e jovens da comunidade marajoara.',
  lemaTitulo: 'HANDEBOL · MARAJÓ · PARÁ',
  lema:
    'Nosso lema expressa a crença em um projeto maior de Desenvolvimento Humano, movido pelo amor por esse esporte e pelo orgulho de fazer parte da comunidade esportiva marajoara.',
  destaques: [
    { titulo: 'Fundada em 2009', texto: 'Mais de 15 anos de história no Marajó.' },
    { titulo: 'Utilidade pública estadual', texto: 'Reconhecida pela Lei nº 10.594/2024.' },
  ],
  // Projetos/bandeiras da APHAM (logos enviadas).
  projetos: [
    { nome: 'Escola de Esportes', logo: '/midia/marca/logo-escola-esportes.jpg' },
    { nome: 'Semear Hand', logo: '/midia/marca/logo-semear-hand.jpg' },
  ],
}

// PROJETOS da APHAM (página própria, aberta pelo menu "Projetos").
// Ordem pedida pelo cliente: 1º Semear Hand, 2º Escola de Esportes.
// Textos tirados dos folders dos prêmios Itaú-Unicef. Cada projeto tem uma página
// própria (/projetos/<slug>), com o conteúdo em `projetosDetalhes` (folders.js).
export const projetos = {
  eyebrow: 'Nossos projetos',
  titulo: 'Projetos que transformam pelo esporte',
  descricao:
    'A APHAM desenvolve projetos que usam o handebol como ferramenta de educação, inclusão social e formação de valores para crianças, adolescentes e jovens do Marajó.',
  lista: [
    {
      slug: 'semear-hand',
      nome: 'Semear Hand',
      logo: '/midia/marca/logo-semear-hand.jpg',
      foto: '/midia/projetos/semear-hand-foto.jpg',
      resumo:
        'Cultivando Valores pelo Esporte e para a Vida! Semifinalista do Prêmio Itaú-Unicef 2015.',
      texto:
        'Desde 2009, em parceria com a E.E.E.F.M. Presidente Tancredo de Almeida Neves, em Melgaço, o Semear Hand une esporte e educação na formação integral de alunos-atletas — com oficinas pedagógicas de handebol, acompanhamento escolar e familiar e treinamento desportivo.',
    },
    {
      slug: 'escola-de-esportes',
      nome: 'Escola de Esportes',
      logo: '/midia/marca/logo-escola-esportes.jpg',
      foto: '/midia/projetos/escola-esportes-foto.jpg',
      resumo:
        'Aprendendo com Valores: Educação e Promoção Social para a Juventude! Semifinalista do Prêmio Itaú-Unicef 2018.',
      texto:
        'Proposta piloto de educação em tempo integral em Breves: cerca de 100 adolescentes de 12 a 17 anos, no contraturno escolar, com handebol, futsal e voleibol, reforço escolar, educação cidadã e acompanhamento das famílias.',
    },
  ],
}

// INFORMAÇÕES GERAIS sobre a associação e o handebol (conteúdo PROVISÓRIO —
// o cliente vai enviar o texto oficial). Aparece na home, no corpo que rola.
export const handebol = {
  eyebrow: 'O esporte',
  titulo: 'Conheça o handebol',
  intro:
    'O handebol é um esporte coletivo, rápido e inclusivo: duas equipes se enfrentam buscando marcar gols com as mãos. Mais do que competição, ele ensina cooperação, disciplina e respeito — valores que a APHAM leva a crianças, adolescentes e jovens de todo o Marajó.',
  topicos: [
    {
      icone: 'Trophy',
      titulo: 'O que é o handebol',
      texto:
        'Jogado por duas equipes de sete atletas, é um dos esportes coletivos mais praticados nas escolas do Brasil — dinâmico, de fácil acesso e que desenvolve corpo e mente.',
    },
    {
      icone: 'MapPin',
      titulo: 'O handebol no Marajó',
      texto:
        'Na região marajoara, a APHAM é referência na formação de atletas e na difusão do handebol escolar e amador, levando o esporte a comunidades que antes tinham pouco acesso.',
    },
    {
      icone: 'Users',
      titulo: 'O dia a dia da APHAM',
      texto:
        'Treinos, oficinas, competições e ações sociais fazem parte da rotina da associação, sempre com foco na inclusão e na formação de valores dentro e fora da quadra.',
    },
  ],
}

// "Handebol no Brasil e no mundo" — portais oficiais do esporte.
export const handebolMundo = {
  eyebrow: 'Para além do Marajó',
  titulo: 'Handebol no Brasil e no mundo',
  intro:
    'Acompanhe o handebol em todos os níveis: a confederação brasileira, a federação europeia e a federação internacional — as casas oficiais do esporte que a APHAM leva ao Marajó.',
  sites: [
    {
      nome: 'CBHb',
      descricao: 'Confederação Brasileira de Handebol',
      ambito: 'Brasil',
      img: '/midia/sites/cbhb.jpg',
      href: 'https://www.cbhb.org.br/',
    },
    {
      nome: 'EHF',
      descricao: 'European Handball Federation',
      ambito: 'Europa',
      img: '/midia/sites/ehf.jpg',
      href: 'https://www.eurohandball.com/',
    },
    {
      nome: 'IHF',
      descricao: 'International Handball Federation',
      ambito: 'Mundo',
      img: '/midia/sites/ihf.jpg',
      href: 'https://www.ihf.info/',
    },
  ],
}

// CALENDÁRIO DA APHAM — calendário de 2026 (janeiro a dezembro), navegável.
// Cada evento tem uma data ISO (AAAA-MM-DD). Datas PROVISÓRIAS — marque as
// competições nos dias corretos conforme a agenda oficial da associação.
export const calendario = {
  eyebrow: 'Agenda',
  titulo: 'Calendário da APHAM',
  intro:
    'As competições e ações da APHAM ao longo de 2026. Use as setas para passar os meses.',
  ano: 2026,
  // Cada evento: data (início) + fim opcional (eventos de vários dias) + tipo
  // (categoria que aparece na etiqueta: Competição, Evento, Ação social…) + cor.
  // cor: 'cyan' | 'amber' | 'red' | 'green' | 'blue' | 'purple'.
  eventos: [
    {
      data: '2026-09-19',
      fim: '2026-09-21',
      titulo: 'TFA — Taça das Fronteiras Amazônicas',
      local: 'Breves — PA',
      tipo: 'Competição',
      cor: 'cyan',
    },
    {
      data: '2026-09-21',
      titulo: 'TFA — Grande final (APHAM x APHAM)',
      local: 'Breves — PA',
      tipo: 'Final',
      cor: 'amber',
    },
  ],
}

export const valores = [
  { icone: 'HeartHandshake', titulo: 'Inclusão Social', texto: 'O esporte como porta de oportunidades e ferramenta de transformação para a juventude.' },
  { icone: 'GraduationCap', titulo: 'Esporte Escolar', texto: 'Fortalecimento do handebol escolar e amador em toda a região do Marajó.' },
  { icone: 'Sparkles', titulo: 'Formação de Valores', texto: 'Construção de valores socialmente significativos dentro e fora da quadra.' },
  { icone: 'ShieldCheck', titulo: 'Garantia de Direitos', texto: 'Compromisso com os direitos de crianças, adolescentes e jovens marajoaras.' },
]

// ============================================================================
//  NOVIDADES — área para a associação postar os momentos (stories + feed).
//  Para publicar algo novo, adicione um item no começo das listas abaixo.
//  (Numa fase futura, dá para ligar isto a um painel de administração ou ao
//  Instagram, para postar sem mexer no código.)
// ============================================================================

// "Stories" — aparecem como círculos no topo da seção e abrem em tela cheia.
export const stories = [
  { img: '/midia/eventos/campeoes-trofeu.jpg', titulo: 'Campeões!' },
  { img: '/midia/eventos/equipe-feminina.jpg', titulo: 'Treino feminino' },
  { img: '/midia/eventos/equipe-medalhas.jpg', titulo: 'Pódio' },
  { img: '/midia/eventos/jeps-2015.jpg', titulo: "JEP's" },
  { img: '/midia/eventos/colonia-aquatica.jpg', titulo: 'Confraternização' },
]

// Feed de novidades/posts.
// Cards do TFA usam `imgs: [foto1, foto2]` para o efeito de 2 fotos (crossfade).
// Fotos de exemplo nos cards do TFA e da Escola de Esportes até chegarem as
// fotos reais (troque pelo painel /admin → Novidades).
export const novidades = [
  {
    data: '',
    tag: 'TFA',
    titulo: 'TFA — a maior competição de handebol do Marajó',
    texto:
      'A Taça das Fronteiras Amazônicas (TFA) é a maior competição de handebol da região do Marajó. Mais do que uma disputa esportiva, é um encontro que valoriza o handebol amador e de base, levando o esporte a atletas de várias cidades da região.\n\nA competição já aconteceu e teve todos os jogos transmitidos ao vivo pela APHAM. Participaram equipes como Bulls, Canibal, União Handebol, Santos, Amigos e Montabo Athletic, entre outras, nas categorias de base e adulto.',
    img: '/midia/eventos/tfa-taca.jpg',
    imgs: ['/midia/eventos/tfa-taca.jpg', '/midia/eventos/tfa-logo.webp'],
  },
  {
    data: '',
    tag: 'TFA',
    titulo: 'TFA: a Guiana Francesa no Marajó',
    texto:
      'A primeira competição internacional de handebol do Marajó. A TFA recebeu a participação de uma delegação da Guiana Francesa, colocando o handebol marajoara em contato com o cenário internacional.\n\nUm marco para a região: o esporte formado na base da APHAM cruzando fronteiras e mostrando a força do handebol do Marajó para além do Brasil.',
    img: '/midia/eventos/tfa-logo.webp',
  },
  {
    data: '',
    tag: 'TFA',
    titulo: 'TFA: a grande final — APHAM x APHAM',
    texto:
      'A grande final da TFA foi decidida entre dois times formados dentro da própria APHAM — a prova viva da força do trabalho de base da associação.\n\nCom a taça ficando em casa, a decisão coroou atletas revelados pelo projeto e mostrou que o handebol do Marajó tem estrutura para formar campeões.',
    img: '/midia/eventos/tfa-logo.webp',
  },
  {
    data: '',
    tag: 'Escola de Esportes',
    titulo: 'Lançamento do Projeto Escola de Esportes',
    texto:
      'Lançamento oficial do Projeto Escola de Esportes, que leva o handebol às escolas e comunidades do Marajó.\n\nO projeto abre portas para crianças e adolescentes por meio do esporte, unindo formação esportiva, inclusão social e cidadania — a base do trabalho da APHAM na região.',
    img: '/midia/marca/logo-escola-esportes.jpg',
  },
  {
    data: '',
    tag: 'Escola de Esportes',
    titulo: 'O dia a dia dos treinamentos',
    texto:
      'No dia a dia dos treinamentos, crianças e jovens aprendem os fundamentos do handebol com disciplina, cooperação e alegria.\n\nMais do que técnica, cada treino é um espaço de convivência e formação de valores — onde se formam atletas e cidadãos.',
    img: '/midia/marca/logo-escola-esportes.jpg',
  },
  {
    data: '',
    tag: 'Escola de Esportes',
    titulo: 'Gincanas pedagógicas',
    texto:
      'As gincanas pedagógicas unem esporte, educação e valores: atividades lúdicas que ensinam dentro e fora da quadra.\n\nBrincando e competindo de forma saudável, os participantes desenvolvem corpo e mente e reforçam o papel social do projeto na comunidade marajoara.',
    img: '/midia/marca/logo-escola-esportes.jpg',
  },
]

// LIVES APHAM — jogos transmitidos no canal do YouTube (@handebolmarajo).
// Coletados da aba "Ao vivo" do canal. Para adicionar um novo jogo, é só
// incluir { id: '<id do vídeo>', torneio: '...', titulo: '...' }.
export const livesInfo = {
  eyebrow: 'Transmissões',
  titulo: 'Lives APHAM',
  intro:
    'Reveja os jogos transmitidos pela APHAM no YouTube — a Taça das Fronteiras Amazônicas (TFA) e a Copa Handebol, direto do Marajó.',
  canal: 'https://www.youtube.com/@handebolmarajo/streams',
}

export const lives = [
  { id: 'U_IiwoyRwNI', torneio: 'TFA', titulo: 'Final — Bulls x Canibal' },
  { id: 'oymU5yU2yiw', torneio: 'TFA', titulo: 'Final Juvenil — Acha x Santos (premiação)' },
  { id: 'vAWS9NfcNG4', torneio: 'TFA', titulo: 'Final Juvenil — Acha x Santos' },
  { id: 'c_Bk2yq-52g', torneio: 'TFA', titulo: 'União Handebol x Santos' },
  { id: 'sm0-s9Ko2qc', torneio: 'TFA', titulo: 'Juvenil — Santos x Acha' },
  { id: 't3zGIJjF39w', torneio: 'TFA', titulo: 'Amigos x Montabo Athletic' },
  { id: 'gKI7iqpVjH8', torneio: 'TFA', titulo: 'Bulls x União Handebol' },
  { id: '5WaHSOA_gT4', torneio: 'TFA', titulo: 'Amigos x Santos' },
  { id: 'a1ulZAEcQMM', torneio: 'TFA', titulo: 'Montabo x Canibal' },
  { id: 'VUQ9BmNElcg', torneio: 'TFA', titulo: 'Montabo x Santos' },
  { id: '96wwzx3r-XQ', torneio: 'TFA', titulo: 'Sub-17 — Acha x Santos' },
  { id: 'WV9oXlVEpB0', torneio: 'TFA', titulo: 'Canibal x União' },
  { id: 'ocisQLuG9VA', torneio: 'TFA', titulo: 'Bulls x Amigos' },
  { id: 'Zjy__v6Ld3o', torneio: 'TFA', titulo: 'Canibal x Amigos' },
  { id: 'KOMMqxyLDDk', torneio: 'TFA', titulo: 'Montabo x União' },
  { id: 'VMdkQZ6j7hs', torneio: 'TFA', titulo: 'Santos/PHAE x Canibal' },
  { id: 'R1CSSVVgdVw', torneio: 'TFA', titulo: 'Santos/PHAE x Canibal' },
  { id: 'IUSfjyYD9Zw', torneio: 'TFA', titulo: 'Bulls x Montabo' },
  { id: '__ykzZlGPN8', torneio: 'Copa Handebol', titulo: 'EETEPA Breves x Acará' },
  { id: 'pMp8sCHjbhY', torneio: 'Copa Handebol', titulo: 'EETEPA Breves x Cametá' },
]

// EVENTOS E CAMPEONATOS — cada um com uma breve história.
// A "Ação Fraternidade Luz" é real. Ajuste/complete os históricos reais.
export const eventos = [
  {
    nome: 'Ação Fraternidade Luz',
    tag: 'Ação social',
    ano: '2020',
    local: 'Breves — Marajó',
    img: '/midia/fotos/foto2.jpg',
    resumo: 'Campanha de combate à COVID-19 com entrega de cestas e apoio a famílias.',
    historia:
      'Durante a pandemia, a APHAM mobilizou atletas e voluntários na Ação Fraternidade Luz de Combate à COVID-19, levando alimentos, materiais de higiene e solidariedade às famílias marajoaras. Foi a prova de que a nossa associação é muito mais que handebol.',
  },
  {
    nome: 'Jogos Escolares do Pará (JEP’s)',
    tag: 'Campeonato',
    ano: '2015',
    local: 'Melgaço — Marajó',
    img: '/midia/eventos/jeps-2015.jpg',
    resumo: 'Participação nos Jogos Escolares, com mobilização da comunidade.',
    historia:
      'A APHAM participou dos Jogos Escolares do Pará levando atletas de Melgaço e região. A comunidade se uniu em ações solidárias, como o pedágio, para garantir a participação das equipes. (Complete com a história real.)',
  },
  {
    nome: 'Oficina Pedagógica de Iniciação ao Handebol',
    tag: 'Formação',
    ano: '2019',
    local: 'Ginásio Municipal — Melgaço',
    img: '/midia/fotos/foto6.jpeg',
    resumo: 'Iniciação e especialização no handebol: regras, fundamentos e quadra.',
    historia:
      'Oficinas que levam o handebol às escolas e comunidades, ensinando desde "conhecer o jogo e a quadra" até os fundamentos técnicos — formando novos atletas e multiplicadores do esporte no Marajó.',
  },
]

// EQUIPES — fotos reais das equipes/categorias.
export const equipes = [
  { nome: 'Categoria Feminina', papel: 'Escola de Esportes', img: '/midia/eventos/equipe-feminina.jpg' },
  { nome: 'Categorias de Base', papel: 'Jovens atletas', img: '/midia/eventos/equipe-medalhas.jpg' },
  { nome: 'Equipe Adulto', papel: 'Representando o Marajó', img: '/midia/eventos/equipe-masculina.jpg' },
  { nome: 'Nossos Campeões', papel: 'Conquistas em quadra', img: '/midia/eventos/campeoes-trofeu.jpg' },
]

// CLUBES/EQUIPES DO CAMPEONATO — card na página Equipes e página própria em
// /equipes/<slug> (slug gerado do nome). cores: as do escudo (usadas na página
// do time); fundoEscudo: a cor de fundo da imagem do escudo, para o card ficar
// sem "moldura". Os jogos do time vêm das Lives (pelo nome no título do jogo).
// historia e titulos: preenchidos pelo painel /admin → Equipes (vazios = a
// página do time não mostra essas seções).
export const clubes = [
  {
    nome: 'Canibal',
    nomeCompleto: 'Canibal Handebol Clube',
    cidade: 'Breves — Marajó — PA',
    lema: 'Pratique handebol: esporte, saúde, lazer, cidadania e qualidade de vida.',
    escudo: '/midia/equipes/canibal.jpg',
    fundoEscudo: '#ffffff',
    cores: { primaria: '#0b7a3b', secundaria: '#f2c200' },
    historia: '',
    titulos: [],
    foto: '',
  },
  {
    nome: 'Huniv',
    nomeCompleto: 'Huniv',
    cidade: '',
    lema: '',
    escudo: '/midia/equipes/huniv.jpg',
    fundoEscudo: '#f3f2ed',
    cores: { primaria: '#2f6b2a', secundaria: '#c9a227' },
    historia: '',
    titulos: [],
    foto: '',
  },
  {
    nome: 'Bulls',
    nomeCompleto: 'Bulls Handball E.R.',
    cidade: '',
    lema: '',
    escudo: '/midia/equipes/bulls.jpg',
    fundoEscudo: '#ffffff',
    cores: { primaria: '#141414', secundaria: '#d6d6d6' },
    historia: '',
    titulos: [],
    foto: '',
  },
  {
    nome: 'Primatas',
    nomeCompleto: 'Primatas Handebol',
    cidade: '',
    lema: '',
    escudo: '/midia/equipes/primatas.jpg',
    fundoEscudo: '#000000',
    cores: { primaria: '#101010', secundaria: '#2f6fe0' },
    historia: '',
    titulos: [],
    foto: '',
  },
]

// RECONHECIMENTOS E CREDENCIAIS — cada item: imagem + texto curto + documento.
// slug: endereço da página de detalhes (/reconhecimentos/<slug>), com o conteúdo em folders.js.
// docPronto: false = o PDF ainda não foi recebido (mostra "documento em breve").
// img: troque pela imagem/logo oficial de cada um quando o cliente enviar.
export const reconhecimentos = [
  {
    slug: 'utilidade-publica-estadual',
    titulo: 'Utilidade Pública Estadual',
    descricao:
      'A APHAM é reconhecida como entidade de utilidade pública estadual pela Lei Estadual nº 10.594, de 20 de junho de 2024 — reconhecimento oficial do nosso trabalho social e esportivo no Marajó.',
    img: '/midia/marca/brasao-para.jpg',
    doc: '/midia/documentos/utilidade-publica.pdf',
    docPronto: true,
  },
  {
    slug: 'utilidade-publica-municipal',
    titulo: 'Utilidade Pública Municipal',
    descricao:
      'A APHAM é reconhecida como entidade de utilidade pública municipal pela Lei Municipal nº 2.527, de 17 de dezembro de 2018, no município de Breves.',
    img: '/midia/marca/brasao-breves.jpg',
    doc: '/midia/documentos/utilidade-publica-municipal.pdf',
    docPronto: true,
  },
  {
    slug: 'premio-itau-unicef-2018',
    titulo: 'Prêmio Itaú-Unicef 2018 — Semifinalista',
    descricao: 'Categoria 1: OSC em Ação — projeto "Escola de Esportes: No Esporte com Valores".',
    img: '/midia/marca/premio-itau-2018.jpg',
    doc: '/midia/documentos/selo-2018.pdf',
    docPronto: true,
  },
  {
    slug: 'premio-itau-unicef-2015',
    titulo: 'Prêmio Itaú-Unicef 2015 — Semifinalista',
    descricao: 'Educação Integral: Aprendizagem que Transforma — projeto "Semear Hand".',
    img: '/midia/marca/premio-itau-2015.jpg',
    doc: '/midia/documentos/selo-2015.pdf',
    docPronto: true,
  },
  {
    slug: 'experiencias-em-rede',
    titulo: 'Certificado Experiências em Rede',
    descricao: 'Certificação do trabalho da APHAM no programa Experiências em Rede (Itaú Social).',
    img: '/midia/marca/experiencias-em-rede.png',
    doc: '/midia/documentos/certificado-experiencias-rede.pdf',
    docPronto: true,
  },
]

// DOCUMENTÁRIO — capítulos no YouTube (o restante da página está em folders.js). Cole as URLs do YouTube em cada
// capítulo (quando vazio, mostra "em breve").
export const documentario = {
  descricao:
    'A história da APHAM contada em capítulos — assista aqui mesmo, direto no site.',
  capitulos: [
    { titulo: 'Capítulo 1', url: 'https://youtu.be/qejbS-Kh-zc' },
    { titulo: 'Capítulo 2', url: 'https://youtu.be/lg2tCbv9fNs' },
    { titulo: 'Capítulo 3', url: 'https://youtu.be/ST4D65TsmZI' },
    { titulo: 'Capítulo 4', url: 'https://youtu.be/wFDXIXR6UpE' },
  ],
}

// Apoio institucional (logos).
export const apoios = [
  { nome: 'Lei de Incentivo ao Esporte', logo: '/midia/marca/lei-incentivo-esporte.jpg' },
]

// VÍDEOS — títulos e durações do site atual. Pôsteres reais.
// Os arquivos precisam ser exportados do Wix para /public/midia/videos.
export const videos = [
  { titulo: 'A Maior História do Esporte Marajoara', duracao: '01:23', poster: '/midia/posters/poster1.jpg', arquivo: '/midia/videos/maior-historia.mp4' },
  { titulo: 'Reconhecimento', duracao: '01:30', poster: '/midia/posters/poster2.jpg', arquivo: '/midia/videos/reconhecimento.mp4' },
  { titulo: 'Lembranças', duracao: '01:39', poster: '/midia/posters/poster3.jpg', arquivo: '/midia/videos/lembrancas.mp4' },
  { titulo: 'Saudade', duracao: '01:19', poster: '/midia/posters/poster4.jpg', arquivo: '/midia/videos/saudade.mp4' },
  { titulo: 'Transformação', duracao: '01:17', poster: '/midia/posters/poster5.jpg', arquivo: '/midia/videos/transformacao.mp4' },
  { titulo: 'Social', duracao: '00:48', poster: '/midia/posters/poster6.jpg', arquivo: '/midia/videos/social.mp4' },
  { titulo: 'Mais que uma Associação', duracao: '02:34', poster: '/midia/posters/poster7.jpg', arquivo: '/midia/videos/mais-que-uma-associacao.mp4' },
  { titulo: 'Memórias APHAM', duracao: '01:13', poster: '/midia/posters/poster8.jpg', arquivo: '/midia/videos/memorias.mp4' },
]

// GALERIA — fotos reais da associação.
export const galeria = [
  { img: '/midia/eventos/campeoes-trofeu.jpg', legenda: 'Campeões no Centro Comunitário Elcione Barbalho' },
  { img: '/midia/eventos/equipe-feminina.jpg', legenda: 'Categoria feminina — Escola de Esportes' },
  { img: '/midia/eventos/equipe-medalhas.jpg', legenda: 'Pódio das categorias de base' },
  { img: '/midia/eventos/coletiva-apham.jpg', legenda: 'Coletiva da APHAM' },
  { img: '/midia/eventos/jeps-2015.jpg', legenda: "JEP's 2015 — Melgaço" },
  { img: '/midia/eventos/equipe-masculina.jpg', legenda: 'Equipe adulto' },
  { img: '/midia/eventos/ginasio-melgaco.jpg', legenda: 'Encontro no ginásio' },
  { img: '/midia/eventos/colonia-aquatica.jpg', legenda: 'Confraternização' },
  { img: '/midia/fotos/foto4.jpeg', legenda: 'Handebol em quadra' },
  { img: '/midia/fotos/foto6.jpeg', legenda: 'Oficina pedagógica' },
  { img: '/midia/fotos/foto2.jpg', legenda: 'Ação Fraternidade Luz' },
  { img: '/midia/fotos/foto5.jpeg', legenda: 'Acompanhamento escolar' },
]

// ÁLBUNS DA GALERIA — cada álbum tem uma página própria (/galeria/<slug>) e um
// card na página Galeria. fotos: [{ img, mini, legenda, vertical }] — `mini` é a
// versão leve usada na grade (a `img` abre em tela cheia). Para contar a história
// em partes, use `capitulos: [{ titulo, texto, fotos }]` no lugar de `fotos`.
// videos: [{ titulo, url }] para YouTube, ou [{ titulo, arquivo, poster, duracao }]
// para vídeo em /public/midia. Opcionais: numeros [{ valor, label }], destaques
// (nomes de 3 fotos para o mosaico de abertura), videosTitulo, videosTexto e
// chamada { titulo, texto } (faixa final que leva à página da ação).
// Enquanto não houver fotos nem vídeos, o álbum mostra "em breve".
const ms = (nome, legenda, vertical = false) => ({
  nome,
  img: `/midia/marajo-solidario/fotos/${nome}.jpg`,
  mini: `/midia/marajo-solidario/fotos/mini/${nome}.jpg`,
  legenda,
  vertical,
})
const msVideo = (nome, titulo) => ({
  titulo,
  duracao: '00:15',
  arquivo: `/midia/marajo-solidario/videos/${nome}.mp4`,
  poster: `/midia/marajo-solidario/videos/${nome}.jpg`,
})

export const albuns = [
  {
    slug: 'marajo-solidario',
    titulo: 'Marajó Solidário',
    descricao: 'Fotos e vídeos da maior ação de distribuição de alimentos do Marajó durante a pandemia de COVID-19.',
    capa: '/midia/marajo-solidario/fotos/mini/entrega-faixa.jpg',
    pagina: { to: '/marajo-solidario', rotulo: 'Conheça a ação' },
    numeros: [
      { valor: '19,5 t', label: 'de alimentos' },
      { valor: '16', label: 'municípios do Marajó' },
      { valor: '2.200', label: 'kits para famílias de Breves' },
    ],
    destaques: ['entrega-comunidade', 'galpao-medida-do-amor', 'entrega-faixa'],
    capitulos: [
      {
        titulo: 'A chegada dos alimentos',
        texto: 'As toneladas de alimentos não perecíveis chegaram em caminhões e foram descarregadas, caixa por caixa, por uma grande equipe de voluntários.',
        fotos: [
          ms('chegada-caminhao', 'O caminhão chega carregado de paletes de alimentos'),
          ms('chegada-empilhadeira', 'A empilhadeira descarrega os paletes'),
          ms('chegada-descarga', 'Voluntários descarregam a carga'),
          ms('chegada-carga', 'Muitas mãos para tirar as caixas do caminhão'),
          ms('chegada-carrinho', 'Os carrinhos são carregados ao lado do caminhão'),
          ms('chegada-mao-em-mao', 'Caixa por caixa, de mão em mão'),
        ],
      },
      {
        titulo: 'Separação e organização',
        texto: 'No galpão, a força-tarefa organizou as pilhas e separou as cargas que seguiriam para os municípios, os projetos sociais e as famílias cadastradas.',
        fotos: [
          ms('galpao-medida-do-amor', '“A medida do amor é amar sem medida” — o galpão tomado pelas caixas'),
          ms('galpao-pilhas', 'Voluntários montam as pilhas sobre os paletes'),
          ms('galpao-voluntario', 'Força-tarefa de voluntários na separação'),
          ms('galpao-equipe', 'A equipe reunida no galpão'),
          ms('galpao-bastidores', 'Bastidores: a organização da equipe'),
          ms('separacao-paletes', 'Paletes separados para as entregas'),
          ms('separacao-carrinho', 'Carrinhos levam as caixas pelo pátio'),
          ms('separacao-conferencia', 'Conferência da carga antes da entrega'),
        ],
      },
      {
        titulo: 'A entrega às famílias',
        texto: 'Os kits chegaram às famílias de crianças, adolescentes e jovens em situação de vulnerabilidade — inclusive nas comunidades à beira do rio.',
        // Deitadas e em pé alternadas: deixa as colunas da grade com alturas parecidas.
        fotos: [
          ms('entrega-comunidade', 'Espaço comunitário à beira do rio recebe os alimentos'),
          ms('entrega-kit-1', 'Entrega do kit de alimentos', true),
          ms('entrega-faixa', 'Em favor de todos que necessitam!'),
          ms('entrega-kits', 'Caixas e kits prontos para a entrega', true),
          ms('entrega-familias-rio', 'Famílias reunidas para a entrega, com o rio ao fundo'),
          ms('entrega-kit-2', 'Famílias recebem as cestas', true),
          ms('entrega-criancas', 'Crianças e famílias no dia da entrega'),
          ms('entrega-alimentacao', 'Alimentação servida às crianças', true),
          ms('entrega-margem-rio', 'A comunidade reunida às margens do rio'),
          ms('entrega-kit-3', 'Entrega das cestas às famílias', true),
          ms('entrega-kit-4', 'Mais uma família atendida', true),
        ],
      },
    ],
    videosTitulo: 'Bastidores em vídeo',
    videosTexto: 'A força-tarefa de voluntários em ação — da chegada da carga à organização do galpão.',
    chamada: {
      titulo: 'Conheça a história completa da ação',
      texto: 'Como a APHAM montou a rede de distribuição, quem apoiou e para onde foram os alimentos.',
    },
    videos: [
      msVideo('carrinhos', 'Carrinhos levam as caixas pelo pátio'),
      msVideo('chuva', 'Trabalho que não parou nem com a chuva'),
      msVideo('corrente', 'A corrente de voluntários em ação'),
      msVideo('mao-em-mao', 'Voluntárias passam as caixas de mão em mão'),
      msVideo('empilhando', 'Voluntários empilham as caixas no galpão'),
      msVideo('galpao-cheio', 'O galpão cheio, pronto para a distribuição'),
    ],
  },
]

// Todas as fotos de um álbum (com ou sem capítulos), na ordem da página.
export const fotosDoAlbum = (a) => (a.capitulos ? a.capitulos.flatMap((c) => c.fotos) : a.fotos || [])

export const citacao = {
  texto: 'Aja como se o que você faz fizesse a diferença. E faz!',
  autor: 'William James',
}

export const apoio = {
  eyebrow: 'Envolva-se',
  titulo: 'Nossa força é ainda maior através da ação coletiva',
  texto:
    'Alguns dos mais desafiadores problemas sociais só são possíveis de resolver com o apoio que recebemos. Entre em contato e junte-se à nossa causa — cause um impacto duradouro.',
  formas: [
    { icone: 'HandHeart', titulo: 'Seja um voluntário', texto: 'Dê seu apoio e contribua para um futuro melhor. Cada gesto conta.' },
    { icone: 'HandCoins', titulo: 'Faça uma doação', texto: 'Uma das formas mais simples de contribuir com a nossa causa.' },
    { icone: 'Handshake', titulo: 'Vire um parceiro', texto: 'Empresas, escolas e órgãos públicos podem somar conosco.' },
  ],
}

export const contato = {
  eyebrow: 'Entre em contato',
  titulo: 'Fale com a APHAM',
  redes: [
    { nome: 'Instagram', icone: 'Instagram', url: site.instagram },
    { nome: 'Facebook', icone: 'Facebook', url: site.facebook },
    { nome: 'WhatsApp', icone: 'MessageCircle', url: site.whatsapp },
  ],
}

// LOJA — identidade "Social Play". O texto inicial usa a fonte Akbar (quando o
// arquivo da fonte for enviado; por enquanto cai no fallback do display) e a
// assinatura dourada da Social Play aparece de fundo.
export const lojaConceito = {
  marca: 'Social Play',
  conceito: 'Vestuário Conceito',
  descricao:
    'Peças com a identidade do handebol marajoara. Cada compra fortalece os projetos sociais da APHAM.',
  assinatura: '/midia/marca/assinatura-socialplay.png',
}

// Assinatura da Social Play (dourada, fundo transparente) — usada como marca d'água.
export const assinaturaSocialPlay = '/midia/marca/assinatura-socialplay.png'

// MAPA — iframe do Google Maps (sem chave de API). Troque o "q=" pelo endereço
// exato ou pelas coordenadas quando o cliente confirmar o local do ginásio.
export const mapaEmbed =
  'https://www.google.com/maps?q=Rua%20Justo%20Chermont%2C%20Centro%2C%20Breves%20-%20PA&z=15&output=embed'

// ============================================================================
//  TREINOS E COMO PARTICIPAR  (#participar)
//  Horários PROVISÓRIOS — ajuste turmas, dias, horários e local com a associação.
// ============================================================================
export const participar = {
  eyebrow: 'Treinos e inscrições',
  titulo: 'Venha fazer parte da APHAM',
  descricao:
    'As portas da APHAM estão abertas para crianças, adolescentes e jovens que queiram praticar handebol. Não é preciso experiência — só vontade de aprender e fazer parte da nossa família marajoara.',
  // true mostra um aviso de que os horários ainda serão confirmados.
  provisorio: false,
  horarios: [
    { turma: 'Categorias de Base (mirim/infantil)', dias: 'Seg · Qua · Sex', horario: '08h – 10h', local: 'Ginásio Municipal — Breves/PA' },
    { turma: 'Categoria Feminina', dias: 'Ter · Qui', horario: '15h – 17h', local: 'Ginásio Municipal — Breves/PA' },
    { turma: 'Escola de Esportes (iniciação)', dias: 'Sáb', horario: '09h – 11h', local: 'Ginásio Municipal — Breves/PA' },
    { turma: 'Equipe Adulto / Amador', dias: 'Qua · Sex', horario: '19h – 21h', local: 'Ginásio Municipal — Breves/PA' },
  ],
  passos: [
    { icone: 'MessageCircle', titulo: 'Fale com a gente', texto: 'Chame no WhatsApp ou pelas redes sociais e diga a idade e a turma de interesse.' },
    { icone: 'ClipboardList', titulo: 'Faça a inscrição', texto: 'A inscrição é gratuita. Levamos um documento do responsável e do atleta no primeiro dia.' },
    { icone: 'Users', titulo: 'Participe do treino', texto: 'É só chegar no horário da turma com roupa confortável. A APHAM cuida do resto.' },
  ],
  requisitos: [
    'Inscrição gratuita e aberta à comunidade.',
    'Menores de idade precisam de autorização do responsável.',
    'Roupa leve, tênis e garrafa de água.',
  ],
}

// ============================================================================
//  PERGUNTAS FREQUENTES  (#faq)
// ============================================================================
export const faq = [
  {
    pergunta: 'Quanto custa treinar na APHAM?',
    resposta:
      'As atividades esportivas da APHAM são gratuitas e abertas à comunidade. Mantemos o projeto com apoios, parcerias, doações e a Lei de Incentivo ao Esporte.',
  },
  {
    pergunta: 'Qual a idade mínima para participar?',
    resposta:
      'Atendemos crianças, adolescentes e jovens em diferentes categorias. Fale com a gente informando a idade e indicamos a turma ideal.',
  },
  {
    pergunta: 'Preciso ter experiência com handebol?',
    resposta:
      'Não. Temos turmas de iniciação na Escola de Esportes, pensadas para quem está começando do zero.',
  },
  {
    pergunta: 'Como faço uma doação ou viro parceiro?',
    resposta:
      'Você pode doar, ser voluntário ou firmar parceria. Veja as formas na seção “Apoie” ou fale conosco pelo formulário de contato e WhatsApp.',
  },
  {
    pergunta: 'A APHAM tem uma loja oficial?',
    resposta:
      'Sim! Camisas, shorts, bolas e acessórios da associação estão na nossa loja — e cada compra ajuda a manter os projetos sociais.',
  },
  {
    pergunta: 'Onde ficam os treinos?',
    resposta:
      'Em Breves, no Marajó/PA. Confira o endereço e o mapa na seção de contato — e confirme o horário da sua turma com a gente antes de ir.',
  },
]

// ============================================================================
//  PRIVACIDADE E TERMOS (LGPD)  —  página /privacidade
//  MODELO: revise com apoio jurídico antes de publicar como versão final.
// ============================================================================
export const privacidade = {
  atualizadoEm: 'outubro de 2026',
  intro:
    'A APHAM — Associação de Praticantes de Handebol do Marajó respeita a sua privacidade. Esta Política explica como tratamos os dados pessoais coletados neste site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).',
  secoes: [
    {
      titulo: '1. Quem é o controlador dos dados',
      itens: [
        'A APHAM — Associação de Praticantes de Handebol do Marajó, com sede na Rua Justo Chermont, Centro, Breves/PA, é a responsável (controladora) pelo tratamento dos dados coletados neste site.',
        'Para qualquer assunto sobre seus dados, fale conosco pelo e-mail apham.cvmf@gmail.com.',
      ],
    },
    {
      titulo: '2. Quais dados coletamos',
      itens: [
        'Dados que você informa no formulário de contato: nome, e-mail e o conteúdo da mensagem.',
        'Dados de pedidos na loja (quando você faz uma compra): nome, contato, endereço de entrega e itens do pedido.',
        'Dados técnicos básicos de navegação, usados apenas para o funcionamento e a segurança do site.',
      ],
    },
    {
      titulo: '3. Para que usamos os dados',
      itens: [
        'Responder às suas mensagens e dúvidas.',
        'Processar, entregar e acompanhar pedidos feitos na loja.',
        'Melhorar o site e garantir a sua segurança.',
        'Não vendemos os seus dados pessoais a terceiros.',
      ],
    },
    {
      titulo: '4. Base legal',
      itens: [
        'Tratamos seus dados com base no seu consentimento, na execução de atendimento/pedido solicitado por você e no legítimo interesse da associação, sempre nos limites da LGPD.',
      ],
    },
    {
      titulo: '5. Compartilhamento',
      itens: [
        'Podemos usar serviços de terceiros apenas para operar o site (por exemplo, hospedagem, banco de dados e envio de e-mails de notificação). Esses parceiros tratam os dados somente para prestar o serviço à APHAM.',
      ],
    },
    {
      titulo: '6. Cookies e armazenamento local',
      itens: [
        'Usamos armazenamento local do navegador (localStorage) para funcionalidades essenciais, como o carrinho da loja e preferências. Esses dados ficam no seu dispositivo e não identificam você para terceiros.',
      ],
    },
    {
      titulo: '7. Seus direitos',
      itens: [
        'Você pode solicitar a confirmação, o acesso, a correção, a portabilidade ou a exclusão dos seus dados, além de revogar o consentimento, a qualquer momento.',
        'Para exercer seus direitos, escreva para apham.cvmf@gmail.com.',
      ],
    },
    {
      titulo: '8. Segurança e retenção',
      itens: [
        'Adotamos medidas técnicas e organizacionais para proteger os seus dados e os mantemos apenas pelo tempo necessário às finalidades descritas ou para cumprir obrigações legais.',
      ],
    },
    {
      titulo: '9. Alterações nesta política',
      itens: [
        'Esta Política pode ser atualizada. A data da última atualização aparece no topo desta página.',
      ],
    },
  ],
}

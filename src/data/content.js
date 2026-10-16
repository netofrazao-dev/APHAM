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
  nomeCompleto: 'Associação de Praticantes de Handebol do Marajó',
  cidade: 'Breves',
  estado: 'Pará',
  fundacao: '27 de fevereiro de 2009',
  endereco: 'Rua Justo Chermont, Centro — Breves/PA',
  email: 'apham.cvmf@gmail.com',
  telefone: '(91) 99244-6806',
  whatsapp: 'https://wa.me/5591992446806',
  instagram: 'https://www.instagram.com/handebolmarajo/',
  facebook: 'https://www.facebook.com/Apham2009',
  // Link da futura loja — por enquanto aponta para o bloco "Loja em breve".
  lojaUrl: '#loja',
}

export const nav = [
  { label: 'Início', href: '#inicio' },
  { label: 'A Associação', href: '#sobre' },
  { label: 'Novidades', href: '#novidades' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Equipes', href: '#equipes' },
  { label: 'Vídeos', href: '#videos' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Apoie', href: '#apoie' },
  { label: 'Contato', href: '#contato' },
]

export const hero = {
  tagline: 'Mais que uma Associação...',
  titulo: 'Muito mais que handebol',
  // Assinatura script que aparece ao lado da logo no topo.
  assinatura: 'Handebol · Marajó · Pará!',
  ctaApoie: { label: 'Apoie o nosso projeto', href: '#apoie' },
  ctaQuemSomos: { label: 'Quem somos', href: '#sobre' },
}

export const stats = [
  { valor: '2009', sufixo: '', label: 'fundada em Breves', raw: true },
  { valor: '15', sufixo: '+', label: 'anos de história' },
  { valor: '100', sufixo: '+', label: 'jovens atendidos' },
  { valor: '2', sufixo: '', label: 'prêmios Itaú-Unicef' },
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
export const novidades = [
  {
    data: '2024',
    tag: 'Conquista',
    titulo: 'APHAM é campeã no Centro Comunitário Elcione Barbalho',
    texto:
      'Nossas equipes subiram ao pódio em mais uma competição regional, levantando o troféu com o apoio de toda a comunidade marajoara. (Conteúdo provisório — ajuste a data e o texto.)',
    img: '/midia/eventos/campeoes-trofeu.jpg',
  },
  {
    data: '2024',
    tag: 'Escola de Esportes',
    titulo: 'Categoria feminina em ação',
    texto:
      'As meninas da Escola de Esportes seguem firmes nos treinos e representando a APHAM com orgulho dentro de quadra. (Conteúdo provisório.)',
    img: '/midia/eventos/equipe-feminina.jpg',
  },
  {
    data: '2015',
    tag: "JEP's",
    titulo: 'Pedágio solidário pelo handebol de Melgaço',
    texto:
      'Atletas e comunidade se uniram em um pedágio solidário para viabilizar a participação nos Jogos Escolares do Pará. (Conteúdo provisório.)',
    img: '/midia/eventos/jeps-2015.jpg',
  },
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
      'Oficinas que levam o handebol às escolas e comunidades, ensinando desde "conhecer o jogo e a quadra" até os fundamentos técnicos — formando novos atletas e multiplicadores do esporte no Marajó. (Conteúdo provisório.)',
  },
]

// EQUIPES — fotos reais das equipes/categorias.
export const equipes = [
  { nome: 'Categoria Feminina', papel: 'Escola de Esportes', img: '/midia/eventos/equipe-feminina.jpg' },
  { nome: 'Categorias de Base', papel: 'Jovens atletas', img: '/midia/eventos/equipe-medalhas.jpg' },
  { nome: 'Equipe Adulto', papel: 'Representando o Marajó', img: '/midia/eventos/equipe-masculina.jpg' },
  { nome: 'Nossos Campeões', papel: 'Conquistas em quadra', img: '/midia/eventos/campeoes-trofeu.jpg' },
]

// RECONHECIMENTOS — prêmios reais (imagens enviadas).
export const reconhecimentos = [
  {
    titulo: 'Prêmio Itaú-Unicef 2018 — Semifinalista',
    descricao: 'Categoria 1: OSC em Ação — projeto "Escola de Esportes: No Esporte com Valores".',
    img: '/midia/marca/premio-itau-2018.jpg',
  },
  {
    titulo: 'Prêmio Itaú-Unicef 2015 — Semifinalista',
    descricao: 'Educação Integral: Aprendizagem que Transforma — projeto "Semear Hand".',
    img: '/midia/marca/premio-itau-2015.jpg',
  },
]

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

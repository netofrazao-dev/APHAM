// ============================================================================
//  Páginas montadas a partir dos folders e documentos oficiais da APHAM.
//  Os textos foram tirados dos próprios PDFs (public/midia/documentos/).
//  O visual fica em src/components/FolderPage.jsx.
//
//  Campos de cada página:
//    eyebrow, titulo, descricao  → cabeçalho da página
//    capa { img, alt, cheia }    → imagem da apresentação (cheia = foto ocupando o card)
//    lema, resumo                → texto ao lado da capa
//    doc, rotuloDoc              → PDF (botões "Ver"/"Baixar")
//    links [{ to, rotulo }]      → botões para outras páginas do site (ex.: galeria)
//    numeros [{ valor, label }]  → destaques em números
//    blocos [...]                → seções (tipos: colunas, texto, cards, datas, artigos, memoria, imagem, destaque, dados)
//    citacao { texto, autor }    → frase do folder
//    paginas [...]               → imagens das páginas do PDF (prévia clicável)
//    ficha [{ nome | nomes, cargo }]
// ============================================================================

// MARAJÓ SOLIDÁRIO — ação de distribuição de alimentos na pandemia de COVID-19.
export const marajoSolidario = {
  eyebrow: 'Ação social',
  titulo: 'Marajó Solidário',
  descricao: 'A maior ação de distribuição de alimentos do Marajó durante a pandemia de COVID-19.',
  capa: { img: '/midia/marajo-solidario/logo-marajo-solidario.jpg', alt: 'Marajó Solidário — Em favor de todos que necessitam!' },
  lema: 'Em favor de todos que necessitam!',
  resumo:
    'A maior ação de distribuição de alimentos do Marajó durante a pandemia de COVID-19. Por meio da Ação MARAJÓ Solidário!, a APHAM levou cerca de 20 toneladas de alimentos aos 16 municípios da Região de Integração do Marajó, atendendo famílias de crianças, adolescentes e jovens em situação de vulnerabilidade social.',
  doc: '/midia/documentos/folder-marajo-solidario.pdf',
  rotuloDoc: 'Ver o folder da ação',
  links: [{ to: '/galeria/marajo-solidario', rotulo: 'Ver fotos e vídeos' }],
  numeros: [
    { valor: '19,5 t', label: 'de alimentos não perecíveis' },
    { valor: '16', label: 'municípios do Marajó atendidos' },
    { valor: '2.200', label: 'kits de alimentação para famílias de Breves' },
    { valor: 'Dez/2020', label: 'a Jan/2021 — período de distribuição' },
  ],
  blocos: [
    {
      tipo: 'colunas',
      colunas: [
        {
          titulo: 'Como a ação aconteceu',
          paragrafos: [
            'Em 2020, após celebrar sua 1ª década de existência, a APHAM passou por um processo criterioso de inscrição, análise e seleção e entrou na Plataforma Juntos Pelas Crianças — rede de organizações que trabalha pela proteção de crianças e adolescentes e contra a violência, com atuação em todos os estados do país.',
            'Com essa aprovação, a plataforma indicou a APHAM para fazer parte da Campanha Brasil Acolhedor, do Programa Federal Pátria Voluntária. O ingresso nessa ação possibilitou chegar ao povo marajoara, no período de crise socioeconômica e de saúde pública causada pela COVID-19, com aproximadamente 20 toneladas de alimentos.',
          ],
        },
        {
          titulo: 'Objetivo',
          paragrafos:
            'Criar uma rede articulada para a distribuição de alimentos não perecíveis para famílias de crianças, adolescentes e jovens em condição de vulnerabilidade social, a partir da identificação de instituições sociais — sem atrelamento político-partidário e sem fins lucrativos — com reconhecido prestígio e atuação social na comunidade marajoara.',
          caixas: [
            { rotulo: 'Promoção', texto: 'Pátria Voluntária · Brasil Acolhedor' },
            { rotulo: 'Apoio', texto: 'Pátria Amada Brasil — Governo Federal · Juntos Pelas Crianças' },
          ],
        },
      ],
    },
    {
      tipo: 'cards',
      titulo: 'Como os alimentos foram distribuídos',
      icone: 'heart',
      itens: [
        { titulo: '8 toneladas', texto: 'distribuídas entre os 16 municípios da Região de Integração do Marajó, através das dioceses e paróquias locais.' },
        { titulo: '4 toneladas', texto: 'distribuídas entre projetos e ações sociais da região, pré-identificados pelo cadastramento da Ação MARAJÓ Solidário!.' },
        { titulo: '8 toneladas', texto: 'para montar 2.200 kits de alimentação, entregues às famílias cadastradas pela APHAM em Breves, nas zonas urbana e rural.' },
      ],
      datas: {
        titulo: 'Período de distribuição',
        itens: [
          { titulo: '16 municípios da Região de Integração do Marajó', texto: '2ª quinzena de dezembro de 2020 a 2ª quinzena de janeiro de 2021' },
          { titulo: 'Organizações sociais e instituições filantrópicas do Marajó Ocidental', texto: '2ª quinzena de dezembro de 2020' },
        ],
      },
    },
    {
      tipo: 'destaque',
      rotulo: 'Galeria',
      titulo: 'A ação em imagens e vídeos',
      img: '/midia/marajo-solidario/logo-marajo-solidario.jpg',
      paragrafos: ['Veja os registros da distribuição de alimentos nos municípios do Marajó — fotos e vídeos da Ação Marajó Solidário.'],
      link: { to: '/galeria/marajo-solidario', rotulo: 'Abrir a galeria da ação' },
    },
  ],
  citacao: {
    texto: 'Amados, amemos uns aos outros, pois o amor procede de Deus. Aquele que ama é nascido de Deus e conhece a Deus.',
    autor: 'I João 4:7',
  },
  tituloPaginas: 'Folder da ação',
  paginas: ['/midia/marajo-solidario/folder-pagina-1.jpg', '/midia/marajo-solidario/folder-pagina-2.jpg'],
  ficha: [
    { nome: 'Genésio Jorge de Oliveira Pena', cargo: 'Presidente da APHAM' },
    { nome: 'Claybe Fernando Furtado Cirino', cargo: 'Coordenador de Projetos da APHAM' },
    { nome: 'Érico dos Santos Santiago', cargo: 'Coordenador da Ação Marajó Solidário' },
  ],
}

// DOCUMENTÁRIO — "Handebol – Marajó – Pará: Sonhos, Trajetórias & Memórias em 10 Anos de História!"
// (Os capítulos do YouTube ficam em `documentario.capitulos`, em content.js.)
export const documentarioFolder = {
  eyebrow: 'Documentário',
  titulo: 'Handebol – Marajó – Pará',
  descricao: 'Sonhos, Trajetórias & Memórias em 10 Anos de História!',
  capa: { img: '/midia/documentos/capa-documentario.jpg', alt: 'Capa do documentário da APHAM', cheia: true },
  lema: 'A maior história do esporte marajoara!',
  resumo: [
    'Lançado em 2019, na celebração dos 10 anos da APHAM, o documentário conta a história social da Associação de Praticantes de Handebol do Marajó sob a ótica de seus próprios membros — com um olhar especial para o papel da juventude, entre desafios, realizações e rupturas.',
    'Dividido em 4 capítulos, ele vai da fundação da associação aos grandes eventos esportivos, passando pelo protagonismo no esporte escolar do Pará e por uma reflexão sobre os jovens que fizeram e fazem parte dos projetos da APHAM.',
  ],
  doc: '/midia/documentos/documentario.pdf',
  rotuloDoc: 'Ver o folder do documentário',
  numeros: [
    { valor: '10 anos', label: 'de história contados (2009–2019)' },
    { valor: '4', label: 'capítulos — assista aqui no site' },
    { valor: '2', label: 'sessões de lançamento: Breves e Melgaço' },
    { valor: '2019', label: 'ano de lançamento' },
  ],
  blocos: [
    {
      tipo: 'colunas',
      colunas: [
        {
          titulo: 'Apresentação',
          paragrafos: [
            'A APHAM, associação de caráter esportivo, sócio e educativo, desde 2009 desenvolve atividades e projetos sociais junto ao público infantil, juvenil e adulto na região marajoara, com o objetivo de promover o reconhecimento, o desenvolvimento, o fortalecimento e a afirmação do handebol amador e escolar — por meio de valores socialmente significativos, ancorados na formação ética e cidadã.',
            'Durante uma década, o trabalho social da APHAM — eventos, torneios, copas, oficinas e projetos em parceria com escolas públicas dos municípios do Marajó — abarcou centenas de cidadãos e cidadãs, gerando aprendizagens, mudanças, amizades e vínculos inseparáveis pelo amor à causa esportiva e, principalmente, ao handebol.',
            'Frente à câmera, o documentário revela como, nessa década, sonhos, perspectivas e conquistas — mas também dúvidas, tragédias e frustrações — transformaram a vida de jovens e de suas famílias.',
          ],
        },
        {
          titulo: 'Sinopse',
          paragrafos: [
            'Retrata a história social da APHAM contada por seus membros efetivos. Passa pela origem da associação, no depoimento dos membros fundadores — das motivações iniciais à decisão de fundar a APHAM —, até a realização de grandes eventos esportivos que repercutiram na região marajoara e no estado do Pará, construindo uma imagem social de reconhecida credibilidade.',
            'Mostra também a construção de uma proposta pedagógica que reestruturou as metas da APHAM e se firmou na parceria com escolas públicas, levando alunos-atletas das equipes de handebol das escolas Estevão Gomes (Breves) e Tancredo Neves (Melgaço) ao protagonismo do esporte escolar no Pará.',
            'Por fim, reflete sobre como estão hoje os jovens que passaram pelos projetos da associação e reafirma um novo compromisso com a juventude marajoara.',
          ],
        },
      ],
    },
    {
      tipo: 'cards',
      titulo: 'O que o documentário aborda',
      icone: 'film',
      itens: [
        { titulo: 'A origem', texto: 'O nascimento da APHAM contado pelos membros fundadores: as motivações iniciais e a decisão de criar a associação.' },
        { titulo: 'Os grandes eventos', texto: 'Competições que repercutiram no Marajó e em todo o Pará e consolidaram a credibilidade da associação.' },
        { titulo: 'Esporte e escola', texto: 'A proposta pedagógica em parceria com escolas públicas e o protagonismo no esporte escolar do estado.' },
        { titulo: 'A juventude da APHAM', texto: 'Como estão hoje os jovens que fizeram e fazem parte dos projetos, diante dos desafios da sociedade atual.' },
        { titulo: 'Um novo compromisso', texto: 'O sonho ainda maior projetado para a próxima década da grande família do esporte marajoara.' },
      ],
    },
    {
      tipo: 'memoria',
      titulo: 'Em memória',
      nomes: ['Heron Machado', 'Ianca Fabrine', 'Daniel Sousa', 'Sebastian_SAF', 'Edson Renê'],
      paragrafos: [
        'O documentário lembra a perda precoce de cinco jovens integrantes dos projetos da associação — quatro deles vítimas de violência letal.',
        'Em sua memória, a APHAM reafirma o compromisso ético, moral e social de sempre reinventar e ressignificar suas ações, para que muitos outros jovens possam viver suas vidas em plenitude e com protagonismo — sem nunca serem interrompidas.',
      ],
    },
    {
      tipo: 'datas',
      titulo: 'Lançamento',
      itens: [
        { titulo: 'Breves — 01 de novembro de 2019, às 19h', texto: 'Sub Sede do SINTEPP', detalhe: 'Avenida Portel / Cidade Nova' },
        { titulo: 'Melgaço — 08 de novembro de 2019, às 19h', texto: 'Sub Sede do SINTEPP', detalhe: 'Rua Santos Dumont, s/n — Centro' },
      ],
    },
  ],
  citacao: { texto: 'Os sonhos existem para tornarem-se realidade.', autor: 'Walt Disney' },
  tituloPaginas: 'Folder do documentário',
  paginas: ['/midia/folders/documentario-1.jpg', '/midia/folders/documentario-2.jpg'],
  ficha: [
    { nomes: ['Associação de Praticantes de Handebol do Marajó', 'RH Mídia'], cargo: 'Produção' },
    { nomes: ['Claybe Fernando Furtado Cirino', 'Genésio Jorge de Oliveira Pena'], cargo: 'Roteiro & direção' },
    { nomes: ['Walber Miranda Mota', 'Lucas Brilhante'], cargo: 'Edição' },
    { nome: 'Matheus Viegas', cargo: 'Arte visual' },
    { nome: 'Rubenil Miranda', cargo: 'Reportagens e imagens' },
    { nomes: ['Claybe Fernando Furtado Cirino', 'Walber Miranda Mota'], cargo: 'Pesquisa e fundamentação' },
  ],
}

// COOPERATIVA SOCIAL — COOPTE*SE/APHAM e a marca Socialplay.
export const cooperativaFolder = {
  eyebrow: 'Cooperativa Social',
  titulo: 'COOPTE*SE / APHAM',
  descricao: 'Cooperativa de Tecnologia Social e Empreendedorismo da APHAM — Para além do Jogo!',
  capa: { img: '/midia/folders/cooperativa-capa.jpg', alt: 'COOPTE*SE — Para além do Jogo!', cheia: true },
  lema: 'Para além do Jogo!',
  resumo: [
    'A COOPTE*SE é o braço prático da APHAM para abrir caminhos no mundo do trabalho: uma cooperativa social que transforma o potencial humano e criativo dos jovens atletas e associados em força produtiva real, com autonomia, dignidade e novas perspectivas de futuro.',
    'Sua marca comercial é a Socialplay — o conceito de “Jogo Social” —, uma marca de roupas e acessórios que nasce no esporte e vai além dele.',
  ],
  doc: '/midia/documentos/cooperativa-social.pdf',
  rotuloDoc: 'Ver o folder da cooperativa',
  numeros: [
    { valor: '4', label: 'pilares de atuação da cooperativa' },
    { valor: '2/3', label: 'dos resultados com retorno direto aos cooperados' },
    { valor: '1/3', label: 'para a sustentabilidade da cooperativa' },
    { valor: 'Lei 9.867', label: 'de 1999 — modelo de cooperativa social' },
  ],
  blocos: [
    {
      tipo: 'colunas',
      colunas: [
        {
          titulo: 'Por que a cooperativa existe',
          paragrafos: [
            'A Socialplay surge como resposta estratégica às desigualdades socioeconômicas que afetam a população marajoara. Diante da escassez de políticas para a juventude e das poucas opções de emprego formal, nossos jovens enfrentam barreiras para entrar no mercado de trabalho.',
            'Essa realidade exige soluções inovadoras, que superem o assistencialismo tradicional. Sob o lema “Para além do Jogo!”, o projeto mostra que, com o esporte, a transformação apenas começa: ir além do jogo é aplicar a energia esportiva na emancipação integral da juventude marajoara.',
          ],
        },
        {
          titulo: 'Objetivo geral',
          paragrafos: [
            'Promover a inclusão produtiva, a autonomia financeira e a emancipação social dos jovens atletas e associados da APHAM, estruturando e consolidando a COOPTE*SE/APHAM — e transformando o potencial criativo e a força do coletivo em um arranjo econômico rentável e sustentável, capaz de impulsionar a marca Socialplay.',
            'O objetivo é consolidar a Socialplay não só como marca de roupas e acessórios, mas como um produto rentável e autossuficiente, que transforma a prática do jogo em plataforma de cidadania.',
          ],
          caixas: [
            { rotulo: 'Promoção', texto: 'APHAM — Associação de Praticantes de Handebol do Marajó' },
            { rotulo: 'Apoio', texto: 'Secretaria de Educação — Prefeitura de Breves' },
          ],
        },
      ],
    },
    {
      tipo: 'cards',
      titulo: 'Os quatro pilares',
      intro: 'A COOPTE*SE/APHAM se estrutura em quatro pilares fundamentais para o sucesso do projeto.',
      icone: 'sprout',
      itens: [
        { titulo: 'Tecnologia Social', texto: 'Uma metodologia replicável que une o esporte à qualificação prática. Os jovens conhecem o vestuário conceito — principal frente da Socialplay no e-commerce — e atuam nas economias criativa e digital.' },
        { titulo: 'Empreendedorismo', texto: 'Capacitação técnica para os desafios do mercado: gestão de negócios, vendas, marcas, finanças e administração prática de novas frentes.' },
        { titulo: 'Economia Solidária', texto: 'Autogestão e comércio justo. Cooperativa social respaldada pela Lei nº 9.867/1999, com rateio de 1/3 para a cooperativa e 2/3 para os cooperados.' },
        { titulo: 'Desenvolvimento Regional', texto: 'Fixa a juventude no território e gera riqueza no Marajó, criando uma alternativa sustentável à falta de vagas de trabalho, integrada à identidade cultural da região.' },
      ],
    },
    {
      tipo: 'colunas',
      colunas: [
        {
          titulo: 'COOPTE*SE: para além da sigla',
          paragrafos: [
            'O nome vai além de um acrônimo para “Cooperativa de Tecnologia Social e Empreendedorismo”. “Coopte-se” é o verbo cooptar no imperativo, com o pronome reflexivo “se”: significa agregar, atrair ou admitir alguém em um grupo, sem as barreiras de uma seleção tradicional.',
            'Em suma, a COOPTE*SE é o ato de cooptar a juventude para dentro de um ecossistema de dignidade, gerando riqueza e agregando valor à realidade local.',
          ],
        },
        {
          titulo: 'Por que o asterisco?',
          paragrafos: [
            'O asterisco estilizado resolve a legibilidade da sigla e transforma a marca em um manifesto visual — um chamado à ação.',
            'Ele divide o coletivo que acolhe (COOPTE) e o indivíduo que se emancipa (SE), fazendo do próprio logotipo o primeiro contato com a metodologia de inclusão participativa da cooperativa.',
          ],
        },
      ],
    },
  ],
  citacao: { texto: 'Transportai um punhado de terra todos os dias e fareis uma montanha.', autor: 'Confúcio' },
  tituloPaginas: 'Folder da cooperativa',
  paginas: ['/midia/folders/cooperativa-social-1.jpg', '/midia/folders/cooperativa-social-2.jpg'],
}

// RECONHECIMENTOS — uma página para cada item de `reconhecimentos` (content.js),
// pela mesma chave `slug`.
export const reconhecimentosDetalhes = {
  'premio-itau-unicef-2015': {
    eyebrow: 'Prêmio Itaú-Unicef · 2015',
    titulo: 'Semifinalista do Prêmio Itaú-Unicef 2015',
    descricao: 'Projeto SEMEAR HAND — Cultivando Valores pelo Esporte e para a Vida.',
    capa: { img: '/midia/marca/premio-itau-2015.jpg', alt: 'Selo Prêmio Itaú-Unicef 2015 — Semifinalista' },
    lema: 'Educação Integral: Aprendizagem que Transforma',
    resumo: [
      'Em 2015, o Projeto SEMEAR HAND concorreu na 11ª edição do Prêmio Itaú-Unicef pela Região Norte e ficou entre os 5 semifinalistas regionais, entre 1.947 iniciativas inscritas em todo o Brasil.',
      'Com isso, a APHAM e a escola parceira — a E.E.E.F.M. Presidente Tancredo de Almeida Neves, de Melgaço/PA — conquistaram o direito de usar o Selo Itaú-Unicef.',
    ],
    doc: '/midia/documentos/selo-2015.pdf',
    rotuloDoc: 'Ver o folder',
    numeros: [
      { valor: '11ª', label: 'edição do Prêmio Itaú-Unicef' },
      { valor: '1.947', label: 'iniciativas inscritas no Brasil' },
      { valor: 'Top 5', label: 'semifinalistas da Região Norte' },
      { valor: '2009', label: 'início da parceria com a escola' },
    ],
    blocos: [
      {
        tipo: 'colunas',
        colunas: [
          {
            titulo: 'Sobre o prêmio',
            paragrafos: [
              'O Prêmio Itaú-Unicef nasceu em 1995 para apoiar e fortalecer iniciativas de Organizações da Sociedade Civil (OSC) em parceria com escolas públicas que favoreçam o desenvolvimento integral de crianças e jovens em vulnerabilidade socioeconômica. A premiação acontece a cada dois anos.',
              'As comissões avaliam a garantia de oportunidades de desenvolvimento para crianças e adolescentes, a relevância do projeto no contexto local, os resultados alcançados, o potencial de transformação social e o caráter inovador.',
              'Cada parceria OSC/escola classificada a partir das semifinais recebe um Selo de Certificação, que pode ser usado em projetos, pedidos de financiamento, parcerias e materiais de divulgação.',
            ],
          },
          {
            titulo: 'Sobre o Semear Hand',
            paragrafos: [
              'O Projeto SEMEAR HAND — Cultivando Valores pelo Esporte e para a Vida é uma ação socioformativa da APHAM que, desde 2009, encontrou na parceria com a E.E.E.F.M. Presidente Tancredo de Almeida Neves terreno fértil para unir ESPORTE & EDUCAÇÃO.',
              'É um projeto de formação integral de alunos e alunas atletas, na perspectiva do desenvolvimento técnico, ético e essencialmente cidadão.',
            ],
            caixas: [
              { rotulo: 'Escola parceira', texto: 'E.E.E.F.M. Presidente Tancredo de Almeida Neves — Melgaço/PA' },
              { rotulo: 'Apoio', texto: 'Pedagogia do Handebol · FHEPA · CMDCA Melgaço' },
            ],
          },
        ],
      },
      {
        tipo: 'cards',
        titulo: 'Como o projeto funciona',
        intro:
          'Objetivo educacional: proporcionar práticas sociais significativas que ajudem a formar personalidades éticas e a afirmar posturas responsáveis frente aos desafios postos aos jovens da nossa comunidade.',
        icone: 'book',
        itens: [
          { titulo: 'Oficinas Pedagógicas de Handebol', texto: 'Formação em 5 módulos de estudo da teoria do jogo — histórico, técnico e tático —, visando o desenvolvimento integral do aluno-atleta.' },
          { titulo: 'Acompanhamento Socioeducativo', lista: ['Monitoramento do rendimento escolar', 'Visitas regulares às residências dos alunos', 'Encontros de formação com a família'] },
          { titulo: 'Treinamento Desportivo', texto: 'Trabalho regular de formação e desenvolvimento técnico, orientado pelos módulos das Oficinas Pedagógicas de Handebol.' },
        ],
      },
    ],
    citacao: { texto: 'Para tudo há um tempo, para cada coisa há um momento debaixo dos céus.', autor: 'Eclesiastes 3:1' },
    tituloPaginas: 'Folder do prêmio',
    paginas: ['/midia/folders/selo-2015-1.jpg', '/midia/folders/selo-2015-2.jpg'],
    ficha: [
      { nome: 'Semaias Miranda Melo', cargo: 'Presidente da APHAM' },
      { nome: 'Hélio Pena Baía', cargo: 'Diretor da E.E.E.F.M. Tancredo de A. Neves' },
      { nome: 'Claybe Fernando Furtado Cirino', cargo: 'Coordenador do projeto Semear Hand' },
    ],
  },

  'premio-itau-unicef-2018': {
    eyebrow: 'Prêmio Itaú-Unicef · 2018',
    titulo: 'Semifinalista do Prêmio Itaú-Unicef 2018',
    descricao: 'Projeto Escola de Esportes — No Esporte com Valores: Educação e Promoção Social para a Juventude!',
    capa: { img: '/midia/marca/premio-itau-2018.jpg', alt: 'Selo Prêmio Itaú-Unicef 2018 — Semifinalista' },
    lema: 'Categoria 1: OSC em Ação',
    resumo: [
      'Na 13ª edição do Prêmio Itaú-Unicef, com 3.514 iniciativas sociais inscritas, o Projeto Escola de Esportes ficou entre as 12 melhores ações socioeducativas da Região Norte e entre as 100 melhores iniciativas do Brasil.',
      'Foi o segundo selo da APHAM em apenas três anos — mérito atribuído a poucas organizações no Marajó, região com alguns dos mais baixos indicadores de desenvolvimento humano e social do país.',
    ],
    doc: '/midia/documentos/selo-2018.pdf',
    rotuloDoc: 'Ver o folder',
    numeros: [
      { valor: '13ª', label: 'edição do Prêmio Itaú-Unicef' },
      { valor: '3.514', label: 'iniciativas sociais inscritas' },
      { valor: 'Top 12', label: 'da Região Norte' },
      { valor: 'Top 100', label: 'do Brasil' },
    ],
    blocos: [
      {
        tipo: 'colunas',
        colunas: [
          {
            titulo: 'Dois selos em três anos',
            paragrafos: [
              'Em 2015, com o Projeto SEMEAR HAND, a APHAM já havia se qualificado como semifinalista na 11ª edição do prêmio — entre 1.947 iniciativas avaliadas pela Fundação Itaú Social e pelo UNICEF, sob a coordenação do CENPEC (Centro de Estudos e Pesquisas em Educação, Cultura e Ação Comunitária).',
              'Em 2018, mais uma ação da associação foi reconhecida como uma iniciativa que contribui positiva e significativamente para mudar a realidade de crianças e jovens da região — garantindo novamente o direito de usar o Selo Itaú-Unicef.',
              'Uma conquista que só foi possível pela crença inabalável no compromisso da APHAM com políticas efetivas para crianças e jovens, em parceria com a escola pública.',
            ],
          },
          {
            titulo: 'Sobre a Escola de Esportes',
            paragrafos: [
              'O projeto mantém a estrutura pedagógica do SEMEAR HAND e trabalha a partir do esporte escolar pela inclusão social do público infantojuvenil, pelo enfrentamento do fracasso escolar e pela educação em tempo integral.',
              'Além do handebol, o projeto incluiu o futsal, por causa da grande procura na comunidade, com turmas regulares nas duas modalidades e carga horária semanal dividida em treinamento desportivo, educação cidadã e reforço escolar.',
            ],
            caixas: [
              { rotulo: 'Modalidades', texto: 'Handebol · Futsal' },
              { rotulo: 'Apoio', texto: 'CMDCA Melgaço · Pedagogia do Handebol' },
            ],
          },
        ],
      },
      {
        tipo: 'cards',
        titulo: 'Como o projeto funciona',
        intro:
          'Objetivo educacional: consolidar, dentro da escola, práticas sociais que formem personalidades éticas — vendo o aluno como atleta-cidadão, com formação para a vida e valores socialmente significativos pela prática esportiva.',
        icone: 'school',
        itens: [
          { titulo: 'OPIES', texto: 'Oficinas Pedagógicas de Iniciação e Especialização nas diferentes modalidades esportivas.' },
          { titulo: 'Acompanhamento Socioeducativo', lista: ['Monitoramento dos alunos', 'Acompanhamento familiar', 'Encontros com a família', 'Aulas de reforço escolar e educação cidadã'] },
          { titulo: 'Treinamento Desportivo', texto: 'Trabalho diário de formação técnica, com métodos e técnicas para desenvolver as atitudes individuais e coletivas de um atleta-cidadão.' },
        ],
      },
    ],
    citacao: {
      texto: 'Se você quiser um ano de prosperidade, cultive grãos. Se você quiser dez anos de prosperidade, cultive árvores. Mas se você quiser cem anos de prosperidade, cultive gente.',
      autor: 'Provérbio chinês',
    },
    tituloPaginas: 'Folder do prêmio',
    paginas: ['/midia/folders/selo-2018-1.jpg', '/midia/folders/selo-2018-2.jpg'],
    outrosDocs: [{ titulo: 'Horários das turmas da Escola de Esportes (PDF)', href: '/midia/documentos/horarios-escola-esportes.pdf' }],
    ficha: [
      { nome: 'Genésio Jorge de Oliveira Pena', cargo: 'Presidente da APHAM' },
      { nome: 'Claybe Fernando Furtado Cirino', cargo: 'Coordenador do Projeto Escola de Esportes' },
    ],
  },

  'utilidade-publica-estadual': {
    eyebrow: 'Utilidade pública · Estado do Pará',
    titulo: 'Utilidade Pública Estadual',
    descricao: 'Lei Estadual nº 10.594, de 20 de junho de 2024.',
    capa: { img: '/midia/marca/brasao-para.jpg', alt: 'Brasão do Estado do Pará' },
    lema: 'Reconhecimento oficial do Estado do Pará',
    resumo: [
      'A APHAM é declarada e reconhecida como entidade de utilidade pública para o Estado do Pará pela Lei nº 10.594, de 20 de junho de 2024, sancionada pelo Governador Helder Barbalho.',
      'É o reconhecimento oficial, em nível estadual, do trabalho social e esportivo que a associação realiza no Marajó desde 2009.',
    ],
    doc: '/midia/documentos/utilidade-publica.pdf',
    rotuloDoc: 'Ver a lei',
    numeros: [
      { valor: 'Lei 10.594', label: 'Lei Estadual' },
      { valor: 'Jun/2024', label: 'sancionada em 20 de junho de 2024' },
      { valor: 'PL 279/24', label: 'projeto de lei de 04/06/2024' },
    ],
    blocos: [
      {
        tipo: 'artigos',
        titulo: 'O que diz a lei',
        ementa:
          'Declara e reconhece como de utilidade pública para o Estado do Pará a Associação de Praticantes de Handebol do Marajó (APHAM), com sede e foro na Cidade de Breves.',
        itens: [
          { rotulo: 'Art. 1º', texto: 'Fica declarada e reconhecida como de utilidade pública para o Estado do Pará, na forma da Lei Estadual nº 4.321, de 03 de setembro de 1970, e suas alterações, a Associação de Praticantes de Handebol do Marajó (APHAM), com sede na Passagem da Saudade, nº 103, Centro, com foro na Comarca de sua jurisdição.' },
          { rotulo: 'Parágrafo único.', texto: 'A inobservância das disposições legais fará cessar, a qualquer tempo, a presente utilidade pública.' },
          { rotulo: 'Art. 2º', texto: 'Esta Lei entra em vigor na data de sua publicação.' },
        ],
      },
      {
        tipo: 'datas',
        titulo: 'Tramitação',
        itens: [
          { titulo: '04 de junho de 2024', texto: 'Data do Projeto de Lei nº 279/24, que tramitou na Assembleia Legislativa do Estado do Pará (ALEPA).' },
          { titulo: '20 de junho de 2024', texto: 'Lei sancionada pelo Governador Helder Barbalho e comunicada à ALEPA pelo Ofício nº 370/2024-GG.' },
        ],
      },
    ],
    tituloPaginas: 'Documento oficial',
    paginas: ['/midia/folders/utilidade-publica-1.jpg', '/midia/folders/utilidade-publica-2.jpg'],
  },

  'utilidade-publica-municipal': {
    eyebrow: 'Utilidade pública · Breves',
    titulo: 'Utilidade Pública Municipal',
    descricao: 'Lei Municipal nº 2.527, de 17 de dezembro de 2018 — Breves/PA.',
    capa: { img: '/midia/marca/brasao-breves.jpg', alt: 'Brasão de Breves' },
    lema: 'Reconhecimento oficial do município de Breves',
    resumo: [
      'A APHAM é declarada de utilidade pública para o município de Breves pela Lei nº 2.527, de 17 de dezembro de 2018, “pelos relevantes serviços prestados junto ao desporto e à cultura do município”.',
      'O projeto de lei nº 024/2018, de autoria do vereador Luís Afonso Brandão de Oliveira, foi aprovado pela Câmara Municipal e sancionado pelo prefeito em exercício, Vilson Fernandes Mainardi.',
    ],
    doc: '/midia/documentos/utilidade-publica-municipal.pdf',
    rotuloDoc: 'Ver a lei',
    numeros: [
      { valor: 'Lei 2.527', label: 'Lei Municipal de Breves' },
      { valor: 'Dez/2018', label: 'sancionada em 17 de dezembro de 2018' },
      { valor: 'PL 024/2018', label: 'aprovado em 16/11/2018' },
    ],
    blocos: [
      {
        tipo: 'artigos',
        titulo: 'O que diz a lei',
        ementa: 'Declara a Associação de Praticantes de Handebol do Marajó – APHAM de utilidade pública para o município de Breves e dá outras providências.',
        itens: [
          { rotulo: 'Art. 1º', texto: 'Fica declarada de utilidade pública para o município de Breves a Associação de Praticantes de Handebol do Marajó – APHAM, com sede e foro neste município, pelos relevantes serviços prestados junto ao desporto e à cultura do município.' },
          { rotulo: 'Art. 2º', texto: 'As despesas decorrentes do fiel cumprimento desta Lei serão de responsabilidade do Poder Executivo.' },
          { rotulo: 'Art. 3º', texto: 'Esta Lei entrará em vigor na data de sua publicação, revogadas as disposições em contrário.' },
        ],
      },
      {
        tipo: 'datas',
        titulo: 'Tramitação',
        itens: [
          { titulo: '16 de novembro de 2018', texto: 'Projeto de Lei nº 024/2018, do vereador Luís Afonso Brandão de Oliveira, aprovado pela Câmara Municipal em sessão extraordinária.' },
          { titulo: '17 de dezembro de 2018', texto: 'Lei sancionada e promulgada pelo prefeito em exercício, Vilson Fernandes Mainardi, no Palácio Executivo “Floriano Pinto Gonçalves”.' },
        ],
      },
    ],
    tituloPaginas: 'Documento oficial',
    paginas: ['/midia/folders/utilidade-publica-municipal-1.jpg'],
  },

  'experiencias-em-rede': {
    eyebrow: 'Certificação · Itaú Social',
    titulo: 'Certificado Experiências em Rede',
    descricao: 'Práticas educativas e colaborativas entre as OSCs na pandemia — 2021.',
    capa: { img: '/midia/marca/experiencias-em-rede.png', alt: 'Experiências em Rede — Itaú Social' },
    lema: 'Itaú Social · 2021',
    resumo: [
      'O Itaú Social certifica que a APHAM participou do projeto “Experiências em Rede: práticas educativas e colaborativas entre as OSCs na pandemia”, no ano de 2021.',
      'É o registro da participação da associação na troca de práticas educativas e colaborativas entre organizações da sociedade civil durante a pandemia de COVID-19 — o mesmo período em que a APHAM realizou a Ação Marajó Solidário.',
    ],
    doc: '/midia/documentos/certificado-experiencias-rede.pdf',
    rotuloDoc: 'Ver o certificado',
    numeros: [
      { valor: '2021', label: 'ano de participação' },
      { valor: 'Itaú Social', label: 'organização certificadora' },
      { valor: 'Dez/2021', label: 'emitido em São Paulo, 15/12/2021' },
    ],
    blocos: [],
    tituloPaginas: 'Certificado',
    paginas: ['/midia/folders/certificado-experiencias-rede-1.jpg'],
    ficha: [{ nome: 'Camila Feldberg', cargo: 'Itaú Social — assinatura do certificado' }],
    tituloFicha: 'Assinatura',
  },
}

// PROJETOS — uma página para cada item de `projetos.lista` (content.js), pela
// chave `slug`. Os projetos não têm folder próprio: o Semear Hand usa os folders
// dos prêmios Itaú-Unicef e do documentário; a Escola de Esportes usa a Proposta
// Político-Pedagógica (PPP) 2026 do projeto, além do folder do prêmio de 2018.
export const projetosDetalhes = {
  'semear-hand': {
    eyebrow: 'Projeto',
    titulo: 'Semear Hand',
    descricao: 'Cultivando Valores pelo Esporte e para a Vida!',
    capa: { img: '/midia/marca/logo-semear-hand.jpg', alt: 'Logo do projeto Semear Hand' },
    lema: 'Esporte & Educação desde 2009',
    resumo: [
      'O SEMEAR HAND é a ação socioformativa que deu origem ao trabalho pedagógico da APHAM. Desde 2009, em parceria com a E.E.E.F.M. Presidente Tancredo de Almeida Neves, em Melgaço, une ESPORTE & EDUCAÇÃO na formação integral de alunos e alunas atletas.',
      'O objetivo é o desenvolvimento técnico, ético e essencialmente cidadão — formar atletas e, acima de tudo, pessoas.',
    ],
    numeros: [
      { valor: '2009', label: 'início da parceria com a escola' },
      { valor: '5', label: 'módulos de estudo da teoria do jogo' },
      { valor: 'Top 5', label: 'da Região Norte no Prêmio Itaú-Unicef 2015' },
      { valor: '1.947', label: 'iniciativas concorrentes no Brasil' },
    ],
    blocos: [
      {
        tipo: 'colunas',
        colunas: [
          {
            titulo: 'Sobre o projeto',
            paragrafos: [
              'O Projeto SEMEAR HAND — Cultivando Valores pelo Esporte e para a Vida encontrou na parceria com a E.E.E.F.M. Presidente Tancredo de Almeida Neves terreno fértil para disseminar, pela relação entre esporte e educação, um projeto de formação integral de alunos-atletas.',
              'Os alunos-atletas das equipes de handebol das escolas parceiras chegaram, em determinado momento, ao protagonismo do esporte escolar no estado do Pará — uma trajetória contada no documentário da APHAM.',
              'A estrutura pedagógica do Semear Hand é a base do Projeto Escola de Esportes, que ampliou o trabalho a partir de 2018.',
            ],
            caixas: [
              { rotulo: 'Escola parceira', texto: 'E.E.E.F.M. Presidente Tancredo de Almeida Neves — Melgaço/PA' },
              { rotulo: 'Apoio', texto: 'Pedagogia do Handebol · FHEPA · CMDCA Melgaço' },
            ],
          },
          {
            titulo: 'Objetivo educacional',
            paragrafos: [
              'Proporcionar a vivência de práticas sociais significativas que ajudem a formar personalidades éticas e a reconhecer e afirmar posturas e condutas responsáveis diante dos inúmeros desafios que a sociedade impõe aos jovens da nossa comunidade.',
            ],
            lista: [
              'Formação técnica no handebol',
              'Acompanhamento da vida escolar',
              'Participação da família',
              'Valores dentro e fora da quadra',
            ],
          },
        ],
      },
      {
        tipo: 'imagem',
        src: '/midia/projetos/semear-hand-foto.jpg',
        legenda: 'Semear Hand — handebol e educação na formação de alunos-atletas.',
      },
      {
        tipo: 'cards',
        titulo: 'Como o projeto funciona',
        intro: 'O Semear Hand se organiza em três frentes que caminham juntas.',
        icone: 'book',
        itens: [
          { titulo: 'Oficinas Pedagógicas de Handebol', texto: 'Formação em 5 módulos de estudo da teoria do jogo — histórico, técnico e tático —, visando o desenvolvimento integral do aluno-atleta.' },
          { titulo: 'Acompanhamento Socioeducativo', lista: ['Monitoramento do rendimento escolar', 'Visitas regulares às residências dos alunos', 'Encontros de formação com a família'] },
          { titulo: 'Treinamento Desportivo', texto: 'Trabalho regular de formação e desenvolvimento técnico, orientado pelos módulos das Oficinas Pedagógicas de Handebol.' },
        ],
      },
      {
        tipo: 'destaque',
        rotulo: 'Reconhecimento',
        titulo: 'Semifinalista do Prêmio Itaú-Unicef 2015',
        img: '/midia/marca/premio-itau-2015.jpg',
        paragrafos: [
          'Na 11ª edição do prêmio, o Semear Hand ficou entre os 5 semifinalistas da Região Norte, entre 1.947 iniciativas de todo o Brasil — conquistando para a APHAM e para a escola parceira o direito de usar o Selo Itaú-Unicef.',
        ],
        link: { to: '/reconhecimentos/premio-itau-unicef-2015', rotulo: 'Ver o prêmio' },
      },
      {
        tipo: 'destaque',
        rotulo: 'A continuação',
        titulo: 'O Semear Hand vive na Escola de Esportes',
        img: '/midia/marca/logo-escola-esportes.jpg',
        paragrafos: [
          'A estrutura pedagógica do Semear Hand é a base do Projeto Escola de Esportes, que ampliou o trabalho para novas modalidades, mais escolas e uma Proposta Político-Pedagógica própria.',
        ],
        link: { to: '/projetos/escola-de-esportes', rotulo: 'Conheça a Escola de Esportes' },
      },
    ],
    citacao: { texto: 'Para tudo há um tempo, para cada coisa há um momento debaixo dos céus.', autor: 'Eclesiastes 3:1' },
    ficha: [
      { nome: 'Claybe Fernando Furtado Cirino', cargo: 'Coordenador do projeto Semear Hand' },
      { nome: 'Hélio Pena Baía', cargo: 'Diretor da E.E.E.F.M. Tancredo de A. Neves (2015)' },
      { nome: 'Semaias Miranda Melo', cargo: 'Presidente da APHAM (2015)' },
    ],
  },

  'escola-de-esportes': {
    eyebrow: 'Projeto',
    titulo: 'Escola de Esportes',
    descricao: 'Aprendendo com Valores: Educação e Promoção Social para a Juventude!',
    capa: { img: '/midia/marca/logo-escola-esportes.jpg', alt: 'Logo do projeto Escola de Esportes' },
    lema: 'Proposta piloto de educação em tempo integral',
    doc: '/midia/documentos/proposta-pedagogica-escola-de-esportes-2026.pdf',
    rotuloDoc: 'Ver a Proposta Pedagógica',
    tituloPaginas: 'Proposta Político-Pedagógica 2026',
    paginas: ['/midia/folders/proposta-pedagogica-capa.jpg'],
    resumo: [
      'A Escola de Esportes atende adolescentes de 12 a 17 anos no contraturno escolar, em parceria com a escola pública, unindo esporte, reforço escolar, educação cidadã e acompanhamento das famílias.',
      'É uma proposta piloto de educação em tempo integral em Breves: tempo qualificado — e não apenas tempo ocupado — enquanto a educação integral não chega a todos. Herdeira do Semear Hand, ganhou em 2026 uma Proposta Político-Pedagógica própria, a “pedra fundamental” do projeto.',
    ],
    numeros: [
      { valor: '~100', label: 'adolescentes atendidos por ano' },
      { valor: '12–17', label: 'anos — faixa etária do projeto' },
      { valor: '3', label: 'modalidades: handebol, futsal e voleibol' },
      { valor: '4', label: 'eixos temáticos, um por bimestre' },
    ],
    blocos: [
      {
        tipo: 'colunas',
        colunas: [
          {
            titulo: 'Por que o projeto existe',
            paragrafos: [
              'No Marajó, rios e furos são as estradas: muitas crianças e adolescentes dependem de barcos para chegar à escola, e a oferta de esporte, cultura, lazer e proteção social é pequena diante da demanda.',
              'Breves tem IDHM de 0,503 (baixo) e Melgaço, onde a APHAM também atua, 0,418 — o menor do país. Nos anos finais do ensino fundamental, o Ideb é de 3,8 em Breves e 3,3 em Melgaço, contra 5,0 no Brasil.',
              'O que um adolescente faz no contraturno — se convive com adultos que o acolhem, se aprende, pratica esporte e é acompanhado — interfere na sua permanência na escola, na sua saúde e na sua proteção contra as violências.',
            ],
          },
          {
            titulo: 'Objetivo geral',
            paragrafos: [
              'Promover a formação integral de crianças, adolescentes e jovens como atletas-cidadãos — éticos, críticos, solidários e participativos — articulando esporte, educação e promoção social, em parceria com a escola pública, a família e a comunidade.',
              'No esporte educacional da APHAM, todos jogam: não há seleção precoce de talentos nem exclusão por baixo rendimento, e a competição é recurso pedagógico — aprende-se a vencer e a perder com dignidade.',
            ],
            caixas: [
              { rotulo: 'Escolas parceiras', texto: 'E.M.E.F. Prof. Estevão Gomes · E.M.E.F. Bom Jesus' },
              { rotulo: 'Quem participa', texto: 'Alunos da rede pública, de 12 a 17 anos, com 50% de meninas e 50% de meninos' },
            ],
          },
        ],
      },
      {
        tipo: 'cards',
        titulo: 'Nós acreditamos… com Fé, Esperança & Amor!',
        intro: 'A frase-símbolo da APHAM não é enfeite: cada palavra é um compromisso pedagógico.',
        icone: 'heart',
        itens: [
          { titulo: 'Fé', texto: 'Crer no potencial de cada adolescente — inclusive daqueles a quem o mundo já disse “não” — e no poder transformador da educação e do esporte.' },
          { titulo: 'Esperança', texto: 'Esperança é verbo: esperançar — agir, planejar e persistir. Cada bimestre é uma etapa concreta de construção de futuro.' },
          { titulo: 'Amor', texto: 'Cuidado, acolhida e compromisso com o outro: escutar, exigir com respeito, corrigir sem humilhar e celebrar cada conquista.' },
        ],
      },
      {
        tipo: 'cards',
        titulo: 'Do eu ao nós, do nós ao direito, do direito à ação',
        intro: 'O ano do projeto acompanha o calendário escolar e se organiza em quatro eixos temáticos — um por bimestre —, cada um com sua culminância.',
        icone: 'target',
        itens: [
          { titulo: 'Valores Humanos', texto: '1º bimestre (mar–abr) · O EU e o NÓS: acolhida, vínculo e convivência.', lista: ['Pergunta: “Que valores fazem de nós um time — dentro e fora da quadra?”', 'Culminância: Festival de Acolhida e Jogos Cooperativos e o Pacto de Convivência'] },
          { titulo: 'Cultura Local', texto: '2º bimestre (mai–jul) · O NOSSO CHÃO: identidade, território e saberes do Marajó.', lista: ['Culminância: Festival “Jogos e Saberes do Marajó” e o Livro de Saberes e Brincadeiras'] },
          { titulo: 'Cidadania', texto: '3º bimestre (ago–set) · O NOSSO DIREITO: direitos, deveres e democracia.', lista: ['Culminância: “Jogos da Cidadania” e a Assembleia de Direitos'] },
          { titulo: 'Participação Social', texto: '4º bimestre (out–dez) · O NOSSO FUTURO: protagonismo, ação comunitária e projeto de vida.', lista: ['Culminância: Mostra Anual Escola de Esportes e certificação'] },
        ],
      },
      {
        tipo: 'imagem',
        src: '/midia/projetos/escola-esportes-foto.jpg',
        legenda: 'Escola de Esportes — esporte, educação e promoção social para a juventude.',
      },
      {
        tipo: 'cards',
        titulo: 'Como o projeto funciona',
        intro: 'Três componentes que se integram em torno do eixo de cada bimestre.',
        icone: 'school',
        itens: [
          { titulo: 'OPIES', texto: 'Oficinas Pedagógicas de Iniciação e Especialização: 5 módulos de 16 horas (80 horas no ano), com estudo de textos e vídeos e prática em quadra — unindo o saber esportivo à reflexão sobre valores, cultura e cidadania.' },
          { titulo: 'Treinamento Desportivo', texto: 'Formação técnica e tática em jogos, treinos e minitorneios — o principal “laboratório” dos valores do bimestre. O jogo se ensina pelo próprio jogo.' },
          { titulo: 'Acompanhamento Socioeducativo', lista: ['Monitoramento do desempenho escolar', 'Reforço em Língua Portuguesa e Matemática', 'Oficinas de Educação Cidadã', 'Acompanhamento e encontros com as famílias'] },
        ],
      },
      {
        tipo: 'colunas',
        colunas: [
          {
            titulo: 'Um turno no projeto',
            paragrafos: 'Os turnos acontecem de segunda a sábado, pela manhã e à tarde, sempre no contraturno escolar.',
            lista: [
              'Acolhida e Roda de Valores — frequência, “palavra do dia” e o valor do bimestre (20 min)',
              'Lanche e convivência (20 min)',
              'Bloco formativo — reforço escolar, educação cidadã ou OPIES (1h30)',
              'Bloco esportivo — fundamentos, tática, jogos e minitorneios (1h30)',
              'Roda de fechamento — “O que aprendi hoje? O que preciso melhorar?” (20 min)',
            ],
          },
          {
            titulo: 'A semana',
            lista: [
              'Segunda — Educação Cidadã + fundamentos técnicos',
              'Terça — Reforço de Língua Portuguesa + jogo e tática',
              'Quarta — OPIES (estudo, vídeos e pesquisa) + modalidade em foco',
              'Quinta — Reforço de Matemática + jogos cooperativos e pré-desportivos',
              'Sexta — Educação Cidadã / projeto do bimestre + jogos coletivos e minitorneios',
              'Sábado — festivais, encontros com as famílias, culminâncias e competições',
            ],
          },
        ],
      },
      {
        tipo: 'cards',
        titulo: 'Metas do projeto',
        intro: 'Metas de referência para o ano de 2026, acompanhadas e revisadas a cada ano.',
        icone: 'award',
        itens: [
          { titulo: 'Frequência escolar', texto: 'Ao menos 90% dos participantes com frequência igual ou superior a 85% nas escolas parceiras.' },
          { titulo: 'Desempenho escolar', texto: 'Redução de 70% nas reprovações e “notas vermelhas” em relação à situação de ingresso.' },
          { titulo: 'Educação cidadã', texto: '36 oficinas por turma no ano — ECA, combate ao bullying, prevenção às drogas e direitos humanos.' },
          { titulo: 'Famílias', texto: '4 encontros gerais no ano, um por bimestre, com a presença de pelo menos 80% das famílias.' },
          { titulo: 'Rede de proteção', texto: 'Casos de violação de direitos encaminhados ao CRAS/CREAS ou ao Conselho Tutelar em até 48 horas.' },
          { titulo: 'Comunidade', texto: 'Pelo menos 2 festivais esportivos ou torneios abertos ao público, além das culminâncias de cada bimestre.' },
        ],
      },
      {
        tipo: 'destaque',
        rotulo: 'Reconhecimento',
        titulo: 'Semifinalista do Prêmio Itaú-Unicef 2018',
        img: '/midia/marca/premio-itau-2018.jpg',
        paragrafos: [
          'Na 13ª edição, entre 3.514 iniciativas, a Escola de Esportes ficou entre as 12 melhores ações socioeducativas da Região Norte e entre as 100 melhores do Brasil — o segundo selo da APHAM em apenas três anos.',
        ],
        link: { to: '/reconhecimentos/premio-itau-unicef-2018', rotulo: 'Ver o prêmio' },
      },
    ],
    citacao: {
      texto: 'Se você quiser um ano de prosperidade, cultive grãos. Se você quiser dez anos de prosperidade, cultive árvores. Mas se você quiser cem anos de prosperidade, cultive gente.',
      autor: 'Provérbio chinês — “cultivar gente é o nosso ofício”',
    },
    outrosDocs: [{ titulo: 'Quadro de horários das turmas (PDF)', href: '/midia/documentos/horarios-escola-esportes.pdf' }],
    ficha: [
      { nome: 'Genésio Jorge de Oliveira Pena', cargo: 'Presidente da APHAM' },
      { nome: 'Claybe Fernando Furtado Cirino', cargo: 'Coordenador do Projeto Escola de Esportes' },
      { nomes: ['Érico dos Santos Santiago', 'Vivia Michilles', 'Claybe Fernando Furtado Cirino'], cargo: 'Professores das turmas' },
    ],
  },
}

// LEI DE INCENTIVO AO ESPORTE — a partir do Ofício nº 2463/2026/MESP/SE/DPPIE/CGLIE-CAP
// (Ministério do Esporte, 07/07/2026), que abriu as contas do projeto no Banco do
// Brasil. O ofício NÃO é publicado no site (traz e-mails e um formulário de
// autorização bancária); só os dados que o próprio ofício manda informar aos doadores.
// Limites de dedução: Decreto nº 12.861/2026.
export const incentivoFolder = {
  eyebrow: 'Imposto de Renda',
  titulo: 'Lei de Incentivo ao Esporte',
  descricao: 'Apoie a Escola de Esportes com parte do seu Imposto de Renda — sem custo extra para você.',
  capa: { img: '/midia/marca/lei-incentivo-esporte.jpg', alt: 'Lei de Incentivo ao Esporte' },
  lema: 'Projeto aprovado pelo Ministério do Esporte',
  resumo: [
    'O Projeto Escola de Esportes — Aprendendo com Valores: Educação e Promoção para a Juventude! está apto a captar recursos pela Lei de Incentivo ao Esporte. O Ministério do Esporte abriu, em nome da APHAM, a conta oficial do projeto no Banco do Brasil.',
    'Pessoas e empresas podem destinar parte do Imposto de Renda devido diretamente para o projeto: o valor que iria para o governo passa a financiar esporte, educação e cidadania para a juventude do Marajó.',
  ],
  links: [
    { to: '/contato', rotulo: 'Quero apoiar' },
    { to: '/projetos/escola-de-esportes', rotulo: 'Conheça o projeto' },
  ],
  numeros: [
    { valor: 'Até 7%', label: 'do IR devido — pessoa física' },
    { valor: 'Até 2%', label: 'do IR devido — empresas no Lucro Real' },
    { valor: 'R$ 0', label: 'de custo extra: é imposto que já seria pago' },
    { valor: '100%', label: 'do valor vai para a conta oficial do projeto' },
  ],
  blocos: [
    {
      tipo: 'colunas',
      colunas: [
        {
          titulo: 'O que é a Lei de Incentivo',
          paragrafos: [
            'É uma lei federal que permite a pessoas físicas e empresas destinarem parte do Imposto de Renda devido a projetos esportivos aprovados pelo Ministério do Esporte, por meio de doação ou patrocínio.',
            'Na prática, você não gasta a mais: o valor destinado é abatido do imposto que você já teria de pagar — e, em vez de ir para o caixa geral do governo, vai direto para um projeto que você escolheu.',
          ],
        },
        {
          titulo: 'O projeto aprovado',
          paragrafos: [
            'Os recursos captados financiam a Escola de Esportes: cerca de 100 adolescentes de 12 a 17 anos atendidos no contraturno escolar em Breves, com handebol, futsal e voleibol, reforço escolar, educação cidadã e acompanhamento das famílias.',
            'O dinheiro fica na conta do projeto, acompanhada pelo Ministério do Esporte, e só é movimentado para a execução do projeto aprovado.',
          ],
          caixas: [
            { rotulo: 'Processo', texto: 'Nº 71000.019450/2026-61 — Ministério do Esporte' },
            { rotulo: 'Situação', texto: 'Em captação de recursos (Ofício nº 2463/2026, de 07/07/2026)' },
          ],
        },
      ],
    },
    {
      tipo: 'dados',
      titulo: 'Conta oficial para doações',
      intro: 'Conta de captação aberta pelo Ministério do Esporte em nome da APHAM, exclusiva para doações e patrocínios ao projeto.',
      itens: [
        { rotulo: 'Banco', valor: 'Banco do Brasil' },
        { rotulo: 'Agência', valor: '0558-4' },
        { rotulo: 'Conta Captação', valor: '66824-9' },
        { rotulo: 'Titular', valor: 'APHAM' },
      ],
      nota: 'Depois de depositar, envie o comprovante para a APHAM pelo WhatsApp ou e-mail para emitirmos o recibo da doação.',
    },
    {
      tipo: 'cards',
      titulo: 'Como apoiar, passo a passo',
      icone: 'target',
      itens: [
        { titulo: '1. Calcule', texto: 'Veja quanto você pode destinar: até 7% do imposto devido (pessoa física) ou até 2% (empresas no Lucro Real).' },
        { titulo: '2. Deposite', texto: 'Faça a doação ou o patrocínio na Conta Captação do projeto no Banco do Brasil (agência 0558-4, conta 66824-9).' },
        { titulo: '3. Envie o comprovante', texto: 'Mande o comprovante para a APHAM. Nós emitimos o recibo que comprova a destinação.' },
        { titulo: '4. Declare', texto: 'Na declaração do Imposto de Renda, informe a doação para que o valor seja abatido do imposto devido.' },
      ],
    },
    {
      tipo: 'cards',
      titulo: 'Quem pode apoiar',
      icone: 'users',
      itens: [
        { titulo: 'Pessoa física', texto: 'Quem faz a declaração do Imposto de Renda no modelo completo pode destinar até 7% do imposto devido, somado às demais deduções de incentivo.' },
        { titulo: 'Empresas', texto: 'Empresas tributadas pelo Lucro Real podem destinar até 2% do IRPJ devido em cada período, como doação ou patrocínio — e ainda associar a marca a um projeto social.' },
      ],
    },
    {
      tipo: 'destaque',
      rotulo: 'O projeto',
      titulo: 'Escola de Esportes — Aprendendo com Valores',
      img: '/midia/marca/logo-escola-esportes.jpg',
      paragrafos: [
        'Proposta piloto de educação em tempo integral no Marajó: esporte, reforço escolar, educação cidadã e acompanhamento das famílias, com uma Proposta Político-Pedagógica própria.',
      ],
      link: { to: '/projetos/escola-de-esportes', rotulo: 'Conheça o projeto' },
    },
  ],
  citacao: { texto: 'A boa educação da juventude é a prenda mais segura da felicidade de um Estado!', autor: 'Axel Oxenstierna' },
}

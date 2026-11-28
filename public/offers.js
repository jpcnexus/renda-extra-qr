/*
 * OFERTAS — único arquivo a editar para trocar cursos, links ou preços.
 * Veja ATUALIZAR-OFERTAS.md. Não é preciso gerar outro QR Code.
 *
 * Campos:
 *   id              estável, usado no Analytics (offer_id). Não renomear.
 *   ativo           false = a oferta não aparece na página.
 *   ordem           menor número aparece primeiro.
 *   selo            etiqueta curta e VERDADEIRA (ex.: "Menor preço"). Vazio = sem selo.
 *   nome            título do card (também enviado como offer_name).
 *   gancho          frase curta de impacto, logo abaixo do título.
 *   itens           até 3 benefícios, só o que consta na página oficial do curso.
 *   preco           preço atual, ex.: "R$ 37". Exibido só com precoConfirmado: true.
 *   precoDe         preço "de" que o PRODUTOR exibe (opcional; vazio = não mostra).
 *   parcelas        ex.: "ou 10x de R$ 5,65" (opcional).
 *   precoConfirmado true somente depois de conferir na página oficial.
 *   garantia        true somente se a página oficial anuncia garantia de 7 dias.
 *   link            link de afiliado completo. Preservar o afid. Não adicionar UTMs.
 *   cta             texto do botão.
 *   imagem          imagem oficial do curso (em img/). Usar só material do produtor.
 *   promo           opcional: { selo, preco, precoDe, parcelas, ate }. Até a data "ate" a página
 *                   mostra o preço promocional; depois volta sozinha ao preço normal.
 *
 * Conferido nas páginas oficiais dos produtores em 28/11/2026.
 */
window.OFFERS_CHECKED_AT = '28/11/2026';
window.OFFERS = [
  {
    id: 'mov',
    ativo: true,
    ordem: 1,
    selo: 'Menor preço',
    nome: 'MOV — Método Orgânico Viral',
    gancho: 'Venda pelo TikTok com vídeos simples, sem aparecer e sem estoque.',
    itens: [
      'Passo a passo para criar a conta e liberar seu link de vendas',
      'Os tipos de vídeo com mais chance de viralizar',
      'Desafio de 7 dias guiado, feito para quem nunca vendeu online'
    ],
    preco: 'R$ 37',
    precoDe: 'R$ 197',
    parcelas: '',
    precoConfirmado: true,
    garantia: true,
    link: 'https://kiwify.app/cdH39sl?afid=F64hqxZa',
    cta: 'Quero conhecer o MOV',
    imagem: 'img/mov.webp'
  },
  {
    id: 'videos_ia',
    ativo: true,
    ordem: 2,
    selo: 'Com inteligência artificial',
    nome: 'Vídeos de IA que Vendem 2.0',
    gancho: 'Transforme uma simples foto de produto em vídeo com inteligência artificial.',
    itens: [
      'Sem aparecer, sem ter o produto em mãos e sem escrever prompts',
      'Para divulgar como afiliada na Shopee e no TikTok Shop',
      'Aulas curtas e diretas ao ponto, pagamento único'
    ],
    preco: 'R$ 47',
    precoDe: 'R$ 197',
    parcelas: 'ou 10x de R$ 5,65',
    precoConfirmado: true,
    garantia: true,
    link: 'https://kiwify.app/m7fQ44k?afid=oQhdXQjt',
    cta: 'Quero criar vídeos com IA',
    imagem: 'img/videos-ia.webp'
  },
  {
    id: 'shopee',
    ativo: true,
    ordem: 3,
    selo: '160+ videoaulas',
    nome: 'Método Lucrando com a Shopee',
    gancho: 'Aprenda a vender como afiliado da Shopee usando só o celular.',
    itens: [
      'Mais de 160 videoaulas mostrando tudo passo a passo',
      'Estratégias para vender sem aparecer',
      'Suporte na área de membros e acesso por 2 anos'
    ],
    // Preço normal (volta sozinho quando a promoção acaba)
    preco: 'R$ 149,99',
    precoDe: '',
    parcelas: '',
    // Black Friday: vale até a data/hora de "ate" (horário de Brasília). Para encerrar antes, apague o bloco promo.
    promo: { selo: 'Black Friday', preco: 'R$ 47', precoDe: 'R$ 149,99', parcelas: 'ou 9x de R$ 6,18', ate: '2026-11-30T23:59:00-03:00' },
    precoConfirmado: true,
    garantia: false,
    link: 'https://kiwify.app/m0mn4dS?afid=ANrYBM87',
    cta: 'Quero o método da Shopee',
    imagem: 'img/shopee.webp'
  }
];

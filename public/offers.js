/*
 * OFERTAS — único arquivo a editar para trocar cursos, links ou preços.
 * Veja ATUALIZAR-OFERTAS.md. Não é preciso gerar outro QR Code.
 *
 * Campos:
 *   id              estável, usado no Analytics (offer_id). Não renomear.
 *   ativo           false = a oferta não aparece na página.
 *   ordem           menor número aparece primeiro.
 *   nome            título do card (também enviado como offer_name).
 *   perfil          etiqueta "para quem é".
 *   descricao       explicação curta.
 *   passos          3 passos curtos de "como funciona".
 *   preco           texto exibido, ex.: "R$ 49,90".
 *   precoConfirmado true somente depois de conferir o preço na Kiwify.
 *                   Enquanto false, o preço NÃO é exibido.
 *   link            link de afiliado completo. Preservar o afid. Não adicionar UTMs.
 *   cta             texto do botão.
 *   imagem          caminho de imagem autorizada (ilustrações próprias em img/).
 */
window.OFFERS = [
  {
    id: 'canva',
    ativo: true,
    ordem: 1,
    nome: 'Canva Lucrativo',
    perfil: 'Para quem gosta de criar',
    descricao: 'Treinamento sobre habilidades criativas no Canva e possíveis serviços digitais, como artes para pequenos negócios.',
    passos: ['Cria as artes', 'Oferece a clientes', 'Cobra pelo serviço'],
    preco: 'R$ 37,00',
    precoConfirmado: false,
    link: 'https://kiwify.app/1SMfVeQ?afid=vU2PrZbU',
    cta: 'Conhecer o treinamento',
    imagem: 'img/canva.svg'
  },
  {
    id: 'pva',
    ativo: true,
    ordem: 2,
    nome: 'Primeira Venda Agora (PVA)',
    perfil: 'Para quem está começando do zero',
    descricao: 'Primeiros passos nas vendas digitais como afiliado: entender o mercado, montar a estrutura e buscar a primeira venda.',
    passos: ['Entende o mercado', 'Monta a estrutura', 'Busca a 1ª venda'],
    preco: 'R$ 49,90',
    precoConfirmado: false,
    link: 'https://kiwify.app/FrsqcHD?afid=7AAd8oEW',
    cta: 'Conhecer o treinamento',
    imagem: 'img/pva.svg'
  },
  {
    id: 'shopee',
    ativo: true,
    ordem: 3,
    nome: 'Método Lucrando com a Shopee',
    perfil: 'Para quem já conhece a Shopee',
    descricao: 'Treinamento sobre oportunidades com marketplaces e afiliados: divulgar produtos e receber comissão quando há venda pelo seu link.',
    passos: ['Escolhe um produto', 'Divulga seu link', 'Comissão quando há venda'],
    preco: 'R$ 149,99',
    precoConfirmado: false,
    link: 'https://kiwify.app/m0mn4dS?afid=ANrYBM87',
    cta: 'Conhecer o método',
    imagem: 'img/shopee.svg'
  }
];

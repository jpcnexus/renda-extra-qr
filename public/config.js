/*
 * CONFIGURAÇÃO DO SITE
 *
 * ga4MeasurementId: ID real do fluxo GA4 exclusivo deste projeto (ex.: 'G-ABC123XYZ').
 *   Vazio = nenhum Analytics e nenhum aviso de cookies são exibidos.
 *   Nunca usar ID fictício em produção.
 * institucionalUrl: site institucional da Nexus JPC (vazio = sem link).
 */
window.SITE_CONFIG = {
  ga4MeasurementId: '',
  institucionalUrl: '',
  // Marcador do QR impresso. Não alterar depois de imprimir.
  qr: { utm_source: 'ponto_onibus', utm_medium: 'qr', utm_campaign: 'renda_extra' }
};

const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function(event, context) {
  // Configurar CORS para permitir llamadas desde tu dashboard
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Intentar obtener noticias de BioBioChile
    const feed = await parser.parseURL('https://www.biobiochile.cl/rss/');
    
    // Extraer solo los títulos de las últimas 8 noticias
    const noticias = feed.items.slice(0, 8).map(item => item.title);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        noticias: noticias,
        actualizacion: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error obteniendo noticias:', error);
    
    // Si falla, devolver noticias por defecto
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        noticias: [
          'Tragedia en Recoleta: niño de 10 años fallece tras choque con furgón escolar',
          'Mundial Sub-20: Marruecos se corona campeón',
          'Universidad de Chile avanza a semifinales de Copa Sudamericana',
          'Mundial de Ciclismo de Pista se realizará en Peñalolén',
          'Ibai Llanos anuncia su visita a Chile',
          'Desierto Florido cubre Atacama'
        ],
        error: error.message
      })
    };
  }
};

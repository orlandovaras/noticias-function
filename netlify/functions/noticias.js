const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Intentar múltiples fuentes de noticias
  const fuentes = [
    'https://www.latercera.com/feed/',
    'https://www.emol.com/rss/rss.asp',
    'https://www.cooperativa.cl/noticias/site/tax/port/all/rss_____.xml'
  ];

  for (const url of fuentes) {
    try {
      const feed = await parser.parseURL(url);
      const noticias = feed.items.slice(0, 8).map(item => item.title);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          noticias: noticias,
          fuente: url,
          actualizacion: new Date().toISOString()
        })
      };
    } catch (error) {
      console.log(`Error con ${url}:`, error.message);
      continue; // Intentar siguiente fuente
    }
  }

  // Si todas las fuentes fallan
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: false,
      noticias: [
        'Tragedia en Recoleta: niño de 11 años fallece tras choque con furgón escolar',
        'Mundial Sub-20: Marruecos se corona campeón',
        'Universidad de Chile avanza a semifinales de Copa Sudamericana',
        'Mundial de Ciclismo de Pista se realizará en Peñalolén',
        'Ibai Llanos anuncia su visita a Chile',
        'Desierto Florido cubre Atacama'
      ],
      error: 'Todas las fuentes RSS fallaron'
    })
  };
};

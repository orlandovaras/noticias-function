const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Usar rss2json como intermediario
    const rssUrl = 'https://www.latercera.com/feed/';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=YOUR_API_KEY&count=8`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 'ok' && data.items && data.items.length > 0) {
      const noticias = data.items.map(item => item.title);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          noticias: noticias,
          actualizacion: new Date().toISOString()
        })
      };
    } else {
      throw new Error('No se pudieron obtener noticias');
    }
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        noticias: [
          'Las noticias se actualizarán automáticamente',
          'Dashboard funcionando correctamente',
          'Temperatura y hora en tiempo real',
          'Sistema de noticias en configuración',
          'Próxima actualización en breve',
          'Gracias por tu paciencia'
        ],
        error: error.message
      })
    };
  }
};

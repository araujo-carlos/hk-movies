// Configuración
const API_KEY = '572ddf662738e3e241966f19e3c1e8b8';
const TOTAL_PAGES = 37;
const allMovies = [];

// Función para realizar solicitud a una página
async function fetchPage(page) {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_companies=5798&primary_release_date.gte=1965-01-01&page=${page}&sort_by=primary_release_date.asc`;
  
  console.log(`Obteniendo página ${page} de ${TOTAL_PAGES}...`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en página ${page}:`, error);
    return { results: [] };
  }
}

// Función principal que procesa todas las páginas
async function getAllShawBrothersMovies() {
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const pageData = await fetchPage(page);
    
    // Añadir datos de esta página al array principal
    if (pageData.results && Array.isArray(pageData.results)) {
      allMovies.push(...pageData.results);
      console.log(`Añadidas ${pageData.results.length} películas. Total acumulado: ${allMovies.length}`);
    }
    
    // Esperar un poco entre solicitudes para respetar los límites de la API
    if (page < TOTAL_PAGES) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Crear un objeto de blob con los datos
  const blob = new Blob([JSON.stringify(allMovies, null, 2)], {type: 'application/json'});
  
  // Crear URL para el blob
  const url = URL.createObjectURL(blob);
  
  // Crear enlace de descarga y hacer clic automáticamente
  const a = document.createElement('a');
  a.href = url;
  a.download = 'shaw_brothers_movies.json';
  document.body.appendChild(a);
  a.click();
  
  // Limpiar
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log(`¡Completado! Se han descargado ${allMovies.length} películas de Shaw Brothers.`);
  
  // También devolver los datos por si quieres hacer algo más con ellos
  return allMovies;
}

// Ejecutar la función
getAllShawBrothersMovies();
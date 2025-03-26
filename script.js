// Función para buscar libros en el acervo bibliográfico
async function searchBooks() {
    const searchType = document.getElementById('searchType').value; // Autor o Título
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    try {
        // URL del archivo CSV (reemplaza con tu enlace)
        const csvUrl = 'https://general-repeated-wallaby.glitch.me/CatalogoPublico.csv';
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo CSV: ${response.status}`);
        }
        const text = await response.text();

        // Procesar el archivo CSV
        const rows = text.split('\n').map(row => row.split(','));
        const filteredRows = rows.filter(row => {
            // Ignorar filas mal formadas o con menos de 3 columnas
            if (row.length < 3) {
                return false;
            }

            // Extraer valores y eliminar espacios innecesarios
            const author = row[0].trim(); // Columna Autor
            const title = row[1].trim();  // Columna Título
            const classification = row[2].trim(); // Columna Clasificación

            // Si el usuario busca por Autor y el autor está vacío, ignorar esta fila
            if (searchType === 'autor' && !author) {
                return false;
            }

            // Buscar por Autor o Título
            if (searchType === 'autor') {
                return author.toLowerCase().includes(query);
            } else if (searchType === 'titulo') {
                return title.toLowerCase().includes(query);
            }
            return false;
        });

        // Mostrar resultados
        if (filteredRows.length === 0) {
            resultsDiv.innerHTML = '<p>No se encontró el libro.</p>';
        } else {
            filteredRows.forEach(row => {
                const classification = row[2].trim(); // Columna Clasificación
                resultsDiv.innerHTML += `<p>Clasificación: <strong>${classification}</strong></p>`;
            });
        }
    } catch (error) {
        console.error('Error al cargar o procesar el archivo CSV:', error);
        resultsDiv.innerHTML = '<p>Ocurrió un error al buscar libros.</p>';
    }
}

// Función para manejar el envío del formulario de sugerencias
document.getElementById('suggestionForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const suggestion = document.getElementById('suggestion').value;

    // Simular envío (puedes integrar un servicio gratuito como Formspree más adelante)
    console.log(`Nombre: ${name}, Correo: ${email}, Sugerencia: ${suggestion}`);
    document.getElementById('message').innerText = '¡Gracias por tu sugerencia!';
    document.getElementById('suggestionForm').reset();
});
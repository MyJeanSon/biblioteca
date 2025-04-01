// Función para normalizar texto (eliminar espacios extras y convertir a minúsculas)
function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Función para buscar libros en el acervo bibliográfico
async function searchBooks() {
    const searchType = document.getElementById('searchType').value; // Autor o Título
    const query = normalizeText(document.getElementById('searchInput').value); // Normalizar la consulta
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

            // Extraer valores y normalizarlos
            const author = normalizeText(row[0]); // Columna Autor
            const title = normalizeText(row[1]); // Columna Título
            const classification = row[2].trim(); // Columna Clasificación

            // Si el usuario busca por Autor y el autor está vacío, ignorar esta fila
            if (searchType === 'autor' && !author) {
                return false;
            }

            // Buscar por Autor o Título
            if (searchType === 'autor') {
                return author.includes(query);
            } else if (searchType === 'titulo') {
                return title.includes(query);
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

// Función para manejar el envío del formulario de sugerencias con Formspree
document.getElementById('suggestionForm')?.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const suggestion = document.getElementById('suggestion').value.trim();
    const messageElement = document.getElementById('message');

    // Validar campos
    if (!name || !email || !suggestion) {
        messageElement.innerText = 'Por favor, completa todos los campos.';
        messageElement.classList.remove('text-success');
        messageElement.classList.add('text-danger');
        return;
    }

    try {
        // URL de Formspree (reemplaza YOUR_FORMSPREE_ENDPOINT con tu endpoint real)
        const response = await fetch('https://formspree.io/f/xzzeayyy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: suggestion
            })
        });

        if (response.ok) {
            // Éxito: Muestra un mensaje y limpia el formulario
            messageElement.innerText = '¡Gracias por tu sugerencia!';
            messageElement.classList.remove('text-danger');
            messageElement.classList.add('text-success');
            document.getElementById('suggestionForm').reset();
        } else {
            throw new Error('Error al enviar la sugerencia.');
        }
    } catch (error) {
        console.error(error);
        messageElement.innerText = 'Ocurrió un error al enviar tu sugerencia.';
        messageElement.classList.remove('text-success');
        messageElement.classList.add('text-danger');
    }
});
// ============================================================
// 1. UTILIDADES COMPARTIDAS
// ============================================================
const apiMetodo = document.getElementById('api-metodo');
const apiUrl = document.getElementById('api-url');
const apiCodigo = document.getElementById('api-codigo');
const notificacionDiv = document.getElementById('notificacion');

// Fetch wrapper con logging (evolución de P2)
async function fetchAPI(url, opciones = {}) {
    const method = opciones.method || 'GET';

    apiMetodo.textContent = method;
    apiMetodo.className = `badge badge-${method.toLowerCase()}`;
    apiUrl.textContent = url;
    apiCodigo.textContent = '...';
    apiCodigo.className = 'badge badge-neutral';

    try {
        const respuesta = await fetch(url, opciones);
        apiCodigo.textContent = `${respuesta.status}`;
        apiCodigo.className = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;

        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.message || `Error ${respuesta.status}`);
        }
        return datos;
    } catch (error) {
        if (apiCodigo.textContent === '...') {
            apiCodigo.textContent = 'ERROR';
            apiCodigo.className = 'badge badge-error';
        }
        throw error;
    }
}

function mostrarNotificacion(mensaje, tipo) {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    setTimeout(() => { notificacionDiv.style.display = 'none'; }, 3000);
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function formatearFechaHora(fechaISO) {
    if (!fechaISO) return '-';
    return new Date(fechaISO).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ============================================================
// 2. MÓDULO DE ESTUDIOS
// ============================================================
const formEstudio = document.getElementById('form-estudio');
const inputEstudioId = document.getElementById('estudio-id');
const inputEstudioNombre = document.getElementById('estudio-nombre');
const inputEstudiosDescripcion = document.getElementById('estudio-descripcion');
const formTituloEstudio = document.getElementById('form-titulo-estudio');
const btnGuardarEstudio = document.getElementById('btn-guardar-estudio');
const btnCancelarEstudio = document.getElementById('btn-cancelar-estudio');
const tbodyEstudios = document.getElementById('tbody-estudios');
const tablaEstudios = document.getElementById('tabla-estudios');
const cargaEstudios = document.getElementById('carga-estudios');
const contadorEstudios = document.getElementById('contador-estudios');
const errorEstudioNombre = document.getElementById('error-estudio-nombre');
const errorEstudioDescripcion = document.getElementById('error-estudio-descripcion');

async function cargarEstudios() {
    try {
        const resp = await fetchAPI('/api/estudios');
        cargaEstudios.style.display = 'none';

        if (resp.data.length === 0) {
            tablaEstudios.style.display = 'none';
            cargaEstudios.textContent = 'No hay estudios registrados.';
            cargaEstudios.style.display = 'block';
        } else {
            tablaEstudios.style.display = 'table';
            tbodyEstudios.innerHTML = '';
            resp.data.forEach(e => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${e.id}</td>
                    <td>${escapeHtml(e.nombre)}</td>
                    <td>${escapeHtml(e.descripcion)}</td>
                    <td>
                        <button class="btn-editar" onclick="editarEstudio(${e.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarEstudio(${e.id}, '${escapeHtml(e.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyEstudios.appendChild(fila);
            });
        }
        contadorEstudios.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar estudios: ' + error.message, 'error');
    }
}


function validarFormEstudio() {
    let ok = true;
    const nombre = inputEstudioNombre.value.trim();
    const descripcion = inputEstudiosDescripcion.value.trim();

    if (!nombre || nombre.length < 2) {
        errorEstudioNombre.textContent = 'Mínimo 2 caracteres';
        inputEstudioNombre.classList.add('input-error');
        ok = false;
    } else {
        errorEstudioNombre.textContent = '';
        inputEstudioNombre.classList.remove('input-error');
    }
    return ok;
    return ok;
    
    if (!nombre || descripcion.length < 2) {
        errorEstudioDescripcion.textContent = 'La descripcion es obligatoria';
        inputEstudiosDescripcion.classList.add('input-error');
        ok = false;
    } else {
        errorEstudioDescripcion.textContent = '';
        inputEstudiosDescripcion.classList.remove('input-error');
    }
    return ok;
    
}

function limpiarFormEstudio() {
    formEstudio.reset();
    inputEstudioId.value = '';
    formTituloEstudio.textContent = 'Agregar Estudios';
    btnGuardarEstudio.textContent = 'Guardar';
    btnCancelarEstudio.style.display = 'none';
    errorEstudioNombre.textContent = '';
    errorEstudioDescripcion.textContent = '';
    inputEstudioNombre.classList.remove('input-error');
    inputEstudiosDescripcion.classList.remove('input-error');
}

formEstudio.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormEstudio()) return;

    const datos = {
        nombre: inputEstudioNombre.value.trim(),
        descripcion: inputEstudiosDescripcion.value.trim()
    };
    const id = inputEstudioId.value;
     
    try {
        if (id) {
            await fetchAPI(`/api/estudios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Estudio actualizado', 'exito');
        } else {
            await fetchAPI('/api/estudios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Estudio creado', 'exito');
        }
        limpiarFormEstudio();
        cargarEstudios();
        cargarSelectEstudios();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarEstudio(id) {
    try {
        const resp = await fetchAPI(`/api/estudios/${id}`);
        inputEstudioId.value = resp.data.id;
        inputEstudioNombre.value = resp.data.nombre;
        inputEstudiosDescripcion.value = resp.data.descripcion;
        formTituloEstudio.textContent = 'Editar Estudio';
        btnGuardarEstudio.textContent = 'Actualizar';
        btnCancelarEstudio.style.display = 'inline-block';
        cambiarSeccion('estudios');
        formEstudio.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarEstudio(id, nombre) {
    if (confirm(`¿Eliminar el estudio "${nombre}" y todas sus entradas?`)) {
        eliminarEstudio(id);
    }
}

async function eliminarEstudio(id) {
    try {
        await fetchAPI(`/api/estudios/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Estudio eliminado', 'exito');
        if (inputEstudioId.value === String(id)) limpiarFormEstudio();
        cargarEstudios();
        cargarSelectEstudios();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarEstudio.addEventListener('click', limpiarFormEstudio);
// ============================================================
// 3. MÓDULO DE GENEROS
// ============================================================
const formGenero = document.getElementById('form-genero');
const inputGeneroId = document.getElementById('genero-id');
const inputGeneroNombre = document.getElementById('genero-nombre');
const inputGeneroDescripcion = document.getElementById('genero-descripcion');
const inputGeneroOrigen = document.getElementById('genero-origen');
const formTituloGenero = document.getElementById('form-titulo-genero');
const btnGuardarGenero = document.getElementById('btn-guardar-genero');
const btnCancelarGenero = document.getElementById('btn-cancelar-genero');
const tbodyGeneros = document.getElementById('tbody-generos');
const tablaGeneros = document.getElementById('tabla-generos');
const cargaGeneros = document.getElementById('carga-generos');
const contadorGeneros = document.getElementById('contador-generos');
const errorGeneroNombre = document.getElementById('error-genero-nombre');
const errorGeneroDescripcion = document.getElementById('error-genero-descripcion');
const errorGeneroOrigen = document.getElementById('error-genero-origen');

async function cargarGeneros() {
    try {
        const resp = await fetchAPI('/api/generos');
        cargaGeneros.style.display = 'none';
        if (resp.data.length === 0) {
            tablaGeneros.style.display = 'none';
            cargaGeneros.textContent = 'No hay generos registrados.';
            cargaGeneros.style.display = 'block';
        } else {
            tablaGeneros.style.display = 'table';
            tbodyGeneros.innerHTML = '';
            resp.data.forEach(e => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${e.id}</td>
                    <td>${escapeHtml(e.nombre)}</td>
                    <td>${escapeHtml(e.descripcion)}</td>
                    <td>${escapeHtml(e.origen)}</td>
                    <td>
                        <button class="btn-editar" onclick="editarGenero(${e.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarGenero(${e.id}, '${escapeHtml(e.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyGeneros.appendChild(fila);
            });
        }
        contadorGeneros.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar generos: ' + error.message, 'error');
    }
}

function limpiarFormGenero() {
    formGenero.reset();
    inputGeneroId.value = '';
    formTituloGenero.textContent = 'Agregar Genero';
    btnGuardarGenero.textContent = 'Guardar';
    btnCancelarGenero.style.display = 'none';
    errorGeneroNombre.textContent = '';
    errorGeneroDescripcion.textContent = '';
    errorGeneroOrigen.textContent = '';
}

formGenero.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        nombre: inputGeneroNombre.value.trim(),
        descripcion: inputGeneroDescripcion.value.trim(),
        origen: inputGeneroOrigen.value.trim()
    };
    const id = inputGeneroId.value;

    try {
        if (id) {
            await fetchAPI(`/api/generos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Genero actualizado', 'exito');
        } else {
            await fetchAPI('/api/generos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Genero creado', 'exito');
        }
        limpiarFormGenero();
        cargarGeneros();
        cargarSelectGeneros();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarGenero(id) {
    try {
        const resp = await fetchAPI(`/api/generos/${id}`);
        inputGeneroId.value = resp.data.id;
        inputGeneroNombre.value = resp.data.nombre;
        inputGeneroDescripcion.value = resp.data.descripcion;
        inputGeneroOrigen.value = resp.data.origen;
        formTituloGenero.textContent = 'Editar Genero';
        btnGuardarGenero.textContent = 'Actualizar';
        btnCancelarGenero.style.display = 'inline-block';
        cambiarSeccion('generos');
        formGenero.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarGenero(id, nombre) {
    if (confirm(`¿Eliminar el Genero "${nombre}"?`)) eliminarGenero(id);
}

async function eliminarGenero(id) {
    try {
        await fetchAPI(`/api/generos/${id}`, { method: 'DELETE' });
        mostrarNotificacion('genero eliminado', 'exito');
        if (inputGeneroId.value === String(id)) limpiarFormGenero();
        cargarGeneros();
        cargarSelectGeneros();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarGenero.addEventListener('click', limpiarFormGenero);

// ============================================================
// 4. MÓDULO DE ANIMES
// ============================================================
const formAnime = document.getElementById('form-anime');
const inputAnimeId = document.getElementById('anime-id');
const inputAnimeTitulo = document.getElementById('anime-titulo');
const inputAnimeDescripcion = document.getElementById('anime-descripcion');
const inputAnimeImagen = document.getElementById('anime-imagen');
const selectAnimeGenero = document.getElementById('anime-genero');
const selectAnimeEstudio = document.getElementById('anime-estudio');
const formTituloAnime = document.getElementById('form-titulo-anime');
const btnGuardarAnime = document.getElementById('btn-guardar-anime');
const btnCancelarAnime = document.getElementById('btn-cancelar-anime');
const tbodyAnimes = document.getElementById('tbody-animes');
const tablaAnimes = document.getElementById('tabla-animes');
const cargaAnimes = document.getElementById('carga-animes');
const contadorAnimes = document.getElementById('contador-animes');

async function cargarSelectEstudios() {
    try {
        const resp = await fetchAPI('/api/estudios');
        selectAnimeEstudio.innerHTML = '<option value="">-- Seleccionar estudio --</option>';
        resp.data.forEach(e => {
            // createElement es más seguro que innerHTML para datos dinámicos
            const option = document.createElement('option');
            option.value = e.id;
            option.textContent = `${e.nombre}`;
            selectAnimeEstudio.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select estudios:', error);
    }
}

async function cargarSelectGeneros() {
    try {
        const resp = await fetchAPI('/api/generos');
        selectAnimeGenero.innerHTML = '<option value="">-- Seleccionar genero --</option>';
        resp.data.forEach(e => {
            const option = document.createElement('option');
            option.value = e.id;
            option.textContent = `${e.nombre} (${e.origen})`;
            selectAnimeGenero.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select generos:', error);
    }
}

async function cargarAnimes() {
    try {
        const resp = await fetchAPI('/api/animes');
        cargaAnimes.style.display = 'none';
        if (resp.data.length === 0) {
            tablaAnimes.style.display = 'none';
            cargaAnimes.textContent = 'No hay animes registrados.';
            cargaAnimes.style.display = 'block';
        } else {
            tablaAnimes.style.display = 'table';
            tbodyAnimes.innerHTML = '';
            resp.data.forEach(a => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${a.id}</td>
                    <td>${escapeHtml(a.titulo)}</td>
                    <td>${escapeHtml(a.Estudio_nombre)}</td>
                    <td>${escapeHtml(a.genero_nombre)}</td>
                    <td><img src="/uploads/${a.imagen}" alt="${escapeHtml(a.titulo)}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;"></td>
                    <td>${escapeHtml(a.descripcion)}</td>
                    <td>
                        <button class="btn-eliminar" onclick="confirmarEliminarAnime(${a.id}, '${escapeHtml(a.titulo)}')">Eliminar</button>
                    </td>
                `;
                tbodyAnimes.appendChild(fila);
            });
        }
        contadorAnimes.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar animes: ' + error.message, 'error');
    }
}

function limpiarFormAnime() {
    formAnime.reset();
    inputAnimeId.value = '';
    formTituloAnime.textContent = 'Agregar Anime';
    btnGuardarAnime.textContent = 'Guardar';
    btnCancelarAnime.style.display = 'none';
}

formAnime.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('titulo', inputAnimeTitulo.value.trim());
    formData.append('descripcion', inputAnimeDescripcion.value.trim());
    formData.append('estudio_id', selectAnimeEstudio.value);
    formData.append('genero_id', selectAnimeGenero.value);
    if (inputAnimeImagen.files[0]) {
        formData.append('imagen', inputAnimeImagen.files[0]);
    }

    try {
        // Usar fetch directo en lugar de fetchAPI
        const respuesta = await fetch('/api/animes', {
            method: 'POST',
            body: formData
        });
        const datos = await respuesta.json();
        console.log('Respuesta:', datos);
        if (!respuesta.ok) throw new Error(datos.message);
        mostrarNotificacion('Anime creado', 'exito');
        limpiarFormAnime();
        cargarAnimes();
        cargarGaleria();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

function confirmarEliminarAnime(id, nombre) {
    if (confirm(`¿Eliminar el anime "${nombre}"?`)) eliminarAnime(id);
}

async function eliminarAnime(id) {
    try {
        await fetchAPI(`/api/animes/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Anime eliminado', 'exito');
        cargarAnimes();
        cargarGaleria();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarAnime.addEventListener('click', limpiarFormAnime);

// ============================================================
// 5. MÓDULO DE OBRAS (galería)
// ============================================================
const galeriaAnimes = document.getElementById('galeria-animes');
const cargaGaleria = document.getElementById('carga-galeria');
const contadorGaleria = document.getElementById('contador-galeria');

async function cargarGaleria() {
    try {
        const resp = await fetchAPI('/api/animes');
        cargaGaleria.style.display = 'none';
        contadorGaleria.textContent = `${resp.count}`;
        galeriaAnimes.innerHTML = '';

        if (resp.data.length === 0) {
            galeriaAnimes.innerHTML = '<p>No hay animes registrados.</p>';
            return;
        }

        resp.data.forEach(d => {
            const card = document.createElement('div');
            card.className = 'obra-card';
            card.innerHTML = `
                <img src="/uploads/${d.imagen}" alt="${escapeHtml(d.titulo)}">
                <div class="obra-info">
                    <h3>${escapeHtml(d.titulo)}</h3>
                    <p><strong>Estudio:</strong> ${escapeHtml(d.estudio_nombre)}</p>
                    <p><strong>Género:</strong> ${escapeHtml(d.genero_nombre)}</p>
                    <p>${escapeHtml(d.descripcion)}</p>
                </div>
            `;
            galeriaAnimes.appendChild(card);
        });
    } catch (error) {
        mostrarNotificacion('Error al cargar animes: ' + error.message, 'error');
    }
}

// ============================================================
// 5. NAVEGACIÓN POR PESTAÑAS
// ============================================================
// Esta función muestra una sección y oculta las demás.
// También actualiza la pestaña activa visualmente.
// Es un patrón básico de SPA (Single Page Application):
// cambiar contenido sin recargar la página.
function cambiarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(s => {
        s.style.display = 'none';
    });

    // Desactivar todas las pestañas
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    document.getElementById(`seccion-${seccion}`).style.display = 'block';

    // Activar la pestaña correspondiente
    // Array.from convierte NodeList a Array para poder usar find()
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const tabActiva = tabs.find(t => t.textContent.toLowerCase() === seccion);
    if (tabActiva) tabActiva.classList.add('active');

    // Si cambiamos a compras, recargar selects con datos actuales
    if (seccion === 'compras') {
        cargarSelectEstudios();
        cargarSelectGeneros();
        cargarAnimes();
    }
}

// ============================================================
// 6. INICIALIZACIÓN
// ============================================================
// Al cargar la página, cargamos todos los datos iniciales.
document.addEventListener('DOMContentLoaded', () => {
    cargarEstudios();
    cargarGeneros();
    cargarAnimes();
    cargarGaleria();
});
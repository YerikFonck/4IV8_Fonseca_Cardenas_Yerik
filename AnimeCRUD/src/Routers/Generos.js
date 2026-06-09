const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// ============================================================
// VALIDACIÓN
// ============================================================
function validarGenero(datos) {
    const errores = [];

    if (
        !datos.nombre ||
        typeof datos.nombre !== 'string' ||
        datos.nombre.trim().length < 2
    ) {
        errores.push('El nombre es obligatorio (mínimo 2 caracteres)');
    }

    if (
        !datos.descripcion ||
        typeof datos.descripcion !== 'string' ||
        datos.descripcion.trim().length < 2
    ) {
        errores.push('La descripción es obligatoria');
    }

    if (
        !datos.origen ||
        typeof datos.origen !== 'string' ||
        datos.origen.trim().length < 2
    ) {
        errores.push('El origen es obligatorio');
    }

    return errores;
}

// ============================================================
// GET /api/generos
// ============================================================
router.get('/', async (req, res) => {
    try {

        const [generos] = await db.execute(`
            SELECT
                id,
                nombre,
                descripcion,
                origen,
                created_at,
                updated_at
            FROM generos
            ORDER BY id ASC
        `);

        res.json({
            status: 'success',
            data: generos,
            count: generos.length
        });

    } catch (error) {

        console.error('Error al listar géneros:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// ============================================================
// GET /api/generos/:id
// ============================================================
router.get('/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const [generos] = await db.execute(`
            SELECT
                id,
                nombre,
                descripcion,
                origen,
                created_at,
                updated_at
            FROM generos
            WHERE id = ?
        `, [id]);

        if (generos.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Género con ID ${id} no encontrado`
            });
        }

        res.json({
            status: 'success',
            data: generos[0]
        });

    } catch (error) {

        console.error('Error al obtener género:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// ============================================================
// POST /api/generos
// ============================================================
router.post('/', async (req, res) => {
    try {

        const { nombre, descripcion, origen } = req.body;

        const errores = validarGenero(req.body);

        if (errores.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: errores[0]
            });
        }

        const [resultado] = await db.execute(`
            INSERT INTO generos
            (
                nombre,
                descripcion,
                origen
            )
            VALUES (?, ?, ?)
        `, [
            nombre.trim(),
            descripcion.trim(),
            origen.trim()
        ]);

        const [nuevo] = await db.execute(`
            SELECT
                id,
                nombre,
                descripcion,
                origen,
                created_at
            FROM generos
            WHERE id = ?
        `, [resultado.insertId]);

        res.status(201).json({
            status: 'success',
            data: nuevo[0]
        });

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'Ya existe un género con ese nombre'
            });
        }

        console.error('Error al crear género:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// ============================================================
// PUT /api/generos/:id
// ============================================================
router.put('/:id', async (req, res) => {
    try {

        const { id } = req.params;
        const { nombre, descripcion, origen } = req.body;

        const [existente] = await db.execute(
            'SELECT id FROM generos WHERE id = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Género con ID ${id} no encontrado`
            });
        }

        const errores = validarGenero(req.body);

        if (errores.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: errores[0]
            });
        }

        await db.execute(`
            UPDATE generos
            SET
                nombre = ?,
                descripcion = ?,
                origen = ?
            WHERE id = ?
        `, [
            nombre.trim(),
            descripcion.trim(),
            origen.trim(),
            id
        ]);

        const [actualizado] = await db.execute(`
            SELECT
                id,
                nombre,
                descripcion,
                origen,
                created_at,
                updated_at
            FROM generos
            WHERE id = ?
        `, [id]);

        res.json({
            status: 'success',
            data: actualizado[0]
        });

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'Ya existe un género con ese nombre'
            });
        }

        console.error('Error al actualizar género:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// ============================================================
// DELETE /api/generos/:id
// ============================================================
router.delete('/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const [genero] = await db.execute(
            'SELECT id, nombre FROM generos WHERE id = ?',
            [id]
        );

        if (genero.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Género con ID ${id} no encontrado`
            });
        }

        await db.execute(
            'DELETE FROM generos WHERE id = ?',
            [id]
        );

        res.json({
            status: 'success',
            data: {
                mensaje: `Género "${genero[0].nombre}" eliminado`
            }
        });

    } catch (error) {

        if (
            error.code === 'ER_ROW_IS_REFERENCED_2' ||
            error.errno === 1451
        ) {
            return res.status(409).json({
                status: 'error',
                message: 'No se puede eliminar el género porque tiene animes asociados'
            });
        }

        console.error('Error al eliminar género:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// ============================================================
// VALIDACIÓN
// ============================================================
function validarEstudio(datos) {
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

    return errores;
}

// ============================================================
// GET /api/estudios
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [estudios] = await db.execute(`
            SELECT
                id,
                nombre,
                descripcion,
                created_at,
                updated_at
            FROM estudios
            ORDER BY id ASC
        `);

        res.json({
            status: 'success',
            data: estudios,
            count: estudios.length
        });

    } catch (error) {
        console.error('Error al listar estudios:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// ============================================================
// GET /api/estudios/:id
// ============================================================
router.get('/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const [estudios] = await db.execute(`
            SELECT
                id,
                nombre,
                descripcion,
                created_at,
                updated_at
            FROM estudios
            WHERE id = ?
        `, [id]);

        if (estudios.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Estudio con ID ${id} no encontrado`
            });
        }

        res.json({
            status: 'success',
            data: estudios[0]
        });

    } catch (error) {
        console.error('Error al obtener estudio:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// ============================================================
// POST /api/estudios
// ============================================================
router.post('/', async (req, res) => {
    try {

        const { nombre, descripcion } = req.body;

        const errores = validarEstudio(req.body);

        if (errores.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: errores[0]
            });
        }

        const [resultado] = await db.execute(`
            INSERT INTO estudios
            (
                nombre,
                descripcion
            )
            VALUES (?, ?)
        `, [
            nombre.trim(),
            descripcion.trim()
        ]);

        const [nuevo] = await db.execute(`
            SELECT
                id,
                nombre,
                descripcion,
                created_at
            FROM estudios
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
                message: 'Ya existe un estudio con ese nombre'
            });
        }

        console.error('Error al crear estudio:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// ============================================================
// PUT /api/estudios/:id
// ============================================================
router.put('/:id', async (req, res) => {
    try {

        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const [existente] = await db.execute(
            'SELECT id FROM estudios WHERE id = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Estudio con ID ${id} no encontrado`
            });
        }

        const errores = validarEstudio(req.body);

        if (errores.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: errores[0]
            });
        }

        await db.execute(`
            UPDATE estudios
            SET
                nombre = ?,
                descripcion = ?
            WHERE id = ?
        `, [
            nombre.trim(),
            descripcion.trim(),
            id
        ]);

        const [actualizado] = await db.execute(`
            SELECT
                id,
                nombre,
                descripcion,
                created_at,
                updated_at
            FROM estudios
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
                message: 'Ya existe un estudio con ese nombre'
            });
        }

        console.error('Error al actualizar estudio:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// ============================================================
// DELETE /api/estudios/:id
// ============================================================
router.delete('/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const [estudio] = await db.execute(
            'SELECT id, nombre FROM estudios WHERE id = ?',
            [id]
        );

        if (estudio.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Estudio con ID ${id} no encontrado`
            });
        }

        await db.execute(
            'DELETE FROM estudios WHERE id = ?',
            [id]
        );

        res.json({
            status: 'success',
            data: {
                mensaje: `Estudio "${estudio[0].nombre}" eliminado`
            }
        });

    } catch (error) {

        if (
            error.code === 'ER_ROW_IS_REFERENCED_2' ||
            error.errno === 1451
        ) {
            return res.status(409).json({
                status: 'error',
                message: 'No se puede eliminar el estudio porque tiene animes asociados'
            });
        }

        console.error('Error al eliminar estudio:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../DB/database");
const path = require("path");
const fs = require("fs");

// ============================================================
// GET /api/animes
// ============================================================
router.get("/", async (req, res) => {
  try {
    const [animes] = await db.execute(`
            SELECT
                a.id,
                a.titulo,
                a.descripcion,
                a.imagen,

                a.estudio_id,
                e.nombre AS estudio_nombre,

                a.genero_id,
                g.nombre AS genero_nombre,

                a.created_at,
                a.updated_at

            FROM animes a

            INNER JOIN estudios e
                ON a.estudio_id = e.id

            INNER JOIN generos g
                ON a.genero_id = g.id

            ORDER BY a.id ASC
        `);

    res.json({
      status: "success",
      data: animes,
      count: animes.length,
    });
  } catch (error) {
    console.error("Error al listar animes:", error.message);

    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

// ============================================================
// GET /api/animes/:id
// ============================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [animes] = await db.execute(
      `
            SELECT
                a.id,
                a.titulo,
                a.descripcion,
                a.imagen,

                a.estudio_id,
                e.nombre AS estudio_nombre,

                a.genero_id,
                g.nombre AS genero_nombre,

                a.created_at,
                a.updated_at

            FROM animes a

            INNER JOIN estudios e
                ON a.estudio_id = e.id

            INNER JOIN generos g
                ON a.genero_id = g.id

            WHERE a.id = ?
        `,
      [id],
    );

    if (animes.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `Anime con ID ${id} no encontrado`,
      });
    }

    res.json({
      status: "success",
      data: animes[0],
    });
  } catch (error) {
    console.error("Error al obtener anime:", error.message);

    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

// ============================================================
// POST /api/animes
// ============================================================
router.post("/", (req, res) => {
  const upload = req.app.locals.upload;

  upload.single("imagen")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    try {
      const { titulo, descripcion, estudio_id, genero_id } = req.body;

      if (!titulo || titulo.trim().length < 2) {
        return res.status(400).json({
          status: "error",
          message: "El título es obligatorio",
        });
      }

      if (!descripcion || descripcion.trim().length < 2) {
        return res.status(400).json({
          status: "error",
          message: "La descripción es obligatoria",
        });
      }

      if (!estudio_id || isNaN(Number(estudio_id))) {
        return res.status(400).json({
          status: "error",
          message: "Debe seleccionar un estudio",
        });
      }

      if (!genero_id || isNaN(Number(genero_id))) {
        return res.status(400).json({
          status: "error",
          message: "Debe seleccionar un género",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "La imagen es obligatoria",
        });
      }

      const [estudio] = await db.execute(
        "SELECT id FROM estudios WHERE id = ?",
        [estudio_id],
      );

      if (estudio.length === 0) {
        return res.status(404).json({
          status: "error",
          message: `Estudio con ID ${estudio_id} no encontrado`,
        });
      }

      const [genero] = await db.execute("SELECT id FROM generos WHERE id = ?", [
        genero_id,
      ]);

      if (genero.length === 0) {
        return res.status(404).json({
          status: "error",
          message: `Género con ID ${genero_id} no encontrado`,
        });
      }

      const nombreImagen = req.file.filename;

      const [resultado] = await db.execute(
        `
                INSERT INTO animes
                (
                    titulo,
                    descripcion,
                    imagen,
                    estudio_id,
                    genero_id
                )
                VALUES (?, ?, ?, ?, ?)
            `,
        [
          titulo.trim(),
          descripcion.trim(),
          nombreImagen,
          estudio_id,
          genero_id,
        ],
      );

      const [nuevo] = await db.execute(
        `
                SELECT
                    a.id,
                    a.titulo,
                    a.descripcion,
                    a.imagen,
                    e.nombre AS estudio_nombre,
                    g.nombre AS genero_nombre,
                    a.created_at

                FROM animes a

                INNER JOIN estudios e
                    ON a.estudio_id = e.id

                INNER JOIN generos g
                    ON a.genero_id = g.id

                WHERE a.id = ?
            `,
        [resultado.insertId],
      );

      res.status(201).json({
        status: "success",
        data: nuevo[0],
      });
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }

      console.error("Error al crear anime:", error.message);

      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  });
});

// ============================================================
// PUT /api/animes/:id
// ============================================================
router.put("/:id", (req, res) => {
  const upload = req.app.locals.upload;

  upload.single("imagen")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    try {
      const { id } = req.params;

      const { titulo, descripcion, estudio_id, genero_id } = req.body;

      const [existente] = await db.execute(
        "SELECT id, imagen FROM animes WHERE id = ?",
        [id],
      );

      if (existente.length === 0) {
        return res.status(404).json({
          status: "error",
          message: `Anime con ID ${id} no encontrado`,
        });
      }

      let nombreImagen = existente[0].imagen;

      if (req.file) {
        const rutaAnterior = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "uploads",
          existente[0].imagen,
        );

        fs.unlink(rutaAnterior, () => {});

        nombreImagen = req.file.filename;
      }

      await db.execute(
        `
                UPDATE animes
                SET
                    titulo = ?,
                    descripcion = ?,
                    imagen = ?,
                    estudio_id = ?,
                    genero_id = ?
                WHERE id = ?
            `,
        [
          titulo.trim(),
          descripcion.trim(),
          nombreImagen,
          estudio_id,
          genero_id,
          id,
        ],
      );

      const [actualizado] = await db.execute(
        `
                SELECT
                    a.id,
                    a.titulo,
                    a.descripcion,
                    a.imagen,
                    e.nombre AS estudio_nombre,
                    g.nombre AS genero_nombre,
                    a.updated_at

                FROM animes a

                INNER JOIN estudios e
                    ON a.estudio_id = e.id

                INNER JOIN generos g
                    ON a.genero_id = g.id

                WHERE a.id = ?
            `,
        [id],
      );

      res.json({
        status: "success",
        data: actualizado[0],
      });
    } catch (error) {
      console.error("Error al actualizar anime:", error.message);

      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  });
});

// ============================================================
// DELETE /api/animes/:id
// ============================================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [anime] = await db.execute(
      "SELECT id, titulo, imagen FROM animes WHERE id = ?",
      [id],
    );

    if (anime.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `Anime con ID ${id} no encontrado`,
      });
    }

    const rutaImagen = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      anime[0].imagen,
    );

    fs.unlink(rutaImagen, () => {});

    await db.execute("DELETE FROM animes WHERE id = ?", [id]);

    res.json({
      status: "success",
      data: {
        mensaje: `Anime "${anime[0].titulo}" eliminado`,
      },
    });
  } catch (error) {
    console.error("Error al eliminar anime:", error.message);

    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

module.exports = router;
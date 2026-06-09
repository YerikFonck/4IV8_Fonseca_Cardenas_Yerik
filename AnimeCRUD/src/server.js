const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();

const PORT = process.env.PORT || 3000;

// ============================================================
// CONFIGURACIÓN MULTER
// ============================================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `${Date.now()}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {

    const tiposPermitidos = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif'
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Solo se permiten imágenes JPG, JPEG, PNG, WEBP o GIF'
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

app.locals.upload = upload;

// ============================================================
// MIDDLEWARES
// ============================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use((req, res, next) => {

    console.log(
        `[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`
    );

    next();
});

// ============================================================
// ARCHIVOS ESTÁTICOS
// ============================================================

app.use(
    express.static(
        path.join(__dirname, '..', 'public')
    )
);

// ============================================================
// RUTAS API
// ============================================================

const estudiosRouter = require('./Routers/Estudios');
const generosRouter = require('./Routers/Generos');
const animesRouter = require('./Routers/Animes');

app.use('/api/estudios', estudiosRouter);
app.use('/api/generos', generosRouter);
app.use('/api/animes', animesRouter);

// ============================================================
// DOCUMENTACIÓN API
// ============================================================

app.get('/api', (req, res) => {

    res.json({
        status: 'success',
        message: 'AnimeCRUD API REST',

        endpoints: {

            estudios: {
                listar: 'GET /api/estudios',
                obtener: 'GET /api/estudios/:id',
                crear: 'POST /api/estudios',
                actualizar: 'PUT /api/estudios/:id',
                eliminar: 'DELETE /api/estudios/:id'
            },

            generos: {
                listar: 'GET /api/generos',
                obtener: 'GET /api/generos/:id',
                crear: 'POST /api/generos',
                actualizar: 'PUT /api/generos/:id',
                eliminar: 'DELETE /api/generos/:id'
            },

            animes: {
                listar: 'GET /api/animes',
                obtener: 'GET /api/animes/:id',
                crear: 'POST /api/animes',
                actualizar: 'PUT /api/animes/:id',
                eliminar: 'DELETE /api/animes/:id'
            }
        }
    });
});

// ============================================================
// RUTA API NO ENCONTRADA
// ============================================================

app.use('/api/*path', (req, res) => {

    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });

});

// ============================================================
// MANEJADOR DE ERRORES
// ============================================================

app.use((err, req, res, next) => {

    console.error('Error no manejado:', err);

    if (err instanceof multer.MulterError) {

        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    res.status(500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
    });
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(PORT, () => {

    console.log('====================================');
    console.log('AnimeCRUD iniciado correctamente');
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log('====================================');

});
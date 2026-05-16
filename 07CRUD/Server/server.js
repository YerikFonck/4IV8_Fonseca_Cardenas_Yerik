/* pregunta 1: 
En lugar de importar manualmente 'http', 'fs', 'path' y 'url', utilizamos el framework "EXPRESS.JS". Este framework une y simplifica la creación del servidor para Backend */
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

/* reemplazo 'leerBody': 
Express incluye middlewares nativos. Esta línea reemplaza por completo la función manual 'leerBody(req)' que usaba promesas y eventos ('data', 'end') para parsear el JSON entrante */
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'pnt_practica1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const db = pool.promise();

/* pregunta 2:
 Con un framework EXPRESS.JS, reducimos todo el bloque de codigo a esta única línea de abajo, el middleware 'express.static' mapea automáticamente la  carpeta, lee los archivos de tipo MIME correspondientes por ti :]*/
app.use(express.static(path.join(__dirname, 'public')));

/* peticiones LOG:
hacemos un middleware para imprmir en consola cada petición */
app.use((req, res, next) => {
    console.log([${new Date().toLocaleTimeString()}] ${req.method} ${req.path});
    next();
});

app.get('/api/datos', async (req, res) => {
    try {
        // Aquí puedes realizar consultas asíncronas usando la "promesa" 'db'
        res.status(200).json({ 
            status: "Éxito", 
            mensaje: "Servidor Backend simplificado y conectado exitosamente." 
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno en el servidor o base de datos." });
    }
});

/* inicializacion del servidor:
Reemplazamos al server.listen del módulo HTTP nativo. */
app.listen(PORT, () => {
    console.log('Servidor inicializado con Express.js en el puerto: ' + PORT);
    console.log('Para salir presiona CTRL + C');
});
const mysql = require('mysql2');

//creamos la conexion
const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'CalebCar/23',
    database : 'Animecrud',
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0
});

//la exportamos para poder usarla
module.exports = pool.promise();
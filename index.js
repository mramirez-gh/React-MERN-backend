const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

console.log(process.env);

//crear el servidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio público
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//rutas
app.use('/api/auth', require('./routes/auth'));

// TODO: CRUD: eventos
app.use('/api/events', require('./routes/events'));

//excuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Sevidor corriendo en el puerto ${process.env.PORT}`);    
});


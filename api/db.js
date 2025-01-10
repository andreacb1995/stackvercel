const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Lee la URI desde el archivo .env
const cliente = new MongoClient(uri); 

async function conectarDB() {
    try {
        await cliente.connect();
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error(err);
    } 
}

conectarDB();

const baseDatos = cliente.db('vercel'); 
const coleccion = baseDatos.collection('usuarios'); 

module.exports = { cliente, baseDatos, coleccion };
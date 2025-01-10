const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
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
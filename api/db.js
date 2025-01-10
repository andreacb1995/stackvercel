const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://andreacarballidoballesteros:NoayArya2619@cluster0.43rf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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
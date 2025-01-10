
  require('dotenv').config();
  const express = require('express');
  const app = express();
  const path = require('path');
  const { cliente, baseDatos, coleccion } = require('./db'); // Importar la conexión a MongoDB
  const cors = require('cors'); // Importar cors
  const bodyParser = require('body-parser');
  const bcrypt = require('bcrypt');
  const { ObjectId } = require('mongodb'); // Importar ObjectId

  const helmet = require('helmet');
  const morgan = require('morgan');

  // Usar cors para permitir solicitudes desde cualquier origen (o especificar un origen)
  app.use(cors());

  app.use(bodyParser.json());  // Asegúrate de que el cuerpo de la solicitud esté parseado como JSON
  app.use(morgan('dev'));
  app.use(express.json());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://code.jquery.com", "https://stackpath.bootstrapcdn.com"],
        },
      },
    })
  );

  // Sirve archivos estáticos desde la carpeta "public"
  app.use(express.static(path.join(__dirname, '../public')));

  // Ruta principal para servir index.html
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // Ruta para /api
  app.get('/api', (req, res) => {
    res.json({
        message: 'Bienvenido a la API',
        status: 'success',
    });
  });

  // Ruta para obtener todos los usuarios
  app.get('/api/usuarios', async (req, res) => {
    try {
      console.log('Consulta a la base de datos iniciada');

      const usuarios = await coleccion.find().toArray(); // Obtener todos los usuarios
      console.log('Usuarios obtenidos:', usuarios);

      res.json(usuarios);
    } catch (err) {
      console.error('Error al consultar los usuarios: ', err);
      res.status(500).json({ error: 'Error en la consulta' });
    }
  });

  // Ruta para obtener un usuario por su ID
  app.get('/api/usuarios/:id', async (req, res) => {
    const usuarioId = req.params.id;

    try {
      // Validar que el ID proporcionado es válido
      if (!ObjectId.isValid(usuarioId)) {
        return res.status(400).json({ error: 'ID de usuario no válido' });
      }
  
      const usuario = await coleccion.findOne({ _id: new ObjectId(usuarioId) }); // Buscar usuario por ID
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json(usuario);
    } catch (err) {
      console.error('Error al consultar el usuario:', err);
      res.status(500).json({ error: 'Error al buscar el usuario' });
    }
  });

 // Ruta para crear un usuario
app.post('/api/crearusuario', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validar que los datos necesarios estén presentes
    if (!username || !password) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await coleccion.findOne({ username });

    if (usuarioExistente) {
      return res.status(409).json({ mensaje: 'El usuario ya existe.' });
    }

    // Hash de la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el usuario en la base de datos
    const resultado = await coleccion.insertOne({ username, password: hashedPassword });

    const nuevoUsuario = {
      id: resultado.insertedId, // Obtiene el ID generado automáticamente por MongoDB
      username: username,
    };

    // Enviar respuesta con el nuevo usuario
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error('Error al guardar el usuario:', err);
    res.status(500).json({ error: 'Error al guardar el usuario' });
  }
});

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
  });

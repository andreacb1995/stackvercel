/**
 * Escucha el evento 'DOMContentLoaded' y ejecuta el código inicial al cargar la página.
 */
document.addEventListener("DOMContentLoaded", function() {

  const resultadoDiv = document.getElementById('mostrarusuario');

  // Selecciona la pestaña activa al cargar la página y muestra la sección correspondiente
  const activeTab = document.querySelector('.nav-link.active'); 
  if (activeTab) {
    mostrarSeccion('tarjetasUsuarios');
    cargarUsuarios();
  }

  /**
   * Evento click para listar usuarios.
   * @param {Event} event - El evento generado al hacer clic.
   */
  document.getElementById('listarUsuarios').addEventListener('click', function(event) {
      event.preventDefault();
      resultadoDiv.style.display = 'none';
      mostrarSeccion('tarjetasUsuarios');
      cargarUsuarios();
    });

  /**
   * Evento click para mostrar el formulario de creación de usuario.
   * @param {Event} event - El evento generado al hacer clic.
   */
  document.getElementById('addUsuario').addEventListener('click', function(event) {
      event.preventDefault();
      formUsuario.reset();
      resultadoDiv.style.display = 'none';
      mostrarSeccion('CrearUsuario');
  });

  /**
   * Evento click para buscar un usuario por ID.
   * @param {Event} event - El evento generado al hacer clic.
   */
  document.getElementById('buscarId').addEventListener('click', function(event) {
      event.preventDefault();
      document.getElementById('usuarioId').value = '';
      resultadoDiv.style.display = 'none';
      mostrarSeccion('BuscarUsuario');
  });

  // Seleccionar todas las pestañas
  const tabs = document.querySelectorAll('.nav-link');

  /**
   * Añade un evento de clic a cada pestaña para cambiar la sección activa.
   */
  tabs.forEach(tab => {
      tab.addEventListener('click', function(event) {
          event.preventDefault();
          tabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          const sectionId = this.id;
      });
  });

  // Seleccionar el formulario de creación de usuario
  const formUsuario = document.getElementById('formCrearUsuario');

  /**
   * Evento submit para enviar los datos del formulario de creación de usuario.
   * @param {Event} event - El evento generado al enviar el formulario.
   */
  formUsuario.addEventListener('submit', function(event) {
    event.preventDefault();

     // Obtener los valores de los campos del formulario
     const username = document.getElementById('username').value;
     const clave = document.getElementById('clave').value;
 
     // Validar que los campos no estén vacíos
     if (!username || !clave) {
       alert("Por favor, completa todos los campos.");
       return;
     }
 
     // Crear el objeto de datos a enviar
     const usuario = {
       username: username,
       password: clave
     };
 
     // Enviar los datos al servidor
     fetch('https://mi-backend.vercel.app/api/crearusuario', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(usuario)
     })
     .then(response => response.json())
     .then(data => {
          console.log('Usuario guardado:', data);
          mostrarMensajeExito('Usuario guardado exitosamente.');
      })
     .catch(error => {
       console.error('Error al guardar el usuario:', error);
       mostrarMensajeError('Error al guardar el usuario');          
    });
  });

  /**
   * Evento submit para buscar un usuario por su ID.
   * @param {Event} event - El evento generado al enviar el formulario.
   */
  const buscarForm = document.querySelector('#BuscarUsuario form');
  buscarForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const usuarioId = document.getElementById('usuarioId').value;
      
      if (!usuarioId) {
          mostrarMensajeError('Por favor, ingrese un ID para buscar.');
          return;
      }

      fetch(`https://mi-backend.vercel.app/api/usuarios/${usuarioId}`, {
          method: 'GET',
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Usuario no encontrado');
          }
          return response.json();
      })
      .then(data => {
          if (data) {
              mostrarDatosUsuario(data);
          } else {
              mostrarMensajeError('Usuario no encontrado.');
          }
      })
      .catch(error => {
          console.error('Error al buscar el usuario:', error);
          mostrarMensajeError('Hubo un problema al buscar el usuario.');
      });
  });
});

/**
 * Cambia la sección visible en la página.
 * @param {string} seccion - El ID de la sección a mostrar.
 */
function mostrarSeccion(seccion) {
    document.getElementById("tarjetasUsuarios").style.display = "none";
    document.getElementById("CrearUsuario").style.display = "none";
    document.getElementById("BuscarUsuario").style.display = "none";
    document.getElementById(seccion).style.display = "block";
}

/**
 * Carga la lista de usuarios desde el servidor.
 */
function cargarUsuarios() {
    fetch('https://mi-backend.vercel.app/api/usuarios', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(usuarios => {
      mostrarUsuario(usuarios);
    })
    .catch(error => console.error('Error:', error));
}

/**
 * Muestra las tarjetas con la información de los usuarios.
 * @param {Array} usuarios - Lista de usuarios obtenida del servidor.
 */
function mostrarUsuario(usuarios) {
    const cardsContainer = document.getElementById('tarjetasUsuarios');
    cardsContainer.innerHTML = ''; 
  
    const row = document.createElement('div');
    row.classList.add('row', 'mx-n1');
  
    usuarios.forEach(usuario => {
        const col = document.createElement('div');
        col.classList.add('col-md-3', 'mb-4');
        
        const card = crearTarjetaAlumno(usuario);
        col.appendChild(card);
        row.appendChild(col);
    });
  
    cardsContainer.appendChild(row);
}

/**
 * Crea una tarjeta con los datos de un usuario.
 * @param {Object} usuario - Datos del usuario.
 * @returns {HTMLElement} La tarjeta creada.
 */
function crearTarjetaAlumno(usuario) {
    const card = document.createElement('div');
    card.classList.add('card', 'h-100');
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title text-primary font-weight-bold">${usuario.username}</h5>
        <h6 class="card-subtitle text-muted mb-2">ID: ${usuario._id}</h6>
      </div>
    `;
    return card;
}

/**
 * Muestra los datos de un usuario en una tarjeta.
 * @param {Object} usuario - Datos del usuario.
 */
function mostrarDatosUsuario(usuario) {
    const resultadoDiv = document.getElementById('mostrarusuario');
    resultadoDiv.style.display = 'flex';
    resultadoDiv.innerHTML = `
    <div class="card-body">
        <h4>Datos del Usuario:</h4>
        <p><strong>Nombre de Usuario:</strong> ${usuario.username}</p>
        <p><strong>ID:</strong> ${usuario._id}</p>
    </div>
    `;
}

/**
 * Muestra un mensaje de error al usuario.
 * @param {string} mensaje - El mensaje de error a mostrar.
 */
function mostrarMensajeError(mensaje) {
    const resultadoDiv = document.getElementById('resultadoBusqueda');
    resultadoDiv.innerHTML = `<p style="color: red;">${mensaje}</p>`;
    resultadoDiv.style.display = 'flex';
    setTimeout(() => {
        resultadoDiv.style.display = 'none';
    }, 3000);
}

/**
 * Muestra un mensaje de éxito al usuario.
 * @param {string} mensaje - El mensaje de éxito a mostrar.
 */
function mostrarMensajeExito(mensaje) {
    const resultadoDiv = document.getElementById('resultadoBusqueda');
    resultadoDiv.style.display = 'flex';
    resultadoDiv.innerHTML = `<p style="color: green;">${mensaje}</p>`;
    setTimeout(() => {
        resultadoDiv.style.display = 'none';
    }, 3000);
}

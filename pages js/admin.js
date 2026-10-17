import Cliente from "../src/Cliente.js";
import CuentaAhorros from "../src/CuentaAhorros.js";
import CuentaCorriente from "../src/CuentaCorriente.js";
import TarjetaCredito from "../src/TarjetaCredito.js";

const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let identificacionOriginal = null;
function generarNumeroCuenta(prefijo) {
    let numeroCuenta;
    do {
        const numeroAleatorio = Math.floor(
            Math.random() * 10000000
        ).toString().padStart(7, "0");

        numeroCuenta = prefijo + numeroAleatorio;

    } while (
        listaUsuarios.some(function (cliente) {
            return (cliente.cuentas || []).some(function (cuenta) {
                return cuenta.numeroCuenta === numeroCuenta;
            });
        })
    );
    return numeroCuenta;
}

const tipoUsuarioActivo = sessionStorage.getItem("tipoUsuarioActivo");

if (tipoUsuarioActivo !== "administrador") {
    window.location.href = "login.html";
}

const tablaUsuarios = document.getElementById("tablaUsuarios");
const btnRegistrarUsuario = document.getElementById("btnRegistrarUsuario");
const formularioRegistro = document.getElementById("formularioRegistro");
const btnCancelarRegistro = document.getElementById("btnCancelarRegistro");
const formAdmin = document.getElementById("formAdmin");
const registrarModificarUsuario = document.getElementById("registrarModificarUsuario");
const cerrarSesion  = document.getElementById("cerrarSesion")
cerrarSesion.addEventListener("click", function(){
    sessionStorage.removeItem("tipoUsuarioActivo");
    window.location.href = "login.html";
})

btnRegistrarUsuario.addEventListener("click", function() {
    identificacionOriginal = null;

    formularioRegistro.style.display = "block";
    formAdmin.reset();

    registrarModificarUsuario.textContent = "Registrar nuevo usuario";
});


btnCancelarRegistro.addEventListener("click", function() {
    formularioRegistro.style.display = "none";
    formAdmin.reset();

    // Salir del modo edición
    identificacionOriginal = null;

    // Restaurar el texto del botón
    formAdmin.querySelector(
        'button[type="submit"]'
    ).textContent = "Guardar usuario";

    registrarModificarUsuario.textContent = "Registrar nuevo usuario";
});

const adminIdentificacion = document.getElementById("adminIdentificacion");
const adminNombre = document.getElementById("adminNombre");
const adminCelular = document.getElementById("adminCelular");
const adminUsuario = document.getElementById("adminUsuario");
const adminClave = document.getElementById("adminClave");
const adminConfirmarClave = document.getElementById("adminConfirmarClave");


function mostrarUsuarios() {
    tablaUsuarios.innerHTML = "";

    listaUsuarios.forEach(function(usuario) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.usuario}</td>
            <td>
                <span class="badge badge-success">Activo</span>
            </td>
            <td>
                <button
                    type="button"
                    class="btn btn-secondary btnEditar"
                    data-usuario="${usuario.id}">
                    Editar
                </button>
                <button
                    type="button"
                    class="btn btn-danger btnEliminar"
                    data-usuario="${usuario.id}">
                    Eliminar
                </button>
            </td>
        `;

        tablaUsuarios.appendChild(fila);
    });
}

mostrarUsuarios();

formAdmin.addEventListener("submit", function(event) {
    event.preventDefault();

    
    // Comprobar si estamos editando un cliente
    if (identificacionOriginal !== null) {

        // Buscar al cliente que estamos editando
        const cliente = listaUsuarios.find(function(usuario) {
            return String(usuario.id) === identificacionOriginal;
        });

        if (!cliente) {
            alert("No se encontró el cliente que deseas editar.");
            return;
        }

        // Validar que la nueva identificación no pertenezca a otro cliente
        const identificacionExiste = listaUsuarios.some(function(usuario) {
            return String(usuario.id) === adminIdentificacion.value.trim()
                && String(usuario.id) !== identificacionOriginal;
        });

        if (identificacionExiste) {
            alert("Esa identificación ya pertenece a otro cliente.");
            return;
        }

        // Validar que el nombre de usuario no pertenezca a otro cliente
        const usuarioExiste = listaUsuarios.some(function(usuario) {
            return usuario.usuario === adminUsuario.value.trim()
                && String(usuario.id) !== identificacionOriginal;
        });

        if (usuarioExiste) {
            alert("Ese nombre de usuario ya pertenece a otro cliente.");
            return;
        }

        // Actualizar únicamente los datos personales
        cliente.id = adminIdentificacion.value.trim();
        cliente.nombre = adminNombre.value.trim();
        cliente.celular = adminCelular.value.trim();
        cliente.usuario = adminUsuario.value.trim();

        // Cambiar la contraseña solo si se escribió una nueva
        if (adminClave.value !== "" || adminConfirmarClave.value !== "") {

            if (adminClave.value !== adminConfirmarClave.value) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            cliente.clave = adminClave.value;
        }

        // Guardar los cambios
        localStorage.setItem(
            "usuarios",
            JSON.stringify(listaUsuarios)
        );

        // Restablecer el formulario
        identificacionOriginal = null;
        formAdmin.reset();
        formularioRegistro.style.display = "none";

        // Restaurar el texto del botón
        formAdmin.querySelector(
            'button[type="submit"]'
        ).textContent = "Guardar usuario";

        // Actualizar la tabla
        mostrarUsuarios();

        alert("Datos del cliente actualizados correctamente.");

        return;
    }

    
    // 1. Validar que las contraseñas coincidan
    if (adminClave.value !== adminConfirmarClave.value) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // 2. Comprobar si la identificación ya existe
    const identificacionExiste = listaUsuarios.some(function(cliente) {
        return cliente.id === adminIdentificacion.value.trim();
    });

    if (identificacionExiste) {
        alert("Ya existe un usuario con esa identificación.");
        return;
    }

    // 3. Comprobar si el nombre de usuario ya existe
    const usuarioExiste = listaUsuarios.some(function(cliente) {
        return cliente.usuario === adminUsuario.value.trim();
    });

    if (usuarioExiste) {
        alert("Ese nombre de usuario ya está registrado.");
        return;
    }

    // 4. Crear el objeto Cliente
    const cliente = new Cliente(
        adminIdentificacion.value.trim(),
        adminNombre.value.trim(),
        adminCelular.value.trim(),
        adminUsuario.value.trim(),
        adminClave.value
    );

    // 5. Generar los números de las cuentas
    const numeroCuentaAhorros = generarNumeroCuenta("1");
    const numeroCuentaCorriente = generarNumeroCuenta("2");

    // 6. Crear las cuentas con saldo inicial de cero
    const cuentaAhorros = new CuentaAhorros(
        numeroCuentaAhorros,
        0
    );

    const cuentaCorriente = new CuentaCorriente(
        numeroCuentaCorriente,
        0
    );

    // 7. Crear la tarjeta de crédito con cupo de $3.000.000
    const numeroTarjetaCredito = generarNumeroCuenta("7");

    const tarjetaCredito = new TarjetaCredito(
        numeroTarjetaCredito,
        3000000
    );

    // 8. Preparar los datos para guardarlos en localStorage
    const datosGuardar = {
        id: cliente.getNumeroIdentificacion(),
        nombre: cliente.getNombreCompleto(),
        celular: cliente.getNumeroCelular(),
        usuario: cliente.getNombreUsuario(),
        clave: cliente.getContrasenia(),
        intentos: cliente.getIntentosRestantes(),
        bloqueado: cliente.getBloqueadoHasta(),

        cuentas: [
            {
                numeroCuenta: cuentaAhorros.getNumeroCuenta(),
                tipo: "ahorros",
                saldo: cuentaAhorros.getSaldo(),
                movimientos: []
            },
            {
                numeroCuenta: cuentaCorriente.getNumeroCuenta(),
                tipo: "corriente",
                saldo: cuentaCorriente.getSaldo(),
                movimientos: []
            }
        ],

        tarjetaCredito: {
            numeroTarjeta: tarjetaCredito.getNumeroTarjeta(),
            cupoTotal: tarjetaCredito.getCupoTotal(),
            cupoDisponible: tarjetaCredito.getCupoDisponible(),
            deudaActual: tarjetaCredito.getDeudaActual(),
            compras: []
        }
    };

    // 9. Agregar el cliente a la lista
    listaUsuarios.push(datosGuardar);

    // 10. Guardar la lista actualizada
    localStorage.setItem(
        "usuarios",
        JSON.stringify(listaUsuarios)
    );

    // 11. Actualizar la tabla y limpiar el formulario
    mostrarUsuarios();
    formAdmin.reset();
    formularioRegistro.style.display = "none";

    alert("Cliente registrado correctamente.");
});


tablaUsuarios.addEventListener("click", function(event) {

    // Comprobar si se pulsó un botón Eliminar
    if (event.target.classList.contains("btnEliminar")) {

        // Obtener la identificación del cliente
        const identificacion = event.target.dataset.usuario;

        // Pedir confirmación antes de eliminar
        const confirmar = confirm(
            "¿Estás seguro de que deseas eliminar este cliente?"
        );

        if (!confirmar) {
            return;
        }

        // Buscar la posición del cliente en la lista
        const indice = listaUsuarios.findIndex(function(usuario) {
            return String(usuario.id) === identificacion;
        });

        // Eliminar al cliente si existe
        if (indice !== -1) {
            listaUsuarios.splice(indice, 1);

            // Guardar los cambios
            localStorage.setItem(
                "usuarios",
                JSON.stringify(listaUsuarios)
            );

            // Actualizar la tabla
            mostrarUsuarios();

            alert("Cliente eliminado correctamente.");
        }
    }

    
    // Comprobar si se pulsó el botón Editar
    if (event.target.classList.contains("btnEditar")) {

        registrarModificarUsuario.textContent = "Editar Usuario"
        // Obtener la identificación del cliente seleccionado
        const identificacion = event.target.dataset.usuario;

        // Buscar al cliente en la lista
        const cliente = listaUsuarios.find(function(usuario) {
            return String(usuario.id) === identificacion;
        });

        if (!cliente) {
            alert("No se encontró el cliente.");
            return;
        }

        // Guardar su identificación original
        identificacionOriginal = String(cliente.id);
        registrarModificarUsuario.textContent = "Modificar usuario";

        // Cargar los datos actuales en el formulario
        adminIdentificacion.value = cliente.id;
        adminNombre.value = cliente.nombre;
        adminCelular.value = cliente.celular;
        adminUsuario.value = cliente.usuario;

        // Dejar las contraseñas vacías por ahora
        adminClave.value = "";
        adminConfirmarClave.value = "";

        // Mostrar el formulario
        formularioRegistro.style.display = "block";

        // Cambiar el texto del botón de guardar
        formAdmin.querySelector(
            'button[type="submit"]'
        ).textContent = "Guardar cambios";

        return;
    }

});

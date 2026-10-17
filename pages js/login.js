const formLogin = document.getElementById("formLogin")

const usuario = document.getElementById("usuario");
const clave = document.getElementById("clave")
const intentos = document.getElementById("intentos")
const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
//Para identificar el admin al momento de iniciar sesión
const administrador = JSON.parse(localStorage.getItem("administrador"));

function actualizarIntentos(cliente) {
    if (!cliente) {
        intentos.textContent = "-";
        return;
    }
    if (cliente.bloqueado !== null && cliente.bloqueado > Date.now()) {
        intentos.textContent = "Bloqueado";
        return;
    }
    intentos.textContent = cliente.intentos;
}

formLogin.addEventListener("submit", function (event) {

    event.preventDefault();
    //1. Buscar el usuario por nombre de usuario
    const usuarioEncontrado = listaUsuarios.find(function (cliente) {
        return cliente.usuario === usuario.value;
    })

    if (
        administrador &&
        usuario.value === administrador.usuario &&
        clave.value === administrador.clave
    ) {
        // Crear la sesión del administrador
        sessionStorage.setItem("tipoUsuarioActivo", "administrador");

        // Redirigir al panel administrativo
        window.location.href = "admin.html";
        return;
    }

    // 2. Comprobar si el usuario existe 
    if (!usuarioEncontrado) {
        alert("Usuario NO encontrado. Intente nuevamente."); return;
    }

    // 3. Comprobar si la cuenta está bloqueada
    if (usuarioEncontrado.bloqueado !== null) {
        if (usuarioEncontrado.bloqueado > Date.now()) {
            const milisegundosRestantes =
                usuarioEncontrado.bloqueado - Date.now();
            const minutosRestantes =
                Math.ceil(milisegundosRestantes / 60000);
            const horasRestantes =
                Math.floor(minutosRestantes / 60);
            const minutos =
                minutosRestantes % 60;
            alert(`Esta cuenta se encuentra BLOQUEADA.

Tiempo restante aproximado: ${horasRestantes} horas y ${minutos} minutos.`);
            actualizarIntentos(usuarioEncontrado)
            return;
        } else { // El bloqueo venció: restaurar los intentos 
            usuarioEncontrado.intentos = 3; usuarioEncontrado.bloqueado = null; localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
            actualizarIntentos(usuarioEncontrado)
        }
    } // 4. Validar la contraseña
    if (usuarioEncontrado.clave === clave.value) {
        alert(`Inicio de sesión correcto.

Bienvenid@ ${usuarioEncontrado.nombre}`);
        // Restaurar los intentos después del acceso correcto
        usuarioEncontrado.intentos = 3;
        localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
        actualizarIntentos(usuarioEncontrado);
        sessionStorage.setItem("usuarioActivo", usuarioEncontrado.usuario);
        sessionStorage.setItem("tipoUsuarioActivo", "cliente");
       window.location.href = "dashboard.html";
    } else {
        // 5. Descontar un intento por contraseña incorrecta
        usuarioEncontrado.intentos--;
        actualizarIntentos(usuarioEncontrado)
        // 6. Bloquear la cuenta al llegar a cero
        if (usuarioEncontrado.intentos === 0) {
            usuarioEncontrado.bloqueado = Date.now() + 86400000;
            alert(`Has agotado tus tres intentos.

Tu cuenta ha sido bloqueada durante 24 horas.`);
actualizarIntentos(usuarioEncontrado)
        } else {
            alert(`Contraseña incorrecta.`);
actualizarIntentos(usuarioEncontrado)
        }
        // 7. Guardar los cambios
        localStorage.setItem(
            "usuarios",
            JSON.stringify(listaUsuarios)
        );
    }
});
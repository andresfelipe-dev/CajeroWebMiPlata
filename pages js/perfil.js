import Cliente from "../src/Cliente.js"

const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioActivo = sessionStorage.getItem("usuarioActivo");
const clienteActual = listaUsuarios.find(function (cliente) {
    return cliente.usuario === usuarioActivo
});

const formPerfil = document.getElementById("formPerfil");
const identificacion = document.getElementById("identificacion");
const nombreCompleto = document.getElementById("nombreCompleto");
const celular = document.getElementById("celular");
const nombreUsuario = document.getElementById("nombreUsuario");
const formContrasenia = document.getElementById("formContrasenia");
const usuarioContrasenia = document.getElementById("usuarioContrasenia")
const contraseniaActual = document.getElementById("contraseniaActual");
const nuevaContrasenia = document.getElementById("nuevaContrasenia");
const confirmarContrasenia = document.getElementById("confirmarContrasenia");

if (!usuarioActivo || !clienteActual) {
    window.location.href = "login.html"
}

if (clienteActual) {
    const cliente = new Cliente(
        clienteActual.id,
        clienteActual.nombre,
        clienteActual.celular,
        clienteActual.usuario,
        clienteActual.clave,
        clienteActual.intentos,
        clienteActual.bloqueado
    )

    identificacion.value = cliente.getNumeroIdentificacion();
    nombreCompleto.value = cliente.getNombreCompleto();
    celular.value = cliente.getNumeroCelular();
    nombreUsuario.value = cliente.getNombreUsuario();

    formPerfil.addEventListener("submit", function (event) {
        event.preventDefault();

        const nuevaIdentificacion = identificacion.value.trim();
        const nuevoNombre = nombreCompleto.value.trim();
        const nuevoCelular = celular.value.trim();
        const nuevoUsuario = nombreUsuario.value.trim();

        if(!nuevaIdentificacion || !nuevoNombre || !nuevoCelular || !nuevoUsuario){
            alert(`Todos los campos son obligatorios.`)
            return;
        }

        const identifiacionRepetida = listaUsuarios.find(function(usuario){
            return usuario.id === nuevaIdentificacion && usuario.usuario !== usuarioActivo;
        })

        if(identifiacionRepetida){
            alert(`Esta identificación ya está registrada.`)
            return;
        }

        const usuarioRepetido = listaUsuarios.find(function(usuario){
            return usuario.usuario === nuevoUsuario && usuario.usuario !== usuarioActivo;
        })

        if(usuarioRepetido){
            alert(`Este nombre de usuario ya existe dentro del sistema.`)
            return;
        }
        //Esto modifica la instancia del objeto creado
        cliente.setNumeroIdentificacion(identificacion.value);
        cliente.setNombreCompleto(nombreCompleto.value);
        cliente.setNumeroCelular(celular.value);
        cliente.setNombreUsuario(nombreUsuario.value);

        //Translada los cambios a el objeto que hay dentro del array de usuarios
        clienteActual.id = cliente.getNumeroIdentificacion();
        clienteActual.nombre = cliente.getNombreCompleto();
        clienteActual.celular = cliente.getNumeroCelular();
        clienteActual.usuario = cliente.getNombreUsuario();
        //Guardar el nombre de usuario en la session activa en caso de cambiar nombre de usuario
        sessionStorage.setItem("usuarioActivo", nuevoUsuario)

        //Guardar los datos en localStorage
        localStorage.setItem("usuarios", JSON.stringify(listaUsuarios))
        alert(`Perfil actualizado correctamente.`)
    })

    formContrasenia.addEventListener("submit", function(event){
        event.preventDefault();

        const usuarioIngresado = usuarioContrasenia.value.trim();
    const claveActualIngresada = contraseniaActual.value;
    const nuevaClave = nuevaContrasenia.value;
    const confirmarClave = confirmarContrasenia.value;

    if (usuarioIngresado !== clienteActual.usuario) {
        alert("El usuario ingresado no corresponde al usuario de la sesión.");
        return;
    }

    if (claveActualIngresada !== clienteActual.clave) {
        alert("La contraseña actual es incorrecta.");
        return;
    }

    if (nuevaClave !== confirmarClave) {
        alert("La nueva contraseña y su confirmación no coinciden.");
        return;
    }

    cliente.setContrasenia(nuevaClave);

    clienteActual.clave = cliente.getContrasenia();

    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

    alert("Contraseña actualizada correctamente.");

    formContrasenia.reset();
    })
}
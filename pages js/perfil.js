import "./vencimientosCDT.js";
import RepositorioBancario from "../src/RepositorioBancario.js";
import {mostrarMensaje} from "./mensajes.js";
const repo = new RepositorioBancario();
const elemento = id => document.getElementById(id);
let usuarioActivo = sessionStorage.getItem("usuarioActivo");
let cliente = repo.buscarCliente(usuarioActivo);
if (sessionStorage.getItem("tipoUsuarioActivo") !== "cliente" || !cliente) window.location.href = "login.html";

/** Muestra los datos actuales del perfil sin mostrar la contraseña. */
function cargarPerfil() {
    if (!cliente) return;
    elemento("identificacion").value = cliente.id;
    elemento("nombreCompleto").value = cliente.nombre;
    elemento("celular").value = cliente.celular;
    elemento("nombreUsuario").value = cliente.usuario;
}

/** Modifica los datos personales sin alterar las cuentas. */
elemento("formPerfil").addEventListener("submit", event => {
    event.preventDefault();
    try {
        const datos = {id: elemento("identificacion").value.trim(), nombre: elemento("nombreCompleto").value.trim(),
            celular: elemento("celular").value.trim(), usuario: elemento("nombreUsuario").value.trim()};
        if (!Object.values(datos).every(Boolean)) throw new Error("Todos los campos son obligatorios.");
        cliente = repo.actualizarCliente(cliente.id, datos);
        usuarioActivo = cliente.usuario;
        sessionStorage.setItem("usuarioActivo", usuarioActivo);
        mostrarMensaje("Perfil actualizado correctamente.");
    } catch (error) { mostrarMensaje(error.message, "error"); }
});

/** Cambia la contraseña solo si la actual es correcta. */
elemento("formContrasenia").addEventListener("submit", event => {
    event.preventDefault();
    const actual = elemento("contraseniaActual").value;
    const nueva = elemento("nuevaContrasenia").value;
    if (elemento("usuarioContrasenia").value.trim() !== cliente.usuario || actual !== cliente.clave) return mostrarMensaje("Usuario o contraseña actual incorrectos.", "error");
    if (!nueva || nueva !== elemento("confirmarContrasenia").value) return mostrarMensaje("La nueva contraseña no coincide.", "error");
    cliente = repo.actualizarCliente(cliente.id, {...cliente, clave: nueva});
    elemento("formContrasenia").reset();
    mostrarMensaje("Contraseña actualizada correctamente.");
});
cargarPerfil();

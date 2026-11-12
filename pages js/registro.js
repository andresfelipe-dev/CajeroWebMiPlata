import RepositorioBancario from "../src/RepositorioBancario.js";
import {mostrarMensaje} from "./mensajes.js";
const repositorio = new RepositorioBancario();

/** Registra un cliente con sus dos cuentas y tarjeta. */
document.getElementById("formRegistro").addEventListener("submit", event => {
    event.preventDefault();
    const dato = id => document.getElementById(id).value.trim();
    if (dato("clave") !== dato("confirmar")) return mostrarMensaje("Las contraseñas no coinciden.", "error");
    try {
        repositorio.crearCliente({id: dato("id"), nombre: dato("nombre"), celular: dato("celular"), usuario: dato("usuario"), clave: dato("clave")});
        mostrarMensaje("Registro completado. Redirigiendo al inicio de sesión.");
        setTimeout(() => { window.location.href = "login.html"; }, 1100);
    } catch (error) { mostrarMensaje(error.message, "error"); }
});
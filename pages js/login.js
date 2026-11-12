import RepositorioBancario from "../src/RepositorioBancario.js";
import Administrador from "../src/Administrador.js";
import {mostrarMensaje} from "./mensajes.js";
const repositorio = new RepositorioBancario();
const form = document.getElementById("formLogin");
const usuarioCampo = document.getElementById("usuario");
const claveCampo = document.getElementById("clave");
const intentos = document.getElementById("intentos");

/** Actualiza el contador de intentos según el cliente consultado. */
function actualizarIntentos() {
    const cliente = repositorio.buscarCliente(usuarioCampo.value.trim());
    intentos.textContent = cliente ? ((cliente.bloqueado && cliente.bloqueado > Date.now()) ? "Bloqueado" : String(cliente.intentos ?? 3)) : "3";
}
usuarioCampo.addEventListener("input", actualizarIntentos);

/** Autentica al administrador o al cliente y crea su sesión. */
form.addEventListener("submit", event => {
    event.preventDefault();
    const usuario = usuarioCampo.value.trim();
    const clave = claveCampo.value;
    try {
        const credenciales = JSON.parse(localStorage.getItem("administrador") || "null");
        if (credenciales && new Administrador(credenciales.usuario, credenciales.clave).validarAcceso(usuario, clave)) {
            sessionStorage.removeItem("usuarioActivo");
            sessionStorage.setItem("tipoUsuarioActivo", "administrador");
            window.location.href = "admin.html";
            return;
        }
        const cliente = repositorio.autenticarCliente(usuario, clave);
        sessionStorage.setItem("usuarioActivo", cliente.usuario);
        sessionStorage.setItem("tipoUsuarioActivo", "cliente");
        window.location.href = "dashboard.html";
    } catch (error) {
        actualizarIntentos();
        mostrarMensaje(error.message, "error");
    }
});

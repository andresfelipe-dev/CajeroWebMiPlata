import ServicioBancario from "../src/ServicioBancario.js";
import {mostrarMensaje} from "./mensajes.js";
const servicio = new ServicioBancario();
const usuario = sessionStorage.getItem("usuarioActivo");
if (sessionStorage.getItem("tipoUsuarioActivo") !== "cliente" || !usuario) window.location.href = "login.html";

/** Retira dinero y aplica intereses o sobregiro mediante la clase de cuenta. */
document.getElementById("formRetirar").addEventListener("submit", event => {
    event.preventDefault();
    try {
        const resultado = servicio.retirar(usuario, document.getElementById("cuentaSeleccionada").value, Number(document.getElementById("montoRetirar").value));
        mostrarMensaje(`Retiro realizado. Saldo: $${resultado.saldo.toLocaleString("es-CO")}` + (resultado.intereses ? ` · Intereses: $${resultado.intereses.toLocaleString("es-CO")}` : ""));
        document.getElementById("montoRetirar").value = "";
    } catch (error) { mostrarMensaje(error.message, "error"); }
});

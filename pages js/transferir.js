import "./vencimientosCDT.js";
import ServicioBancario from "../src/ServicioBancario.js";
import {mostrarMensaje} from "./mensajes.js";
const servicio = new ServicioBancario();
const usuario = sessionStorage.getItem("usuarioActivo");
if (sessionStorage.getItem("tipoUsuarioActivo") !== "cliente" || !usuario) window.location.href = "login.html";

/** Envía dinero a una cuenta propia o de otro cliente. */
document.getElementById("formTransferir").addEventListener("submit", event => {
    event.preventDefault();
    const campo = id => document.getElementById(id);
    try {
        const resultado = servicio.transferir(usuario, campo("cuentaOrigen").value, campo("tipoDestino").value, campo("cuentaDestino").value.trim(), Number(campo("montoTransferir").value));
        mostrarMensaje(`Transferencia exitosa a ${resultado.titular}. Saldo: $${resultado.saldo.toLocaleString("es-CO")}`);
        campo("cuentaDestino").value = "";
        campo("montoTransferir").value = "";
    } catch (error) { mostrarMensaje(error.message, "error"); }
});

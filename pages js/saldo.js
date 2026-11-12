import "./vencimientosCDT.js";
import ServicioBancario from "../src/ServicioBancario.js";
import {mostrarMensaje} from "./mensajes.js";
const servicio = new ServicioBancario();
const usuario = sessionStorage.getItem("usuarioActivo");
if (sessionStorage.getItem("tipoUsuarioActivo") !== "cliente" || !usuario) window.location.href = "login.html";

/** Consulta el saldo de la cuenta indicada por el cliente. */
document.getElementById("btnConsultarSaldo").addEventListener("click", () => {
    try {
        const cuenta = servicio.consultarSaldo(usuario, document.getElementById("cuentaSeleccionada").value);
        document.getElementById("resultadoSaldo").hidden = false;
        document.getElementById("cuentaNombre").textContent = cuenta.tipo === "ahorros" ? "Cuenta de Ahorros" : "Cuenta Corriente";
        document.getElementById("cuentaNumero").textContent = `Número de cuenta: ${cuenta.numeroCuenta}`;
        document.getElementById("saldoActual").textContent = `$ ${cuenta.saldo.toLocaleString("es-CO")}`;
    } catch (error) { mostrarMensaje(error.message, "error"); }
});

import "./vencimientosCDT.js";
import ServicioBancario from "../src/ServicioBancario.js";
import {mostrarMensaje} from "./mensajes.js";
const servicio = new ServicioBancario();
const usuario = sessionStorage.getItem("usuarioActivo");
if (sessionStorage.getItem("tipoUsuarioActivo") !== "cliente" || !usuario) window.location.href = "login.html";

/** Consigna el valor indicado en la cuenta seleccionada. */
document.getElementById("btnRealizarConsignacion").addEventListener("click", () => {
    const monto = Number(document.getElementById("montoConsignar").value);
    try {
        const resultado = servicio.consignar(usuario, document.getElementById("cuentaSeleccionada").value, monto);
        mostrarMensaje(`Consignación exitosa. Saldo: $${resultado.saldo.toLocaleString("es-CO")}`);
        document.getElementById("montoConsignar").value = "";
    } catch (error) { mostrarMensaje(error.message, "error"); }
});

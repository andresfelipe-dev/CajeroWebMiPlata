import ServicioBancario from "../src/ServicioBancario.js";
import { mostrarMensaje } from "./mensajes.js";

const servicio = new ServicioBancario();
const usuario = sessionStorage.getItem("usuarioActivo");

/** Comprueba los CDT vencidos mientras el cliente tenga una página abierta. */
function revisarVencimientos() {
    if (sessionStorage.getItem("tipoUsuarioActivo") !== "cliente" ||
        sessionStorage.getItem("usuarioActivo") !== usuario || !usuario) return;

    try {
        const finalizados = servicio.procesarCDTsVencidos(usuario);
        if (finalizados.length === 0) return;
        const texto = finalizados.length === 1
            ? `Tu CDT venció. Recibiste $${finalizados[0].total.toLocaleString("es-CO")} en tu cuenta.`
            : `${finalizados.length} CDT finalizaron. Sus capitales y rendimientos regresaron a sus cuentas.`;
        mostrarMensaje(texto);
        document.dispatchEvent(new CustomEvent("miPlata:cdtsActualizados"));
    } catch (error) {
        console.error("No se pudieron procesar los CDT vencidos:", error);
    }
}

if (usuario && sessionStorage.getItem("tipoUsuarioActivo") === "cliente") {
    revisarVencimientos();
    setInterval(revisarVencimientos, 1000);
    window.addEventListener("focus", revisarVencimientos);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) revisarVencimientos();
    });
}

import "./vencimientosCDT.js";
import ServicioBancario from "../src/ServicioBancario.js";
import RepositorioBancario from "../src/RepositorioBancario.js";
import {mostrarMensaje} from "./mensajes.js";
const servicio = new ServicioBancario();
const repositorio = new RepositorioBancario();
const usuario = sessionStorage.getItem("usuarioActivo");
if (sessionStorage.getItem("tipoUsuarioActivo") !== "cliente" || !usuario) window.location.href = "login.html";
const formato = monto => Number(monto).toLocaleString("es-CO", {style: "currency", currency: "COP", maximumFractionDigits: 0});

/** Actualiza el cupo, deuda, titular e historial de compras y pagos. */
function mostrarTarjeta() {
    const cliente = repositorio.buscarCliente(usuario);
    if (!cliente?.tarjetaCredito) return mostrarMensaje("Tarjeta no disponible.", "error");
    const tarjeta = repositorio.reconstruirTarjeta(cliente.tarjetaCredito);
    document.getElementById("numeroTarjeta").textContent = tarjeta.getNumeroTarjeta();
    document.getElementById("nombreUsuarioTarjeta").textContent = cliente.nombre.toUpperCase();
    document.getElementById("cupoDisponible").textContent = formato(tarjeta.getCupoDisponible());
    document.getElementById("deudaActual").textContent = formato(tarjeta.getDeudaActual());
    const historial = document.getElementById("historialCompras");
    historial.replaceChildren();
    if (!tarjeta.getCompras().length) { historial.textContent = "No tienes compras registradas."; return; }
    const tabla = document.createElement("table");
    const cabecera = document.createElement("thead");
    cabecera.innerHTML = "<tr><th>Capital</th><th>Cuotas</th><th>Interés mensual</th><th>Cuota mensual</th><th>Deuda total</th></tr>";
    tabla.append(cabecera);
    const cuerpo = document.createElement("tbody");
    tarjeta.getCompras().forEach(c => {
        const fila = document.createElement("tr");
        [formato(c.capital), String(c.numeroCuotas), `${(c.tasaInteres * 100).toFixed(1)}%`, formato(c.cuotaMensual), formato(c.deudaTotal)].forEach(valor => {
            const celda = document.createElement("td"); celda.textContent = valor; fila.append(celda);
        });
        cuerpo.append(fila);
    });
    tabla.append(cuerpo);
    historial.append(tabla);
}

/** Procesa la compra y muestra la cuota correspondiente. */
document.getElementById("formCompra").addEventListener("submit", event => {
    event.preventDefault();
    try {
        const compra = servicio.comprar(usuario, Number(document.getElementById("valorCompra").value), Number(document.getElementById("numeroCuotas").value));
        document.getElementById("resultadoCompra").textContent = `Cuota mensual: ${formato(compra.cuotaMensual)} · Deuda generada: ${formato(compra.deudaTotal)}`;
        document.getElementById("valorCompra").value = "";
        mostrarTarjeta();
        mostrarMensaje("Compra registrada correctamente.");
    } catch (error) { mostrarMensaje(error.message, "error"); }
});

/** Recibe pagos desde ahorros o corriente y actualiza el estado de la tarjeta. */
document.getElementById("formPagoTarjeta").addEventListener("submit", event => {
    event.preventDefault();
    try {
        const resultado = servicio.pagarTarjeta(usuario, document.getElementById("cuentaPagoTarjeta").value, Number(document.getElementById("montoPagoTarjeta").value));
        mostrarTarjeta();
        document.getElementById("montoPagoTarjeta").value = "";
        mostrarMensaje(`Pago exitoso. Deuda pendiente: ${formato(resultado.deudaActual)}. Cupo disponible: ${formato(resultado.cupoDisponible)}`);
    } catch (error) { mostrarMensaje(error.message, "error"); }
});
mostrarTarjeta();

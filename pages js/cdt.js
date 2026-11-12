import "./vencimientosCDT.js";
import CDT from "../src/CDT.js";
import ServicioBancario from "../src/ServicioBancario.js";
import { mostrarMensaje } from "./mensajes.js";

const usuario = sessionStorage.getItem("usuarioActivo");
if (sessionStorage.getItem("tipoUsuarioActivo") !== "cliente" || !usuario) {
    window.location.replace("login.html");
} else {
    const servicio = new ServicioBancario();
    const elemento = id => document.getElementById(id);
    const formato = valor => `$${Number(valor).toLocaleString("es-CO")}`;
    let pendiente = null;

    /** Crea un elemento HTML con clase y texto opcionales. */
    function crearElemento(etiqueta, clase = "", texto = "") {
        const nodo = document.createElement(etiqueta);
        if (clase) nodo.className = clase;
        if (texto) nodo.textContent = texto;
        return nodo;
    }

    /** Muestra el saldo real de la cuenta elegida, sin intereses ni sobregiro. */
    function mostrarSaldo() {
        try {
            const datos = servicio.consultarSaldo(usuario, elemento("cuentaOrigenCDT").value);
            elemento("saldoRealCDT").textContent = `Saldo real disponible: ${formato(datos.saldo)}`;
        } catch (error) {
            mostrarMensaje(error.message, "error");
        }
    }

    /** Calcula una vista previa sin modificar los datos del cliente. */
    function actualizarPrevision() {
        const monto = Number(elemento("montoCDT").value);
        const plazo = Number(elemento("plazoCDT").value);
        const tasa = CDT.PLAZOS[plazo] || 0;
        const valido = Number.isInteger(monto) && monto >= 50000;
        const rendimiento = valido ? Math.round(monto * tasa) : 0;
        elemento("rendimientoPrevisto").textContent = formato(rendimiento);
        elemento("totalPrevisto").textContent = formato(valido ? monto + rendimiento : 0);
    }

    /** Actualiza los segundos que faltan en cada CDT activo. */
    function actualizarContadores() {
        document.querySelectorAll(".cdt-countdown").forEach(reloj => {
            const plazo = Number(reloj.dataset.plazo);
            const restante = Math.max(0, Math.ceil((Number(reloj.dataset.vencimiento) - Date.now()) / 1000));
            const minutos = String(Math.floor(restante / 60)).padStart(2, "0");
            const segundos = String(restante % 60).padStart(2, "0");
            reloj.textContent = restante === 0 ? "Liquidando…" : `${minutos}:${segundos}`;
            const barra = reloj.closest(".cdt-item").querySelector("progress");
            barra.value = Math.min(plazo, Math.max(0, plazo - restante));
        });
    }

    /** Construye una tarjeta visual para un CDT activo o finalizado. */
    function construirTarjeta(datos) {
        const activo = datos.estado === "activo";
        const tarjeta = crearElemento("article", `cdt-item ${activo ? "cdt-item-active" : "cdt-item-done"}`);
        const encabezado = crearElemento("div", "cdt-item-head");
        const titulos = crearElemento("div");
        titulos.append(
            crearElemento("span", "cdt-item-kicker", `CDT · ${datos.plazoSegundos} segundos`),
            crearElemento("h3", "", activo ? "Inversión en curso" : "Inversión completada")
        );
        encabezado.append(titulos, crearElemento("span", `cdt-status ${activo ? "cdt-status-active" : "cdt-status-done"}`, activo ? "Activo" : "Finalizado"));
        tarjeta.append(encabezado);

        const importes = crearElemento("div", "cdt-amounts");
        for (const [nombre, valor] of [["Capital", datos.capital], ["Rendimiento", datos.rendimiento], ["Total", datos.total]]) {
            const bloque = crearElemento("div");
            bloque.append(crearElemento("span", "", nombre), crearElemento("strong", "", formato(valor)));
            importes.append(bloque);
        }
        tarjeta.append(importes);
        tarjeta.append(crearElemento("p", "cdt-account-note", `Cuenta de retorno: ${datos.numeroCuentaOrigen}`));

        if (activo) {
            const filaTiempo = crearElemento("div", "cdt-time-head");
            filaTiempo.append(crearElemento("span", "", "Tiempo restante"));
            const reloj = crearElemento("strong", "cdt-countdown", "00:00");
            reloj.dataset.vencimiento = String(datos.fechaVencimiento);
            reloj.dataset.plazo = String(datos.plazoSegundos);
            filaTiempo.append(reloj);
            const barra = crearElemento("progress", "cdt-progress");
            barra.max = datos.plazoSegundos;
            barra.value = 0;
            barra.setAttribute("aria-label", "Progreso del CDT");
            tarjeta.append(filaTiempo, barra);
        } else {
            const fecha = datos.fechaLiquidacion ? new Date(datos.fechaLiquidacion).toLocaleString("es-CO") : "—";
            tarjeta.append(crearElemento("p", "cdt-account-note", `Abonado: ${fecha}`));
        }
        return tarjeta;
    }

    /** Presenta varios CDT simultáneos y conserva el historial de finalizados. */
    function mostrarCDTs() {
        try {
            const cdts = servicio.listarCDTs(usuario);
            const activos = cdts.filter(c => c.estado === "activo").sort((a, b) => a.fechaVencimiento - b.fechaVencimiento);
            const finalizados = cdts.filter(c => c.estado === "finalizado").sort((a, b) => b.fechaLiquidacion - a.fechaLiquidacion);
            const listaActivos = elemento("listaCDTActivos");
            const listaFinalizados = elemento("listaCDTFinalizados");
            listaActivos.replaceChildren();
            listaFinalizados.replaceChildren();
            elemento("resumenCDT").textContent = `${activos.length} CDT activo${activos.length === 1 ? "" : "s"} · cada uno con su propio contador`;
            if (activos.length === 0) listaActivos.append(crearElemento("p", "cdt-empty", "Todavía no tienes CDT activos. Puedes abrir uno desde el formulario."));
            else activos.forEach(c => listaActivos.append(construirTarjeta(c)));
            if (finalizados.length === 0) listaFinalizados.append(crearElemento("p", "cdt-empty", "Los CDT que finalices aparecerán aquí."));
            else finalizados.forEach(c => listaFinalizados.append(construirTarjeta(c)));
            actualizarContadores();
            mostrarSaldo();
        } catch (error) {
            mostrarMensaje(error.message, "error");
        }
    }

    /** Prepara un resumen para que el cliente confirme antes del débito. */
    elemento("formCDT").addEventListener("submit", event => {
        event.preventDefault();
        const monto = Number(elemento("montoCDT").value);
        const plazo = Number(elemento("plazoCDT").value);
        const tipoCuenta = elemento("cuentaOrigenCDT").value;
        if (!Number.isInteger(monto) || monto < 50000 || !Object.hasOwn(CDT.PLAZOS, plazo)) {
            mostrarMensaje("Selecciona un monto mínimo de $50.000 y un plazo válido.", "error");
            return;
        }
        pendiente = {monto, plazo, tipoCuenta};
        const rendimiento = Math.round(monto * CDT.PLAZOS[plazo]);
        elemento("resumenConfirmacionCDT").textContent =
            `Invertirás ${formato(monto)} desde ${tipoCuenta} por ${plazo} segundos. Al vencimiento recibirás ${formato(monto + rendimiento)} (${formato(rendimiento)} de rendimiento). No se aplicarán intereses de ahorros ni sobregiro.`;
        elemento("confirmacionCDT").hidden = false;
    });

    /** Descuenta y abre el CDT solamente después de la confirmación. */
    elemento("confirmarCDT").addEventListener("click", () => {
        if (!pendiente) return;
        try {
            servicio.abrirCDT(usuario, pendiente.tipoCuenta, pendiente.monto, pendiente.plazo);
            mostrarMensaje("CDT abierto correctamente. Tu contador ya está en marcha.");
            pendiente = null;
            elemento("confirmacionCDT").hidden = true;
            elemento("formCDT").reset();
            actualizarPrevision();
            mostrarCDTs();
        } catch (error) {
            mostrarMensaje(error.message, "error");
        }
    });

    /** Cancela la confirmación sin descontar dinero. */
    elemento("cancelarCDT").addEventListener("click", () => {
        pendiente = null;
        elemento("confirmacionCDT").hidden = true;
    });

    for (const id of ["cuentaOrigenCDT", "montoCDT", "plazoCDT"]) {
        elemento(id).addEventListener("change", () => {
            pendiente = null;
            elemento("confirmacionCDT").hidden = true;
            actualizarPrevision();
            if (id === "cuentaOrigenCDT") mostrarSaldo();
        });
    }
    elemento("montoCDT").addEventListener("input", () => {
        pendiente = null;
        elemento("confirmacionCDT").hidden = true;
        actualizarPrevision();
    });

    document.addEventListener("miPlata:cdtsActualizados", mostrarCDTs);
    actualizarPrevision();
    mostrarCDTs();
    setInterval(actualizarContadores, 1000);
}

import RepositorioBancario from "../src/RepositorioBancario.js";
const repositorio = new RepositorioBancario();
const usuario = sessionStorage.getItem("usuarioActivo");
const cliente = repositorio.buscarCliente(usuario);
if (sessionStorage.getItem("tipoUsuarioActivo") !== "cliente" || !cliente) window.location.href = "login.html";

/** Presenta todos los movimientos bancarios, del más reciente al más antiguo. */
function mostrarMovimientos() {
    if (!cliente) return;
    const tbody = document.getElementById("listaMovimientos");
    tbody.replaceChildren();
    const movimientos = cliente.cuentas.flatMap(datos => repositorio.reconstruirCuenta(datos).consultarMovimientos().map(m => ({ ...m, producto: datos.tipo })));
    movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    movimientos.forEach(m => {
        const tr = document.createElement("tr");
        const fecha = new Date(m.fecha).toLocaleString("es-CO", { timeZone: "America/Bogota" });

        // Obtiene la información adicional del movimiento.
        let detalles = "—";

        if (m.destino) {
            detalles = `Cuenta destino: ${m.destino}`;
        } else if (m.origen) {
            detalles = `Cuenta origen: ${m.origen}`;
        } else if (m.tarjeta) {
            detalles = `Tarjeta: ${m.tarjeta}`;
        }

        const valores = [
            fecha,
            m.tipo,
            m.producto === "ahorros" ? "Ahorros" : "Corriente",
            `$ ${Number(m.valor).toLocaleString("es-CO")}`,
            detalles
        ];

        valores.forEach((valor, indice) => {
            const td = document.createElement("td");

            if (indice === 1) {
                const etiqueta = document.createElement("span");

                etiqueta.textContent = valor;
                etiqueta.classList.add("etiqueta-movimiento");

                if (m.tipo === "Consignación" || m.tipo === "Transferencia recibida") {
                    etiqueta.classList.add("movimiento-ingreso");
                } else if (m.tipo === "Retiro" || m.tipo === "Transferencia enviada") {
                    etiqueta.classList.add("movimiento-salida");
                } else if (m.tipo === "Intereses de ahorros") {
                    etiqueta.classList.add("movimiento-interes");
                } else if (m.tipo === "Pago tarjeta de crédito") {
                    etiqueta.classList.add("movimiento-tarjeta");
                }

                td.appendChild(etiqueta);
            } else {
                td.textContent = valor;
            }

            tr.appendChild(td);
        });

        tbody.append(tr);
    });
}
mostrarMovimientos();
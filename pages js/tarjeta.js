import TarjetaCredito from "../src/TarjetaCredito.js";

const formCompra = document.getElementById("formCompra");
const valorCompra = document.getElementById("valorCompra");
const numeroCuotas = document.getElementById("numeroCuotas");
const resultadoCompra = document.getElementById("resultadoCompra");
const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioActivo = sessionStorage.getItem("usuarioActivo")
const clienteActual = listaUsuarios.find(function (cliente) {
    return cliente.usuario === usuarioActivo
})

const historialCompras = document.getElementById("historialCompras");

//Función para implementar el historial de compras al html
function mostrarHistorial(compras) {
    historialCompras.innerHTML = "";

    if (compras.length === 0) {
        historialCompras.textContent = "No tienes compras registradas.";
        return;
    }

    const tabla = document.createElement("table");

    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Capital</th>
                <th>Cuotas</th>
                <th>Interés mensual</th>
                <th>Cuota mensual</th>
                <th>Deuda total</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const cuerpoTabla = tabla.querySelector("tbody");


    compras.forEach(function (compra) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
        <td>${formatearMoneda(compra.capital)}</td>
        <td>${compra.numeroCuotas}</td>
        <td>${(compra.tasaInteres * 100).toFixed(1)}%</td>
        <td>${formatearMoneda(compra.cuotaMensual)}</td>
        <td>${formatearMoneda(compra.deudaTotal)}</td>
    `;

        cuerpoTabla.appendChild(fila);
    });

    historialCompras.appendChild(tabla);
}

//FUncion solo para formatear las monedas con muchos decimales dentro de la lista de movimientos
function formatearMoneda(valor) {
    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}


if (!usuarioActivo || !clienteActual || !clienteActual.tarjetaCredito) {
    window.location.href = "login.html"
} else {
    const tarjetaGuardada = clienteActual.tarjetaCredito;

    const numeroTarjeta = document.getElementById("numeroTarjeta");
    numeroTarjeta.textContent = tarjetaGuardada.numeroTarjeta

    const nombreUsuarioTarjeta = document.getElementById("nombreUsuarioTarjeta")
    nombreUsuarioTarjeta.textContent = clienteActual.nombre.toUpperCase()

    const tarjeta = new TarjetaCredito(
        tarjetaGuardada.numeroTarjeta,
        tarjetaGuardada.cupoTotal
    );

    tarjeta.setCupoDisponible(tarjetaGuardada.cupoDisponible);
    tarjeta.setDeudaActual(tarjetaGuardada.deudaActual);
    tarjeta.setCompras(tarjetaGuardada.compras || []);

    mostrarHistorial(tarjeta.getCompras());

    const cupoDisponible = document.getElementById("cupoDisponible");

    cupoDisponible.textContent = tarjeta.getCupoDisponible().toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    })

    formCompra.addEventListener("submit", function (event) {
        event.preventDefault();

        const capital = Number(valorCompra.value);
        const cuotas = Number(numeroCuotas.value);

        try {
            const compra = tarjeta.realizarCompra(capital, cuotas);

            // Actualizar los datos de la tarjeta guardada
            clienteActual.tarjetaCredito.cupoDisponible =
                tarjeta.getCupoDisponible();

            clienteActual.tarjetaCredito.deudaActual =
                tarjeta.getDeudaActual();

            clienteActual.tarjetaCredito.compras =
                tarjeta.getCompras();

            // Guardar los cambios en localStorage
            localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
            mostrarHistorial(tarjeta.getCompras());
            resultadoCompra.textContent =
                `Compra registrada correctamente.
    Cuota mensual: ${compra.cuotaMensual.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0
                })}
    Deuda total: ${compra.deudaTotal.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0
                })}`;
            cupoDisponible.textContent =
                tarjeta.getCupoDisponible().toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0
                });
                valorCompra.value = "";
        } catch (error) {
            alert(error.message)
        }
    })
}



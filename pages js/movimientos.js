const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioActivo = sessionStorage.getItem("usuarioActivo")
const clienteActual = listaUsuarios.find(function (cliente) {
    return cliente.usuario === usuarioActivo
})
if (!usuarioActivo || !clienteActual) {
    window.location.href = "login.html"
}
const listaMovimientos = document.getElementById("listaMovimientos")


// Reunir los movimientos de todas las cuentas en un solo arreglo
const movimientos = [];

clienteActual.cuentas.forEach(function (cuenta) {
    cuenta.movimientos.forEach(function (movimiento) {
        movimientos.push({
            ...movimiento,
            producto: cuenta.tipo
        });
    });
});

// Ordenar del movimiento más reciente al más antiguo
movimientos.sort(function (a, b) {
    return new Date(b.fecha) - new Date(a.fecha);
});

// Mostrar los movimientos ordenados en la tabla
movimientos.forEach(function (movimiento) {
    console.log(movimiento.fecha);

    const producto = movimiento.producto === "ahorros"
        ? "Ahorros"
        : "Corriente";

    let claseTipo = "";

    //Esto es únicamente para conservar los estilos del archivo css y se aplica solo a el tipo de movimiento
    if (movimiento.tipo === "Consignación") {
        claseTipo = "badge-success";
    } else if (movimiento.tipo === "Retiro") {
        claseTipo = "badge-danger";
    } else if (movimiento.tipo === "Transferencia enviada") {
        claseTipo = "badge-warning";
    } else if(movimiento.tipo === "Transferencia recibida") {
        claseTipo = "badge-notification"
    }

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${new Date(movimiento.fecha).toLocaleString("es-CO", {
            timeZone: "America/Bogota"
        })}</td>
        <td><span class="badge ${claseTipo}">${movimiento.tipo}</span></td>
        <td>${producto}</td>
        <td>$ ${Number(movimiento.valor).toLocaleString("es-CO")}</td>
    `;

    listaMovimientos.appendChild(fila);
});



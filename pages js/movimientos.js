const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioActivo = sessionStorage.getItem("usuarioActivo")
const clienteActual = listaUsuarios.find(function (cliente) {
    return cliente.usuario === usuarioActivo
})
if (!usuarioActivo || !clienteActual) {
    window.location.href = "login.html"
}
const listaMovimientos = document.getElementById("listaMovimientos")

clienteActual.cuentas.forEach(function (cuenta) {
    cuenta.movimientos.forEach(function (movimiento) {
        console.log(movimiento.fecha);
        const producto = cuenta.tipo === "ahorros" ? "Ahorros" : "Corriente";

        let claseTipo = "";

        //Esto es únicamente para conservar los estilos del archivo css y se aplica solo a el tipo de movimiento
        if (movimiento.tipo === "Consignación") {
            claseTipo = "badge-success";
        } else if (movimiento.tipo === "Retiro") {
            claseTipo = "badge-danger";
        } else if (movimiento.tipo === "Transferencia") {
            claseTipo = "badge-warning";
        }

        const fila = document.createElement("tr");
        
        fila.innerHTML = `
        <td>${new Date(movimiento.fecha).toLocaleString("es-CO", {
            timeZone: "America/Bogota"
        })}</td>
        <td><span class="badge ${claseTipo}">${movimiento.tipo}</span></td>
        <td>${producto}</td>
        <td>$ ${Number(movimiento.valor).toLocaleString("es-CO")}</td>`;
        listaMovimientos.appendChild(fila)
    })
})


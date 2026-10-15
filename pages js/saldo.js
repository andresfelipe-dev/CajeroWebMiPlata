const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioActivo = sessionStorage.getItem("usuarioActivo")
const clienteActual = listaUsuarios.find(function (cliente) {
    return cliente.usuario === usuarioActivo
})
const cuentaSeleccionada = document.getElementById("cuentaSeleccionada")
const btnConsultarSaldo = document.getElementById("btnConsultarSaldo")
const cuentaNombre = document.getElementById("cuentaNombre")
const cuentaNumero = document.getElementById("cuentaNumero")
const saldoActual = document.getElementById("saldoActual")
const resultadoSaldo = document.getElementById("resultadoSaldo")

if(!usuarioActivo || !clienteActual){
    window.location.href = "login.html"
}

btnConsultarSaldo.addEventListener('click', function () {
    const tipoCuenta = cuentaSeleccionada.value
    const cuentaElegida = clienteActual.cuentas.find(function(cuenta){
        return cuenta.tipo === tipoCuenta;
    })

    if (tipoCuenta === "") {
        resultadoSaldo.hidden = true
        alert("Por favor, selecciona un tipo de cuenta.")
        return;
    }
    else if (tipoCuenta === "ahorros") {
        resultadoSaldo.hidden = false;
        cuentaNombre.textContent = `Cuenta de Ahorros`
        cuentaNumero.textContent = `Número de cuenta: ${cuentaElegida.numeroCuenta}`
        saldoActual.textContent = `$ ${Number(cuentaElegida.saldo).toLocaleString("es-CO")}`;
    }
    else if(tipoCuenta === "corriente"){
        resultadoSaldo.hidden = false;
        cuentaNombre.textContent = "Cuenta Corriente"
        cuentaNumero.textContent = `Número de cuenta: ${cuentaElegida.numeroCuenta}`
        saldoActual.textContent = `$ ${Number(cuentaElegida.saldo).toLocaleString("es-CO")}`;
    }
})
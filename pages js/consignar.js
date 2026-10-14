const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioActivo = sessionStorage.getItem("usuarioActivo")
const clienteActual = listaUsuarios.find(function (cliente) {
    return cliente.usuario === usuarioActivo
})
const cuentaSeleccionada = document.getElementById("cuentaSeleccionada")
const btnRealizarConsignacion = document.getElementById("btnRealizarConsignacion")
const montoConsignar = document.getElementById("montoConsignar")

if(!usuarioActivo || !clienteActual){
    window.location.href = "login.html"
}

btnRealizarConsignacion.addEventListener('click', function(){
    const tipoCuenta = cuentaSeleccionada.value
    const monto = Number(montoConsignar.value)
    const cuentaElegida = clienteActual.cuentas.find(function(cuenta){
        return cuenta.tipo === tipoCuenta;
    })

    if(!cuentaElegida){
        alert("No se encontró la cuenta seleccionada.")
        return;
    }   

    if(!Number.isFinite(monto) || monto < 100){
        alert("Por favor ingrese un monto válido. Mínimo $100")
        return;
    }

    cuentaElegida.saldo = Number(cuentaElegida.saldo) + monto;
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    alert(`Consignación exitosa de:  $${monto.toLocaleString("es-CO")}
    Tipo de cuenta de la consignación: ${tipoCuenta}`)
    montoConsignar.value = "";
})
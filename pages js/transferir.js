const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioActivo = sessionStorage.getItem("usuarioActivo");
const clienteActual = listaUsuarios.find(function (cliente) {
    return cliente.usuario === usuarioActivo
})
const formTransferir = document.getElementById("formTransferir");
const cuentaOrigen = document.getElementById("cuentaOrigen");
const tipoDestino = document.getElementById("tipoDestino");
const cuentaDestino = document.getElementById("cuentaDestino");
const montoTransferir = document.getElementById("montoTransferir");

if (!usuarioActivo || !clienteActual) {
    window.location.href = "login.html"
}

formTransferir.addEventListener("submit", function (event) {
    event.preventDefault();

    const monto = Number(montoTransferir.value);
    const tipoCuenta = cuentaOrigen.value;

    if (!Number.isFinite(monto) || monto < 100) {
        montoTransferir.value = ""
        alert("Por favor ingrese un monto válido. Mínimo $100")
        return;
    }

    const cuentaElegida = clienteActual.cuentas.find(function (cuenta) {
        return cuenta.tipo === tipoCuenta
    })

    if (!cuentaElegida) {
        alert("No se encontró la cuenta seleccionada.")
        return;
    }

    if (tipoDestino.value === "propio") {

        const cuentaDestinoElegida = clienteActual.cuentas.find(function (cuenta) {
            return cuenta.numeroCuenta === cuentaDestino.value;
        });

        if (!cuentaDestinoElegida) {
            montoTransferir.value = "";
            alert("No se encontró la cuenta destino entre tus productos.");
            return;
        }

        if (cuentaElegida.numeroCuenta === cuentaDestinoElegida.numeroCuenta) {
            montoTransferir.value = "";
            alert(`No puedes transferir dinero a la misma cuenta de origen.
Transacción Declinada.`);
            return;
        }

        if(Number(cuentaElegida.saldo) < monto){
            montoTransferir.value = "";
            alert(`No posees fondos suficientes para realizar esta acción.`)
            return;
        }

        if(monto<100){
            montoTransferir.value = "";
            alert(`La transferencia mínima debe de ser de $100.`)
            return;
        }

        cuentaDestinoElegida.saldo = Number(cuentaDestinoElegida.saldo) + monto;
        cuentaElegida.saldo = Number(cuentaElegida.saldo) - monto;
        cuentaElegida.movimientos.push({
            fecha: new Date().toISOString(),
            tipo: "Transferencia enviada",
            valor: monto
        })
        cuentaDestinoElegida.movimientos.push({
            fecha: new Date().toISOString(),
            tipo: "Transferencia recibida",
            valor: monto
        })
        localStorage.setItem("usuarios", JSON.stringify(listaUsuarios))
        alert(`¡Transferencia Exitosa!
Se han enviado correctamente $${monto.toLocaleString("es-CO")}
Desde tu cuenta de ${cuentaElegida.tipo} hacia tu cuenta ${cuentaDestinoElegida.tipo}`)
            cuentaDestino.value = "";
            montoTransferir.value = "";
    }

    if(tipoDestino.value === "otroUsuario"){
        const usuarioDestino = listaUsuarios.find(function(cliente){
            return cliente.cuentas.some(function(cuenta){
                return cuenta.numeroCuenta === cuentaDestino.value;
            })
        })

        if(!usuarioDestino){
            montoTransferir.value = "";
            alert(`No se encontró un Usuario con ese número de cuenta.
Transacción Declinada.`)
            return;
        }

        const cuentaDestinoElegida = usuarioDestino.cuentas.find(function (cuenta){
            return cuenta.numeroCuenta === cuentaDestino.value;
        })

        if(usuarioDestino.usuario === usuarioActivo){
            cuentaDestino.value = "";
            alert(`Para transferir entre tus propias cuentas, selecciona "Producto propio"`);
            return;
        }

        if(monto>Number(cuentaElegida.saldo)){
            montoTransferir.value = "";
            alert(`No posees fondos suficientes para realizar esta acción.`)
            return;
        }

        if(monto<100){
            montoTransferir.value = "";
            alert(`La transferencia mínima debe de ser de $100.`)
            return;
        }

        cuentaDestinoElegida.saldo = Number(cuentaDestinoElegida.saldo) + monto;
        cuentaElegida.saldo = Number(cuentaElegida.saldo) - monto;
        cuentaElegida.movimientos.push({
            fecha: new Date().toISOString(),
            tipo: "Transferencia enviada",
            valor: monto
        });
        cuentaDestinoElegida.movimientos.push({
            fecha: new Date().toISOString(),
            tipo: "Transferencia recibida",
            valor: monto
        });
        localStorage.setItem("usuarios", JSON.stringify(listaUsuarios))
        alert(`¡Transferencia Exitosa!
Se han enviado correctamente $${monto.toLocaleString("es-CO")}
Desde tu cuenta de ${cuentaElegida.tipo}
Hacia la cuenta: ${cuentaDestinoElegida.numeroCuenta}
Tipo de cuenta: ${cuentaDestinoElegida.tipo}
Titular de la cuenta: ${usuarioDestino.nombre}`)
            cuentaDestino.value = "";
            montoTransferir.value = "";
    }
})
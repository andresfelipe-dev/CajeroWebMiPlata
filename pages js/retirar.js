import CuentaCorriente from "../src/CuentaCorriente.js";
import CuentaAhorros from "../src/CuentaAhorros.js";

const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioActivo = sessionStorage.getItem("usuarioActivo")
const clienteActual = listaUsuarios.find(function (cliente) {
    return cliente.usuario === usuarioActivo
})
const formRetirar = document.getElementById("formRetirar");
const cuentaSeleccionada = document.getElementById("cuentaSeleccionada");
const montoRetirar = document.getElementById("montoRetirar");
if (!usuarioActivo || !clienteActual) {
    window.location.href = "login.html"
}

formRetirar.addEventListener("submit", function (event) {
    event.preventDefault()

    const tipoCuenta = cuentaSeleccionada.value
    const monto = Number(montoRetirar.value)

    if (!Number.isFinite(monto) || monto < 100) {
        alert("Por favor ingrese un monto válido. Mínimo $100")
        return;
    }

    const cuentaElegida = clienteActual.cuentas.find(function (cuenta) {
        return cuenta.tipo === tipoCuenta;
    });
    const saldoActual = Number(cuentaElegida.saldo);

    if (!cuentaElegida) {
        alert("No se encontró la cuenta seleccionada.");
        return;
    }

    if (tipoCuenta === "corriente") {
        const cuentaCorriente = new CuentaCorriente(
            cuentaElegida.numeroCuenta,
            saldoActual
        );
        const limiteSobregiro = cuentaCorriente.calcularSobreGiro();
        const saldoMaximoRetirable = saldoActual + limiteSobregiro;

        if (monto > saldoMaximoRetirable) {
            montoRetirar.value = ""
            alert("Fondos insuficientes. Superas el saldo disponible y el límite de sobregiro.");
            return;
        } else if(monto < 100){
            alert("Por favor ingrese un valor mayor a $100.")
            return;
        }

        cuentaCorriente.setSaldo(saldoActual - monto)

        cuentaElegida.saldo = cuentaCorriente.getSaldo()

        cuentaElegida.movimientos.push({
            fecha: new Date().toISOString(),
            tipo: "Retiro",
            valor: monto
        })
        localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

        alert(`Retiro exitoso: $${monto.toLocaleString("es-CO")}
Tipo de cuenta: Corriente
Sobregiro permitido: $${limiteSobregiro.toLocaleString("es-CO")}
Saldo actual: $${cuentaCorriente.getSaldo().toLocaleString("es-CO")}`);

        montoRetirar.value = "";
    }

    if (tipoCuenta === "ahorros") {
        const cuentaAhorros = new CuentaAhorros(
            cuentaElegida.numeroCuenta,
            saldoActual
        );

        if(monto > saldoActual){
            montoRetirar.value = ""
            alert("Fondos insuficientes. Superas el saldo disponible.");
            return;
        } else if(monto < 100){
            alert("Por favor ingrese un valor mayor a $100.")
            return;
        }

        const intereses = cuentaAhorros.retiroIntereses();

        cuentaAhorros.setSaldo(cuentaAhorros.getSaldo() - monto)

        cuentaElegida.saldo = cuentaAhorros.getSaldo()

        cuentaElegida.movimientos.push({
            fecha: new Date().toISOString(),
        tipo: "Retiro",
        valor: monto
        })
        localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    alert(`Retiro exitoso: $${monto.toLocaleString("es-CO")}
Tipo de cuenta: ${tipoCuenta}
Intereses generados: $${intereses.toLocaleString("es-CO")}
Saldo actual: $${cuentaAhorros.getSaldo().toLocaleString("es-CO")}`);

        montoRetirar.value = "";
    }
})
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
            alert("Fondos insuficientes. Superas el saldo disponible y el límite de sobregiro.");
            return;
        }

        console.log("El retiro está permitido.");
    }

    if (tipoCuenta === "ahorros") {
        const cuentaAhorros = new CuentaAhorros(
            cuentaElegida.numeroCuenta,
            saldoActual
        );

        const intereses = cuentaAhorros.retiroIntereses();

        console.log("Intereses ganados:", intereses);
        console.log("Saldo con intereses:", cuentaAhorros.getSaldo());
    }




})
import Cliente from "../src/Cliente.js"
import CuentaAhorros from "../src/CuentaAhorros.js";
import CuentaCorriente from "../src/CuentaCorriente.js";

const formRegistro = document.getElementById("formRegistro")

const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

function generarNumeroCuenta(prefijo) {
    let numeroCuenta;
    do {
        const numeroAleatorio = Math.floor(
            Math.random() * 10000000
        ).toString().padStart(7, "0");

        numeroCuenta = prefijo + numeroAleatorio;

    } while (
        listaUsuarios.some(function (cliente) {
            return (cliente.cuentas || []).some(function (cuenta) {
                return cuenta.numeroCuenta === numeroCuenta;
            });
        })
    );
    return numeroCuenta;
}

//Variables para agarrar los datos desde el HTML
const id = document.getElementById("id");
const nombre = document.getElementById("nombre");
const celular = document.getElementById("celular");
const usuario = document.getElementById("usuario")
const clave = document.getElementById("clave");
const confirmar = document.getElementById("confirmar");

formRegistro.addEventListener("submit", function (event) {

    event.preventDefault()

    const usuarioRepetido = listaUsuarios.find(function (cliente) {
        return cliente.usuario === usuario.value || cliente.id === id.value;
    })
    if (usuarioRepetido) {
        return alert('Este ID o nombre de Usuario ya se encuentra en el Sistema')
    }

    if (clave.value !== confirmar.value) {
        alert("Las contraseña de confirmación no coincide, por favor intenta de nuevo")
        clave.value = ""
        confirmar.value = ""
    } else {
        const cliente = new Cliente(id.value, nombre.value, celular.value, usuario.value, clave.value);

        const numeroCuentaAhorros = generarNumeroCuenta("1");
        const numeroCuentaCorriente = generarNumeroCuenta("2");

        const cuentaAhorros = new CuentaAhorros(
            numeroCuentaAhorros,
            0
        );

        const cuentaCorriente = new CuentaCorriente(
            numeroCuentaCorriente,
            0
        );

        const datosGuardar = {
            id: cliente.getNumeroIdentificacion(),
            nombre: cliente.getNombreCompleto(),
            celular: cliente.getNumeroCelular(),
            usuario: cliente.getNombreUsuario(),
            clave: cliente.getContrasenia(),
            intentos: cliente.getIntentosRestantes(),
            bloqueado: cliente.getBloqueadoHasta(),
            cuentas: [
                {
                    numeroCuenta: cuentaAhorros.getNumeroCuenta(),
                    tipo: "ahorros",
                    saldo: cuentaAhorros.getSaldo(),
                    movimientos: []
                },
                {
                    numeroCuenta: cuentaCorriente.getNumeroCuenta(),
                    tipo: "corriente",
                    saldo: cuentaCorriente.getSaldo(),
                    movimientos: []
                }
            ]
        }
        listaUsuarios.push(datosGuardar)
        localStorage.setItem("usuarios", JSON.stringify(listaUsuarios))
        alert('Registro Completado Correctamente')
        //Redirección a Login
        window.location.href = 'login.html'
    }
})

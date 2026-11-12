import Cuenta from "./Cuenta.js";
import RepositorioBancario from "./RepositorioBancario.js";

/** Coordina operaciones entre productos sin trasladar reglas a las pantallas. */
export default class ServicioBancario {
    constructor(repositorio = new RepositorioBancario()) { this.repositorio = repositorio; }

    /** Busca el usuario activo y su registro guardado. */
    _origen(lista, usuarioActivo, tipoCuenta) {
        const cliente = lista.find(c => c.usuario === usuarioActivo);
        if (!cliente) throw new Error("Sesión no válida. Inicia sesión nuevamente.");
        const datos = cliente.cuentas.find(c => c.tipo === tipoCuenta);
        if (!datos) throw new Error("No se encontró la cuenta seleccionada.");
        return {cliente, datos, cuenta: this.repositorio.reconstruirCuenta(datos)};
    }

    /** Consulta el saldo de una cuenta sin modificarlo. */
    consultarSaldo(usuario, tipoCuenta) {
        const {cuenta} = this._origen(this.repositorio.listarClientes(), usuario, tipoCuenta);
        return cuenta.toJSON();
    }

    /** Deposita dinero en una cuenta, incluso si su saldo actual es negativo. */
    consignar(usuario, tipoCuenta, monto) {
        const lista = this.repositorio.listarClientes();
        const {cliente, datos, cuenta} = this._origen(lista, usuario, tipoCuenta);
        cuenta.consignarDinero(monto);
        Object.assign(datos, cuenta.toJSON());
        this.repositorio.guardarClientes(lista);
        return {saldo: cuenta.getSaldo(), cliente};
    }

    /** Retira dinero aplicando polimorfismo en la cuenta elegida. */
    retirar(usuario, tipoCuenta, monto) {
        const lista = this.repositorio.listarClientes();
        const {datos, cuenta} = this._origen(lista, usuario, tipoCuenta);
        const resultado = cuenta.retirarDinero(monto);
        Object.assign(datos, cuenta.toJSON());
        this.repositorio.guardarClientes(lista);
        return resultado;
    }

    /** Transfiere dinero entre cuentas propias o de otro cliente sin transferencias parciales. */
    transferir(usuario, tipoCuenta, tipoDestino, numeroDestino, monto) {
        const lista = this.repositorio.listarClientes();
        const origen = this._origen(lista, usuario, tipoCuenta);
        const destinatario = lista.find(c => (c.cuentas || []).some(x => x.numeroCuenta === numeroDestino));
        if (!destinatario) throw new Error("No se encontró la cuenta de destino.");
        if (tipoDestino === "propio" && destinatario.usuario !== usuario) throw new Error("La cuenta de destino no es tuya.");
        if (tipoDestino === "otroUsuario" && destinatario.usuario === usuario) throw new Error("Para cuentas propias, selecciona Producto propio.");
        if (origen.datos.numeroCuenta === numeroDestino) throw new Error("No puedes transferir a la misma cuenta.");
        const destinoDatos = destinatario.cuentas.find(x => x.numeroCuenta === numeroDestino);
        const destino = this.repositorio.reconstruirCuenta(destinoDatos);
        Cuenta.validarMonto(monto);
        origen.cuenta.validarSalida(monto);
        const resultado = origen.cuenta.retirarDinero(monto, "Transferencia enviada", {destino: numeroDestino});
        destino.consignarDinero(monto, "Transferencia recibida", {origen: origen.datos.numeroCuenta});
        Object.assign(origen.datos, origen.cuenta.toJSON());
        Object.assign(destinoDatos, destino.toJSON());
        this.repositorio.guardarClientes(lista);
        return {...resultado, destino: numeroDestino, titular: destinatario.nombre};
    }

    /** Registra una compra con tarjeta y guarda su nueva deuda. */
    comprar(usuario, capital, cuotas) {
        const lista = this.repositorio.listarClientes();
        const cliente = lista.find(c => c.usuario === usuario);
        if (!cliente) throw new Error("Sesión no válida.");
        const tarjeta = this.repositorio.reconstruirTarjeta(cliente.tarjetaCredito);
        const compra = tarjeta.realizarCompra(capital, cuotas);
        cliente.tarjetaCredito = tarjeta.toJSON();
        this.repositorio.guardarClientes(lista);
        return compra;
    }

    /** Paga una tarjeta desde ahorros o corriente con todas sus reglas de salida. */
    pagarTarjeta(usuario, tipoCuenta, monto) {
        const lista = this.repositorio.listarClientes();
        const origen = this._origen(lista, usuario, tipoCuenta);
        const tarjeta = this.repositorio.reconstruirTarjeta(origen.cliente.tarjetaCredito);
        tarjeta.validarPago(monto);
        origen.cuenta.validarSalida(monto);
        const retiro = origen.cuenta.retirarDinero(monto, "Pago tarjeta de crédito", {tarjeta: tarjeta.getNumeroTarjeta()});
        const pago = tarjeta.pagar(monto);
        Object.assign(origen.datos, origen.cuenta.toJSON());
        origen.cliente.tarjetaCredito = tarjeta.toJSON();
        this.repositorio.guardarClientes(lista);
        return {...retiro, ...pago};
    }
}

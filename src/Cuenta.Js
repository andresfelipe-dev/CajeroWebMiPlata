import ProductoFinanciero from "./ProductoFinanciero.js";

/** Funciones compartidas por todas las cuentas bancarias. */
export default class Cuenta extends ProductoFinanciero {
    #saldo;
    #movimientos;

    constructor(numeroCuenta, saldo = 0, movimientos = []) {
        super(numeroCuenta);
        if (new.target === Cuenta) throw new Error("Cuenta es abstracta.");
        if (!Number.isFinite(Number(saldo))) throw new Error("Saldo inválido.");
        this.#saldo = Number(saldo);
        this.#movimientos = [...movimientos];
    }

    /** Valida montos monetarios, con mínimo de $100 para operaciones del cliente. */
    static validarMonto(monto, minimo = 100) {
        if (!Number.isFinite(monto) || monto < minimo || !Number.isInteger(monto)) {
            throw new Error(`El monto debe ser un número entero de al menos $${minimo}.`);
        }
    }

    /** Consulta el saldo contable. */
    consultarSaldo() { return this.#saldo; }
    getSaldo() { return this.consultarSaldo(); }
    getNumeroCuenta() { return this.getNumeroProducto(); }

    /** Entrega una copia del historial para proteger los movimientos internos. */
    consultarMovimientos() { return this.#movimientos.map(m => ({ ...m })); }
    getMovimientos() { return this.consultarMovimientos(); }

    /** Registra un movimiento con fecha, tipo, valor y saldo final. */
    registrarMovimientos(tipo, valor, detalles = {}) {
        this.#movimientos.push({ fecha: new Date().toISOString(), tipo, valor, saldo: this.#saldo, ...detalles });
    }

    /** Incrementa el saldo y registra la entrada del dinero. */
    consignarDinero(monto, tipo = "Consignación", detalles = {}) {
        Cuenta.validarMonto(monto);
        this.#saldo += monto;
        this.registrarMovimientos(tipo, monto, detalles);
        return this.#saldo;
    }

    /** Cambia el saldo internamente; las pantallas no deben alterarlo. */
    _actualizarSaldo(nuevoSaldo) { this.#saldo = nuevoSaldo; }

    /** Comprueba si un retiro es posible, sin cambiar la cuenta. */
    validarSalida(monto) { throw new Error("Cada tipo de cuenta debe validar sus salidas."); }

    /** Descuenta dinero usando las reglas específicas de la clase hija. */
    retirarDinero(monto, tipo = "Retiro", detalles = {}) {
        throw new Error("Cada tipo de cuenta debe implementar retirarDinero().");
    }

    /** Convierte la cuenta en un objeto apto para localStorage. */
    toJSON() {
        return { numeroCuenta: this.getNumeroCuenta(), tipo: this.tipo, saldo: this.#saldo, movimientos: this.consultarMovimientos() };
    }
}
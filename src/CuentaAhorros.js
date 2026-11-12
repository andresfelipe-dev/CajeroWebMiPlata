import Cuenta from "./Cuenta.js";

/** Cuenta de ahorros: abona un 1,5 % antes de cada salida exitosa. */
export default class CuentaAhorros extends Cuenta {
    tipo = "ahorros";

    /** Calcula los intereses sobre el saldo anterior sin abonarlos todavía. */
    retiroIntereses() {
        return Math.round(this.getSaldo() * 0.015);
    }

    /** Comprueba la disponibilidad, contando los intereses que ganaría la operación. */
    validarSalida(monto) {
        Cuenta.validarMonto(monto);
        if (monto > this.getSaldo() + this.retiroIntereses()) {
            throw new Error("Fondos insuficientes en la cuenta de ahorros.");
        }
    }

    /** Aplica el interés y luego el retiro; registra ambos movimientos. */
    retirarDinero(monto, tipo = "Retiro", detalles = {}) {
        this.validarSalida(monto);
        const interes = this.retiroIntereses();
        if (interes > 0) {
            this._actualizarSaldo(this.getSaldo() + interes);
            this.registrarMovimientos("Intereses de ahorros", interes);
        }
        this._actualizarSaldo(this.getSaldo() - monto);
        this.registrarMovimientos(tipo, monto, detalles);
        return { saldo: this.getSaldo(), intereses: interes };
    }

    /** Calcula cuánto dinero podría salir, incluidos intereses del momento. */
    cconsultarDisponible() {
        return Math.max(0, this.getSaldo() + this.retiroIntereses());
    }
}
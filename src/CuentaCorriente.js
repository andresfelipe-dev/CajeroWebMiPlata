import Cuenta from "./Cuenta.js";

/** Cuenta corriente: permite un 20 % adicional si su saldo es positivo. */
export default class CuentaCorriente extends Cuenta {
    tipo = "corriente";

    /** Calcula el sobregiro sobre el saldo positivo actual. */
    calcularSobreGiro() {
        const saldo = this.getSaldo();
        if (saldo <= 0) {
            return 0;
        }
        return Math.floor(saldo * 0.20);
    }

    /** Informa cuánto puede retirar incluyendo el sobregiro disponible. */
    consultarDisponible() {
        const saldo = this.getSaldo();
        if (saldo <= 0) {
            return 0;
        }
        return saldo + this.calcularSobreGiro();
    }
    /** Rechaza salidas si el saldo es cero, negativo o insuficiente. */
    validarSalida(monto) {
        Cuenta.validarMonto(monto);
        if (this.getSaldo() <= 0) {
            throw new Error(
                "No puedes retirar con saldo cero o negativo."
            );
        }
        const disponible = this.getSaldo() + this.calcularSobreGiro();
        if (monto > disponible) {
            throw new Error(
                "Fondos insuficientes en la cuenta corriente."
            );
        }
    }

    /** Realiza el débito y registra el nuevo saldo, incluso si queda negativo. */
    retirarDinero(monto, tipo = "Retiro", detalles = {}) {
        this.validarSalida(monto);
        const sobregiro = this.calcularSobreGiro();
        this._actualizarSaldo(this.getSaldo() - monto);
        this.registrarMovimientos(tipo, monto, detalles);
        return { saldo: this.getSaldo(), sobregiro };
    }
}
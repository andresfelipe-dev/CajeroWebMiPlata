import ProductoFinanciero from "./ProductoFinanciero.js";

/** Tarjeta con límite de compras y pagos parciales o totales. */
export default class TarjetaCredito extends ProductoFinanciero {
    #cupoTotal;
    #cupoDisponible;
    #deudaActual;
    #compras;
    #capitalPendiente;
    #pagos;

    constructor(numeroTarjeta, cupoTotal = 3000000, estado = {}) {
        super(numeroTarjeta);
        if (!Number.isFinite(cupoTotal) || cupoTotal <= 0) throw new Error("Cupo inválido.");
        this.#cupoTotal = cupoTotal;
        this.#cupoDisponible = estado.cupoDisponible ?? cupoTotal;
        this.#deudaActual = estado.deudaActual ?? 0;
        this.#compras = (estado.compras || []).map(c => ({ ...c }));
        this.#capitalPendiente = estado.capitalPendiente ?? (cupoTotal - this.#cupoDisponible);
        this.#pagos = (estado.pagos || []).map(x => ({ ...x }));
    }

    /** Calcula la cuota mensual según el número de cuotas. */
    calcularCuotaMensual(capital, numeroCuotas) {
        if (!Number.isFinite(capital) || capital <= 0 || !Number.isInteger(numeroCuotas) || numeroCuotas < 1) throw new Error("Compra o cuotas inválidas.");
        if (numeroCuotas <= 2) return capital / numeroCuotas;
        const tasa = numeroCuotas <= 6 ? 0.019 : 0.023;
        return capital * tasa / (1 - Math.pow(1 + tasa, -numeroCuotas));
    }

    /** Verifica el cupo y agrega una nueva compra con sus intereses calculados. */
    realizarCompra(capital, numeroCuotas) {
        const cuotaMensual = this.calcularCuotaMensual(capital, numeroCuotas);
        if (capital < 100 || !Number.isInteger(capital)) throw new Error("La compra mínima es de $100 y debe ser entera.");
        if (capital > this.#cupoDisponible) throw new Error("No tienes cupo suficiente.");
        const deudaTotal = Math.round(cuotaMensual * numeroCuotas);
        const compra = {
            capital, numeroCuotas, cuotaMensual, deudaTotal,
            tasaInteres: numeroCuotas <= 2 ? 0 : numeroCuotas <= 6 ? 0.019 : 0.023
        };
        this.#cupoDisponible -= capital;
        this.#capitalPendiente += capital;
        this.#deudaActual += deudaTotal;
        this.#compras.push(compra);
        return { ...compra };
    }

    /** Valida un pago parcial o total antes de debitar la cuenta bancaria. */
    validarPago(monto) {
        if (!Number.isFinite(monto) || !Number.isInteger(monto) || monto <= 0 || (monto < 100 && monto !== this.#deudaActual)) throw new Error("El pago mínimo es de $100, salvo al cancelar el saldo restante.");
        if (monto > this.#deudaActual) {
            throw new Error("El pago supera la deuda actual.");
        }
    }

    /** Disminuye la deuda y libera cupo según la proporción de capital pendiente. */
    pagar(monto) {
        this.validarPago(monto);
        const proporcionCapital = this.#deudaActual ? this.#capitalPendiente / this.#deudaActual : 0;
        const capitalLiberado = monto === this.#deudaActual
            ? this.#capitalPendiente
            : Math.min(
                this.#capitalPendiente,
                Math.round(monto * proporcionCapital)
            );
        this.#deudaActual = Math.max(0, this.#deudaActual - monto);
        this.#capitalPendiente = Math.max(0, this.#capitalPendiente - capitalLiberado);
        this.#cupoDisponible = Math.min(this.#cupoTotal, this.#cupoDisponible + capitalLiberado);
        if (this.#deudaActual < 0.000001) {
            this.#deudaActual = 0;
            this.#capitalPendiente = 0;
            this.#cupoDisponible = this.#cupoTotal;
        }
        this.#pagos.push({ fecha: new Date().toISOString(), monto, capitalLiberado });
        return { deudaActual: this.#deudaActual, cupoDisponible: this.#cupoDisponible, capitalLiberado };
    }

    /** Consulta el cupo que puede usarse para comprar. */
    consultarDisponible() { return this.#cupoDisponible; }
    getNumeroTarjeta() { return this.getNumeroProducto(); }
    getCupoTotal() { return this.#cupoTotal; }
    getCupoDisponible() { return this.#cupoDisponible; }
    getDeudaActual() { return this.#deudaActual; }
    getCompras() { return this.#compras.map(x => ({ ...x })); }
    getPagos() { return this.#pagos.map(x => ({ ...x })); }

    /** Exporta los datos privados para su almacenamiento. */
    toJSON() {
        return {
            numeroTarjeta: this.getNumeroTarjeta(), cupoTotal: this.#cupoTotal,
            cupoDisponible: this.#cupoDisponible, deudaActual: this.#deudaActual,
            capitalPendiente: this.#capitalPendiente, compras: this.getCompras(), pagos: this.getPagos()
        };
    }
}
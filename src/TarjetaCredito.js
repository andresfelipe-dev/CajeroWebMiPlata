export default class TarjetaCredito {
    #numeroTarjeta;
    #cupoTotal;
    #cupoDisponible;
    #deudaActual;
    #compras;

    constructor(numeroTarjeta, cupoTotal) {
        this.#numeroTarjeta = numeroTarjeta;
        this.#cupoTotal = cupoTotal;
        this.#cupoDisponible = cupoTotal;
        this.#deudaActual = 0;
        this.#compras = [];
    }

    //Métodos
    calcularCuotaMensual(capital, numeroCuotas) {
        if (numeroCuotas <= 2) {
            return capital / numeroCuotas
        } else if (numeroCuotas <= 6) {
            return (capital * 0.019) / (1 - Math.pow(1 + 0.019, (-numeroCuotas)))
        } else {
            return (capital * 0.023) / (1 - Math.pow(1 + 0.023, (-numeroCuotas)))
        }
    }

    realizarCompra(capital, numeroCuotas) {
        if (!Number.isInteger(numeroCuotas) || numeroCuotas < 1) {
            throw new Error("El número de cuotas debe ser un entero positivo.");
        } else if (capital <= 0) {
            throw new Error("El valor de la compra debe ser mayor a $0");
        } else if (capital > this.#cupoDisponible) {
            throw new Error("No tienes suficiente cupo disponible.");
        } else {
            const cuotaMensual = this.calcularCuotaMensual(capital, numeroCuotas)
            const dedutaTotal = cuotaMensual * numeroCuotas;
            this.setCupoDisponible(this.getCupoDisponible() - capital)
            this.setDeudaActual(this.getDeudaActual() + dedutaTotal);
            this.#compras.push({
                capital: capital,
                numeroCuotas: numeroCuotas,
                cuotaMensual: cuotaMensual,
                tasaInteres: numeroCuotas <= 2 ? 0 :
                    numeroCuotas <= 6 ? 0.019 : 0.023,
                deudaTotal: dedutaTotal
            })
            return {
                capital: capital,
                numeroCuotas: numeroCuotas,
                cuotaMensual: cuotaMensual,
                deudaTotal: dedutaTotal
            };
        }
    }

    // Getters
    getNumeroTarjeta() {
        return this.#numeroTarjeta;
    }

    getCupoTotal() {
        return this.#cupoTotal;
    }

    getCupoDisponible() {
        return this.#cupoDisponible;
    }

    getDeudaActual() {
        return this.#deudaActual;
    }

    getCompras() {
        return this.#compras;
    }

    // Setters
    setNumeroTarjeta(numeroTarjeta) {
        this.#numeroTarjeta = numeroTarjeta;
    }

    setCupoTotal(cupoTotal) {
        this.#cupoTotal = cupoTotal;
    }

    setCupoDisponible(cupoDisponible) {
        this.#cupoDisponible = cupoDisponible;
    }

    setDeudaActual(deudaActual) {
        this.#deudaActual = deudaActual;
    }

    setCompras(compras){
        this.#compras = compras;
    }
}
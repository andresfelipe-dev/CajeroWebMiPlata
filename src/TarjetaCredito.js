export default class TarjetaCredito {
    #numeroTarjeta;
    #cupoTotal;
    #cupoDisponible;
    #deudaActual;

    constructor(numeroTarjeta, cupoTotal) {
        this.#numeroTarjeta = numeroTarjeta;
        this.#cupoTotal = cupoTotal;
        this.#cupoDisponible = cupoTotal;
        this.#deudaActual = 0;
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
}
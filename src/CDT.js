import ProductoFinanciero from "./ProductoFinanciero.js";

/** Inversión demostrativa con capital, rendimiento y vencimiento fijo. */
export default class CDT extends ProductoFinanciero {
    static PLAZOS = Object.freeze({10: 0.09, 30: 0.12, 60: 0.15});

    #numeroCuentaOrigen;
    #capital;
    #plazoSegundos;
    #fechaApertura;
    #estado;
    #fechaLiquidacion;

    /** Crea un CDT nuevo o reconstruye uno almacenado. */
    constructor(id, numeroCuentaOrigen, capital, plazoSegundos, fechaApertura = Date.now(), estado = "activo", fechaLiquidacion = null) {
        super(id);
        if (!String(numeroCuentaOrigen || "").trim()) throw new Error("Debes seleccionar una cuenta de origen.");
        if (!Number.isInteger(capital) || capital < 50000) throw new Error("El CDT requiere una inversión mínima de $50.000 en pesos enteros.");
        if (!Object.hasOwn(CDT.PLAZOS, plazoSegundos)) throw new Error("Selecciona un plazo válido: 10, 30 o 60 segundos.");
        if (!Number.isFinite(fechaApertura) || fechaApertura <= 0) throw new Error("Fecha de apertura inválida.");
        if (!["activo", "finalizado"].includes(estado)) throw new Error("Estado del CDT inválido.");
        this.#numeroCuentaOrigen = String(numeroCuentaOrigen);
        this.#capital = capital;
        this.#plazoSegundos = plazoSegundos;
        this.#fechaApertura = fechaApertura;
        this.#estado = estado;
        this.#fechaLiquidacion = fechaLiquidacion;
    }

    /** Calcula el rendimiento de una sola vez y lo redondea a pesos enteros. */
    getRendimiento() { return Math.round(this.#capital * CDT.PLAZOS[this.#plazoSegundos]); }

    /** Devuelve el capital más el rendimiento, sin intereses compuestos. */
    getTotal() { return this.#capital + this.getRendimiento(); }

    /** Consulta el identificador del CDT. */
    getId() { return this.getNumeroProducto(); }
    /** Consulta el número de cuenta que recibirá el abono. */
    getNumeroCuentaOrigen() { return this.#numeroCuentaOrigen; }
    /** Consulta el capital inicial invertido. */
    getCapital() { return this.#capital; }
    /** Consulta la duración elegida. */
    getPlazoSegundos() { return this.#plazoSegundos; }
    /** Consulta la tasa correspondiente al plazo. */
    getTasa() { return CDT.PLAZOS[this.#plazoSegundos]; }
    /** Indica si el CDT sigue activo o ya finalizó. */
    getEstado() { return this.#estado; }
    /** Calcula la hora exacta de vencimiento en milisegundos. */
    getFechaVencimiento() { return this.#fechaApertura + this.#plazoSegundos * 1000; }

    /** Indica si ya venció y todavía no se ha pagado. */
    estaVencido(ahora = Date.now()) {
        return this.#estado === "activo" && ahora >= this.getFechaVencimiento();
    }

    /** Marca el CDT como pagado, una sola vez y después de su vencimiento. */
    finalizar(ahora = Date.now()) {
        if (!this.estaVencido(ahora)) throw new Error("El CDT no está activo o todavía no ha vencido.");
        this.#estado = "finalizado";
        this.#fechaLiquidacion = ahora;
    }

    /** Un CDT no permite retiros: el capital permanece inmovilizado hasta el vencimiento. */
    consultarDisponible() { return 0; }

    /** Prepara los atributos privados para guardarlos en localStorage. */
    toJSON() {
        return {
            id: this.getId(), numeroCuentaOrigen: this.#numeroCuentaOrigen,
            capital: this.#capital, plazoSegundos: this.#plazoSegundos,
            tasa: this.getTasa(), rendimiento: this.getRendimiento(), total: this.getTotal(),
            fechaApertura: this.#fechaApertura, fechaVencimiento: this.getFechaVencimiento(),
            estado: this.#estado, fechaLiquidacion: this.#fechaLiquidacion
        };
    }
}

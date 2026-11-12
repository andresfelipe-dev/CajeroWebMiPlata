/** Clase abstracta para los productos financieros de Mi Plata. */
export default class ProductoFinanciero {
    #numeroProducto;

    constructor(numeroProducto) {
        if (new.target === ProductoFinanciero) throw new Error("ProductoFinanciero es abstracta.");
        if (!String(numeroProducto || "").trim()) throw new Error("El producto requiere un número.");
        this.#numeroProducto = String(numeroProducto);
    }

    /** Devuelve el identificador del producto. */
    getNumeroProducto() { return this.#numeroProducto; }

    /** Cada producto determina cuánto dinero tiene disponible. */
    consultarDisponible() { throw new Error("El producto debe implementar consultarDisponible()."); }
}

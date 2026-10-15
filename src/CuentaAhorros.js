//Creacion clase cuenta de ahorros

import Cuenta from "./Cuenta.Js";

class CuentaAhorros extends Cuenta {
    //Constructor
    constructor(numeroCuenta, saldo) {
        super(numeroCuenta, saldo)
    }

    //Métodos
    retiroIntereses() {
        const intereses = this.getSaldo() * 0.015;

        this.setSaldo(this.getSaldo() + intereses);

        return intereses;
    }


}
export default CuentaAhorros;


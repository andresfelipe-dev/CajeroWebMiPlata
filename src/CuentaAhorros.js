//Creacion clase cuenta de ahorros

import Cuenta from "./Cuenta.Js";

class CuentaAhorros extends Cuenta{
    //Constructor
    constructor(numeroCuenta, saldo){
        super(numeroCuenta, saldo)
    }

    retiroIntereses(){

    }
    
} 
export default CuentaAhorros;


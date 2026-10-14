//Creacion clase cuenta corriente

import Cuenta from "./Cuenta.Js";

class CuentaCorriente extends Cuenta{

    //Constructor
    constructor(numeroCuenta, saldo){
        super(numeroCuenta, saldo)
    }

    //Metodos
    calcularSobreGiro(){

    }
} 
export default CuentaCorriente
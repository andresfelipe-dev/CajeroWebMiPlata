//Creacion de la clase abstracta de cuenta
export default class Cuenta{
    #numeroCuenta
    #saldo

    //Constructor
    constructor(numeroCuenta, saldo){
        if (this.constructor === Cuenta){
            throw new Error("No se puede instanciar la clase abstracta cuenta")
        }
        this.#numeroCuenta = numeroCuenta;
        this.#saldo = saldo;
    }

    //Metodos
    consultarSaldo(){

    }

    consignarDinero(){

    }

    registrarMovimientos(){

    }

    consultarMovimientos(){
        
    }

    //Getter
    getNumeroCuenta(){
        return this.#numeroCuenta;
    }

    getSaldo(){
        return this.#saldo;
    }

    //Setter
    setNumeroCuenta(numeroCuenta){
        this.#numeroCuenta = numeroCuenta;
    }

    setSaldo(saldo){
        this.#saldo = saldo;
    }
}
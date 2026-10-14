//Creacion de la clase hija Cliente que hereda de Usuario
import Usuario from './Usuario.js';

class Cliente extends Usuario{
    #intentosRestantes;
    #bloqueadoHasta;

    //Constructor
    constructor(numeroIdentificacion, nombreCompleto, numeroCelular, nombreUsuario, contrasenia, intentosRestantes = 3, bloqueadoHasta = null){
        super(numeroIdentificacion, nombreCompleto, numeroCelular, nombreUsuario, contrasenia);
        this.#intentosRestantes = intentosRestantes;
        this.#bloqueadoHasta = bloqueadoHasta;
    } 

    getIntentosRestantes(){
        return this.#intentosRestantes
    }

    setIntentosRestantes(intentosRestantes){
        this.#intentosRestantes = intentosRestantes
    }

    getBloqueadoHasta(){
        return this.#bloqueadoHasta;
    }

    setBloqueadoHasta(bloqueadoHasta){
        this.#bloqueadoHasta = bloqueadoHasta
    }
}
export default Cliente
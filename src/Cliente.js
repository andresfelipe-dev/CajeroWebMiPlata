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

    /** Indica si el bloqueo de 24 horas continúa vigente. */
    estaBloqueado() { return this.#bloqueadoHasta !== null && this.#bloqueadoHasta > Date.now(); }

    /** Restaura los intentos si el bloqueo ha vencido. */
    actualizarBloqueo() {
        if (this.#bloqueadoHasta !== null && !this.estaBloqueado()) {
            this.#intentosRestantes = 3;
            this.#bloqueadoHasta = null;
        }
    }

    /** Verifica la contraseña y controla los tres intentos del cliente. */
    iniciarSesion(clave) {
        this.actualizarBloqueo();
        if (this.estaBloqueado()) throw new Error("Tu cuenta está bloqueada temporalmente durante 24 horas.");
        if (clave === this.getContrasenia()) {
            this.#intentosRestantes = 3;
            return true;
        }
        this.#intentosRestantes = Math.max(0, this.#intentosRestantes - 1);
        if (this.#intentosRestantes === 0) {
            this.#bloqueadoHasta = Date.now() + 86400000;
            throw new Error("Agotaste los tres intentos. Cuenta bloqueada durante 24 horas.");
        }
        throw new Error(`Contraseña incorrecta. Te quedan ${this.#intentosRestantes} intentos.`);
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
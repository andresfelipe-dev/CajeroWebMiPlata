//Creacion de clase abstracta Usuario
export default class Usuario {
    #numeroIdentificacion;
    #nombreCompleto;
    #numeroCelular;
    #nombreUsuario;
    #contrasenia;

    //Constructor
    constructor(numeroIdentificacion, nombreCompleto, numeroCelular, nombreUsuario, contrasenia) {
        if (this.constructor === Usuario) {
            throw new Error("No se puede instanciar la clase abstracta Usuario");
        }
        this.#numeroIdentificacion = numeroIdentificacion;
        this.#nombreCompleto = nombreCompleto;
        this.#numeroCelular = numeroCelular;
        this.#nombreUsuario = nombreUsuario;
        this.#contrasenia = contrasenia;
    }

    //Getter
    getNumeroIdentificacion() {
        return this.#numeroIdentificacion;
    }

    getNombreCompleto() {
        return this.#nombreCompleto;
    }

    getNumeroCelular() {
        return this.#numeroCelular;
    }

    getNombreUsuario() {
        return this.#nombreUsuario;
    }

    getContrasenia() {
        return this.#contrasenia;
    }

    //Setter
    setNumeroIdentificacion(numeroIdentificacion) {
        this.#numeroIdentificacion = numeroIdentificacion;
    }

    setNombreCompleto(nombreCompleto) {
        this.#nombreCompleto = nombreCompleto;
    }

    setNumeroCelular(numeroCelular) {
        this.#numeroCelular = numeroCelular;
    }

    setNombreUsuario(nombreUsuario) {
        this.#nombreUsuario = nombreUsuario;
    }

    setContrasenia(contrasenia) {
        this.#contrasenia = contrasenia;
    }

    //Metodos
}


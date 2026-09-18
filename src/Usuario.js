//Creacion de clase Usuario
export default class Usuario{
    #numeroIdentificacion;
    #nombreCompleto;
    #numeroCelular;
    #nombreUsuario;
    #contraseña;

    //Constructor
    constructor(numeroIdentificacion, nombreCompleto, numeroCelular, nombreUsuario, contraseña){
        this.#numeroIdentificacion = numeroIdentificacion;
        this.#nombreCompleto = nombreCompleto;
        this.#numeroCelular = numeroCelular;
        this.#nombreUsuario = nombreUsuario;
        this.#contraseña = contraseña;
    } 

    
}


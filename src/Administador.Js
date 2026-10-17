//Creacion clase de Administrador
import Usuario from "./Usuario";

class Administrador extends Usuario {

    //Constructor
    constructor(nombreUsuario, contrasenia) {
        super(
            null,
            null,
            null,
            nombreUsuario,
            contrasenia
        );
    }
}

export default Administrador;
//Creacion clase de Administrador
import Usuario from "./Usuario";

class Admin extends Usuario{

    //Constructor
    constructor(numeroIdentificacion, nombreCompleto, numeroCelular, nombreUsuario, contrasenia){
        super(numeroIdentificacion, nombreCompleto, numeroCelular, nombreUsuario, contrasenia)
    }
}
export default Admin
//Creacion clase de Administrador
import Usuario from "./Usuario.js";

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

    /** Comprueba las credenciales del administrador de demostración. */
    validarAcceso(usuario, clave) {
        return usuario === this.getNombreUsuario() && clave === this.getContrasenia();
    }

    /** Consulta los clientes registrados mediante el repositorio. */
    listarClientes(repositorio) { return repositorio.listarClientes(); }

    /** Registra un cliente y sus productos financieros. */
    registrarCliente(repositorio, datos) { return repositorio.crearCliente(datos); }

    /** Modifica únicamente los datos personales de un cliente. */
    modificarCliente(repositorio, id, datos) { return repositorio.actualizarCliente(id, datos); }

    /** Elimina un cliente después de una confirmación de la interfaz. */
    eliminarCliente(repositorio, id) { return repositorio.eliminarCliente(id); }
}

export default Administrador;
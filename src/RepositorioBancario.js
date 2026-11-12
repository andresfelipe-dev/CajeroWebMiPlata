import Cliente from "./Cliente.js";
import CuentaAhorros from "./CuentaAhorros.js";
import CuentaCorriente from "./CuentaCorriente.js";
import TarjetaCredito from "./TarjetaCredito.js";
import CDT from "./CDT.js";

/** Centraliza la lectura y escritura de usuarios y productos en localStorage. */
export default class RepositorioBancario {
    /** Devuelve todos los clientes como objetos simples. */
    listarClientes() { return JSON.parse(localStorage.getItem("usuarios") || "[]"); }

    /** Guarda todas las modificaciones en una sola escritura. */
    guardarClientes(clientes) { localStorage.setItem("usuarios", JSON.stringify(clientes)); }

    /** Localiza un cliente por su nombre de usuario. */
    buscarCliente(usuario) { return this.listarClientes().find(c => c.usuario === usuario); }

    /** Autentica un cliente y persiste sus intentos, incluso si falló la clave. */
    autenticarCliente(usuario, clave) {
        const lista = this.listarClientes();
        const registro = lista.find(c => c.usuario === usuario);
        if (!registro) throw new Error("Usuario no encontrado.");
        const cliente = new Cliente(registro.id, registro.nombre, registro.celular, registro.usuario, registro.clave, registro.intentos ?? 3, registro.bloqueado ?? null);
        try { cliente.iniciarSesion(clave); }
        finally {
            registro.intentos = cliente.getIntentosRestantes();
            registro.bloqueado = cliente.getBloqueadoHasta();
            this.guardarClientes(lista);
        }
        return registro;
    }

    /** Recupera una cuenta con métodos reales de su clase. */
    reconstruirCuenta(datos) {
        if (!datos) throw new Error("No se encontró la cuenta.");
        const Clase = datos.tipo === "ahorros" ? CuentaAhorros : datos.tipo === "corriente" ? CuentaCorriente : null;
        if (!Clase) throw new Error("Tipo de cuenta desconocido.");
        return new Clase(datos.numeroCuenta, Number(datos.saldo), datos.movimientos || []);
    }

    /** Recupera una tarjeta con su deuda, compras y pagos. */
    reconstruirTarjeta(datos) {
        if (!datos) throw new Error("Este cliente no tiene tarjeta de crédito.");
        return new TarjetaCredito(datos.numeroTarjeta, Number(datos.cupoTotal), datos);
    }

    /** Reconstruye un CDT guardado para recuperar sus métodos y fecha de vencimiento. */
    reconstruirCDT(datos) {
        if (!datos) throw new Error("No se encontraron los datos del CDT.");
        return new CDT(
            datos.id, datos.numeroCuentaOrigen, datos.capital, datos.plazoSegundos,
            datos.fechaApertura, datos.estado ?? "activo", datos.fechaLiquidacion ?? null
        );
    }

    /** Crea un registro bancario completo para un cliente nuevo. */
    crearCliente(datos) {
        const lista = this.listarClientes();
        const admin = JSON.parse(localStorage.getItem("administrador") || "null");
        if (admin?.usuario === datos.usuario) throw new Error("El nombre de usuario está reservado.");
        if (lista.some(c => String(c.id) === String(datos.id) || c.usuario === datos.usuario)) {
            throw new Error("La identificación o el usuario ya están registrados.");
        }
        const usados = new Set(lista.flatMap(c => [...(c.cuentas || []).map(x => x.numeroCuenta), c.tarjetaCredito?.numeroTarjeta].filter(Boolean)));
        const numero = prefijo => {
            let n;
            do { n = prefijo + String(Math.floor(Math.random() * 10000000)).padStart(7, "0"); }
            while (usados.has(n));
            usados.add(n);
            return n;
        };
        const cliente = new Cliente(datos.id, datos.nombre, datos.celular, datos.usuario, datos.clave);
        const ahorros = new CuentaAhorros(numero("1"));
        const corriente = new CuentaCorriente(numero("2"));
        const tarjeta = new TarjetaCredito(numero("7"));
        const registro = {id: cliente.getNumeroIdentificacion(), nombre: cliente.getNombreCompleto(),
            celular: cliente.getNumeroCelular(), usuario: cliente.getNombreUsuario(),
            clave: cliente.getContrasenia(), intentos: cliente.getIntentosRestantes(),
            bloqueado: cliente.getBloqueadoHasta(), cuentas: [ahorros.toJSON(), corriente.toJSON()], tarjetaCredito: tarjeta.toJSON(), cdts: []};
        lista.push(registro);
        this.guardarClientes(lista);
        return registro;
    }

    /** Actualiza datos personales sin reemplazar las cuentas y tarjetas. */
    actualizarCliente(idOriginal, datos) {
        const lista = this.listarClientes();
        const cliente = lista.find(c => String(c.id) === String(idOriginal));
        if (!cliente) throw new Error("Cliente no encontrado.");
        if (lista.some(c => c !== cliente && (String(c.id) === String(datos.id) || c.usuario === datos.usuario))) {
            throw new Error("Identificación o usuario ya registrados.");
        }
        Object.assign(cliente, {id: datos.id, nombre: datos.nombre, celular: datos.celular, usuario: datos.usuario});
        if (datos.clave) cliente.clave = datos.clave;
        this.guardarClientes(lista);
        return cliente;
    }

    /** Elimina un cliente y sus productos financieros. */
    eliminarCliente(id) {
        const lista = this.listarClientes();
        const actualizados = lista.filter(c => String(c.id) !== String(id));
        if (actualizados.length === lista.length) throw new Error("Cliente no encontrado.");
        this.guardarClientes(actualizados);
    }
}

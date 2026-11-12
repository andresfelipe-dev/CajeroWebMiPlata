import Administrador from "../src/Administrador.js";
import RepositorioBancario from "../src/RepositorioBancario.js";
import {mostrarMensaje} from "./mensajes.js";
const repo = new RepositorioBancario();
const credencialesAdmin = JSON.parse(localStorage.getItem("administrador") || "null");
const administrador = credencialesAdmin ? new Administrador(credencialesAdmin.usuario, credencialesAdmin.clave) : null;
if (sessionStorage.getItem("tipoUsuarioActivo") !== "administrador" || !administrador) window.location.href = "login.html";
const elemento = id => document.getElementById(id);
const tabla = elemento("tablaUsuarios");
const formulario = elemento("formularioRegistro");
const form = elemento("formAdmin");
const titulo = elemento("registrarModificarUsuario");
let identificacionOriginal = null;
const entrada = id => elemento(id).value.trim();

/** Abre el formulario en modo registro o edición. */
function abrirFormulario(cliente = null) {
    identificacionOriginal = cliente ? String(cliente.id) : null;
    form.reset();
    formulario.style.display = "block";
    titulo.textContent = cliente ? "Modificar usuario" : "Registrar nuevo usuario";
    form.querySelector('button[type="submit"]').textContent = cliente ? "Guardar cambios" : "Guardar usuario";
    elemento("adminClave").required = !cliente;
    elemento("adminConfirmarClave").required = !cliente;
    if (cliente) {
        elemento("adminIdentificacion").value = cliente.id;
        elemento("adminNombre").value = cliente.nombre;
        elemento("adminCelular").value = cliente.celular;
        elemento("adminUsuario").value = cliente.usuario;
    }
}

/** Cierra el formulario y limpia cualquier edición pendiente. */
function cancelarFormulario() {
    formulario.style.display = "none";
    abrirFormulario();
    formulario.style.display = "none";
}

/** Muestra clientes, su estado y acciones administrativas. */
function mostrarUsuarios() {
    tabla.replaceChildren();
    administrador.listarClientes(repo).forEach(cliente => {
        const tr = document.createElement("tr");
        const bloqueado = cliente.bloqueado && cliente.bloqueado > Date.now();
        [cliente.id, cliente.nombre, cliente.usuario].forEach(dato => {
            const td = document.createElement("td"); td.textContent = dato; tr.append(td);
        });
        const estado = document.createElement("td");
        const span = document.createElement("span");
        span.className = `badge badge-${bloqueado ? "danger" : "success"}`;
        span.textContent = bloqueado ? "Bloqueado" : "Activo";
        estado.append(span); tr.append(estado);
        const acciones = document.createElement("td");
        for (const [accion, clase] of [["Editar", "secondary"], ["Eliminar", "danger"]]) {
            const boton = document.createElement("button");
            boton.type = "button"; boton.className = `btn btn-${clase}`;
            boton.dataset.accion = accion; boton.dataset.usuario = cliente.id;
            boton.textContent = accion; acciones.append(boton);
        }
        tr.append(acciones); tabla.append(tr);
    });
}

elemento("btnRegistrarUsuario").addEventListener("click", () => abrirFormulario());
elemento("btnCancelarRegistro").addEventListener("click", cancelarFormulario);
elemento("cerrarSesion").addEventListener("click", () => {
    sessionStorage.removeItem("tipoUsuarioActivo");
    sessionStorage.removeItem("usuarioActivo");
});

/** Guarda los datos personales sin afectar cuentas, movimientos o tarjeta. */
form.addEventListener("submit", event => {
    event.preventDefault();
    const datos = {id: entrada("adminIdentificacion"), nombre: entrada("adminNombre"),
        celular: entrada("adminCelular"), usuario: entrada("adminUsuario"), clave: elemento("adminClave").value};
    const confirmacion = elemento("adminConfirmarClave").value;
    if (!Object.values(datos).slice(0, 4).every(Boolean)) return mostrarMensaje("Completa los campos del cliente.", "error");
    if (datos.clave !== confirmacion) return mostrarMensaje("Las contraseñas no coinciden.", "error");
    try {
        if (identificacionOriginal === null) administrador.registrarCliente(repo, datos);
        else administrador.modificarCliente(repo, identificacionOriginal, datos);
        mostrarUsuarios(); cancelarFormulario();
        mostrarMensaje("Cliente guardado correctamente.");
    } catch (error) { mostrarMensaje(error.message, "error"); }
});

/** Permite editar o eliminar el cliente seleccionado. */
tabla.addEventListener("click", event => {
    const boton = event.target.closest("button[data-accion]");
    if (!boton) return;
    const cliente = administrador.listarClientes(repo).find(x => String(x.id) === boton.dataset.usuario);
    if (!cliente) return mostrarMensaje("Cliente no encontrado.", "error");
    if (boton.dataset.accion === "Editar") abrirFormulario(cliente);
    if (boton.dataset.accion === "Eliminar" && confirm(`¿Eliminar a ${cliente.nombre} y sus productos?`)) {
        try { administrador.eliminarCliente(repo, cliente.id); mostrarUsuarios(); mostrarMensaje("Cliente eliminado correctamente."); }
        catch (error) { mostrarMensaje(error.message, "error"); }
    }
});
mostrarUsuarios();
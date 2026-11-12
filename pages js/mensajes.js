/** Muestra mensajes discretos dentro de la página, sin ventanas alert(). */
export function mostrarMensaje(mensaje, tipo = "exito") {
    let panel = document.getElementById("miPlataNotificacion");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "miPlataNotificacion";
        panel.setAttribute("role", "status");
        panel.setAttribute("aria-live", "polite");
        document.body.appendChild(panel);
    }
    panel.className = `notificacion notificacion-${tipo}`;
    panel.textContent = mensaje;
    panel.hidden = false;
    clearTimeout(panel._temporizador);
    panel._temporizador = setTimeout(() => { panel.hidden = true; }, 5500);
}
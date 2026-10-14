const usuarioActivo = sessionStorage.getItem("usuarioActivo")
const botonesCerrarSesion  = document.querySelectorAll(".cerrarSesion")
const nombreDashboard = document.getElementById("nombreDashboard")

botonesCerrarSesion.forEach(function(boton) {
    boton.addEventListener("click", function() {
        sessionStorage.removeItem("usuarioActivo");
        window.location.href = "login.html";
    });
});

if(!usuarioActivo){
    window.location.href = "login.html"
}else {
    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || []

    const usuarioEncontrado = listaUsuarios.find(function(cliente){
        return cliente.usuario === usuarioActivo
    });

    if(!usuarioEncontrado){
        sessionStorage.removeItem("usuarioActivo");
        window.location.href = "login.html"
    }
    nombreDashboard.textContent = usuarioEncontrado.nombre
}


const administradorGuardado = localStorage.getItem("administrador");

if (!administradorGuardado) {
    const administrador = {
        usuario: "admin",
        clave: "Admin123"
    };

    localStorage.setItem(
        "administrador",
        JSON.stringify(administrador)
    );
}

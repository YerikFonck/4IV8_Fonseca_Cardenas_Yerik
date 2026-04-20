function calcularEdad() {

    var fechaNacimiento = new Date(formulario6.fechaNacimiento.value);
    var hoy = new Date();

    if (isNaN(fechaNacimiento)) {
        alert("Ingrese una fecha válida");
        return false;
    }

    var edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    var mesActual = hoy.getMonth();
    var mesNacimiento = fechaNacimiento.getMonth();

    if (
        mesActual < mesNacimiento ||
        (mesActual === mesNacimiento && hoy.getDate() < fechaNacimiento.getDate())
    ) {
        edad--;
    }

    if (edad < 0 || edad > 120) {
        alert("Edad no válida");
        return false;
    }

    document.getElementById("resultado").innerHTML =
        "Edad actual: " + edad + " años";

    return false;
}
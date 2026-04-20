function calcularSueldo(formulario2){
    var sueldo = parseFloat(formulario2.sueldo.value);
    var venta1 = parseFloat(formulario2.venta1.value);
    var venta2 = parseFloat(formulario2.venta2.value);
    var venta3 = parseFloat(formulario2.venta3.value);


    if( isNaN(sueldo) || sueldo < 9582.47){
        alert("ingrese un sueldo valido")
        return false;
    }

    var ventas = [venta1, venta2, venta3];

for (var i = 0; i < ventas.length; i++) {
    if (isNaN(ventas[i]) || ventas[i] < 500 || ventas[i] > 50000) {
        alert("Ingrese ventas válidas (entre $500 y $50000)");
        return false;
    }
}

    var comision = (venta1 * 0.1) + (venta2 * 0.1) + (venta3 * 0.1);
    var total = comision + sueldo;

    document.getElementById("resultado").innerHTML =
        "comisiones en un mes: $" + comision.toFixed(2) +
        "<br>Total después de un mes: $" + total.toFixed(2);

    return false;

}
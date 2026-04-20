function calcularCapital(formulario1){
    var capital = parseFloat(formulario1.capital.value);
    var meses = parseInt(formulario1.meses.value);

    if( capital == null || capital < 1000 || capital > 500000){
        alert("solo se permiten cantidades entre $1000 y $500000")
        return false;
    }

    if(!meses){
        alert("porfavor seleccione un plazo")
        return false;
    }

    var ganancia = (capital * 0.02) * meses;
    var cantidadTotal = capital + ganancia;

    document.getElementById("resultado").innerHTML =
        "Ganancia en un mes: $" + ganancia.toFixed(2) +
        "<br>Total después de un mes: $" + cantidadTotal.toFixed(2);

    return false;

}
function calcularPorcentaje(formulario5){
    var hombre = parseInt(formulario5.hombre.value);
    var mujer = parseInt(formulario5.mujer.value);
    var personas = [hombre, mujer];
    
    for(var i = 0; i < personas.length; i ++){
        if( isNaN(personas[i]) || personas[i] < 0 || personas[i] > 1000000){
        alert("Solo cantidades entre 0 y 1000000")
        return false; 
        }
    }
    
    var Total = hombre + mujer;
    var hombrePorcentaje = (hombre/Total) * 100;
    var mujerPorcentaje = (mujer/Total) * 100;
    

    document.getElementById("resultado").innerHTML =
        "Porcentaje de hombres: " + hombrePorcentaje.toFixed(0) + "%" +
        "<br>Porcentaje de mujeres: " + mujerPorcentaje.toFixed(0) +"%";

    return false;

}
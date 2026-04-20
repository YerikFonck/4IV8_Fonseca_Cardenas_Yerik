function calcularPromedio(formulario4) {
  var cal1 = parseFloat(formulario4.cal1.value);
  var cal2 = parseFloat(formulario4.cal2.value);
  var cal3 = parseFloat(formulario4.cal3.value);
  var examen = parseFloat(formulario4.examen.value);
  var tF = parseFloat(formulario4.TrabajoFinal.value);

  var calificaciones = [cal1, cal2, cal3, examen, tF];

  for (var i = 0; i < calificaciones.length; i++) {
    if (
      isNaN(calificaciones[i]) ||
      calificaciones[i] < 0 ||
      calificaciones[i] > 10
    ) {
      alert("Ingrese calificaciones entre 0 y 10 con un solo decimal");
      return false;
    }
  }

  var promedioDepartamental = (cal1 + cal2 + cal3) / 3;

  var calFinal = promedioDepartamental * 0.55 + examen * 0.3 + tF * 0.15;

  document.getElementById("resultado").innerHTML =
    "calificacion departamental: " + promedioDepartamental.toFixed(1) +
    "<br>Examen Final: " + (examen * 0.3).toFixed(1) +
    "<br>Trabajo final: " + (tF * 0.15).toFixed(1) +
    "<br>Calificación final: " + calFinal.toFixed(1);

    return false;
}

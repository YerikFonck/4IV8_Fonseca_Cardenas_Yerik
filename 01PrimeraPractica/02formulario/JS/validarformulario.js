function validar(formulario) {
  //vamos a crear una funcion para validar un numero minimo de caracters en el nombre
  if (formulario.nombre.value.length < 3) {
    alert("por favor ingrese un nombre minimo de 3 caracteres");
    formulario.nombre.focus();
    return false;
  }

  var abcOK = "QWERTYUIOPASDFGHJKLZXCVBNM " + "qwertyuioplkjhgfdsazxcvbnm";
  var checkString = formulario.nombre.value.trim();
  var allvalid = true;

  //tenemos que ir comparando y recooriendo la cadena caracter po caracter

  for (var i = 0; i < checkString.length; i++) {
    var caracteres = checkString.charAt(i);
    for (var j = 0; j < abcOK.length; j++) {
      if (caracteres == abcOK.charAt(j)) {
        break;
      }
    }
    if (j == abcOK.length) {
      allvalid = false;
      break;
    }
  }

  if (!allvalid) {
    alert("el campo nombre solo acepta letras");
    formulario.nombre.focus();
    return false;
  }

   // validamos solo números entre 10 y 120
    var edad = formulario.edad.value.trim();

    if( edad = null || edad < 10 || edad > 120){
        alert("La edad debe ser un número entre 10 y 120.");
        formulario.edad.focus();
        return false;
    }

    // validamos que e email sea correcto
    var correoelectronico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var txt = formulario.email.value.trim();

    if(!correoelectronico.test(txt)){
        alert("Ingrese un correo electrónico válido.");
        formulario.email.focus();
        return false;
    }

    alert("Formulario válido.");
    return false;
}

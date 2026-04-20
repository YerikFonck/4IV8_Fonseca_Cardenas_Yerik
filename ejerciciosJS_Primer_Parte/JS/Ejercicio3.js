function calcularDescuento(formulario3){
    var compra = parseFloat(formulario3.compra.value);

    if( isNaN(compra) || compra < 0 || compra > 1000000){
        alert("compra invalida")
        return false; 
   }

    var descuento = compra * 0.15;
    var precioTotal = compra - (compra * 0.15);

    document.getElementById("resultado").innerHTML =
        "descuento en la compra: $" + descuento.toFixed(2) +
        "<br>Total después del descuento: $" + precioTotal.toFixed(2);

    return false;

}
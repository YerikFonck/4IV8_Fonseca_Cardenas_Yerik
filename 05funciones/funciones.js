//vamos a hacer unviaje en el tiempo y ahora vamos a programamr todo bajo el esquema ES6

/*
Para javascript ya conocemos el concepto de variable

var

Se sustituye por las nuevas variables:

let es una variable de tipo "protegida", ya que solo funciona dentro de un fragmento de codigo

const si es constante


if(true){
    const x = "x";
    console.log(x);
}



//para decalarar las funciones en javascript hay una forma mas efectiva para declararlas y a partir de una funcion flecha

//una funcion flcha en js a diferencia de una funcion normal, no genera su propio contexto (this); ncesita ser declarada antes de ser usada y no necesita un return

//function cosa(String hola) { this.hola = hola}
function sumarnumeros(n1,n2){
    return n1 + n2;
}

const sumarDosNumeros = (n1,n2) => n1 + n2;

console.log(`la suma de la funcion es: (2,3): ${sumarnumeros(2,3)} `);

console.log(`la suma de la funcion es: (4,3): ${sumarDosNumeros(3,4)} `);

//para arma runa funcio flecha debemos entender la etrctura:
//"cadena" {el tipo devariable, el nombre de la funcion y los argumentos} => operacion



const razaDePerros = [
    "Gran Danes",
    "Doverman",
    "Chihuahua",
    "Pastor Aleman",
    "Pitbull",
    "San bernardo",
    "Xoloscuincle"
];

for(const raza of razaDePerros){
    console.log(raza);
}

for(const indice in razaDePerros){
    console.log(razaDePerros[indice]);
}

forEach
iterar sobre elementos de arreglo que devuelven nada

*/ 

razaDePerros.forEach((raza,indice,arregloOriginal)=> console.log(raza));

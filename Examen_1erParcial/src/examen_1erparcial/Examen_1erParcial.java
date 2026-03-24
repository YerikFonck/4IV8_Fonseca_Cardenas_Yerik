/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package examen_1erparcial;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

/**
 *
 * @author Yerik
 */
public class Examen_1erParcial {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Double> numeros = new ArrayList<>();
        Double entrada;
        String Salida = "";
        System.out.println("Cual es tu nombre?");
        String nombre = sc.nextLine();
        System.out.println("cual s tu edad?");
        int edad = sc.nextInt();

        if (edad < 18) {
            System.out.println("Acceso denegado. Debes ser mayor de edad.");

        } else {
            System.out.println("Bienvenido/a " + nombre + ". Puedes usar el programa.");

            while (!Salida.equalsIgnoreCase("Salir")) {
                System.out.println("Escriba salir para cerrar el programa");
                Salida = sc.nextLine();
                System.out.println("Ingrese los valores de su lista (ingrese 0 para cerrar la lista): ");
                numeros.clear();
                while (true) {
                    entrada = sc.nextDouble();
                    if (entrada == 0) {
                        break;
                    }
                    numeros.add(entrada);
                }

                if (numeros.isEmpty()) {
                    System.out.println("No ingresaste numeros");
                    return;
                }
                //Media
                double suma = 0;
                for (double n : numeros) {
                    suma += n;
                }
                double media = suma / numeros.size();

                //Mediana
                Collections.sort(numeros);
                double mediana;
                int size = numeros.size();

                if (size % 2 == 0) {
                    mediana = (numeros.get(size / 2 - 1) + numeros.get(size / 2)) / 2;
                } else {
                    mediana = numeros.get(size / 2);
                }

                // Moda
                HashMap<Double, Integer> frecuencia = new HashMap<>();
                for (double n : numeros) {
                    frecuencia.put(n, frecuencia.getOrDefault(n, 0) + 1);
                }

                double moda = numeros.get(0);
                int maxFrecuencia = 0;

                for (Map.Entry<Double, Integer> entry : frecuencia.entrySet()) {
                    if (entry.getValue() > maxFrecuencia) {
                        maxFrecuencia = entry.getValue();
                        moda = entry.getKey();
                    }

                }

                // Resultados
                System.out.println("\nResultados:");
                System.out.println("Media: " + media);
                System.out.println("Mediana: " + mediana);
                System.out.println("Moda: " + moda);
            }

        }

    }

}

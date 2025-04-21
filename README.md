# AlgarroMap: Mapa Interactivo

[![Mantenido por Aaron Gálvez Salido](https://img.shields.io/badge/Mantenido%20por-Aaron%20G%C3%A1lvez%20Salido-blue)](mailto:ags408@ual.es) [![Colaboradora Laura Flores Fernández](https://img.shields.io/badge/Colaboradora-Laura%20Flores%20Fern%C3%A1ndez-brightgreen)]() [![AlgarroMap](https://img.shields.io/badge/Web-AlgarroMap-orange)](https://aarongs1999.github.io/AlgarroMap/)


Este repositorio contiene los elementos necesarios para el mapa interactivo **AlgarroMap**.

## Descripción del Proyecto

AlgarroMap es un proyecto cuyo objetivo es desarrollar un mapa interactivo con los árboles de algarrobo muestreados por el grupo de investigación **BIO-359: Genómica Evolutiva de Plantas (PlantEVOLGEN)** cuyo director es **Lorenzo Carretero Paulet**. Este repositorio alberga el código fuente, los datos y otros recursos necesarios para su funcionamiento.

## Mantenimiento y Contacto

El código de este repositorio está siendo mantenido por:

* **Aaron Gálvez Salido**
    * Estudiante de Doctorado
    * Grupo de investigación: **BIO-359: Genómica Evolutiva de Plantas (PlantEVOLGEN)**
    * Correo de contacto: [ags408@ual.es](mailto:ags408@ual.es)

## Colaboración

En este proyecto también está colaborando:

* **Laura Flores Fernández**
    * Alumna del Grado de Biotecnología
    * Universidad de Almería
    * Contribución: Creación de las fichas de cada individuo muestreado.

## Contenido del Repositorio

Este repositorio contiene los siguientes elementos clave:

* **`datos/datos.json`**: Archivo principal en formato JSON que almacena la información detallada de los diferentes árboles de algarrobo muestreados.
* **`imágenes`**: Directorio que contiene las fichas (imágenes) correspondientes a cada individuo muestreado. Cada archivo de imagen debería estar nombrado de forma que se pueda relacionar con la información del archivo `algarrobos.json`.
* **`js/main.js`**: JavaScript que muestra puntos geográficos en el mapa utilizando la librería Leaflet. Los datos de los puntos se cargan desde el archivo JSON (`datos/datos.json`).

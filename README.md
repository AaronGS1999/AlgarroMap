# AlgarroMap: Mapa Interactivo

[![Mantenido por Aaron Gálvez Salido](https://img.shields.io/badge/Mantenido%20por-Aaron%20G%C3%A1lvez%20Salido-blue)](mailto:ags408@ual.es) [![Colaboradora Laura Flores Fernández](https://img.shields.io/badge/Colaboradora-Laura%20Flores%20Fern%C3%A1ndez-brightgreen)]() [![Colaboradora Carmen Abarca Rodríguez](https://img.shields.io/badge/Colaboradora-Carmen%20Abarca%20Rodríguez-brightgreen)](https://www.instagram.com/jali.jpg/)[![AlgarroMap](https://img.shields.io/badge/Web-AlgarroMap-orange)](https://aarongs1999.github.io/AlgarroMap/)


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

* **Carmen Abarca Rodríguez**
    * Diseñadora gráfica.
    * Contribución: Diseño de los iconos de algarrobo.

## Contenido del Repositorio

Este repositorio contiene los siguientes elementos clave:

* **`datos/datos.json`**: Archivo principal en formato JSON que almacena la información básica de los diferentes árboles de algarrobo muestreados y que está vinculado al contenido de las fichas en el directorio `imágenes`.
* **`imágenes`**: Directorio que contiene las fichas con información detallada de cada individuo muestreado.
* **`js/main.js`**: JavaScript que muestra puntos geográficos en el mapa utilizando la librería Leaflet. Los datos de los puntos se cargan desde el archivo JSON (`datos/datos.json`).

function cargarJSON(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error cargando JSON:', error));
}

const mymap = L.map('mapid').setView([36.93, -1.99], 13);

L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        '<a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; ' +
        '<a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAAB49x6fAAAAHklEQVR42mNgGAWjgP///zDw//8/AyUY0QYAjKkMBV8Y+Z4AAAAASUVORK5CYII=',
    keepBuffer: 5
}).addTo(mymap);

// Definir los íconos según el tipo de árbol
function getIconUrl(punto) {
    const sexo = punto.Sexo ? punto.Sexo.toLowerCase() : '';

    if (punto.injertada && punto.injertada.toLowerCase() === 'si') {
        return 'Iconos/injerto.png';
    } else if (sexo.includes('hermafrodita')) {
        return 'Iconos/hermafrodita.png';
    } else if (sexo.includes('hembra')) {
        return 'Iconos/hembra.png';
    } else if (sexo.includes('macho')) {
        return 'Iconos/macho.png';
    } else {
        return 'Iconos/Algarrobo_gris.png';
    }
}

function getIconSize() {
    if (window.innerWidth < 768) {
        return [80, 80];
    } else {
        return [100, 100];
    }
}

function getIconAnchor(size) {
    return [size[0] / 2, size[1]];
}

// Ocultar la capa de la imagen ampliada al inicio
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('img-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
});

// Cargar los datos y agregar marcadores
cargarJSON('Datos/datos.json', function(puntos) {
    let totalArboles = 0;
    let tiposArboles = {
        injertada: 0,
        hermafrodita: 0,
        hembra: 0,
        macho: 0,
        otros: 0
    };

    puntos.forEach(punto => {
        const lat = punto.latitud / 1000000;
        const lon = punto.longitud / 1000000;
        const iconUrl = getIconUrl(punto);

        const size = getIconSize();
        const anchor = getIconAnchor(size);

        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: size,
            iconAnchor: anchor,
            popupAnchor: [0, -anchor[1]]
        });

        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(mymap);

        totalArboles++;

        if (punto.injertada && punto.injertada.toLowerCase() === 'si') {
            tiposArboles.injertada++;
        } else if (punto.Sexo && punto.Sexo.toLowerCase().includes('hermafrodita')) {
            tiposArboles.hermafrodita++;
        } else if (punto.Sexo && punto.Sexo.toLowerCase().includes('hembra')) {
            tiposArboles.hembra++;
        } else if (punto.Sexo && punto.Sexo.toLowerCase().includes('macho')) {
            tiposArboles.macho++;
        } else {
            tiposArboles.otros++;
        }

        // Mostrar directamente la imagen ampliada al hacer clic, sin popup
        const img = new Image();
        img.src = `Fichas/${punto.imagen}`;
        img.onload = function () {
            marker.on('click', () => ampliarImagen(img.src));
        };
    });

    // Contenido de la leyenda
    const legendContent = `
        <div id="legend-popup-content" style="padding: 20px; background-color: white; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; max-width: 300px; max-height: 400px; overflow-y: auto; text-align: center;">
            <h4 style="margin-top: 0;">Leyenda</h4>
            <button id="close-legend" style="position: absolute; top: 10px; right: 10px; border: none; background: none; font-size: 16px; cursor: pointer;">&times;</button>
            <div style="display: flex; align-items: center; margin-bottom: 10px; justify-content: flex-start;">
                <img src="Iconos/injerto.png" alt="Injertada" style="width: 30px; height: 30px; margin-right: 10px;">
                <span>Injertadas: ${tiposArboles.injertada}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px; justify-content: flex-start;">
                <img src="Iconos/hermafrodita.png" alt="Hermafrodita" style="width: 30px; height: 30px; margin-right: 10px;">
                <span>Hermafroditas: ${tiposArboles.hermafrodita}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px; justify-content: flex-start;">
                <img src="Iconos/hembra.png" alt="Hembra" style="width: 30px; height: 30px; margin-right: 10px;">
                <span>Hembras: ${tiposArboles.hembra}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px; justify-content: flex-start;">
                <img src="Iconos/macho.png" alt="Macho" style="width: 30px; height: 30px; margin-right: 10px;">
                <span>Machos: ${tiposArboles.macho}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: flex-start;">
                <img src="Iconos/Algarrobo_gris.png" alt="Otros" style="width: 30px; height: 30px; margin-right: 10px;">
                <span>Otros: ${tiposArboles.otros}</span>
            </div>
            <hr style="margin-top: 15px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; justify-content: flex-start;">
                <img src="Iconos/Algarrobo_color.png" alt="Total de árboles" style="width: 30px; height: 30px; margin-right: 10px;">
                <span>Total de árboles: ${totalArboles}</span>
            </div>
            <hr style="margin-top: 15px; margin-bottom: 10px;">
            <div style="text-align: center;">
                <a href="https://github.com/AaronGS1999/AlgarroMap" target="_blank" style="text-decoration: none; color: blue;">Link al repositorio</a>
            </div>
        </div>
    `;

    // Crear un div para la leyenda y añadirlo al body
    const legendDiv = document.createElement('div');
    legendDiv.id = 'legend-container';
    legendDiv.innerHTML = legendContent;
    document.body.appendChild(legendDiv);

    // Aplicar estilos CSS para centrarlo en la pantalla
    legendDiv.style.position = 'fixed';
    legendDiv.style.top = '50%';
    legendDiv.style.left = '50%';
    legendDiv.style.transform = 'translate(-50%, -50%)';
    legendDiv.style.backgroundColor = 'white';
    legendDiv.style.border = '1px solid #ccc';
    legendDiv.style.borderRadius = '5px';
    legendDiv.style.padding = '20px';
    legendDiv.style.zIndex = '1000'; // Asegura que esté por encima del mapa
    legendDiv.style.maxWidth = '90vw';
    legendDiv.style.maxHeight = '80vh';
    legendDiv.style.overflowY = 'auto';
    legendDiv.style.textAlign = 'center';

    // Añadir evento para cerrar la leyenda
    const closeButton = document.getElementById('close-legend');
    closeButton.addEventListener('click', function() {
        const legendContainer = document.getElementById('legend-container');
        if (legendContainer) {
            legendContainer.style.display = 'none';
        }
    });
});

function ampliarImagen(src) {
    const overlay = document.getElementById('img-overlay');
    const overlayImg = document.getElementById('img-overlay-content');
    overlayImg.src = src;
    overlay.style.display = 'flex';

    // Cierra cualquier popup abierto al ampliar la imagen
    mymap.closePopup();
}

// Cerrar imagen ampliada y también cualquier popup abierto
document.getElementById('img-overlay').addEventListener('click', function () {
    this.style.display = 'none';
    mymap.closePopup(); // Cierra posibles popups residuales
});

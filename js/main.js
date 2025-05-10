// Función para cargar los datos .json
function cargarJSON(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error cargando JSON:', error));
}

const mymap = L.map('mapid').setView([36.93, -1.99], 13);

// Tiles del mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAAB49x6fAAAAHklEQVR42mNgGAWjgP///zDw//8/AyUY0QYAjKkMBV8Y+Z4AAAAASUVORK5CYII=',
    keepBuffer: 5,
    updateWhenIdle: true,
    reuseTiles: true,
    unloadInvisibleTiles: true,
    detectRetina: true
}).addTo(mymap);

// Grupo de clústeres
const markersCluster = L.markerClusterGroup();

// Asignación de íconos según el tipo de árbol
function getIconUrl(punto) {
    const sexo = punto.Sexo ? punto.Sexo.toLowerCase() : '';

    if (sexo === 'injertado') {
        return 'Iconos/injerto.png';
    } else if (sexo.includes('hembra')) {
        return 'Iconos/hembra.png';
    } else if (sexo.includes('macho')) {
        return 'Iconos/macho.png';
    } else if (sexo.includes('hermafrodita')) {
        return 'Iconos/hermafrodita.png';
    }
}

// Tamaño de los iconos
function getIconSize() {
    return [80, 80];
}

function getIconAnchor(size) {
    return [size[0] / 2, size[1]];
}

// Ocultar la capa de la imagen ampliada al inicio
document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('img-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }

    // Crear el contenedor para el icono de leyenda y el contador de hits
    const legendContainerDiv = document.createElement('div');
    legendContainerDiv.style.position = 'fixed';
    legendContainerDiv.style.top = '20px';
    legendContainerDiv.style.right = '20px';
    legendContainerDiv.style.display = 'flex';
    legendContainerDiv.style.alignItems = 'center';
    legendContainerDiv.style.zIndex = '1001';

    // Crear el contador de visitas (enlace e imagen)
    const hitsMarker = document.createElement('a');
    hitsMarker.href = "https://hits.sh/aarongs1999.github.io/AlgarroMap/";
    const hitsImage = document.createElement('img');
    hitsImage.alt = "Visitas";
    hitsImage.src = "https://hits.sh/aarongs1999.github.io/AlgarroMap.svg?label=Visitas"; // Modificamos la URL
    hitsImage.style.marginRight = '10px'; // Espacio entre el contador y el icono
    hitsMarker.appendChild(hitsImage);

    // Crear el botón de leyenda (icono)
    const legendButton = document.createElement('img');
    legendButton.src = 'Iconos/Algarrobo_color.png';
    legendButton.alt = 'Mostrar Leyenda';
    legendButton.style.width = '50px';
    legendButton.style.height = '50px';
    legendButton.style.cursor = 'pointer';

    legendContainerDiv.appendChild(hitsMarker);
    legendContainerDiv.appendChild(legendButton);
    document.body.appendChild(legendContainerDiv);

    let legendContainer = null;

    legendButton.addEventListener('click', function () {
        if (legendContainer) {
            legendContainer.style.display = 'block';
            return;
        }

        legendContainer = document.createElement('div');
        legendContainer.id = 'legend-container';
        legendContainer.style.position = 'fixed';
        legendContainer.style.top = '50%';
        legendContainer.style.left = '50%';
        legendContainer.style.transform = 'translate(-50%, -50%)';
        legendContainer.style.backgroundColor = 'white';
        legendContainer.style.border = '1px solid #ccc';
        legendContainer.style.borderRadius = '5px';
        legendContainer.style.padding = '20px';
        legendContainer.style.zIndex = '1000';
        legendContainer.style.maxWidth = '95vw';
        legendContainer.style.maxHeight = '85vh';
        legendContainer.style.overflowY = 'auto';
        legendContainer.style.textAlign = 'center';

        legendContainer.innerHTML = legendContent;
        document.body.appendChild(legendContainer);

        const closeButton = document.getElementById('close-legend');
        closeButton.addEventListener('click', function () {
            if (legendContainer) {
                legendContainer.style.display = 'none';
            }
        });
    });
});

// Cargar los datos y agregar marcadores
cargarJSON('Datos/datos.json', function (puntos) {
    let totalArboles = 0;
    let tiposArboles = {
        hembra: 0,
        injertado: 0,
        macho: 0,
        hermafrodita: 0,
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

        const marker = L.marker([lat, lon], { icon: customIcon });

        totalArboles++;

        if (punto.Sexo && punto.Sexo.toLowerCase() === 'injertado') {
            tiposArboles.injertado++;
        } else if (punto.Sexo && punto.Sexo.toLowerCase().includes('hembra')) {
            tiposArboles.hembra++;
        } else if (punto.Sexo && punto.Sexo.toLowerCase().includes('macho')) {
            tiposArboles.macho++;
        } else if (punto.Sexo && punto.Sexo.toLowerCase().includes('hermafrodita')) {
            tiposArboles.hermafrodita++;
        }

        // Mostrar ficha al pulsar punto GPS
        const img = new Image();
        img.src = `Fichas/${punto.imagen}`;
        img.onload = function () {
            marker.on('click', () => ampliarImagen(img.src));
        };

        markersCluster.addLayer(marker);
    });

    mymap.addLayer(markersCluster);

    window.legendContent = `
        <div id="legend-popup-content" style="padding: 15px; background-color: white; border: 1px solid #ccc; border-radius: 5px; font-size: 12px; max-width: 450px; max-height: 650px; overflow-y: auto; text-align: center;">
            <h4 style="margin-top: 0; margin-bottom: 10px;">Leyenda</h4>
            <button id="close-legend" style="position: absolute; top: 1px; right: 1px; border: none; background: none; font-size: 18px; cursor: pointer;">&times;</button>
            <div style="display: flex; align-items: center; margin-bottom: 10px; justify-content: flex-start;">
                <img src="Iconos/hembra.png" alt="Hembra" style="width: 55px; height: 55px; margin-right: 10px;">
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <span>Hembras</span>
                    <span style="font-weight: bold;">${tiposArboles.hembra}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px; justify-content: flex-start;">
                <img src="Iconos/injerto.png" alt="Injertado" style="width: 55px; height: 55px; margin-right: 10px;">
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <span>Injertados</span>
                    <span style="font-weight: bold;">${tiposArboles.injertado}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px; justify-content: flex-start;">
                <img src="Iconos/macho.png" alt="Macho" style="width: 55px; height: 55px; margin-right: 10px;">
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <span>Machos</span>
                    <span style="font-weight: bold;">${tiposArboles.macho}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px; justify-content: flex-start;">
                <img src="Iconos/hermafrodita.png" alt="Hermafrodita" style="width: 55px; height: 55px; margin-right: 10px;">
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <span>Hermafroditas</span>
                    <span style="font-weight: bold;">${tiposArboles.hermafrodita}</span>
                </div>
            </div>
            <hr style="margin-top: 15px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; justify-content: flex-start;">
                <img src="Iconos/Algarrobo_color.png" alt="Total" style="width: 55px; height: 55px; margin-right: 10px;">
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <span>Total</span>
                    <span style="font-weight: bold;">${totalArboles}</span>
                </div>
            </div>
            <hr style="margin-top: 15px; margin-bottom: 10px;">
            <div style="text-align: center;">
                <a href="https://github.com/AaronGS1999/AlgarroMap" target="_blank" style="text-decoration: none; color: blue; font-size: 14px;">Link al repositorio</a>
            </div>
        </div>
    `;
});

// Cierre popups
function ampliarImagen(src) {
    const overlay = document.getElementById('img-overlay');
    const overlayImg = document.getElementById('img-overlay-content');
    overlayImg.src = src;
    overlay.style.display = 'flex';

    mymap.closePopup();
}

document.getElementById('img-overlay').addEventListener('click', function () {
    this.style.display = 'none';
    mymap.closePopup();
});
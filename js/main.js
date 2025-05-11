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

    // Contenedor para el icono de leyenda y el contador de visitas
    const legendContainerDiv = document.createElement('div');
    legendContainerDiv.style.position = 'fixed';
    legendContainerDiv.style.top = '20px';
    legendContainerDiv.style.right = '20px';
    legendContainerDiv.style.display = 'flex';
    legendContainerDiv.style.alignItems = 'center';
    legendContainerDiv.style.zIndex = '1001';

    // Contador de visitas
    const hitsMarker = document.createElement('a');
    const hitsImage = document.createElement('img');
    hitsImage.alt = "Visitas";
    hitsImage.src = "https://hits.sh/aarongs1999.github.io/AlgarroMap.svg?label=Visitas";
    hitsImage.style.marginRight = '10px';
    hitsMarker.appendChild(hitsImage);
    hitsMarker.style.cursor = 'pointer';
    hitsMarker.addEventListener('click', function(event) {
    event.preventDefault();
    window.open("https://hits.sh/aarongs1999.github.io/AlgarroMap/", '_blank');
    });
    // Botón de leyenda
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

// Función para obtener datos climáticos históricos anuales de Open-Meteo API
async function getHistoricalWeatherData(lat, lon) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const startDate = `${currentYear - 1}-01-01`;
    const endDate = `${currentYear - 1}-12-31`;
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum&timezone=Europe%2FBerlin`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching historical weather data:', error);
        return null;
    }
}

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

        img.onload = async function () {
            const historicalWeatherData = await getHistoricalWeatherData(lat, lon);
            let weatherInfo = '';
            if (historicalWeatherData && historicalWeatherData.daily && historicalWeatherData.daily.time) {
                const dailyTemperatures = historicalWeatherData.daily.temperature_2m_mean;
                const dailyPrecipitation = historicalWeatherData.daily.precipitation_sum;

                if (dailyTemperatures && dailyPrecipitation && dailyTemperatures.length > 0) {
                    const avgTemperature = dailyTemperatures.reduce((sum, temp) => sum + temp, 0) / dailyTemperatures.length;
                    const totalPrecipitation = dailyPrecipitation.reduce((sum, prec) => sum + prec, 0);

                    weatherInfo = `<div style="text-align: center; margin-bottom: 10px; background-color: white; padding: 5px; border-radius: 3px;">
                                        <b>Datos climatológicos (${new Date().getFullYear() - 1}):</b><br>
                                        Tª media anual: ${avgTemperature.toFixed(2)} &#8451;<br>
                                        Precipitación total anual: ${totalPrecipitation.toFixed(2)} mm
                                    </div>`;
                } else {
                    weatherInfo = '<div style="text-align: center; margin-bottom: 10px; background-color: white; padding: 5px; border-radius: 3px;">No se encontraron datos climatológicos anuales.</div>';
                }
            } else {
                weatherInfo = '<div style="text-align: center; margin-bottom: 10px; background-color: white; padding: 5px; border-radius: 3px;">Error al obtener datos climatológicos anuales.</div>';
            }

            marker.on('click', () => ampliarImagen(img.src, weatherInfo));
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

function ampliarImagen(src, weatherInfo) {
    const overlay = document.getElementById('img-overlay');
    const overlayImg = document.getElementById('img-overlay-content');
    overlayImg.src = src;
    overlayImg.style.maxWidth = '90vw';
    overlayImg.style.maxHeight = 'calc(100vh - 60px)';

    // Insertar la información del clima con fondo blanco
    overlay.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; width: 100%; margin-bottom: 5px;">
                                        <div style="text-align: center; font-size: smaller; background-color: white; padding: 5px; border-radius: 3px;">${weatherInfo.replace(/<br>/g, ' | ')}</div>
                                        <img id="img-overlay-content" src="${src}" style="max-width: 90vw; max-height: calc(100vh - 60px); margin-top: 0;">
                                    </div>`;
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'flex-start';
    overlay.style.paddingTop = '10px';

    mymap.closePopup();
}

document.getElementById('img-overlay').addEventListener('click', function () {
    this.style.display = 'none';
    mymap.closePopup();
});
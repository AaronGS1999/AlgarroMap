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
        return [80, 80]; // Iconos más grandes en móviles
    } else {
        return [40, 40]; // Iconos más grandes en ordenador (ajusta según necesites)
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

        // Actualización de recuento total y desglose por tipo
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

        // Mostrar imagen en el popup al hacer clic en el marcador
        const img = new Image();
        img.src = `Fichas/${punto.imagen}`;
        img.onload = function () {
            const popupContent = `<img id="popup-image-${punto.id}" src="${img.src}" alt="Imagen del árbol" style="width: 300px; max-width: 100%; cursor: pointer;">`;
            marker.bindPopup(popupContent);
            const popupImage = document.getElementById(`popup-image-${punto.id}`);
            if (popupImage) {
                popupImage.addEventListener('click', () => ampliarImagen(img.src));
            }
        };
    });

    // Leyenda
    const legendContent = `
        <div id="legend-popup-content" style="padding: 20px; background-color: white; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; max-width: 90vw; max-height: 80vh; overflow-y: auto;">
            <h4 style="margin-top: 0; text-align: left;">Leyenda</h4>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="Iconos/injerto.png" alt="Injertada" style="width: 50px; height: 50px; margin-right: 10px;">
                <span style="text-align: left;">Injertadas: ${tiposArboles.injertada}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="Iconos/hermafrodita.png" alt="Hermafrodita" style="width: 50px; height: 50px; margin-right: 10px;">
                <span style="text-align: left;">Hermafroditas: ${tiposArboles.hermafrodita}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="Iconos/hembra.png" alt="Hembra" style="width: 50px; height: 50px; margin-right: 10px;">
                <span style="text-align: left;">Hembras: ${tiposArboles.hembra}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="Iconos/macho.png" alt="Macho" style="width: 50px; height: 50px; margin-right: 10px;">
                <span style="text-align: left;">Machos: ${tiposArboles.macho}</span>
            </div>
            <div style="display: flex; align-items: center;">
                <img src="Iconos/Algarrobo_gris.png" alt="Otros" style="width: 50px; height: 50px; margin-right: 10px;">
                <span style="text-align: left;">Otros: ${tiposArboles.otros}</span>
            </div>
            <hr style="margin-top: 15px; margin-bottom: 10px;">
            <div style="text-align: left; font-weight: bold; font-size: 18px;">Total de Árboles: ${totalArboles}</div>
            <button onclick="mymap.closePopup();" style="padding: 10px 15px; margin-top: 15px; font-size: 16px;">Cerrar</button>
        </div>
    `;

    // Crear el popup de la leyenda y abrirlo en el mapa
    const legendPopup = L.popup({
        closeOnClick: false, // Para que no se cierre al hacer clic fuera
        autoClose: false     // Para que no se cierre automáticamente
    })
    .setLatLng(mymap.getCenter()) // Centrar el popup en la vista inicial
    .setContent(legendContent)
    .openOn(mymap);

    // Ajustar el tamaño máximo del popup de leyenda
    const legendPopupElement = legendPopup.getElement();
    if (legendPopupElement) {
        legendPopupElement.style.maxWidth = '90vw'; // O un porcentaje adecuado
        legendPopupElement.style.maxHeight = '80vh'; // Ajustar altura máxima
        legendPopupElement.style.overflowY = 'auto'; // Añadir scroll si el contenido es muy largo
    }
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

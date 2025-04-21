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
        return [80, 80]; 
    }
}

function getIconAnchor(size) {
    return [size[0] / 2, size[1] * 0.9];
}

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
            marker.on('click', () => ampliarImagen(img.src));
        };
    });

    // Mostrar el popup con el recuento y desglose
    const legendContent = `
        <div style="text-align:center;">
            <h3>Total de Árboles: ${totalArboles}</h3>
            <img src="Iconos/Algarrobo_color.png" alt="Árbol" style="width: 30px; height: 30px;" />
            <h4>Desglose:</h4>
            <ul>
                <li>Injertadas: ${tiposArboles.injertada}</li>
                <li>Hermafroditas: ${tiposArboles.hermafrodita}</li>
                <li>Hembras: ${tiposArboles.hembra}</li>
                <li>Machos: ${tiposArboles.macho}</li>
                <li>Otros: ${tiposArboles.otros}</li>
            </ul>
            <button onclick="closePopup()" style="padding: 5px 10px;">Cerrar</button>
        </div>
    `;

    // Crear el popup con la leyenda
    const popup = L.popup()
        .setLatLng([36.93, -1.99]) // Puedes cambiar la posición si es necesario
        .setContent(legendContent)
        .openOn(mymap);
});

// Función para cerrar el popup
function closePopup() {
    mymap.closePopup();
}

function ampliarImagen(src) {
    const overlay = document.getElementById('img-overlay');
    const overlayImg = document.getElementById('img-overlay-content');
    overlayImg.src = src;
    overlay.style.display = 'flex';
}

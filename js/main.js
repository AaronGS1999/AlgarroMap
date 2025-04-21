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
                 '<a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mymap);

function getIconUrl(punto) {
    if (punto.injertada && punto.injertada.toLowerCase() === 'si') {
        return 'Iconos/injerto.png';
    } else if (punto.Sexo && punto.Sexo.toLowerCase().includes('hembra')) {
        return 'Iconos/hembra.png';
    } else if (punto.Sexo && punto.Sexo.toLowerCase() === 'macho') {
        return 'Iconos/macho.png';
    } else if (punto.Sexo && punto.Sexo.toLowerCase().includes('hermafrodita')) {
        return 'Iconos/hermafrodita.png';
    } else {
        return 'Iconos/Algarrobo_gris.png';
    }
}

cargarJSON('Datos/datos.json', function(puntos) {
    puntos.forEach(punto => {
        const lat = punto.latitud / 1000000;
        const lon = punto.longitud / 1000000;
        const iconUrl = getIconUrl(punto);

        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });

        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(mymap);

        const img = new Image();
        img.src = `Fichas/${punto.imagen}`;
        img.onload = function () {
            marker.on('click', () => ampliarImagen(img.src));
        };
    });
});

function ampliarImagen(src) {
    const overlay = document.getElementById('img-overlay');
    const overlayImg = document.getElementById('img-overlay-content');
    overlayImg.src = src;
    overlay.style.display = 'flex';
}

document.getElementById('img-overlay').addEventListener('click', function () {
    this.style.display = 'none';
});
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar el mapa en una ubicación central y con un nivel de zoom adecuado
    var map = L.map('map').setView([20.5931, -89.6280], 7);

    // Agregar una capa de mapa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Lista de estaciones con sus nombres y coordenadas geográficas
    var estaciones = [
    { nombre: 'Palenque', latlng: [17.532794731119697, -91.97950474669383] },
    { nombre: 'Boca del Rio', latlng: [17.429748900805606, -91.49516604577295] },
    { nombre: 'Tenosique', latlng: [17.469419795407376, -91.41655310344422] },
    { nombre: 'El triunfo', latlng: [17.923335501531575, -91.17128786878135] },
    { nombre: 'Tenabo', latlng: [20.04043572813988, -90.2437673131932] },
    { nombre: 'Hecelchakán', latlng: [20.175248462697038, -90.15160325737055] },
    { nombre: 'Calkini', latlng: [20.381671971207584, -90.06770809186118] },
    { nombre: 'Teya', latlng: [20.930493361303885, -89.5133723861932] },
    { nombre: 'Izamal', latlng: [20.94610407629438, -89.07890828989586] },
    { nombre: 'Maxcanu', latlng: [20.600141866355465, -89.97851175921463] },
    { nombre: 'Tixkokob', latlng: [20.98806125325721, -89.39530958804366] },
    { nombre: 'Chichen Itza', latlng: [20.721228663917323, -88.54870798709514] },
    { nombre: 'Nuevo Xcan', latlng: [20.879389145356004, -87.6024635061465] },
    { nombre: 'Xcaret', latlng: [20.581039069162326, -87.11976527931078] },
    { nombre: 'Puerto Aventuras', latlng: [20.50770113901973, -87.23221485494473] },
    { nombre: 'Akumal', latlng: [20.515116468322642, -87.2801434889549] },       
    { nombre: 'Felipe Carrillo', latlng: [19.597153174459308, -88.07086418033683] },
    { nombre: 'Chetumal', latlng: [18.508399786983958, -88.32288444852831] },
    { nombre: 'Limones', latlng: [18.54214709335762, -88.29543335829476] },
    { nombre: 'Conhumal', latlng: [18.531721223287562, -89.90318397736428] },
    { nombre: 'Centenario', latlng: [18.650798014916074, -90.28597209848395] },
    { nombre: 'Leona Vicario', latlng: [20.979896266091313, -87.19666644923294] },
    { nombre: 'Cancun Aereopuerto', latlng: [21.02875384732279, -86.87151958416914] },
    { nombre: 'Puerto Morelos', latlng: [20.856090668684356, -86.95082890429224] },
    { nombre: 'Playa del Carmen', latlng: [20.679537119835555, -87.11616486382415] },
    { nombre: 'Tulum', latlng: [20.199267844089654, -87.46896049081735] },
    { nombre: 'Tulum Aereopuerto', latlng: [20.13717553295712, -87.65093472909358] },
    { nombre: 'Candelaria', latlng: [18.18430143376173, -91.04455869683723] },
    { nombre: 'Escárcega', latlng: [18.612506285623947, -90.73126326201688] },
    { nombre: 'Campeche', latlng: [19.824665887879842, -90.47645204515037] },
    { nombre: 'Mérida', latlng: [20.930393152391744, -89.51344748894482] },
    { nombre: 'Valladolid', latlng: [20.740187217222022, -88.19312842942188] },
    { nombre: 'Cancún', latlng: [21.062195054849063, -86.87627789074763] },
    { nombre: 'Bacalar</b>', latlng: [18.708770983239933, -88.39726152154239] },
    { nombre: 'Xpujil</b>', latlng: [18.536962985885378, -89.90280254988629] }
    ];

    // Elementos select para las estaciones de inicio y destino
    var startSelect = document.getElementById('startStation');
    var endSelect = document.getElementById('endStation');

    // Llenar las listas desplegables con las estaciones disponibles
    estaciones.forEach(function (estacion, index) {
        var option = new Option(estacion.nombre, index);
        startSelect.add(option.cloneNode(true)); // Clona la opción para el select de inicio
        endSelect.add(option); // Añade la opción al select de destino
    });

    // Agregar marcadores para cada estación en el mapa
    estaciones.forEach(function (estacion) {
        L.marker(estacion.latlng).addTo(map).bindPopup(estacion.nombre);
    });

    // Función para trazar la ruta entre las estaciones seleccionadas incluyendo todas las intermedias
    document.getElementById('findRouteBtn').addEventListener('click', function () {
        map.eachLayer(function (layer) { // Limpiar rutas anteriores
            if (layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });

        var startIndex = parseInt(startSelect.value);
        var endIndex = parseInt(endSelect.value);
        if (startIndex >= 0 && endIndex >= 0) {
            var routeCoordinates = [];
            // Determinar la dirección del recorrido y recopilar las coordenadas de las estaciones
            if (startIndex <= endIndex) {
                for (let i = startIndex; i <= endIndex; i++) {
                    routeCoordinates.push(estaciones[i].latlng);
                }
            } else {
                for (let i = startIndex; i >= endIndex; i--) {
                    routeCoordinates.push(estaciones[i].latlng);
                }
            }
            // Trazar la ruta completa
            L.polyline(routeCoordinates, { color: 'red' }).addTo(map);
            map.fitBounds(routeCoordinates);
        }
    });

    // Evento para el botón del agente viajero
    document.getElementById('travelingAgentBtn').addEventListener('click', function () {
        var startIndex = parseInt(startSelect.value); // Obtener el índice de la estación inicial
        if (startIndex >= 0) {
            // Obtener las coordenadas de la estación inicial
            var startLatLng = estaciones[startIndex].latlng;
            // Resaltar la posición inicial con un marcador diferente
            L.marker(startLatLng, { icon: L.divIcon({ className: 'start-marker' }) }).addTo(map);
            
            var routeCoordinates = [startLatLng]; // Incluir la posición inicial en las coordenadas de la ruta
            
            // Determinar el orden de las estaciones para el recorrido completo
            var stationIndices = Array.from({ length: estaciones.length }, (_, index) => index);
            stationIndices.splice(startIndex, 1); // Eliminar la estación inicial de la lista
            stationIndices.push(startIndex); // Agregar la estación inicial al final para el regreso
            
            // Recorrer todas las estaciones en el orden determinado
            stationIndices.forEach(function (index) {
                var stationLatLng = estaciones[index].latlng;
                routeCoordinates.push(stationLatLng); // Agregar las coordenadas de la estación a las rutas
                // Resaltar la estación con un marcador diferente
                L.marker(stationLatLng, { icon: L.divIcon({ className: 'station-marker' }) }).addTo(map);
            });

            // Trazar la ruta completa
            L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);
            map.fitBounds(routeCoordinates);
            
        }
    });
});

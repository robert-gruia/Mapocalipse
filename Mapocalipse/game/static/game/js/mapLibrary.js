// library of function for handling the maps and street views


// map creation functions
function createMap(mapElement, center, zoom, mapId) {

    const mapOptions = {
        center: center,
        zoom: zoom,
    };

    if (mapId) {
        if (typeof mapId !== 'string') {
            console.error('mapId is not a string:', mapId);
            return;
        }
        mapOptions.mapId = mapId;
    }

    return new google.maps.Map(mapElement, mapOptions);
}







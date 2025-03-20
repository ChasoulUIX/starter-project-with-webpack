import CONFIG from '../globals/config';

const MapHelper = {
  async initMap(mapElement) {
    // Make sure we have loaded the MapTiler SDK
    if (!window.L) {
      await this._loadMapTilerSDK();
    }

    const map = L.map(mapElement).setView([-6.200000, 106.816666], 13);

    L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${CONFIG.MAP_KEY}`, {
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>',
      maxZoom: 18,
    }).addTo(map);

    return map;
  },

  async _loadMapTilerSDK() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = resolve;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    });
  },

  createMarker(map, lat, lon, popupContent) {
    const marker = L.marker([lat, lon]).addTo(map);
    if (popupContent) {
      marker.bindPopup(popupContent);
    }
    return marker;
  },

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
};

export default MapHelper; 
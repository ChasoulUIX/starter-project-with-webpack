import StoryApi from '../../data/story-api';
import WebStorage from '../../utils/webstorage';
import MapHelper from '../../utils/map-helper';
import createMapPopupTemplate from '../templates/map-popup';

const Maps = {
  async render() {
    return `
      <div class="content">
        <h2 class="content__heading">Peta Cerita</h2>
        <div id="map" class="map-container"></div>
      </div>
    `;
  },

  async afterRender() {
    const token = WebStorage.get('token');
    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    try {
      const map = await MapHelper.initMap(document.querySelector('#map'));
      const storyApi = new StoryApi();
      const response = await storyApi.getAllStories(token);

      if (response.error) {
        alert(response.message);
        return;
      }

      const storiesWithLocation = response.listStory.filter(
        (story) => story.lat && story.lon,
      );

      if (storiesWithLocation.length > 0) {
        // Create bounds to fit all markers
        const bounds = L.latLngBounds(
          storiesWithLocation.map((story) => [story.lat, story.lon]),
        );

        storiesWithLocation.forEach((story) => {
          MapHelper.createMarker(
            map,
            story.lat,
            story.lon,
            createMapPopupTemplate(story),
          );
        });

        // Fit map to show all markers
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        alert('Tidak ada cerita dengan lokasi');
        // Center map to Indonesia
        map.setView([-2.548926, 118.014863], 5);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  },
};

export default Maps; 
import StoryApi from '../../data/story-api';
import WebStorage from '../../utils/webstorage';
import MapHelper from '../../utils/map-helper';
import createMapPopupTemplate from '../templates/map-popup';

const Detail = {
  async render() {
    return `
      <div class="content">
        <h2 class="content__heading">Detail Cerita</h2>
        <div id="story" class="story-detail-container"></div>
      </div>
    `;
  },

  async afterRender() {
    const token = WebStorage.get('token');
    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    const url = window.location.hash.slice(1);
    const storyId = url.split('/')[2];
    const storyContainer = document.querySelector('#story');

    try {
      // Tampilkan loading state
      storyContainer.innerHTML = '<div class="loading">Memuat cerita...</div>';

      const storyApi = new StoryApi();
      const response = await storyApi.getStoryDetail(storyId, token);

      if (response.error) {
        storyContainer.innerHTML = `<div class="story-item__not__found">${response.message}</div>`;
        return;
      }

      const { story } = response;
      storyContainer.innerHTML = `
        <article class="story-detail">
          <div class="story-detail__image-container">
            <img class="story-detail__image" src="${story.photoUrl}" alt="${story.description}">
          </div>
          <div class="story-detail__content">
            <div class="story-detail__description">
              <p>${story.description}</p>
            </div>
            
            <div class="story-detail__footer">
              <div class="story-detail__author">
                <img 
                  class="story-detail__author-avatar" 
                  src="https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}" 
                  alt="${story.name}"
                >
                <div class="story-detail__author-info">
                  <h3 class="story-detail__author-name">${story.name}</h3>
                  <p class="story-detail__date">${new Date(story.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>

            ${story.lat && story.lon ? '<div id="map" class="story-detail__map"></div>' : ''}
          </div>
        </article>
      `;

      if (story.lat && story.lon) {
        const map = await MapHelper.initMap(document.querySelector('#map'));
        map.setView([story.lat, story.lon], 13);
        MapHelper.createMarker(
          map,
          story.lat,
          story.lon,
          createMapPopupTemplate(story),
        );
      }
    } catch (error) {
      storyContainer.innerHTML = `<div class="story-item__not__found">Error: ${error.message}</div>`;
    }
  },
};

export default Detail; 
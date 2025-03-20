import StoryApi from '../../data/story-api';
import WebStorage from '../../utils/webstorage';
import createStoryItemTemplate from '../templates/story-item';

const Home = {
  async render() {
    return `
      <div class="content">
        <h2 class="content__heading">Cerita Terbaru</h2>
        <div id="stories" class="stories">
        </div>
      </div>
    `;
  },

  async afterRender() {
    const storiesContainer = document.querySelector('#stories');
    const token = WebStorage.get('token');

    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    try {
      storiesContainer.innerHTML = '<div class="loading">Memuat cerita...</div>';
      
      const storyApi = new StoryApi();
      const response = await storyApi.getAllStories(token);

      if (response.error) {
        storiesContainer.innerHTML = `<div class="error-message">${response.message}</div>`;
        return;
      }

      if (response.listStory.length === 0) {
        storiesContainer.innerHTML = '<div class="empty-message">Belum ada cerita</div>';
        return;
      }

      storiesContainer.innerHTML = '';
      response.listStory.forEach((story) => {
        storiesContainer.innerHTML += createStoryItemTemplate(story);
      });
    } catch (error) {
      storiesContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    }
  },
};

export default Home; 
import API_ENDPOINT from '../globals/api-endpoint';

class StoryApi {
  constructor() {
    this._baseUrl = API_ENDPOINT;
  }

  async register({ name, email, password }) {
    const response = await fetch(this._baseUrl.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  async login({ email, password }) {
    const response = await fetch(this._baseUrl.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  async getAllStories(token) {
    const response = await fetch(this._baseUrl.GET_ALL_STORIES, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseJson = await response.json();
    return responseJson;
  }

  async getStoryDetail(id, token) {
    const response = await fetch(this._baseUrl.GET_STORY_DETAIL(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseJson = await response.json();
    return responseJson;
  }

  async addStory({ description, photo, lat, lon }, token) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch(this._baseUrl.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const responseJson = await response.json();
    return responseJson;
  }
}

export default StoryApi; 
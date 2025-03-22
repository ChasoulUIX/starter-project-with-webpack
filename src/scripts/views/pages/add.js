import StoryApi from '../../data/story-api';
import WebStorage from '../../utils/webstorage';
import MapHelper from '../../utils/map-helper';

const Add = {
  async render() {
    return `
      <div class="content">
        <div class="story-form-wrapper">
          <div class="story-form-header">
            <h2 class="story-title">✨ Bagikan Momen Anda</h2>
            <p class="story-subtitle">Ceritakan pengalaman menarik Anda kepada dunia</p>
          </div>

          <div class="story-form-container">
            <form id="addStoryForm">
              <div class="story-form-layout">
                <div class="story-form-left">
                  <div class="form-group">
                    <label for="description" class="form-label">
                      <i class="fas fa-pen"></i>
                      Ceritakan Kisahmu
                    </label>
                    <textarea 
                      id="description" 
                      name="description" 
                      placeholder="Bagikan cerita menarikmu di sini..."
                      class="story-textarea"
                      required></textarea>
                  </div>

                  <div class="form-group location-section">
                    <label class="location-label">
                      <input type="checkbox" id="useLocation" name="useLocation">
                      <span class="location-text">
                        <i class="fas fa-map-marker-alt"></i>
                        Sertakan Lokasi
                      </span>
                    </label>
                    <div id="mapContainer" class="map-container" style="display: none;">
                      <div id="map"></div>
                    </div>
                  </div>
                </div>

                <div class="story-form-right">
                  <div class="form-group upload-section">
                    <div class="upload-options">
                      <button type="button" class="upload-option camera-option" id="cameraButton">
                        <i class="fas fa-camera"></i>
                        <span>Ambil Foto</span>
                      </button>
                      <div class="option-divider">atau</div>
                      <button type="button" class="upload-option gallery-option" id="galleryButton">
                        <i class="fas fa-images"></i>
                        <span>Pilih dari Galeri</span>
                      </button>
                    </div>

                    <div class="upload-area" id="uploadArea">
                      <input type="file" 
                        id="photo" 
                        name="photo" 
                        accept="image/*" 
                        capture="environment"
                        style="display: none;" 
                        required>
                      <input type="file" 
                        id="gallery" 
                        name="photo" 
                        accept="image/*" 
                        style="display: none;" 
                        required>
                    </div>
                    <div class="preview-container">
                      <img id="photoPreview" class="photo-preview" style="display: none;">
                      <button type="button" id="retakeButton" class="retake-button" style="display: none;">
                        <i class="fas fa-redo"></i>
                        Ambil Ulang
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="submit-button">
                  <i class="fas fa-paper-plane"></i>
                  Bagikan Cerita
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const token = WebStorage.get('token');
    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    const form = document.querySelector('#addStoryForm');
    const cameraInput = document.querySelector('#photo');
    const galleryInput = document.querySelector('#gallery');
    const photoPreview = document.querySelector('#photoPreview');
    const cameraButton = document.querySelector('#cameraButton');
    const galleryButton = document.querySelector('#galleryButton');
    const retakeButton = document.querySelector('#retakeButton');
    const useLocationCheckbox = document.querySelector('#useLocation');
    const mapContainer = document.querySelector('#mapContainer');
    let map = null;
    let userLocation = null;
    let currentInput = null;

    // Handle camera button click
    cameraButton.addEventListener('click', () => {
      cameraInput.click();
      currentInput = cameraInput;
    });

    // Handle gallery button click
    galleryButton.addEventListener('click', () => {
      galleryInput.click();
      currentInput = galleryInput;
    });

    // Handle file selection (both camera and gallery)
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          photoPreview.src = e.target.result;
          photoPreview.style.display = 'block';
          retakeButton.style.display = 'flex';
          document.querySelector('.upload-options').style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    };

    cameraInput.addEventListener('change', handleFileSelect);
    galleryInput.addEventListener('change', handleFileSelect);

    // Handle retake button
    retakeButton.addEventListener('click', () => {
      photoPreview.style.display = 'none';
      retakeButton.style.display = 'none';
      document.querySelector('.upload-options').style.display = 'flex';
      if (currentInput) {
        currentInput.value = '';
      }
    });

    useLocationCheckbox.addEventListener('change', async (event) => {
      if (event.target.checked) {
        mapContainer.style.display = 'block';
        if (!map) {
          map = await MapHelper.initMap(document.querySelector('#map'));
          try {
            userLocation = await MapHelper.getCurrentPosition();
            map.setView([userLocation.lat, userLocation.lon], 13);
            MapHelper.createMarker(map, userLocation.lat, userLocation.lon, 'Lokasi Anda');
          } catch (error) {
            console.error('Error getting location:', error);
            alert('Tidak dapat mengakses lokasi Anda');
            event.target.checked = false;
            mapContainer.style.display = 'none';
          }
        }
      } else {
        mapContainer.style.display = 'none';
        userLocation = null;
      }
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const description = document.querySelector('#description').value;
      const photo = cameraInput.files[0] || galleryInput.files[0];

      try {
        const storyApi = new StoryApi();
        const response = await storyApi.addStory({
          description,
          photo,
          ...(userLocation && { lat: userLocation.lat, lon: userLocation.lon }),
        }, token);

        if (response.error) {
          alert(response.message);
          return;
        }

        alert('Cerita berhasil ditambahkan');
        window.location.hash = '#/';
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  },
};

export default Add; 
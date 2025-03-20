import StoryApi from '../../data/story-api';
import WebStorage from '../../utils/webstorage';

const Login = {
  async render() {
    return `
      <div class="auth-page">
        <h2 class="content__heading">Login</h2>
        <div class="form-container">
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>

            <button type="submit" class="submit-button">
              <span>Login</span>
            </button>

            <p class="form-footer">
              Belum punya akun? <a href="#/register">Register di sini</a>
            </p>
          </form>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const form = document.querySelector('#loginForm');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        const storyApi = new StoryApi();
        const response = await storyApi.login({ email, password });

        if (response.error) {
          alert(response.message);
          return;
        }

        WebStorage.set('token', response.loginResult.token);
        window.location.hash = '#/';
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  },
};

export default Login; 
import StoryApi from '../../data/story-api';

const Register = {
  async render() {
    return `
      <div class="auth-page">
        <h2 class="content__heading">Register</h2>
        <div class="form-container">
          <form id="registerForm">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required minlength="6">
              <small>Password minimal 6 karakter</small>
            </div>

            <button type="submit" class="submit-button">
              <span>Register</span>
            </button>

            <p class="form-footer">
              Sudah punya akun? <a href="#/login">Login di sini</a>
            </p>
          </form>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const form = document.querySelector('#registerForm');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        const storyApi = new StoryApi();
        const response = await storyApi.register({ name, email, password });

        if (response.error) {
          alert(response.message);
          return;
        }

        alert('Registrasi berhasil! Silakan login.');
        window.location.hash = '#/login';
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  },
};

export default Register; 
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import WebStorage from '../utils/webstorage';

class App {
  constructor({ button, drawer, content }) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;
    this._navContainer = null;

    this._initialAppShell();
    this._setupLogout();
    this._setupActiveLinks();
  }

  _initialAppShell() {
    // Create hamburger button if it doesn't exist
    if (!this._button) {
      const button = document.createElement('button');
      button.className = 'drawer-button';
      button.innerHTML = '<i class="fas fa-bars"></i>';
      button.setAttribute('aria-label', 'Open Menu');
      
      const header = document.querySelector('.main-header');
      if (header) {
        header.appendChild(button);
        this._button = button;
      }
    }

    // Create nav container if it doesn't exist
    const existingNavContainer = document.querySelector('.nav-container');
    if (!existingNavContainer) {
      const navContainer = document.createElement('div');
      navContainer.className = 'nav-container';
      
      // Create nav list
      const navList = document.createElement('ul');
      navList.className = 'nav-list';
      
      // Add navigation items
      const navItems = [
        { href: '#/', text: 'Home' },
        { href: '#/add', text: 'Add Story' },
        { href: '#/maps', text: 'Maps' }
      ];
      
      navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.className = 'nav-link';
        a.textContent = item.text;
        li.appendChild(a);
        navList.appendChild(li);
      });
      
      navContainer.appendChild(navList);
      
      const header = document.querySelector('.main-header');
      if (header) {
        header.appendChild(navContainer);
        this._navContainer = navContainer;
      }
    } else {
      this._navContainer = existingNavContainer;
    }

    // Setup button click handler
    if (this._button) {
      this._button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (this._navContainer) {
          this._navContainer.classList.toggle('open');
          const isOpen = this._navContainer.classList.contains('open');
          this._button.setAttribute('aria-expanded', isOpen.toString());
          this._button.innerHTML = isOpen ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';

          // Add overlay when menu is open
          if (isOpen) {
            this._createOverlay();
          } else {
            this._removeOverlay();
          }
        }
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (this._navContainer && 
          !this._navContainer.contains(event.target) && 
          !this._button.contains(event.target)) {
        this._navContainer.classList.remove('open');
        this._button.setAttribute('aria-expanded', 'false');
        this._button.innerHTML = '<i class="fas fa-bars"></i>';
        this._removeOverlay();
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this._navContainer) {
        this._navContainer.classList.remove('open');
        this._button.setAttribute('aria-expanded', 'false');
        this._button.innerHTML = '<i class="fas fa-bars"></i>';
        this._removeOverlay();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this._navContainer.classList.remove('open');
        this._button.setAttribute('aria-expanded', 'false');
        this._button.innerHTML = '<i class="fas fa-bars"></i>';
        this._removeOverlay();
      }
    });
  }

  _createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 998;
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
      this._navContainer.classList.remove('open');
      this._button.setAttribute('aria-expanded', 'false');
      this._button.innerHTML = '<i class="fas fa-bars"></i>';
      this._removeOverlay();
    });
  }

  _removeOverlay() {
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  _setupLogout() {
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.textContent = 'Logout';
    logoutLink.className = 'nav-link logout-button';
    
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      WebStorage.remove('token');
      window.location.hash = '#/login';
    });

    const navList = this._navContainer.querySelector('.nav-list');
    if (navList) {
      const listItem = document.createElement('li');
      listItem.appendChild(logoutLink);
      navList.appendChild(listItem);
    }
  }

  _setupActiveLinks() {
    const setActiveLink = () => {
      const currentHash = window.location.hash || '#/';
      const links = this._navContainer.querySelectorAll('.nav-link');
      
      links.forEach(link => {
        if (link.getAttribute('href') === currentHash) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    window.addEventListener('hashchange', setActiveLink);
    setActiveLink();
  }

  _shouldShowNavbar() {
    const currentHash = window.location.hash;
    return !currentHash.includes('#/login') && !currentHash.includes('#/register');
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];
    
    try {
      const header = document.querySelector('.main-header');
      if (header) {
        if (this._shouldShowNavbar()) {
          header.style.display = 'flex';
          if (this._button) {
            this._button.style.display = window.innerWidth < 768 ? 'block' : 'none';
          }
        } else {
          header.style.display = 'none';
        }
      }

      this._content.innerHTML = await page.render();
      await page.afterRender();
      
      // Close menu after navigation on mobile
      if (window.innerWidth < 768 && this._navContainer) {
        this._navContainer.classList.remove('open');
        this._button.setAttribute('aria-expanded', 'false');
        this._button.innerHTML = '<i class="fas fa-bars"></i>';
        this._removeOverlay();
      }

      if (this._shouldShowNavbar()) {
        this._setupActiveLinks();
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this._content.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
  }
}

export default App; 
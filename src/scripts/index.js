import 'regenerator-runtime';
import '../styles/main.css';
import '../styles/responsive.css';
import '../styles/map.css';
import App from './views/app';

const app = new App({
  button: document.querySelector('#drawer-button'),
  drawer: document.querySelector('#navigation-drawer'),
  content: document.querySelector('#main-content'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();
});

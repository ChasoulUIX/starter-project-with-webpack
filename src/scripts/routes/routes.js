import Home from '../views/pages/home';
import Add from '../views/pages/add';
import Detail from '../views/pages/detail';
import Maps from '../views/pages/maps';
import Login from '../views/pages/login';
import Register from '../views/pages/register';

const routes = {
  '/': Home,
  '/home': Home,
  '/add': Add,
  '/detail/:id': Detail,
  '/maps': Maps,
  '/login': Login,
  '/register': Register,
};

export default routes;

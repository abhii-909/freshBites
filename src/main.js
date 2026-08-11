import './style.css';
import { router } from './router';
import { Navbar } from './components/Navbar';

// Import Views
import { HomeView } from './views/HomeView';
import { AuthView } from './views/AuthView';
import { RestaurantDetailView } from './views/RestaurantDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { OrderHistoryView } from './views/OrderHistoryView';
import { ProfileView } from './views/ProfileView';
import { DashboardView } from './views/DashboardView';

// Initialize the global Shell navbar
const navbar = new Navbar('nav-root');
navbar.render();

// Register SPA Views
router.addRoute('/', HomeView);
router.addRoute('/auth', AuthView);
router.addRoute('/restaurant/:id', RestaurantDetailView);
router.addRoute('/cart', CartView);
router.addRoute('/checkout', CheckoutView, { requiresAuth: true });
router.addRoute('/tracking/:id', OrderTrackingView);
router.addRoute('/orders', OrderHistoryView, { requiresAuth: true });
router.addRoute('/profile', ProfileView, { requiresAuth: true });
router.addRoute('/dashboard', DashboardView, { requiresAuth: true, requiresAdmin: true });

// Setup router main injection container
const appRoot = document.getElementById('app-root');
router.setAppRoot(appRoot);

// Initial route resolve
router.handleRouteChange();

// Re-render Navbar on route change to update active navigation tab state
window.addEventListener('hashchange', () => {
  navbar.render();
});

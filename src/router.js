import { authStore } from './store/authStore';
import { toastManager } from './components/Toast';

class Router {
  constructor() {
    this.routes = [];
    this.currentView = null;
    this.appRoot = null;

    window.addEventListener('hashchange', () => this.handleRouteChange());
  }

  setAppRoot(element) {
    this.appRoot = element;
  }

  addRoute(pattern, viewClass, options = {}) {
    // Convert path with parameters (like /restaurant/:id) to regex
    // e.g. /restaurant/:id -> ^#/restaurant/([^/]+)$
    const regexPath = pattern
      .replace(/\//g, '\\/')
      .replace(/:[a-zA-Z0-9_]+/g, '([^\\/]+)');
    const regex = new RegExp(`^#${regexPath}$`);

    // Extract parameter names from pattern
    const params = (pattern.match(/:[a-zA-Z0-9_]+/g) || []).map(p => p.substring(1));

    this.routes.push({
      pattern,
      regex,
      params,
      viewClass,
      requiresAuth: options.requiresAuth || false,
      requiresAdmin: options.requiresAdmin || false
    });
  }

  handleRouteChange() {
    let hash = window.location.hash || '#/';
    
    // Normalize hash (remove trailing slash if any, unless it's just #/)
    if (hash.endsWith('/') && hash.length > 2) {
      hash = hash.slice(0, -1);
    }

    // Find matching route
    let matchedRoute = null;
    let routeParams = {};

    for (const route of this.routes) {
      const match = hash.match(route.regex);
      if (match) {
        matchedRoute = route;
        // Map parameter values to names
        route.params.forEach((paramName, index) => {
          routeParams[paramName] = match[index + 1];
        });
        break;
      }
    }

    if (!matchedRoute) {
      // 404 - Redirect to home or show 404
      window.location.hash = '#/';
      return;
    }

    // Auth & Admin guards
    if (matchedRoute.requiresAuth && !authStore.isAuthenticated()) {
      toastManager.show('Please log in to access this page.', 'info');
      // Store intended destination to redirect after login
      sessionStorage.setItem('auth_redirect', hash);
      window.location.hash = '#/auth';
      return;
    }

    if (matchedRoute.requiresAdmin && !authStore.isAdmin()) {
      toastManager.show('Access denied. Admin privileges required.', 'error');
      window.location.hash = '#/';
      return;
    }

    // Render the view
    this.renderView(matchedRoute.viewClass, routeParams);
  }

  renderView(ViewClass, params) {
    if (!this.appRoot) return;

    // Destroy old view if cleanup is needed
    if (this.currentView && typeof this.currentView.destroy === 'function') {
      this.currentView.destroy();
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Instantiation and rendering
    this.currentView = new ViewClass(this.appRoot, params);
    
    // Add page transition class
    this.appRoot.classList.remove('fade-in');
    void this.appRoot.offsetWidth; // Trigger reflow to restart animation
    this.appRoot.classList.add('fade-in');
    
    this.currentView.render();
  }

  navigateTo(hash) {
    window.location.hash = hash;
  }
}

export const router = new Router();
export default router;

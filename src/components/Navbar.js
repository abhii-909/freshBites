import { authStore } from '../store/authStore';
import { cartStore } from '../store/cartStore';

export class Navbar {
  constructor(containerId = 'nav-root') {
    this.container = document.getElementById(containerId);
    this.mobileMenuOpen = false;

    // Set up listeners for dynamic re-rendering
    window.addEventListener('auth-change', () => this.render());
    window.addEventListener('cart-change', () => this.render());
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.render();
  }

  render() {
    if (!this.container) return;

    const isLoggedIn = authStore.isAuthenticated();
    const isAdmin = authStore.isAdmin();
    const user = authStore.currentUser;
    const cartCount = cartStore.items.reduce((sum, item) => sum + item.quantity, 0);

    const activeHash = window.location.hash || '#/';

    this.container.className = "sticky top-0 z-50 glass border-b border-slate-100 dark:border-slate-800 transition-all duration-300";

    this.container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo Section -->
          <div class="flex items-center gap-8">
            <a href="#/" class="flex items-center gap-2 group">
              <div class="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl text-white shadow-md shadow-emerald-200 dark:shadow-none group-hover:scale-105 transition-transform duration-300">
                <!-- Food Bowl SVG Icon -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
                </svg>
              </div>
              <span class="text-xl font-bold tracking-tight text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                Fresh<span class="text-emerald-500">Bite</span>
              </span>
            </a>

            <!-- Desktop Left Navigation Links -->
            <nav class="hidden md:flex items-center gap-6">
              <a href="#/" class="text-sm font-medium ${activeHash === '#/' || activeHash.startsWith('#/restaurant') ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'} transition-colors">
                Restaurants
              </a>
              ${isLoggedIn ? `
                <a href="#/orders" class="text-sm font-medium ${activeHash === '#/orders' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'} transition-colors">
                  My Orders
                </a>
              ` : ''}
              ${isLoggedIn && isAdmin ? `
                <a href="#/dashboard" class="text-sm font-medium ${activeHash === '#/dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'} transition-colors">
                  Dashboard
                </a>
              ` : ''}
            </nav>
          </div>

          <!-- Desktop Right Side Icons / User -->
          <div class="hidden md:flex items-center gap-4">
            <!-- Search Icon Link (directs to home search) -->
            <a href="#/" class="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors" title="Search restaurants">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </a>

            <!-- Cart Icon Button -->
            <a href="#/cart" class="relative p-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group" title="View Cart">
              <svg class="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              ${cartCount > 0 ? `
                <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                  ${cartCount}
                </span>
              ` : ''}
            </a>

            <!-- User Auth Profile Dropdown / Login -->
            ${isLoggedIn ? `
              <div class="relative group/profile">
                <a href="#/profile" class="flex items-center gap-2 pl-2 cursor-pointer">
                  <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    ${user.name.charAt(0).toUpperCase()}
                  </div>
                  <div class="text-left hidden lg:block">
                    <p class="text-xs font-semibold text-slate-800 dark:text-white leading-3">${user.name}</p>
                    <span class="text-[10px] text-slate-400 capitalize">${user.role}</span>
                  </div>
                </a>
                
                <!-- Quick Dropdown Menu on hover/focus -->
                <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1.5 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 transform translate-y-1">
                  <a href="#/profile" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    Profile Settings
                  </a>
                  <a href="#/orders" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    My Orders
                  </a>
                  ${isAdmin ? `
                    <a href="#/dashboard" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2"></path></svg>
                      Dashboard
                    </a>
                  ` : ''}
                  <div class="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                  <button id="nav-logout-btn" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                  </button>
                </div>
              </div>
            ` : `
              <a href="#/auth" class="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-emerald-500 hover:to-teal-400 hover:shadow-lg transition-all duration-300">
                Sign In
              </a>
            `}
          </div>

          <!-- Mobile Hamburger Menu Button -->
          <div class="flex items-center gap-3 md:hidden">
            <!-- Mobile Cart Button -->
            <a href="#/cart" class="relative p-2 text-slate-600 dark:text-slate-300" aria-label="Mobile cart">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              ${cartCount > 0 ? `
                <span class="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  ${cartCount}
                </span>
              ` : ''}
            </a>

            <button id="mobile-menu-toggle" class="p-2 text-slate-600 dark:text-slate-300" aria-label="Toggle menu">
              ${this.mobileMenuOpen ? `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              ` : `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              `}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      ${this.mobileMenuOpen ? `
        <div class="md:hidden glass border-b border-slate-100 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2 flex flex-col">
          <a href="#/" class="px-3 py-2 rounded-lg text-base font-medium ${activeHash === '#/' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}">
            Restaurants
          </a>
          ${isLoggedIn ? `
            <a href="#/orders" class="px-3 py-2 rounded-lg text-base font-medium ${activeHash === '#/orders' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}">
              My Orders
            </a>
            <a href="#/profile" class="px-3 py-2 rounded-lg text-base font-medium ${activeHash === '#/profile' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}">
              Profile Settings
            </a>
            ${isAdmin ? `
              <a href="#/dashboard" class="px-3 py-2 rounded-lg text-base font-medium ${activeHash === '#/dashboard' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}">
                Admin Dashboard
              </a>
            ` : ''}
            <button id="mobile-logout-btn" class="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600">
              Logout
            </button>
          ` : `
            <a href="#/auth" class="mx-3 mt-2 text-center bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg">
              Sign In
            </a>
          `}
        </div>
      ` : ''}
    `;

    // Hook listeners
    const toggleBtn = this.container.querySelector('#mobile-menu-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    const logoutBtn = this.container.querySelector('#nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    const mobileLogoutBtn = this.container.querySelector('#mobile-logout-btn');
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', () => this.handleLogout());
    }
  }

  handleLogout() {
    authStore.logout();
    this.mobileMenuOpen = false;
    this.render();
    window.location.hash = '#/';
    toastManager.show('Logged out successfully.', 'info');
  }
}

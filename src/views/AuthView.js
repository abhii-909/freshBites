import { authStore } from '../store/authStore';
import { toastManager } from '../components/Toast';
import { router } from '../router';

export class AuthView {
  constructor(appRoot, params = {}) {
    this.appRoot = appRoot;
    this.params = params;
    this.activeTab = 'login'; // 'login' or 'signup'
    this.loading = false;
  }

  render() {
    this.appRoot.innerHTML = `
      <div class="max-w-md mx-auto my-12 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        
        <!-- Tabs -->
        <div class="flex border-b border-slate-100 dark:border-slate-700">
          <button id="tab-login" class="flex-1 py-4 text-center text-sm font-semibold transition-all duration-300 border-b-2 ${this.activeTab === 'login' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}">
            Sign In
          </button>
          <button id="tab-signup" class="flex-1 py-4 text-center text-sm font-semibold transition-all duration-300 border-b-2 ${this.activeTab === 'signup' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}">
            Create Account
          </button>
        </div>

        <div class="p-8">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white" id="auth-title">
              ${this.activeTab === 'login' ? 'Welcome Back!' : 'Join FreshBite'}
            </h2>
            <p class="text-xs text-slate-400 mt-2">
              ${this.activeTab === 'login' ? 'Login with your credentials to start ordering' : 'Register a new account to get started'}
            </p>
          </div>

          <form id="auth-form" class="space-y-5" novalidate>
            ${this.activeTab === 'signup' ? `
              <div>
                <label for="name" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
                <input type="text" id="name" required placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                <span class="text-xs text-rose-500 mt-1 hidden" id="err-name">Please enter your name.</span>
              </div>
            ` : ''}

            <div>
              <label for="email" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
              <input type="email" id="email" required placeholder="you@example.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
              <span class="text-xs text-rose-500 mt-1 hidden" id="err-email">Please enter a valid email address.</span>
            </div>

            <div>
              <label for="password" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Password</label>
              <input type="password" id="password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
              <span class="text-xs text-rose-500 mt-1 hidden" id="err-password">Password must be at least 6 characters.</span>
            </div>

            ${this.activeTab === 'signup' ? `
              <div>
                <label for="role" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Account Type</label>
                <select id="role" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                  <option value="customer">Hungry Customer (Order food)</option>
                  <option value="admin">Restaurant Partner (Manage menus & orders)</option>
                </select>
              </div>
            ` : ''}

            <button type="submit" ${this.loading ? 'disabled' : ''} class="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-4">
              ${this.loading ? `
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              ` : (this.activeTab === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <!-- Demo Credentials Assistance -->
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 text-center">
            <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Demo Login</h4>
            <div class="flex flex-col gap-2">
              <button id="demo-customer" class="text-xs py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                Customer: <span class="font-semibold text-emerald-600 dark:text-emerald-400">customer@freshbite.com</span> (password)
              </button>
              <button id="demo-admin" class="text-xs py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                Partner/Admin: <span class="font-semibold text-teal-600 dark:text-teal-400">admin@freshbite.com</span> (password)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const tabLogin = this.appRoot.querySelector('#tab-login');
    const tabSignup = this.appRoot.querySelector('#tab-signup');
    const form = this.appRoot.querySelector('#auth-form');
    const btnDemoCust = this.appRoot.querySelector('#demo-customer');
    const btnDemoAdmin = this.appRoot.querySelector('#demo-admin');

    if (tabLogin) {
      tabLogin.addEventListener('click', () => {
        if (this.activeTab !== 'login') {
          this.activeTab = 'login';
          this.render();
        }
      });
    }

    if (tabSignup) {
      tabSignup.addEventListener('click', () => {
        if (this.activeTab !== 'signup') {
          this.activeTab = 'signup';
          this.render();
        }
      });
    }

    if (btnDemoCust) {
      btnDemoCust.addEventListener('click', () => this.autofillDemo('customer@freshbite.com', 'password'));
    }
    if (btnDemoAdmin) {
      btnDemoAdmin.addEventListener('click', () => this.autofillDemo('admin@freshbite.com', 'password'));
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  autofillDemo(email, pw) {
    if (this.activeTab !== 'login') {
      this.activeTab = 'login';
      this.render();
    }
    
    const emailInput = this.appRoot.querySelector('#email');
    const pwInput = this.appRoot.querySelector('#password');
    if (emailInput && pwInput) {
      emailInput.value = email;
      pwInput.value = pw;
      this.handleSubmit();
    }
  }

  async handleSubmit() {
    // Reset error messages
    const errs = this.appRoot.querySelectorAll('[id^="err-"]');
    errs.forEach(el => el.classList.add('hidden'));

    const emailInput = this.appRoot.querySelector('#email');
    const passwordInput = this.appRoot.querySelector('#password');
    const nameInput = this.appRoot.querySelector('#name');
    const roleInput = this.appRoot.querySelector('#role');

    let isValid = true;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      this.appRoot.querySelector('#err-email').classList.remove('hidden');
      isValid = false;
    }

    // Validate password
    if (passwordInput.value.length < 6) {
      this.appRoot.querySelector('#err-password').classList.remove('hidden');
      isValid = false;
    }

    // Validate signup fields
    if (this.activeTab === 'signup' && (!nameInput || !nameInput.value.trim())) {
      this.appRoot.querySelector('#err-name').classList.remove('hidden');
      isValid = false;
    }

    if (!isValid) return;

    // Set loading
    this.loading = true;
    this.render();

    // Mock network request latency
    setTimeout(() => {
      try {
        if (this.activeTab === 'login') {
          const user = authStore.login(emailInput.value, passwordInput.value);
          toastManager.show(`Welcome back, ${user.name}!`, 'success');
          
          this.redirectAfterAuth(user);
        } else {
          const user = authStore.signup(
            nameInput.value, 
            emailInput.value, 
            passwordInput.value, 
            roleInput.value
          );
          toastManager.show(`Account created successfully! Welcome, ${user.name}.`, 'success');
          
          this.redirectAfterAuth(user);
        }
      } catch (error) {
        this.loading = false;
        this.render();
        toastManager.show(error.message, 'error');
      }
    }, 800);
  }

  redirectAfterAuth(user) {
    // Check if there was a redirected route
    const redirectUrl = sessionStorage.getItem('auth_redirect');
    sessionStorage.removeItem('auth_redirect');

    if (redirectUrl) {
      window.location.hash = redirectUrl;
    } else if (user.role === 'admin') {
      window.location.hash = '#/dashboard';
    } else {
      window.location.hash = '#/';
    }
  }

  destroy() {
    // Cleanup
  }
}

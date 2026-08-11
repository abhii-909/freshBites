import { authStore } from '../store/authStore';
import { toastManager } from '../components/Toast';

export class ProfileView {
  constructor(appRoot, params = {}) {
    this.appRoot = appRoot;
    this.params = params;
    this.showNewAddressForm = false;

    this.onAuthChange = () => this.render();
    window.addEventListener('auth-change', this.onAuthChange);
  }

  render() {
    const user = authStore.currentUser;
    if (!user) {
      this.appRoot.innerHTML = `
        <div class="text-center py-16">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Access Denied</h2>
          <p class="text-slate-400 mt-2">Please log in to manage your profile settings.</p>
          <a href="#/auth" class="mt-4 inline-block bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl">Login</a>
        </div>
      `;
      return;
    }

    this.appRoot.innerHTML = `
      <div class="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Profile Settings</h1>
          <p class="text-xs text-slate-400 mt-1">Manage your account information and delivery details</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- General Info Card -->
          <div class="md:col-span-2 space-y-6">
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-premium space-y-5">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Personal Information</h3>

              <form id="profile-info-form" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="profile-name" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
                    <input type="text" id="profile-name" value="${user.name}" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  </div>
                  <div>
                    <label for="profile-phone" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Phone Number</label>
                    <input type="tel" id="profile-phone" value="${user.phone || ''}" placeholder="e.g. +1 (555) 000-0000" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  </div>
                </div>

                <div>
                  <label for="profile-email" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
                  <input type="email" id="profile-email" value="${user.email}" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>

                <div class="flex justify-end pt-2">
                  <button type="submit" class="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs py-3 px-6 rounded-xl hover:shadow-lg transition-all">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
            
            <!-- System Controls -->
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-premium space-y-4">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider text-rose-500">Danger Zone</h3>
              <p class="text-xs text-slate-400">Perform standard storage wipe or database cleanup to restore default fresh installation state.</p>
              
              <div class="flex">
                <button id="reset-storage-btn" class="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-600 font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Reset App Database
                </button>
              </div>
            </div>
          </div>

          <!-- Saved Addresses Sidebar -->
          <div class="space-y-6">
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-700/60 shadow-premium space-y-4">
              <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700/60">
                <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Saved Addresses</h3>
                <button id="toggle-add-addr" class="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-0.5">
                  ${this.showNewAddressForm ? 'Close' : '+ Add'}
                </button>
              </div>

              <!-- Address List -->
              <div class="space-y-3">
                ${user.addresses && user.addresses.length > 0 ? user.addresses.map(addr => `
                  <div class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl relative group">
                    <button data-action="delete-addr" data-addr-id="${addr.id}" class="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete address">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <span class="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded capitalize">${addr.label}</span>
                    <p class="text-xs text-slate-400 mt-2 pr-6 leading-relaxed font-medium">${addr.address}</p>
                  </div>
                `).join('') : `
                  <p class="text-xs text-slate-400 text-center py-4">No addresses saved. Add dropoff locations for quick checkouts.</p>
                `}
              </div>

              <!-- Inline Add Address Form -->
              ${this.showNewAddressForm ? `
                <form id="profile-address-form" class="space-y-3.5 p-3.5 bg-slate-50 dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950/40 rounded-xl">
                  <h4 class="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider">New Location</h4>
                  <div>
                    <label for="new-addr-label" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Label</label>
                    <input type="text" id="new-addr-label" required placeholder="e.g. Home, Work" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold" />
                  </div>
                  <div>
                    <label for="new-addr-text" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Address</label>
                    <textarea id="new-addr-text" required rows="2" placeholder="Street, building, apt, zip" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold leading-relaxed"></textarea>
                  </div>
                  <button type="submit" class="w-full bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider py-2 rounded-lg hover:shadow-md transition-all">
                    Save Address
                  </button>
                </form>
              ` : ''}
            </div>
          </div>

        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const infoForm = this.appRoot.querySelector('#profile-info-form');
    if (infoForm) {
      infoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = this.appRoot.querySelector('#profile-name').value.trim();
        const email = this.appRoot.querySelector('#profile-email').value.trim();
        const phone = this.appRoot.querySelector('#profile-phone').value.trim();

        try {
          authStore.updateProfile(name, email, phone);
          toastManager.show('Profile information updated.', 'success');
        } catch (error) {
          toastManager.show(error.message, 'error');
        }
      });
    }

    const resetBtn = this.appRoot.querySelector('#reset-storage-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to restore all defaults? This clears all orders, cart, and profile customizations.")) {
          localStorage.clear();
          toastManager.show('Database restored to default template. Reloading...', 'success');
          setTimeout(() => {
            window.location.hash = '#/';
            window.location.reload();
          }, 1000);
        }
      });
    }

    const toggleAddrBtn = this.appRoot.querySelector('#toggle-add-addr');
    if (toggleAddrBtn) {
      toggleAddrBtn.addEventListener('click', () => {
        this.showNewAddressForm = !this.showNewAddressForm;
        this.render();
      });
    }

    const addrForm = this.appRoot.querySelector('#profile-address-form');
    if (addrForm) {
      addrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const label = this.appRoot.querySelector('#new-addr-label').value.trim();
        const address = this.appRoot.querySelector('#new-addr-text').value.trim();

        authStore.addAddress(label, address);
        toastManager.show(`Address "${label}" saved.`, 'success');
        this.showNewAddressForm = false;
        this.render();
      });
    }

    const delAddrBtns = this.appRoot.querySelectorAll('[data-action="delete-addr"]');
    delAddrBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.addrId;
        authStore.removeAddress(id);
        toastManager.show('Address removed.', 'info');
        this.render();
      });
    });
  }

  destroy() {
    window.removeEventListener('auth-change', this.onAuthChange);
  }
}

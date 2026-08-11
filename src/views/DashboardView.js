import { orderStore } from '../store/orderStore';
import { restaurantStore } from '../store/restaurantStore';
import { authStore } from '../store/authStore';
import { toastManager } from '../components/Toast';

export class DashboardView {
  constructor(appRoot, params = {}) {
    this.appRoot = appRoot;
    this.params = params;
    this.activeTab = 'orders'; // 'orders', 'menu', 'analytics'
    this.selectedRestaurantId = 'rest-1'; // default representing Gourmet Burger Co
    this.editingItemId = null; // ID of item currently editing
    this.showAddForm = false; // toggle add menu item form

    // Listen to changes to re-render dynamically
    this.onOrdersChange = () => this.render();
    this.onRestaurantsChange = () => this.render();

    window.addEventListener('orders-change', this.onOrdersChange);
    window.addEventListener('restaurants-change', this.onRestaurantsChange);
  }

  render() {
    const user = authStore.currentUser;
    if (!user || user.role !== 'admin') {
      this.appRoot.innerHTML = `
        <div class="text-center py-16">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Admin Privileges Required</h2>
          <p class="text-slate-400 mt-2">Please log in with an administrator account to view the merchant dashboard.</p>
          <a href="#/auth" class="mt-4 inline-block bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl">Login as Admin</a>
        </div>
      `;
      return;
    }

    const orders = orderStore.getAll();
    const restaurants = restaurantStore.getAll();
    const selectedRestaurant = restaurantStore.getById(this.selectedRestaurantId) || restaurants[0];

    this.appRoot.innerHTML = `
      <div class="space-y-6">
        <!-- Dashboard Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Partner Dashboard</h1>
            <p class="text-xs text-slate-400 mt-1">Manage orders, customize menus, and track analytics in real-time</p>
          </div>

          <!-- Restaurant Selector -->
          <div class="flex items-center gap-2">
            <label for="dashboard-rest-select" class="text-xs font-semibold text-slate-500">Representing:</label>
            <select id="dashboard-rest-select" class="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
              ${restaurants.map(r => `<option value="${r.id}" ${this.selectedRestaurantId === r.id ? 'selected' : ''}>${r.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Tab Controls -->
        <div class="flex border-b border-slate-100 dark:border-slate-700/60 gap-8">
          <button id="dash-tab-orders" class="pb-3 text-sm font-semibold transition-all border-b-2 ${this.activeTab === 'orders' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'}">
            Active Orders (${orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length})
          </button>
          <button id="dash-tab-menu" class="pb-3 text-sm font-semibold transition-all border-b-2 ${this.activeTab === 'menu' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'}">
            Edit Menu (${selectedRestaurant ? selectedRestaurant.menu.length : 0} items)
          </button>
          <button id="dash-tab-analytics" class="pb-3 text-sm font-semibold transition-all border-b-2 ${this.activeTab === 'analytics' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'}">
            Store Performance
          </button>
        </div>

        <!-- Render Tab Contents -->
        <div class="space-y-6">
          ${this.renderTabContents(orders, selectedRestaurant)}
        </div>
      </div>
    `;

    this.attachEventListeners(orders, selectedRestaurant);
  }

  renderTabContents(orders, selectedRestaurant) {
    if (this.activeTab === 'orders') {
      return this.renderOrdersTab(orders);
    } else if (this.activeTab === 'menu') {
      return this.renderMenuTab(selectedRestaurant);
    } else {
      return this.renderAnalyticsTab(orders);
    }
  }

  // --- 1. ORDERS TAB ---
  renderOrdersTab(orders) {
    // Filter active/recent orders
    if (orders.length === 0) {
      return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-100 dark:border-slate-700 text-center">
          <p class="text-sm text-slate-400">No orders placed on the platform yet. Submit orders from the customer page to test!</p>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        ${orders.map(order => {
          const isCompleted = ['Delivered', 'Cancelled'].includes(order.status);
          return `
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-premium space-y-4">
              <div class="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60 text-xs">
                <div>
                  <span class="font-extrabold text-slate-800 dark:text-white">Order #${order.id}</span>
                  <span class="text-slate-400 ml-2">by ${order.userEmail}</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <span class="px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${this.getStatusStyles(order.status)}">${order.status}</span>
                  <span class="font-semibold text-slate-400">${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <!-- Item count & Address dropoff -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div class="space-y-1">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dishes</p>
                  ${order.items.map(i => `<p class="flex justify-between max-w-sm"><span class="text-slate-400">${i.quantity} x</span> ${i.item.name} <span>$${(i.item.price * i.quantity).toFixed(2)}</span></p>`).join('')}
                </div>
                <div class="space-y-1">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Info</p>
                  <p class="capitalize text-slate-800 dark:text-white">${order.address.label}</p>
                  <p class="text-slate-400 text-[11px] leading-relaxed font-medium">${order.address.address}</p>
                </div>
              </div>

              <!-- Admin controls to advance state -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2 justify-between items-center">
                <div class="text-xs font-bold text-slate-800 dark:text-white">
                  Payment: <span class="capitalize text-emerald-500">${order.paymentMethod}</span> ($${order.pricing.total.toFixed(2)})
                </div>
                
                ${!isCompleted ? `
                  <div class="flex gap-2">
                    ${this.renderStatusActionButtons(order)}
                  </div>
                ` : `
                  <span class="text-xs text-slate-400 font-semibold">Order processing concluded.</span>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderStatusActionButtons(order) {
    switch (order.status) {
      case 'Placed':
        return `
          <button data-action="cancel" data-order-id="${order.id}" class="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors">Reject</button>
          <button data-action="status-next" data-status="Confirmed" data-order-id="${order.id}" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors">Accept</button>
        `;
      case 'Confirmed':
        return `<button data-action="status-next" data-status="Preparing" data-order-id="${order.id}" class="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors">Cook Food</button>`;
      case 'Preparing':
        return `<button data-action="status-next" data-status="Out for Delivery" data-order-id="${order.id}" class="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors">Ship Delivery</button>`;
      case 'Out for Delivery':
        return `<button data-action="status-next" data-status="Delivered" data-order-id="${order.id}" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors">Deliver Order</button>`;
      default:
        return '';
    }
  }

  // --- 2. MENU TAB ---
  renderMenuTab(selectedRestaurant) {
    if (!selectedRestaurant) {
      return `<p class="text-slate-400 text-center py-6">Select or create a restaurant first.</p>`;
    }

    return `
      <div class="space-y-6">
        
        <!-- Controls and Add Toggle -->
        <div class="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">Dishes on menu</h3>
          <button id="toggle-add-dish-btn" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all">
            ${this.showAddForm ? 'Hide Form' : '+ Add Menu Item'}
          </button>
        </div>

        <!-- Add Item Form -->
        ${this.showAddForm ? `
          <form id="add-dish-form" class="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <h4 class="md:col-span-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Create New Dish</h4>
            <div>
              <label for="dish-name" class="block text-xs font-semibold text-slate-500 mb-1">Dish Name</label>
              <input type="text" id="dish-name" required placeholder="e.g. Garlic bread" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="dish-price" class="block text-xs font-semibold text-slate-500 mb-1">Price ($)</label>
              <input type="number" step="0.01" id="dish-price" required placeholder="8.99" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="dish-category" class="block text-xs font-semibold text-slate-500 mb-1">Category</label>
              <input type="text" id="dish-category" required placeholder="Starters, Mains, Drinks" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div class="md:col-span-2">
              <label for="dish-desc" class="block text-xs font-semibold text-slate-500 mb-1">Description</label>
              <input type="text" id="dish-desc" placeholder="Briefly describe the ingredients" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="dish-veg" class="block text-xs font-semibold text-slate-500 mb-1">Dietary</label>
              <select id="dish-veg" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="true">Vegetarian Only</option>
                <option value="false">Contains Meat / Non-Veg</option>
              </select>
            </div>
            <div class="md:col-span-3 flex justify-end gap-2 pt-2">
              <button type="submit" class="bg-emerald-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all hover:shadow-md">Save Dish</button>
            </div>
          </form>
        ` : ''}

        <!-- Menu Table List -->
        <div class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-premium">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-semibold text-slate-500 border-collapse">
              <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700/60 font-bold uppercase text-[9px] tracking-wider text-slate-400">
                <tr>
                  <th class="p-4">Dish</th>
                  <th class="p-4">Category</th>
                  <th class="p-4">Price</th>
                  <th class="p-4">Dietary</th>
                  <th class="p-4">In Stock</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60">
                ${selectedRestaurant.menu.map(item => this.renderMenuTableRow(item)).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  renderMenuTableRow(item) {
    const isEditing = this.editingItemId === item.id;
    const isVeg = item.veg;
    
    if (isEditing) {
      return `
        <tr class="bg-emerald-50/10 dark:bg-emerald-950/10">
          <td class="p-3" colspan="2">
            <div class="space-y-1.5">
              <input type="text" id="edit-name-${item.id}" value="${item.name}" class="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold" />
              <input type="text" id="edit-desc-${item.id}" value="${item.description}" class="w-full px-2 py-1.5 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400" />
            </div>
          </td>
          <td class="p-3">
            <input type="number" step="0.01" id="edit-price-${item.id}" value="${item.price}" class="w-20 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold" />
          </td>
          <td class="p-3">
            <select id="edit-veg-${item.id}" class="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
              <option value="true" ${isVeg ? 'selected' : ''}>Veg</option>
              <option value="false" ${!isVeg ? 'selected' : ''}>Non-Veg</option>
            </select>
          </td>
          <td class="p-3">--</td>
          <td class="p-3 text-right">
            <div class="flex justify-end gap-1.5">
              <button data-edit-cancel="${item.id}" class="px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold">Cancel</button>
              <button data-edit-save="${item.id}" class="px-3 py-1.5 rounded bg-emerald-600 text-white font-bold">Save</button>
            </div>
          </td>
        </tr>
      `;
    }

    return `
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-850">
        <td class="p-4 flex items-center gap-3">
          <img src="${item.image}" alt="${item.name}" class="w-10 h-10 rounded-lg object-cover bg-slate-50 dark:bg-slate-900" />
          <div>
            <p class="font-bold text-slate-800 dark:text-white">${item.name}</p>
            <p class="text-[10px] text-slate-400 line-clamp-1 max-w-[200px] font-medium">${item.description}</p>
          </div>
        </td>
        <td class="p-4 font-semibold text-slate-700 dark:text-slate-300 capitalize">${item.category}</td>
        <td class="p-4 font-extrabold text-slate-800 dark:text-white">$${item.price.toFixed(2)}</td>
        <td class="p-4">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isVeg ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20'}">
            ${isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </td>
        <td class="p-4">
          <button data-toggle-stock="${item.id}" class="text-xs font-bold ${item.available !== false ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-500'}">
            ${item.available !== false ? '🟢 Yes' : '🔴 Out'}
          </button>
        </td>
        <td class="p-4 text-right">
          <div class="flex justify-end gap-2.5">
            <button data-edit-trigger="${item.id}" class="text-slate-400 hover:text-emerald-500" title="Edit Item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            <button data-delete-dish="${item.id}" class="text-slate-400 hover:text-rose-500" title="Delete Item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  // --- 3. ANALYTICS TAB ---
  renderAnalyticsTab(orders) {
    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const totalEarnings = deliveredOrders.reduce((sum, o) => sum + o.pricing.total, 0);

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Total Revenue -->
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-premium flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</p>
            <h4 class="text-2xl font-extrabold text-slate-800 dark:text-white">$${totalEarnings.toFixed(2)}</h4>
          </div>
          <div class="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>
          </div>
        </div>

        <!-- Orders Completed -->
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-premium flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orders Delivered</p>
            <h4 class="text-2xl font-extrabold text-slate-800 dark:text-white">${deliveredOrders.length} / ${orders.length}</h4>
          </div>
          <div class="bg-teal-500/10 text-teal-500 p-3 rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          </div>
        </div>

        <!-- Average Rating KPI -->
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-premium flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</p>
            <h4 class="text-2xl font-extrabold text-slate-800 dark:text-white">4.8 ⭐</h4>
          </div>
          <div class="bg-amber-500/10 text-amber-500 p-3 rounded-xl">
            <svg class="w-6 h-6 text-amber-500 fill-amber-500/20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.977-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
          </div>
        </div>

        <!-- Best Seller representation -->
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-premium flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Cuisine</p>
            <h4 class="text-2xl font-extrabold text-slate-800 dark:text-white">Burgers 🍔</h4>
          </div>
          <div class="bg-sky-500/10 text-sky-500 p-3 rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
        </div>

      </div>
    `;
  }

  getStatusStyles(status) {
    switch (status) {
      case 'Placed':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20';
      case 'Confirmed':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/20';
      case 'Preparing':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20';
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20';
      case 'Cancelled':
      default:
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20';
    }
  }

  attachEventListeners(orders, selectedRestaurant) {
    // Tab switching
    const tabOrders = this.appRoot.querySelector('#dash-tab-orders');
    const tabMenu = this.appRoot.querySelector('#dash-tab-menu');
    const tabAnalytics = this.appRoot.querySelector('#dash-tab-analytics');

    if (tabOrders) {
      tabOrders.addEventListener('click', () => {
        this.activeTab = 'orders';
        this.render();
      });
    }
    if (tabMenu) {
      tabMenu.addEventListener('click', () => {
        this.activeTab = 'menu';
        this.render();
      });
    }
    if (tabAnalytics) {
      tabAnalytics.addEventListener('click', () => {
        this.activeTab = 'analytics';
        this.render();
      });
    }

    // Restaurant selector change
    const restSelect = this.appRoot.querySelector('#dashboard-rest-select');
    if (restSelect) {
      restSelect.addEventListener('change', (e) => {
        this.selectedRestaurantId = e.target.value;
        this.render();
      });
    }

    // Active orders status updates
    if (this.activeTab === 'orders') {
      const nextBtns = this.appRoot.querySelectorAll('[data-action="status-next"]');
      const rejectBtns = this.appRoot.querySelectorAll('[data-action="cancel"]');

      nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const orderId = btn.dataset.orderId;
          const status = btn.dataset.status;
          orderStore.updateOrderStatus(orderId, status);
          toastManager.show(`Order #${orderId} status set to: ${status}`, 'success');
        });
      });

      rejectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const orderId = btn.dataset.orderId;
          orderStore.updateOrderStatus(orderId, 'Cancelled');
          toastManager.show(`Order #${orderId} rejected & cancelled.`, 'info');
        });
      });
    }

    // Menu management handlers
    if (this.activeTab === 'menu') {
      // Toggle Add Form
      const addDishToggleBtn = this.appRoot.querySelector('#toggle-add-dish-btn');
      if (addDishToggleBtn) {
        addDishToggleBtn.addEventListener('click', () => {
          this.showAddForm = !this.showAddForm;
          this.render();
        });
      }

      // Add Item Submit
      const addForm = this.appRoot.querySelector('#add-dish-form');
      if (addForm) {
        addForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = this.appRoot.querySelector('#dish-name').value.trim();
          const price = this.appRoot.querySelector('#dish-price').value;
          const category = this.appRoot.querySelector('#dish-category').value.trim();
          const description = this.appRoot.querySelector('#dish-desc').value.trim();
          const veg = this.appRoot.querySelector('#dish-veg').value === 'true';

          restaurantStore.addMenuItem(selectedRestaurant.id, { name, price, category, description, veg });
          toastManager.show(`Created dish "${name}" successfully!`, 'success');
          this.showAddForm = false;
          this.render();
        });
      }

      // Stock toggling
      const stockBtns = this.appRoot.querySelectorAll('[data-toggle-stock]');
      stockBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const itemId = btn.dataset.toggleStock;
          restaurantStore.toggleMenuItemAvailability(selectedRestaurant.id, itemId);
          toastManager.show('Item stock availability updated.', 'info');
        });
      });

      // Edit Triggers
      const editTriggerBtns = this.appRoot.querySelectorAll('[data-edit-trigger]');
      editTriggerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.editingItemId = btn.dataset.editTrigger;
          this.render();
        });
      });

      const editCancelBtns = this.appRoot.querySelectorAll('[data-edit-cancel]');
      editCancelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.editingItemId = null;
          this.render();
        });
      });

      const editSaveBtns = this.appRoot.querySelectorAll('[data-edit-save]');
      editSaveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const itemId = btn.dataset.editSave;
          const name = this.appRoot.querySelector(`#edit-name-${itemId}`).value.trim();
          const desc = this.appRoot.querySelector(`#edit-desc-${itemId}`).value.trim();
          const price = this.appRoot.querySelector(`#edit-price-${itemId}`).value;
          const veg = this.appRoot.querySelector(`#edit-veg-${itemId}`).value === 'true';

          restaurantStore.updateMenuItem(selectedRestaurant.id, itemId, { name, description: desc, price, veg });
          toastManager.show('Menu item updated.', 'success');
          this.editingItemId = null;
          this.render();
        });
      });

      // Delete action
      const deleteBtns = this.appRoot.querySelectorAll('[data-delete-dish]');
      deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const itemId = btn.dataset.deleteDish;
          if (confirm("Are you sure you want to permanently delete this menu item?")) {
            restaurantStore.deleteMenuItem(selectedRestaurant.id, itemId);
            toastManager.show('Item deleted from menu.', 'info');
            this.render();
          }
        });
      });
    }
  }

  destroy() {
    window.removeEventListener('orders-change', this.onOrdersChange);
    window.removeEventListener('restaurants-change', this.onRestaurantsChange);
  }
}

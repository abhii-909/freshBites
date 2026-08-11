import { restaurantStore } from '../store/restaurantStore';
import { cartStore } from '../store/cartStore';
import { toastManager } from '../components/Toast';

export class RestaurantDetailView {
  constructor(appRoot, params = {}) {
    this.appRoot = appRoot;
    this.params = params;
    this.restaurantId = params.id;
    this.selectedCategory = 'All';
    this.conflictModalData = null; // store item and rest details during cart merge conflict

    // Render whenever cart changes to keep quantities in sync
    this.onCartChange = () => this.render();
    window.addEventListener('cart-change', this.onCartChange);
  }

  render() {
    const restaurant = restaurantStore.getById(this.restaurantId);
    if (!restaurant) {
      this.appRoot.innerHTML = `
        <div class="text-center py-16">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Restaurant Not Found</h2>
          <p class="text-slate-400 mt-2">The food spot you are looking for does not exist or has been removed.</p>
          <a href="#/" class="mt-4 inline-block bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl">Go Home</a>
        </div>
      `;
      return;
    }

    // Extract all unique categories from the restaurant's menu
    const categories = ["All", ...new Set(restaurant.menu.map(item => item.category))];

    // Filter menu items by selected category
    const menuItems = this.selectedCategory === 'All' 
      ? restaurant.menu 
      : restaurant.menu.filter(item => item.category === this.selectedCategory);

    this.appRoot.innerHTML = `
      <div class="space-y-8">
        
        <!-- Header Banner Block -->
        <section class="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-premium">
          <div class="absolute inset-0 opacity-40 bg-cover bg-center" style="background-image: url('${restaurant.image}');"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20"></div>

          <!-- Back button -->
          <a href="#/" class="absolute top-4 left-4 z-10 p-2.5 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/35 transition-colors text-white" title="Go back to listings">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </a>

          <div class="relative z-10 p-6 md:p-10 pt-28 md:pt-36 max-w-4xl space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              ${restaurant.cuisine.map(c => `<span class="text-xs bg-emerald-500/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md font-medium">${c}</span>`).join('')}
            </div>
            
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">${restaurant.name}</h1>
            <p class="text-slate-300 text-sm max-w-2xl">${restaurant.description}</p>
            
            <!-- Quick Stats -->
            <div class="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-200">
              <span class="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-1 rounded-md">
                <svg class="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ${restaurant.rating.toFixed(1)} (${restaurant.ratingCount} reviews)
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                ${restaurant.deliveryTime}
              </span>
              <span>•</span>
              <span>$${restaurant.costForTwo} for two</span>
            </div>
          </div>
        </section>

        <!-- Category bar and Menu layout -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- Desktop Category List (Sidebar) -->
          <aside class="hidden lg:block space-y-2">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider px-3 mb-4">Categories</h3>
            <div class="flex flex-col gap-1">
              ${categories.map(cat => `
                <button data-category="${cat}" class="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${this.selectedCategory === cat ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold border-l-4 border-emerald-500 pl-2.5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'}">
                  ${cat}
                </button>
              `).join('')}
            </div>
          </aside>

          <!-- Menu Items List -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Mobile Category List (Horizontal Slider) -->
            <div class="lg:hidden flex gap-2 overflow-x-auto pb-1 scrollbar-thin border-b border-slate-100 dark:border-slate-800">
              ${categories.map(cat => `
                <button data-category="${cat}" class="px-4 py-2 text-xs font-semibold rounded-full border whitespace-nowrap transition-all ${this.selectedCategory === cat ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}">
                  ${cat}
                </button>
              `).join('')}
            </div>

            <h2 class="text-xl font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span>${this.selectedCategory} Menu Items</span>
              <span class="text-xs text-slate-400 font-normal">Showing ${menuItems.length} items</span>
            </h2>

            <!-- Menu Cards Grid -->
            <div class="space-y-4">
              ${menuItems.map(item => this.renderMenuItemCard(item, restaurant)).join('')}
            </div>
          </div>
        </div>

      </div>

      <!-- Add Cart Conflict Modal Backdrop (rendered dynamically) -->
      <div id="cart-conflict-modal-container"></div>
    `;

    this.attachEventListeners(restaurant);
  }

  renderMenuItemCard(item, restaurant) {
    const qty = cartStore.getItemQuantity(item.id);
    const isVeg = item.veg;
    const isAvailable = item.available !== false; // default true

    return `
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 md:p-5 flex gap-4 md:gap-6 items-center shadow-premium relative ${!isAvailable ? 'opacity-60' : ''}">
        <!-- Veg / Non-veg tag symbol -->
        <div class="absolute top-4 left-4 z-10">
          <div class="w-4 h-4 p-0.5 border ${isVeg ? 'border-emerald-500' : 'border-rose-500'} flex items-center justify-center rounded-sm bg-white dark:bg-slate-800">
            <span class="w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
          </div>
        </div>

        <!-- Thumbnail Image -->
        <div class="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex-shrink-0 relative">
          <img src="${item.image}" alt="${item.name}" loading="lazy" class="w-full h-full object-cover" />
          ${!isAvailable ? `
            <div class="absolute inset-0 bg-slate-950/70 text-white text-[10px] font-extrabold flex items-center justify-center uppercase tracking-wide">
              Sold Out
            </div>
          ` : ''}
        </div>

        <!-- Details -->
        <div class="flex-grow space-y-1 md:space-y-1.5 min-w-0 pr-2">
          <div class="flex items-center gap-2">
            <h3 class="text-base md:text-lg font-bold text-slate-800 dark:text-white leading-tight truncate">
              ${item.name}
            </h3>
          </div>
          <p class="text-xs text-slate-400 dark:text-slate-400 line-clamp-2 leading-relaxed">
            ${item.description}
          </p>
          <p class="text-base font-extrabold text-slate-900 dark:text-white">
            $${item.price.toFixed(2)}
          </p>
        </div>

        <!-- Add Actions -->
        <div class="flex-shrink-0">
          ${!isAvailable ? `
            <button disabled class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed uppercase">
              Unavailable
            </button>
          ` : (qty > 0 ? `
            <!-- Increment / Decrement Counter -->
            <div class="flex items-center bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-100 dark:shadow-none font-bold text-sm overflow-hidden h-10">
              <button data-action="decrement" data-item-id="${item.id}" class="px-3.5 hover:bg-emerald-700 transition-colors h-full flex items-center justify-center font-bold text-lg" aria-label="Decrease quantity">−</button>
              <span class="px-2 w-7 text-center select-none font-semibold text-xs">${qty}</span>
              <button data-action="increment" data-item-id="${item.id}" class="px-3.5 hover:bg-emerald-700 transition-colors h-full flex items-center justify-center font-bold text-lg" aria-label="Increase quantity">+</button>
            </div>
          ` : `
            <!-- Standard Add Button -->
            <button data-action="add" data-item-id="${item.id}" class="bg-white dark:bg-slate-900 border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm uppercase tracking-wider h-10">
              Add
            </button>
          `)}
        </div>
      </div>
    `;
  }

  attachEventListeners(restaurant) {
    // Category click listeners
    const categoryBtns = this.appRoot.querySelectorAll('[data-category]');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCuisine = btn.dataset.category;
        this.selectedCategory = btn.dataset.category;
        this.render();
      });
    });

    // Add / Qty buttons delegation
    const addBtns = this.appRoot.querySelectorAll('[data-action="add"]');
    const incBtns = this.appRoot.querySelectorAll('[data-action="increment"]');
    const decBtns = this.appRoot.querySelectorAll('[data-action="decrement"]');

    addBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.itemId;
        const item = restaurant.menu.find(i => i.id === itemId);
        this.handleAddToCart(item, restaurant);
      });
    });

    incBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.itemId;
        const currentQty = cartStore.getItemQuantity(itemId);
        cartStore.updateQuantity(itemId, currentQty + 1);
        toastManager.show('Item count updated.', 'success', 1000);
      });
    });

    decBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.itemId;
        const currentQty = cartStore.getItemQuantity(itemId);
        cartStore.updateQuantity(itemId, currentQty - 1);
        toastManager.show('Item count updated.', 'success', 1000);
      });
    });
  }

  handleAddToCart(item, restaurant) {
    const result = cartStore.addItem(item, restaurant.id, restaurant.name, false);
    
    if (result.conflict) {
      // Open cart replacement confirmation dialog
      this.conflictModalData = { item, restaurant };
      this.showConflictModal();
    } else {
      toastManager.show(`Added ${item.name} to cart.`, 'success', 2000);
    }
  }

  showConflictModal() {
    const modalContainer = this.appRoot.querySelector('#cart-conflict-modal-container');
    if (!modalContainer) return;

    const existingRestName = cartStore.restaurantName || "another restaurant";
    const currentItem = this.conflictModalData.item;
    const currentRest = this.conflictModalData.restaurant;

    modalContainer.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm";
    modalContainer.innerHTML = `
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-700 space-y-6 transform scale-95 transition-transform duration-300">
        <div class="text-center space-y-3">
          <div class="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 dark:text-white leading-tight">Replace Cart Items?</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Your cart already contains dishes from <span class="font-bold text-slate-700 dark:text-slate-200">"${existingRestName}"</span>. 
            Do you want to discard those items and start a new order with <span class="font-bold text-slate-700 dark:text-slate-200">"${currentRest.name}"</span>?
          </p>
        </div>

        <div class="flex gap-3">
          <button id="cancel-conflict-btn" class="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all">
            Cancel
          </button>
          <button id="confirm-conflict-btn" class="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-lg text-white font-bold text-xs rounded-xl transition-all">
            Clear & Add
          </button>
        </div>
      </div>
    `;

    // Listeners inside modal
    modalContainer.querySelector('#cancel-conflict-btn').addEventListener('click', () => {
      this.closeConflictModal();
    });

    modalContainer.querySelector('#confirm-conflict-btn').addEventListener('click', () => {
      cartStore.addItem(currentItem, currentRest.id, currentRest.name, true);
      toastManager.show(`Cart cleared. Added ${currentItem.name}.`, 'success', 2000);
      this.closeConflictModal();
      this.render(); // update detail view quantities
    });
  }

  closeConflictModal() {
    const modalContainer = this.appRoot.querySelector('#cart-conflict-modal-container');
    if (modalContainer) {
      modalContainer.innerHTML = '';
      modalContainer.className = '';
    }
    this.conflictModalData = null;
  }

  destroy() {
    window.removeEventListener('cart-change', this.onCartChange);
  }
}

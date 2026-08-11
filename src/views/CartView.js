import { cartStore } from '../store/cartStore';
import { toastManager } from '../components/Toast';

export class CartView {
  constructor(appRoot, params = {}) {
    this.appRoot = appRoot;
    this.params = params;

    this.onCartChange = () => this.render();
    window.addEventListener('cart-change', this.onCartChange);
  }

  render() {
    const items = cartStore.items;
    const subtotal = cartStore.getSubtotal();
    const discount = cartStore.getDiscount();
    const delivery = cartStore.getDeliveryFee();
    const tax = cartStore.getTax();
    const platform = cartStore.getPlatformFee();
    const total = cartStore.getTotal();
    const promo = cartStore.appliedPromo;

    if (items.length === 0) {
      this.appRoot.innerHTML = `
        <div class="max-w-md mx-auto my-12 bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 text-center border border-slate-100 dark:border-slate-700/60 shadow-premium">
          <div class="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <!-- Empty Cart SVG -->
            <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">Your Cart is Empty</h2>
          <p class="text-sm text-slate-400 leading-relaxed mb-8">
            Look like you haven't added anything to your cart yet. Browse our selection of premium restaurants and start ordering!
          </p>
          <a href="#/" class="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:shadow-lg transition-all duration-300">
            Browse Restaurants
          </a>
        </div>
      `;
      return;
    }

    this.appRoot.innerHTML = `
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Your Cart</h1>
          <p class="text-xs text-slate-400 mt-1">Review your items before placing the order</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items List Section -->
          <div class="lg:col-span-2 space-y-4">
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 md:p-6 shadow-premium space-y-4">
              <div class="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <span class="text-sm font-bold text-slate-800 dark:text-white">Ordering from: <span class="text-emerald-500">${cartStore.restaurantName}</span></span>
                <button id="clear-cart-btn" class="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors">Clear Cart</button>
              </div>

              <div class="divide-y divide-slate-100 dark:divide-slate-700/60">
                ${items.map(cartItem => this.renderCartItemRow(cartItem)).join('')}
              </div>
            </div>
          </div>

          <!-- Checkout Summary Section -->
          <div class="space-y-6">
            <!-- Promo Code Card -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-premium space-y-4">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white">Apply Promo Code</h3>
              
              <form id="promo-form" class="flex gap-2">
                <input type="text" id="promo-input" placeholder="e.g. FRESH50" value="${promo ? promo.code : ''}" ${promo ? 'disabled' : ''} class="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                ${promo ? `
                  <button type="button" id="remove-promo-btn" class="bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-all">
                    Remove
                  </button>
                ` : `
                  <button type="submit" class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl transition-all">
                    Apply
                  </button>
                `}
              </form>

              <!-- Promo Code Info -->
              ${promo ? `
                <div class="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs space-y-1">
                  <p class="font-bold flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Code "${promo.code}" applied!
                  </p>
                  <p class="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">Enjoy ${promo.value}${promo.type === 'percent' ? '%' : '$'} discount on your meal.</p>
                </div>
              ` : `
                <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Codes</p>
                  <div class="grid grid-cols-1 gap-1.5">
                    <button class="promo-quick-apply text-left text-[11px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700/40 rounded-lg text-slate-600 dark:text-slate-300 font-medium border border-dashed border-slate-200 dark:border-slate-700" data-code="FRESH50">
                      <span class="font-bold text-emerald-500">FRESH50</span> - 50% Off (Min order $20, Max cap $15)
                    </button>
                    <button class="promo-quick-apply text-left text-[11px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700/40 rounded-lg text-slate-600 dark:text-slate-300 font-medium border border-dashed border-slate-200 dark:border-slate-700" data-code="BITE10">
                      <span class="font-bold text-emerald-500">BITE10</span> - 10% Off (Min order $10, Max cap $5)
                    </button>
                  </div>
                </div>
              `}
            </div>

            <!-- Bill Breakdown Card -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-premium space-y-4">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700/60">Order Summary</h3>

              <div class="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span class="font-bold text-slate-800 dark:text-white">$${subtotal.toFixed(2)}</span>
                </div>
                
                ${discount > 0 ? `
                  <div class="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Discount</span>
                    <span>-$${discount.toFixed(2)}</span>
                  </div>
                ` : ''}

                <div class="flex justify-between">
                  <span>Delivery Fee</span>
                  <span class="font-bold text-slate-800 dark:text-white">
                    ${delivery === 0 ? '<span class="text-emerald-500">FREE</span>' : `$${delivery.toFixed(2)}`}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span>Platform Fee</span>
                  <span class="font-bold text-slate-800 dark:text-white">$${platform.toFixed(2)}</span>
                </div>

                <div class="flex justify-between">
                  <span>Taxes (8%)</span>
                  <span class="font-bold text-slate-800 dark:text-white">$${tax.toFixed(2)}</span>
                </div>
              </div>

              <!-- Grand Total -->
              <div class="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <span class="text-sm font-bold text-slate-800 dark:text-white">Grand Total</span>
                <span class="text-xl font-extrabold text-slate-900 dark:text-white">$${total.toFixed(2)}</span>
              </div>

              <a href="#/checkout" class="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-lg text-white font-bold text-sm py-4 rounded-xl transition-all duration-300 mt-2">
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderCartItemRow(cartItem) {
    const item = cartItem.item;
    const itemTotal = item.price * cartItem.quantity;
    
    return `
      <div class="flex gap-4 items-center py-4 first:pt-0 last:pb-0">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover bg-slate-50 dark:bg-slate-900" />
        
        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 p-0.5 border ${item.veg ? 'border-emerald-500' : 'border-rose-500'} flex items-center justify-center rounded-sm bg-white dark:bg-slate-800 flex-shrink-0">
              <span class="w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
            </span>
            <h4 class="text-sm font-bold text-slate-800 dark:text-white truncate">${item.name}</h4>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">$${item.price.toFixed(2)} each</p>
        </div>

        <!-- Quantity adjust -->
        <div class="flex items-center bg-slate-100 dark:bg-slate-950/40 rounded-lg text-slate-800 dark:text-white text-xs overflow-hidden h-8">
          <button data-action="decrement" data-item-id="${item.id}" class="px-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 h-full flex items-center justify-center font-bold" aria-label="Decrease quantity">−</button>
          <span class="px-2 w-6 text-center select-none font-bold">${cartItem.quantity}</span>
          <button data-action="increment" data-item-id="${item.id}" class="px-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 h-full flex items-center justify-center font-bold" aria-label="Increase quantity">+</button>
        </div>

        <div class="text-right min-w-[70px]">
          <p class="text-sm font-bold text-slate-800 dark:text-white">$${itemTotal.toFixed(2)}</p>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Clear Cart button
    const clearBtn = this.appRoot.querySelector('#clear-cart-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        cartStore.clearCart();
        toastManager.show('Cart cleared.', 'info');
      });
    }

    // Inc / Dec buttons
    const incBtns = this.appRoot.querySelectorAll('[data-action="increment"]');
    const decBtns = this.appRoot.querySelectorAll('[data-action="decrement"]');

    incBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.itemId;
        const currentQty = cartStore.getItemQuantity(itemId);
        cartStore.updateQuantity(itemId, currentQty + 1);
      });
    });

    decBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.itemId;
        const currentQty = cartStore.getItemQuantity(itemId);
        cartStore.updateQuantity(itemId, currentQty - 1);
      });
    });

    // Promo Code submit
    const promoForm = this.appRoot.querySelector('#promo-form');
    if (promoForm) {
      promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = this.appRoot.querySelector('#promo-input');
        if (!input || !input.value.trim()) return;

        try {
          cartStore.applyPromo(input.value);
          toastManager.show('Promo code applied successfully!', 'success');
          this.render();
        } catch (error) {
          toastManager.show(error.message, 'error');
        }
      });
    }

    // Remove Promo button
    const removePromoBtn = this.appRoot.querySelector('#remove-promo-btn');
    if (removePromoBtn) {
      removePromoBtn.addEventListener('click', () => {
        cartStore.removePromo();
        toastManager.show('Promo code removed.', 'info');
      });
    }

    // Quick Apply Promo buttons
    const quickApplyBtns = this.appRoot.querySelectorAll('.promo-quick-apply');
    quickApplyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        try {
          cartStore.applyPromo(code);
          toastManager.show(`Promo code ${code} applied!`, 'success');
          this.render();
        } catch (error) {
          toastManager.show(error.message, 'error');
        }
      });
    });
  }

  destroy() {
    window.removeEventListener('cart-change', this.onCartChange);
  }
}

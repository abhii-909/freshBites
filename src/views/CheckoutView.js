import { authStore } from '../store/authStore';
import { cartStore } from '../store/cartStore';
import { orderStore } from '../store/orderStore';
import { toastManager } from '../components/Toast';
import { router } from '../router';

export class CheckoutView {
  constructor(appRoot, params = {}) {
    this.appRoot = appRoot;
    this.params = params;
    this.processing = false;
    this.paymentMethod = 'card'; // 'card', 'upi', 'cod'
    this.selectedAddressId = authStore.currentUser?.selectedAddressId || 'new';

    // Event listener for profile changes to update addresses
    this.onAuthChange = () => this.render();
    window.addEventListener('auth-change', this.onAuthChange);
  }

  render() {
    const user = authStore.currentUser;
    const cartItems = cartStore.items;
    const total = cartStore.getTotal();

    if (!user) {
      this.appRoot.innerHTML = `
        <div class="text-center py-16">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Access Denied</h2>
          <p class="text-slate-400 mt-2">Please log in to proceed to checkout.</p>
          <a href="#/auth" class="mt-4 inline-block bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl">Login</a>
        </div>
      `;
      return;
    }

    if (cartItems.length === 0) {
      this.appRoot.innerHTML = `
        <div class="text-center py-16">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Your cart is empty</h2>
          <p class="text-slate-400 mt-2">Please add items to your cart before checking out.</p>
          <a href="#/" class="mt-4 inline-block bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl">Browse Food</a>
        </div>
      `;
      return;
    }

    this.appRoot.innerHTML = `
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Checkout</h1>
          <p class="text-xs text-slate-400 mt-1">Complete your delivery address and payment details</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Address & Payment Sections -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Delivery Address Card -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 md:p-6 shadow-premium space-y-5">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span class="bg-emerald-500/10 text-emerald-500 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-extrabold">1</span>
                Delivery Address
              </h3>

              <!-- Saved Addresses Quick Choice -->
              ${user.addresses && user.addresses.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${user.addresses.map(addr => `
                    <label class="flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${this.selectedAddressId === addr.id ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40'}">
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-xs font-bold text-slate-800 dark:text-white capitalize">${addr.label}</span>
                        <input type="radio" name="address-select" value="${addr.id}" ${this.selectedAddressId === addr.id ? 'checked' : ''} class="text-emerald-500 focus:ring-emerald-500" />
                      </div>
                      <p class="text-xs text-slate-400 leading-normal">${addr.address}</p>
                    </label>
                  `).join('')}

                  <label class="flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${this.selectedAddressId === 'new' ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40'}">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs font-bold text-slate-800 dark:text-white">Add New Address</span>
                      <input type="radio" name="address-select" value="new" ${this.selectedAddressId === 'new' ? 'checked' : ''} class="text-emerald-500 focus:ring-emerald-500" />
                    </div>
                    <p class="text-xs text-slate-400 leading-normal">Enter details for a new drop-off location</p>
                  </label>
                </div>
              ` : ''}

              <!-- New Address Form (Rendered always if no addresses, or if 'new' is selected) -->
              <div id="new-address-form-box" class="${user.addresses && user.addresses.length > 0 && this.selectedAddressId !== 'new' ? 'hidden' : 'space-y-4 pt-3 border-t border-slate-100 dark:border-slate-700/60'}">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="md:col-span-1">
                    <label for="address-label" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Address Nickname</label>
                    <input type="text" id="address-label" placeholder="e.g. Home, Office, Gym" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold" />
                  </div>
                  <div class="md:col-span-2">
                    <label for="address-text" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Full Delivery Address</label>
                    <input type="text" id="address-text" placeholder="Street name, apartment, building name, zip" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold" />
                  </div>
                </div>

                ${user.addresses && user.addresses.length > 0 ? '' : `
                  <div class="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="save-address-checkbox" checked class="rounded border-slate-200 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500" />
                    <label for="save-address-checkbox" class="text-xs text-slate-400 font-semibold cursor-pointer">Save this address to my profile</label>
                  </div>
                `}
              </div>
            </div>

            <!-- Payment Details Card -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 md:p-6 shadow-premium space-y-5">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span class="bg-emerald-500/10 text-emerald-500 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-extrabold">2</span>
                Payment Method
              </h3>

              <!-- Payment Tabs -->
              <div class="grid grid-cols-3 gap-2.5 border-b border-slate-100 dark:border-slate-700/60 pb-4">
                <button type="button" data-payment="card" class="py-3 px-2 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 font-bold text-[11px] uppercase tracking-wider transition-all ${this.paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-500' }">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  Card
                </button>
                <button type="button" data-payment="upi" class="py-3 px-2 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 font-bold text-[11px] uppercase tracking-wider transition-all ${this.paymentMethod === 'upi' ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-500' }">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  UPI
                </button>
                <button type="button" data-payment="cod" class="py-3 px-2 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 font-bold text-[11px] uppercase tracking-wider transition-all ${this.paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-500' }">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  COD
                </button>
              </div>

              <!-- Payment Fields -->
              <div id="payment-fields-box">
                ${this.renderPaymentFields()}
              </div>
            </div>

          </div>

          <!-- Checkout Sidebar (Summary Card) -->
          <div class="space-y-6">
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-premium space-y-4">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700/60">Checkout Summary</h3>

              <!-- Item Mini-list -->
              <div class="space-y-3 max-h-48 overflow-y-auto pr-1">
                ${cartItems.map(cartItem => `
                  <div class="flex justify-between items-center text-xs font-semibold">
                    <span class="text-slate-500 dark:text-slate-400 truncate pr-2">${cartItem.quantity} x ${cartItem.item.name}</span>
                    <span class="text-slate-800 dark:text-white">$${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
              </div>

              <!-- Bill details -->
              <div class="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 font-medium">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span>$${cartStore.getSubtotal().toFixed(2)}</span>
                </div>
                ${cartStore.getDiscount() > 0 ? `
                  <div class="flex justify-between text-emerald-600">
                    <span>Promo Discount</span>
                    <span>-$${cartStore.getDiscount().toFixed(2)}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between">
                  <span>Fees & Taxes</span>
                  <span>$${(cartStore.getDeliveryFee() + cartStore.getPlatformFee() + cartStore.getTax()).toFixed(2)}</span>
                </div>
              </div>

              <!-- Grand Total -->
              <div class="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <span class="text-xs font-bold text-slate-800 dark:text-white">Amount to Pay</span>
                <span class="text-lg font-extrabold text-slate-900 dark:text-white">$${total.toFixed(2)}</span>
              </div>

              <button id="pay-submit-btn" class="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-2">
                Place Order & Pay
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Full-Screen Payment Processing Overlay -->
      ${this.processing ? `
        <div class="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-md flex flex-col items-center justify-center text-white space-y-4">
          <div class="relative">
            <svg class="animate-spin h-14 w-14 text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-emerald-500 font-bold text-xs">FB</div>
          </div>
          <div class="text-center space-y-1">
            <p class="text-base font-bold tracking-wide">Processing Secure Payment...</p>
            <p class="text-xs text-slate-400">Do not refresh this page or click back.</p>
          </div>
        </div>
      ` : ''}
    `;

    this.attachEventListeners();
  }

  renderPaymentFields() {
    if (this.paymentMethod === 'card') {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label for="card-holder" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Cardholder Name</label>
            <input type="text" id="card-holder" required placeholder="John Doe" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold" />
          </div>
          <div class="md:col-span-2">
            <label for="card-number" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Card Number</label>
            <input type="text" id="card-number" required maxlength="19" placeholder="4111 2222 3333 4444" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold" />
          </div>
          <div>
            <label for="card-expiry" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Expiry Date</label>
            <input type="text" id="card-expiry" required maxlength="5" placeholder="MM/YY" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold" />
          </div>
          <div>
            <label for="card-cvv" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">CVV</label>
            <input type="password" id="card-cvv" required maxlength="3" placeholder="•••" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold" />
          </div>
        </div>
      `;
    } else if (this.paymentMethod === 'upi') {
      return `
        <div class="space-y-4">
          <div>
            <label for="upi-id" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">UPI ID (VPA)</label>
            <input type="text" id="upi-id" required placeholder="john@okaxis" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold" />
            <span class="text-[10px] text-slate-400 mt-1 block">A payment notification request will be sent to your UPI app.</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pay with cash or card upon delivery. Please ensure you have exact change or access to digital wallet scanning when the rider arrives.
          </p>
        </div>
      `;
    }
  }

  attachEventListeners() {
    const user = authStore.currentUser;

    // Address selection radio change
    const addressRadios = this.appRoot.querySelectorAll('input[name="address-select"]');
    addressRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedAddressId = e.target.value;
        const newAddressForm = this.appRoot.querySelector('#new-address-form-box');
        if (newAddressForm) {
          if (this.selectedAddressId === 'new') {
            newAddressForm.classList.remove('hidden');
          } else {
            newAddressForm.classList.add('hidden');
          }
        }
      });
    });

    // Payment method tabs
    const paymentBtns = this.appRoot.querySelectorAll('[data-payment]');
    paymentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.paymentMethod = btn.dataset.payment;
        this.render();
      });
    });

    // Handle submit order placement
    const paySubmitBtn = this.appRoot.querySelector('#pay-submit-btn');
    if (paySubmitBtn) {
      paySubmitBtn.addEventListener('click', () => this.handlePlaceOrder());
    }
  }

  async handlePlaceOrder() {
    const user = authStore.currentUser;
    if (!user) return;

    let finalAddressText = "";
    let finalAddressLabel = "";

    // 1. Validate Address
    if (this.selectedAddressId === 'new') {
      const labelInput = this.appRoot.querySelector('#address-label');
      const textInput = this.appRoot.querySelector('#address-text');
      const saveCheckbox = this.appRoot.querySelector('#save-address-checkbox');

      if (!textInput || !textInput.value.trim()) {
        toastManager.show('Please enter your full delivery address.', 'error');
        textInput?.focus();
        return;
      }

      finalAddressLabel = labelInput.value.trim() || 'Home';
      finalAddressText = textInput.value.trim();

      // If user checks the save box or has no saved addresses, save to profile
      if (saveCheckbox?.checked || !user.addresses || user.addresses.length === 0) {
        authStore.addAddress(finalAddressLabel, finalAddressText);
      }
    } else {
      const selected = user.addresses.find(a => a.id === this.selectedAddressId);
      if (selected) {
        finalAddressLabel = selected.label;
        finalAddressText = selected.address;
      } else {
        toastManager.show('Please select or enter a delivery address.', 'error');
        return;
      }
    }

    // 2. Validate Payment
    if (this.paymentMethod === 'card') {
      const holder = this.appRoot.querySelector('#card-holder')?.value.trim();
      const num = this.appRoot.querySelector('#card-number')?.value.trim();
      const exp = this.appRoot.querySelector('#card-expiry')?.value.trim();
      const cvv = this.appRoot.querySelector('#card-cvv')?.value.trim();

      if (!holder || !num || !exp || !cvv) {
        toastManager.show('Please fill in all credit card details.', 'error');
        return;
      }
      if (num.replace(/\s/g, '').length < 16) {
        toastManager.show('Card number must be 16 digits.', 'error');
        return;
      }
    } else if (this.paymentMethod === 'upi') {
      const upiId = this.appRoot.querySelector('#upi-id')?.value.trim();
      if (!upiId || !upiId.includes('@')) {
        toastManager.show('Please enter a valid UPI ID (e.g. name@upi).', 'error');
        return;
      }
    }

    // 3. Process order
    this.processing = true;
    this.render();

    // Simulate payment transaction
    setTimeout(() => {
      try {
        const orderPricing = {
          subtotal: cartStore.getSubtotal(),
          discount: cartStore.getDiscount(),
          delivery: cartStore.getDeliveryFee(),
          platform: cartStore.getPlatformFee(),
          tax: cartStore.getTax(),
          total: cartStore.getTotal()
        };

        const deliveryAddress = {
          label: finalAddressLabel,
          address: finalAddressText
        };

        // Place the order in storage
        const placedOrder = orderStore.placeOrder(
          user.id,
          user.email,
          cartStore.restaurantId,
          cartStore.restaurantName,
          cartStore.items,
          orderPricing,
          deliveryAddress,
          this.paymentMethod
        );

        // Clear cart
        cartStore.clearCart();

        toastManager.show(`Order placed successfully! Order ID: ${placedOrder.id}`, 'success');
        
        // Hide processing screen and route
        this.processing = false;
        router.navigateTo(`#/tracking/${placedOrder.id}`);
      } catch (error) {
        this.processing = false;
        this.render();
        toastManager.show(`Order placing failed: ${error.message}`, 'error');
      }
    }, 2000);
  }

  destroy() {
    window.removeEventListener('auth-change', this.onAuthChange);
  }
}

import { orderStore } from '../store/orderStore';
import { authStore } from '../store/authStore';
import { cartStore } from '../store/cartStore';
import { toastManager } from '../components/Toast';
import { router } from '../router';

export class OrderHistoryView {
  constructor(appRoot, params = {}) {
    this.appRoot = appRoot;
    this.params = params;

    this.onOrdersChange = () => this.render();
    window.addEventListener('orders-change', this.onOrdersChange);
  }

  render() {
    const user = authStore.currentUser;
    if (!user) {
      this.appRoot.innerHTML = `
        <div class="text-center py-16">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Access Denied</h2>
          <p class="text-slate-400 mt-2">Please log in to view your order history.</p>
          <a href="#/auth" class="mt-4 inline-block bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl">Login</a>
        </div>
      `;
      return;
    }

    const orders = orderStore.getOrdersByUser(user.id);

    if (orders.length === 0) {
      this.appRoot.innerHTML = `
        <div class="max-w-md mx-auto my-12 bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 text-center border border-slate-100 dark:border-slate-700/60 shadow-premium">
          <div class="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Orders Yet</h2>
          <p class="text-sm text-slate-400 leading-relaxed mb-8">
            You haven't ordered any delicious food yet. Give your taste buds a treat and make your first order!
          </p>
          <a href="#/" class="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:shadow-lg transition-all duration-300">
            Order Now
          </a>
        </div>
      `;
      return;
    }

    this.appRoot.innerHTML = `
      <div class="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Your Order History</h1>
          <p class="text-xs text-slate-400 mt-1">Manage and view all your past orders</p>
        </div>

        <div class="space-y-5">
          ${orders.map(order => this.renderOrderCard(order)).join('')}
        </div>
      </div>
    `;

    this.attachEventListeners(orders);
  }

  renderOrderCard(order) {
    const isCompleted = ['Delivered', 'Cancelled'].includes(order.status);
    const dateStr = new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-premium overflow-hidden transition-all duration-300">
        
        <!-- Order Card Header -->
        <div class="p-5 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-700/60">
          <div class="space-y-1">
            <h3 class="text-base font-bold text-slate-800 dark:text-white leading-tight">
              ${order.restaurantName}
            </h3>
            <p class="text-[10px] text-slate-400 font-semibold uppercase">
              ID: #${order.id} • ${dateStr} at ${timeStr}
            </p>
          </div>
          
          <div class="flex items-center gap-3">
            <span class="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${this.getStatusStyles(order.status)}">
              ${order.status}
            </span>
            <span class="text-sm font-extrabold text-slate-800 dark:text-white">
              $${order.pricing.total.toFixed(2)}
            </span>
          </div>
        </div>

        <!-- Order Card Content (Items) -->
        <div class="p-5 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-500">
            <div class="space-y-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items Ordered</p>
              <ul class="space-y-1">
                ${order.items.map(i => `
                  <li class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full ${i.item.veg ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
                    <span class="text-slate-700 dark:text-slate-300 font-semibold">${i.quantity} x</span> ${i.item.name}
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="space-y-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Destination</p>
              <div class="flex gap-2 text-slate-600 dark:text-slate-400">
                <svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div class="leading-relaxed">
                  <span class="font-bold text-slate-800 dark:text-white capitalize">${order.address.label}</span>
                  <p class="text-[11px] mt-0.5">${order.address.address}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Button Row -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/40">
            ${!isCompleted ? `
              <a href="#/tracking/${order.id}" class="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-50">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                Live Track
              </a>
            ` : ''}
            <button data-reorder="${order.id}" class="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all">
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12"></path></svg>
              Reorder Items
            </button>
            <a href="#/restaurant/${order.restaurantId}" class="py-2.5 px-4 text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold text-xs rounded-xl transition-all">
              View Menu
            </a>
          </div>
        </div>

      </div>
    `;
  }

  getStatusStyles(status) {
    switch (status) {
      case 'Placed':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50';
      case 'Confirmed':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50';
      case 'Preparing':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50';
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50';
      case 'Cancelled':
      default:
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50';
    }
  }

  attachEventListeners(orders) {
    const reorderBtns = this.appRoot.querySelectorAll('[data-reorder]');
    reorderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.reorder;
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Clear and populate cart
        cartStore.clearCart(false); // clear cart silently
        let successCount = 0;
        
        order.items.forEach(orderItem => {
          const res = cartStore.addItem(
            orderItem.item,
            order.restaurantId,
            order.restaurantName,
            true // force allow since we cleared it first
          );
          if (res.success) {
            // Set exact quantity
            cartStore.updateQuantity(orderItem.item.id, orderItem.quantity);
            successCount++;
          }
        });

        if (successCount > 0) {
          toastManager.show(`Loaded ${successCount} items from order #${order.id} into your cart!`, 'success');
          router.navigateTo('#/cart');
        } else {
          toastManager.show('Failed to reorder. Items may no longer be available.', 'error');
        }
      });
    });
  }

  destroy() {
    window.removeEventListener('orders-change', this.onOrdersChange);
  }
}

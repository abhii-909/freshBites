import { orderStore } from '../store/orderStore';

export class OrderTrackingView {
  constructor(appRoot, params = {}) {
    this.appRoot = appRoot;
    this.params = params;
    this.orderId = params.id;

    // Listen to status updates to re-render in real-time
    this.onStatusUpdate = (e) => {
      if (e.detail.orderId === this.orderId) {
        this.render();
      }
    };
    window.addEventListener('order-status-update', this.onStatusUpdate);
  }

  render() {
    const order = orderStore.getOrderById(this.orderId);
    if (!order) {
      this.appRoot.innerHTML = `
        <div class="text-center py-16">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Order Not Found</h2>
          <p class="text-slate-400 mt-2">The order ID ${this.orderId} does not exist in your history.</p>
          <a href="#/orders" class="mt-4 inline-block bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl">View My Orders</a>
        </div>
      `;
      return;
    }

    const statuses = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];
    const currentStatusIdx = statuses.indexOf(order.status);

    this.appRoot.innerHTML = `
      <div class="space-y-8 max-w-4xl mx-auto">
        
        <!-- Header Info Card -->
        <section class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1.5">
            <span class="inline-block bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
              Order ID: #${order.id}
            </span>
            <h1 class="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
              Tracking your food order
            </h1>
            <p class="text-xs text-slate-400">
              Placed on ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div class="text-left md:text-right">
            <p class="text-xs font-semibold text-slate-400 uppercase">Estimated Delivery Time</p>
            <p class="text-2xl font-extrabold text-emerald-500">25 - 35 mins</p>
          </div>
        </section>

        <!-- Status Progress Timeline -->
        <section class="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-700/60 shadow-premium space-y-8">
          <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Order Timeline</h3>
          
          <!-- Stepper Graphic -->
          <div class="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4 md:items-center">
            
            <!-- Connection Line (Desktop) -->
            <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-700 hidden md:block z-0">
              <div class="h-full bg-emerald-500 transition-all duration-500" style="width: ${(currentStatusIdx / (statuses.length - 1)) * 100}%;"></div>
            </div>

            <!-- Steps -->
            ${statuses.map((statusName, idx) => {
              const isCompleted = idx < currentStatusIdx;
              const isActive = idx === currentStatusIdx;
              const isUpcoming = idx > currentStatusIdx;

              let iconColor = "bg-slate-100 dark:bg-slate-700 text-slate-400";
              let textColor = "text-slate-400 dark:text-slate-500";
              let ringColor = "";

              if (isCompleted) {
                iconColor = "bg-emerald-500 text-white";
                textColor = "text-slate-800 dark:text-slate-200 font-semibold";
              } else if (isActive) {
                iconColor = "bg-emerald-600 text-white animate-pulse";
                textColor = "text-emerald-600 dark:text-emerald-400 font-extrabold";
                ringColor = "ring-4 ring-emerald-100 dark:ring-emerald-950/50";
              }

              return `
                <div class="flex md:flex-col items-center gap-4 md:gap-2.5 z-10 md:flex-1 text-left md:text-center relative">
                  <!-- Connection Line (Mobile) -->
                  ${idx < statuses.length - 1 ? `
                    <div class="absolute left-5 top-10 bottom-[-32px] w-0.5 bg-slate-100 dark:bg-slate-700 md:hidden z-[-1]">
                      <div class="w-full bg-emerald-500 transition-all duration-500" style="height: ${isCompleted ? '100%' : '0%'};"></div>
                    </div>
                  ` : ''}

                  <!-- Number Icon -->
                  <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${iconColor} ${ringColor} transition-all duration-300">
                    ${isCompleted ? `
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    ` : (idx + 1)}
                  </div>

                  <!-- Text label -->
                  <div>
                    <p class="text-xs ${textColor}">${statusName}</p>
                    ${isActive ? `<span class="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 px-1.5 py-0.5 rounded font-extrabold uppercase mt-0.5 inline-block">Active</span>` : ''}
                  </div>
                </div>
              `;
            }).join('')}

          </div>
        </section>

        <!-- Simulated Map Visualizer & Rider Card -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Mock Map -->
          <section class="bg-slate-200 dark:bg-slate-950 rounded-3xl p-1.5 border border-slate-300 dark:border-slate-800 shadow-premium overflow-hidden aspect-[4/3] flex flex-col justify-between relative">
            
            <!-- Map grid background animation -->
            <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(0,0,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.2)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50"></div>
            
            <!-- Styled Simulated Roads -->
            <div class="absolute inset-0 p-8 pointer-events-none">
              <!-- Route Path -->
              <svg class="w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 10 90 Q 50 80 50 50 T 90 10" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" class="dark:stroke-slate-800" />
                <path d="M 10 90 Q 50 80 50 50 T 90 10" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="8 6" stroke-linecap="round" class="animate-dash" />
              </svg>
            </div>

            <!-- Start / Restaurant Pin -->
            <div class="absolute left-[10%] bottom-[10%] bg-emerald-500 text-white p-2 rounded-full shadow-lg flex items-center justify-center z-10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>

            <!-- End / Customer Home Pin -->
            <div class="absolute right-[10%] top-[10%] bg-blue-500 text-white p-2 rounded-full shadow-lg flex items-center justify-center z-10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </div>

            <!-- Rider Moving Marker -->
            ${order.status === 'Out for Delivery' ? `
              <div class="absolute bg-amber-500 text-white p-2.5 rounded-full shadow-2xl flex items-center justify-center z-20 animate-bounce" id="map-rider-marker" style="left: 45%; top: 40%; transition: all 10s ease-in-out;">
                🚴
              </div>
            ` : ''}

            <!-- Map Overlay Banner -->
            <div class="relative z-10 m-3 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-100 dark:border-slate-800 rounded-2xl shadow-lg text-[10px] font-bold text-slate-500 max-w-[200px]">
              ${order.status === 'Delivered' ? `
                <span class="text-emerald-500 flex items-center gap-1">
                  🟢 Order Delivered Successfully!
                </span>
              ` : (order.status === 'Out for Delivery' ? `
                <span class="text-amber-500 flex items-center gap-1 animate-pulse">
                  🚴 Rider is on his way to your address!
                </span>
              ` : `
                <span>🍲 Cooking at ${order.restaurantName}...</span>
              `)}
            </div>
          </section>

          <!-- Rider Contact & Support -->
          <section class="space-y-6">
            
            <!-- Rider Detail Card -->
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-700/60 shadow-premium space-y-4">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Your Delivery Hero</h3>

              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl font-bold">
                  👨‍✈️
                </div>
                <div>
                  <h4 class="text-sm font-bold text-slate-800 dark:text-white">Marcus Vance</h4>
                  <p class="text-xs text-slate-400 mt-0.5">FreshBite Delivery Executive</p>
                </div>
              </div>

              <div class="flex gap-2.5 pt-2">
                <a href="tel:+15550192834" class="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors">
                  <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  Call Rider
                </a>
                <button id="chat-rider-btn" class="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors">
                  <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  Chat Rider
                </button>
              </div>
            </div>

            <!-- Address dropoff Summary -->
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-700/60 shadow-premium space-y-4">
              <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Delivery Details</h3>
              
              <div class="space-y-3.5 text-xs">
                <div class="flex gap-3">
                  <svg class="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  <div>
                    <p class="font-bold text-slate-800 dark:text-white">${order.restaurantName}</p>
                    <p class="text-slate-400 mt-0.5">Preparing your delicious items</p>
                  </div>
                </div>

                <div class="flex gap-3">
                  <svg class="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <div>
                    <p class="font-bold text-slate-800 dark:text-white">Drop off location (${order.address.label})</p>
                    <p class="text-slate-400 mt-0.5 leading-relaxed">${order.address.address}</p>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </div>

      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const chatBtn = this.appRoot.querySelector('#chat-rider-btn');
    if (chatBtn) {
      chatBtn.addEventListener('click', () => {
        toastManager.show('Chat option is disabled for offline demo.', 'info');
      });
    }
  }

  destroy() {
    window.removeEventListener('order-status-update', this.onStatusUpdate);
  }
}

import { restaurantStore } from '../store/restaurantStore';

export class HomeView {
  constructor(appRoot, params = {}) {
    this.appRoot = appRoot;
    this.params = params;
    
    // Default search and filter states
    this.searchQuery = '';
    this.selectedCuisine = 'All';
    this.vegOnly = false;
    this.sortBy = 'rating'; // 'rating', 'deliveryTime', 'costLowToHigh', 'costLowToHigh'
  }

  render() {
    // Get list of filtered restaurants
    const restaurants = restaurantStore.searchAndFilter(
      this.searchQuery,
      this.selectedCuisine,
      this.vegOnly,
      this.sortBy
    );

    // Get list of unique cuisines for filters
    const cuisines = ["All", "Burgers", "Indian", "Pizza", "Asian", "Healthy", "Desserts"];

    this.appRoot.innerHTML = `
      <div class="space-y-8">
        
        <!-- Premium Hero Section -->
        <section class="relative rounded-3xl overflow-hidden bg-slate-900 text-white py-16 px-8 md:px-16 shadow-premium shadow-slate-200 dark:shadow-none">
          <!-- Background decorative elements -->
          <div class="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none" style="background-image: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'); filter: grayscale(1) contrast(1.2);"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-900 to-transparent pointer-events-none"></div>
          
          <div class="relative z-10 max-w-2xl space-y-4">
            <span class="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-emerald-500/30">
              ⚡ Super-Fast Food Delivery
            </span>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Delicious Food,<br/>
              Delivered <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Fresh & Fast</span>
            </h1>
            <p class="text-slate-300 text-sm md:text-base max-w-md">
              Order gourmet meals, authentic curries, wood-fired pizzas, healthy organic bowls, and bakery treats from the top local restaurants.
            </p>
          </div>
        </section>

        <!-- Search and Filter Panel -->
        <section class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-premium border border-slate-100 dark:border-slate-700/60 space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Search Input -->
            <div class="relative flex-grow max-w-lg">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" id="search-input" value="${this.searchQuery}" placeholder="Search restaurants, cuisines, or dishes..." class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>

            <!-- Sorting & Veg Toggle -->
            <div class="flex flex-wrap items-center gap-3.5">
              <div class="flex items-center gap-2">
                <label for="sort-select" class="text-xs font-semibold text-slate-500 dark:text-slate-400">Sort By</label>
                <select id="sort-select" class="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700 dark:text-slate-200">
                  <option value="rating" ${this.sortBy === 'rating' ? 'selected' : ''}>Rating (High to Low)</option>
                  <option value="deliveryTime" ${this.sortBy === 'deliveryTime' ? 'selected' : ''}>Delivery Time (Fastest)</option>
                  <option value="costLowToHigh" ${this.sortBy === 'costLowToHigh' ? 'selected' : ''}>Price: Low to High</option>
                  <option value="costHighToLow" ${this.sortBy === 'costHighToLow' ? 'selected' : ''}>Price: High to Low</option>
                </select>
              </div>

              <!-- Veg Toggle -->
              <button id="veg-toggle" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${this.vegOnly ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}">
                <span class="w-2.5 h-2.5 rounded-full ${this.vegOnly ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}"></span>
                Vegetarian
              </button>
            </div>
          </div>

          <!-- Cuisine categories scroll -->
          <div class="border-t border-slate-100 dark:border-slate-700/60 pt-5">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Cuisines</p>
            <div class="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              ${cuisines.map(cuisine => `
                <button data-cuisine="${cuisine}" class="px-4 py-2 text-xs font-semibold rounded-full border whitespace-nowrap transition-all ${this.selectedCuisine === cuisine ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}">
                  ${cuisine}
                </button>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Restaurant Grid -->
        <section class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              ${this.searchQuery || this.selectedCuisine !== 'All' ? 'Filtered Restaurants' : 'All Restaurants'} 
              <span class="text-sm font-normal text-slate-400">(${restaurants.length} found)</span>
            </h2>
          </div>

          ${restaurants.length === 0 ? `
            <!-- Empty state -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-700/60 max-w-md mx-auto">
              <div class="w-16 h-16 bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 class="text-lg font-bold text-slate-700 dark:text-white mb-1.5">No restaurants match</h3>
              <p class="text-sm text-slate-400">We couldn't find any food spots matching your search criteria. Try modifying your search query or filters.</p>
              <button id="reset-filters-btn" class="mt-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold py-2.5 px-4 rounded-xl hover:opacity-90 transition-opacity">
                Clear Filters
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${restaurants.map(rest => this.renderRestaurantCard(rest)).join('')}
            </div>
          `}
        </section>

      </div>
    `;

    this.attachEventListeners();
  }

  renderRestaurantCard(rest) {
    const isVegOnly = rest.vegOnly;
    return `
      <a href="#/restaurant/${rest.id}" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-premium shadow-premium-hover flex flex-col group h-full">
        <!-- Thumbnail -->
        <div class="relative overflow-hidden aspect-[16/10]">
          <img src="${rest.image}" alt="${rest.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          
          <!-- Rating Overlay -->
          <div class="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md text-xs font-bold text-slate-800 dark:text-white">
            <svg class="w-3.5 h-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            ${rest.rating.toFixed(1)}
          </div>

          <!-- Featured Tag -->
          ${rest.featured ? `
            <div class="absolute top-3 right-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
              Featured
            </div>
          ` : ''}

          <!-- Veg Indicator Badge -->
          ${isVegOnly ? `
            <div class="absolute bottom-3 left-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-400">
              VEG ONLY
            </div>
          ` : ''}
        </div>

        <!-- Content -->
        <div class="p-5 flex-grow flex flex-col justify-between">
          <div class="space-y-1.5">
            <h3 class="text-lg font-bold text-slate-800 dark:text-white leading-tight group-hover:text-emerald-500 transition-colors">
              ${rest.name}
            </h3>
            <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              ${rest.description}
            </p>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <!-- Cuisine tag pill -->
            <div class="flex items-center gap-1 overflow-hidden max-w-[50%]">
              <span class="truncate text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-500">
                ${rest.cuisine.join(', ')}
              </span>
            </div>
            
            <div class="flex items-center gap-3.5 flex-shrink-0">
              <!-- Delivery speed -->
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                ${rest.deliveryTime}
              </span>
              <!-- Cost For Two -->
              <span>$${rest.costForTwo} for 2</span>
            </div>
          </div>
        </div>
      </a>
    `;
  }

  attachEventListeners() {
    const searchInput = this.appRoot.querySelector('#search-input');
    const sortSelect = this.appRoot.querySelector('#sort-select');
    const vegToggle = this.appRoot.querySelector('#veg-toggle');
    const cuisineBtns = this.appRoot.querySelectorAll('[data-cuisine]');
    const resetBtn = this.appRoot.querySelector('#reset-filters-btn');

    if (searchInput) {
      // Debounced/delayed search to avoid excessive rendering
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.searchQuery = e.target.value;
          this.render();
          
          // Re-focus and restore cursor position after render
          const reInput = this.appRoot.querySelector('#search-input');
          if (reInput) {
            reInput.focus();
            reInput.setSelectionRange(reInput.value.length, reInput.value.length);
          }
        }, 300);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.render();
      });
    }

    if (vegToggle) {
      vegToggle.addEventListener('click', () => {
        this.vegOnly = !this.vegOnly;
        this.render();
      });
    }

    cuisineBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCuisine = btn.dataset.cuisine;
        this.render();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.searchQuery = '';
        this.selectedCuisine = 'All';
        this.vegOnly = false;
        this.sortBy = 'rating';
        this.render();
      });
    }
  }

  destroy() {
    // Cleanup
  }
}

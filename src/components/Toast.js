// Premium Animated Toast Manager
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.className = 'fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 md:px-0';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3500) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 p-4 rounded-xl shadow-xl border glass pointer-events-auto transform translate-x-12 opacity-0 transition-all duration-300 ease-out ${this.getTypeStyles(type)}`;
    
    // Icon based on type
    const icon = this.getIcon(type);

    toast.innerHTML = `
      <div class="flex-shrink-0">${icon}</div>
      <div class="flex-grow text-sm font-medium pr-2">${message}</div>
      <button class="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" aria-label="Close toast">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;

    // Click to close
    toast.querySelector('button').addEventListener('click', () => this.removeToast(toast));

    this.container.appendChild(toast);

    // Trigger entrance animation
    setTimeout(() => {
      toast.classList.remove('translate-x-12', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    // Auto-remove timeout
    const timeout = setTimeout(() => {
      this.removeToast(toast);
    }, duration);

    // Store timeout on the element to cancel if manual close
    toast.dataset.timeoutId = timeout;
  }

  removeToast(toast) {
    clearTimeout(toast.dataset.timeoutId);
    toast.classList.remove('translate-x-0', 'opacity-100');
    toast.classList.add('translate-x-12', 'opacity-0');
    
    // Remove from DOM after transition
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }

  getTypeStyles(type) {
    switch (type) {
      case 'success':
        return 'bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200';
      case 'error':
        return 'bg-rose-50/90 dark:bg-rose-950/80 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200';
      case 'warning':
        return 'bg-amber-50/90 dark:bg-amber-950/80 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200';
      case 'info':
      default:
        return 'bg-sky-50/90 dark:bg-sky-950/80 border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-200';
    }
  }

  getIcon(type) {
    switch (type) {
      case 'success':
        return `<svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      case 'error':
        return `<svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      case 'warning':
        return `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
      case 'info':
      default:
        return `<svg class="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }
  }
}

export const toastManager = new ToastManager();
export default toastManager;

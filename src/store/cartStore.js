import { MOCK_PROMO_CODES } from '../mockData';

const CART_KEY = 'freshbite_cart';

class CartStore {
  constructor() {
    this.items = [];
    this.restaurantId = null;
    this.restaurantName = null;
    this.appliedPromo = null; // { code, type, value, maxDiscount, minOrder }
    this.init();
  }

  init() {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      this.items = data.items || [];
      this.restaurantId = data.restaurantId || null;
      this.restaurantName = data.restaurantName || null;
      this.appliedPromo = data.appliedPromo || null;
    }
  }

  save() {
    const data = {
      items: this.items,
      restaurantId: this.restaurantId,
      restaurantName: this.restaurantName,
      appliedPromo: this.appliedPromo
    };
    localStorage.setItem(CART_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('cart-change', { detail: this }));
  }

  addItem(item, restaurantId, restaurantName, force = false) {
    // Check if item is from a different restaurant
    if (this.restaurantId && this.restaurantId !== restaurantId) {
      if (!force) {
        return { success: false, conflict: true };
      }
      this.clearCart(false); // clear silently
    }

    this.restaurantId = restaurantId;
    this.restaurantName = restaurantName;

    const existing = this.items.find(i => i.item.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ item, quantity: 1, restaurantId, restaurantName });
    }

    this.validatePromo(); // Check if promo is still valid
    this.save();
    return { success: true, conflict: false };
  }

  updateQuantity(itemId, quantity) {
    const existing = this.items.find(i => i.item.id === itemId);
    if (!existing) return;

    if (quantity <= 0) {
      this.items = this.items.filter(i => i.item.id !== itemId);
    } else {
      existing.quantity = quantity;
    }

    if (this.items.length === 0) {
      this.restaurantId = null;
      this.restaurantName = null;
      this.appliedPromo = null;
    }

    this.validatePromo(); // Check if promo is still valid
    this.save();
  }

  removeItem(itemId) {
    this.updateQuantity(itemId, 0);
  }

  clearCart(shouldSave = true) {
    this.items = [];
    this.restaurantId = null;
    this.restaurantName = null;
    this.appliedPromo = null;
    if (shouldSave) {
      this.save();
    }
  }

  applyPromo(codeString) {
    if (this.items.length === 0) {
      throw new Error("Add items to your cart first.");
    }
    const code = codeString.toUpperCase().trim();
    const promo = MOCK_PROMO_CODES[code];
    if (!promo) {
      throw new Error("Invalid promo code.");
    }

    const subtotal = this.getSubtotal();
    if (subtotal < promo.minOrder) {
      throw new Error(`Minimum order amount of $${promo.minOrder.toFixed(2)} is required for this code.`);
    }

    this.appliedPromo = { code, ...promo };
    this.save();
    return this.appliedPromo;
  }

  removePromo() {
    this.appliedPromo = null;
    this.save();
  }

  validatePromo() {
    if (!this.appliedPromo) return;
    const subtotal = this.getSubtotal();
    if (subtotal < this.appliedPromo.minOrder || this.items.length === 0) {
      this.appliedPromo = null;
    }
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  }

  getDiscount() {
    if (!this.appliedPromo) return 0;
    const subtotal = this.getSubtotal();
    if (this.appliedPromo.type === 'percent') {
      const discount = (subtotal * this.appliedPromo.value) / 100;
      return Math.min(discount, this.appliedPromo.maxDiscount || discount);
    } else {
      return Math.min(this.appliedPromo.value, subtotal);
    }
  }

  getDeliveryFee() {
    if (this.items.length === 0) return 0;
    const subtotal = this.getSubtotal();
    return subtotal > 30 ? 0 : 2.99; // Free delivery above $30
  }

  getPlatformFee() {
    return this.items.length === 0 ? 0 : 0.99;
  }

  getTax() {
    return this.getSubtotal() * 0.08; // 8% Tax
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const delivery = this.getDeliveryFee();
    const platform = this.getPlatformFee();
    const tax = this.getTax();
    return Math.max(0, subtotal - discount + delivery + platform + tax);
  }

  getItemQuantity(itemId) {
    const found = this.items.find(i => i.item.id === itemId);
    return found ? found.quantity : 0;
  }
}

export const cartStore = new CartStore();
export default cartStore;

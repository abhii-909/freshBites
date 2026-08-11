const ORDERS_KEY = 'freshbite_orders';

class OrderStore {
  constructor() {
    this.orders = [];
    this.statusTimers = {};
    this.init();
  }

  init() {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (saved) {
      this.orders = JSON.parse(saved);
      // Restart timers for active orders
      this.orders.forEach(order => {
        if (!['Delivered', 'Cancelled'].includes(order.status)) {
          this.startStatusProgression(order.id);
        }
      });
    }
  }

  save() {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(this.orders));
    window.dispatchEvent(new CustomEvent('orders-change', { detail: this.orders }));
  }

  placeOrder(userId, userEmail, restaurantId, restaurantName, items, pricing, address, paymentMethod) {
    const newOrder = {
      id: 'order-' + Math.floor(100000 + Math.random() * 900000), // 6 digit ID
      userId,
      userEmail,
      restaurantId,
      restaurantName,
      items: [...items],
      pricing: { ...pricing },
      address: { ...address },
      paymentMethod,
      status: "Placed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.push(newOrder);
    this.save();
    
    // Start automated progress of the order
    this.startStatusProgression(newOrder.id);
    return newOrder;
  }

  getOrdersByUser(userId) {
    return this.orders
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getAll() {
    return this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  updateOrderStatus(orderId, status) {
    const order = this.getOrderById(orderId);
    if (!order) return;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    if (['Delivered', 'Cancelled'].includes(status)) {
      this.stopStatusProgression(orderId);
    }
    
    this.save();
    
    // Trigger custom tracking update event
    window.dispatchEvent(new CustomEvent('order-status-update', { 
      detail: { orderId, status } 
    }));
  }

  startStatusProgression(orderId) {
    if (this.statusTimers[orderId]) return;

    const statuses = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];
    
    // Auto advance status every 25 seconds for testing
    this.statusTimers[orderId] = setInterval(() => {
      const order = this.getOrderById(orderId);
      if (!order) {
        this.stopStatusProgression(orderId);
        return;
      }

      const currentIdx = statuses.indexOf(order.status);
      if (currentIdx !== -1 && currentIdx < statuses.length - 1) {
        const nextStatus = statuses[currentIdx + 1];
        this.updateOrderStatus(orderId, nextStatus);
      } else {
        this.stopStatusProgression(orderId);
      }
    }, 25000); 
  }

  stopStatusProgression(orderId) {
    if (this.statusTimers[orderId]) {
      clearInterval(this.statusTimers[orderId]);
      delete this.statusTimers[orderId];
    }
  }
}

export const orderStore = new OrderStore();
export default orderStore;

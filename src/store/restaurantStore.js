import { MOCK_RESTAURANTS } from '../mockData';

const RESTAURANTS_KEY = 'freshbite_restaurants';

class RestaurantStore {
  constructor() {
    this.restaurants = [];
    this.init();
  }

  init() {
    const saved = localStorage.getItem(RESTAURANTS_KEY);
    if (saved) {
      this.restaurants = JSON.parse(saved);
    } else {
      this.restaurants = [...MOCK_RESTAURANTS];
      this.saveToStorage();
    }
  }

  saveToStorage() {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(this.restaurants));
    window.dispatchEvent(new CustomEvent('restaurants-change', { detail: this.restaurants }));
  }

  getAll() {
    return this.restaurants;
  }

  getById(id) {
    return this.restaurants.find(r => r.id === id);
  }

  searchAndFilter(query = '', cuisine = '', vegOnly = false, sortBy = 'rating') {
    let list = [...this.restaurants];

    // Search query match (name, description, cuisine items)
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.cuisine.some(c => c.toLowerCase().includes(q))
      );
    }

    // Cuisine filter
    if (cuisine && cuisine !== 'All') {
      const c = cuisine.toLowerCase();
      list = list.filter(r => r.cuisine.some(item => item.toLowerCase() === c));
    }

    // Veg Only filter
    if (vegOnly) {
      list = list.filter(r => r.vegOnly === true || r.menu.some(item => item.veg === true));
    }

    // Sorting
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'deliveryTime') {
      list.sort((a, b) => {
        const timeA = parseInt(a.deliveryTime) || 0;
        const timeB = parseInt(b.deliveryTime) || 0;
        return timeA - timeB;
      });
    } else if (sortBy === 'costLowToHigh') {
      list.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (sortBy === 'costHighToLow') {
      list.sort((a, b) => b.costForTwo - a.costForTwo);
    }

    return list;
  }

  // Admin: update order items or item availability
  addMenuItem(restaurantId, item) {
    const restaurant = this.getById(restaurantId);
    if (!restaurant) return;

    const newItem = {
      id: 'item-' + Date.now(),
      name: item.name,
      price: parseFloat(item.price),
      description: item.description,
      image: item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      rating: 5.0,
      veg: item.veg,
      category: item.category || "Mains",
      available: true
    };

    restaurant.menu.push(newItem);
    this.saveToStorage();
    return newItem;
  }

  updateMenuItem(restaurantId, itemId, updatedFields) {
    const restaurant = this.getById(restaurantId);
    if (!restaurant) return;

    const item = restaurant.menu.find(i => i.id === itemId);
    if (!item) return;

    Object.assign(item, {
      ...updatedFields,
      price: parseFloat(updatedFields.price),
      veg: updatedFields.veg === true || updatedFields.veg === 'true'
    });

    this.saveToStorage();
  }

  deleteMenuItem(restaurantId, itemId) {
    const restaurant = this.getById(restaurantId);
    if (!restaurant) return;

    restaurant.menu = restaurant.menu.filter(i => i.id !== itemId);
    this.saveToStorage();
  }

  // Toggle item availability status (e.g. out of stock)
  toggleMenuItemAvailability(restaurantId, itemId) {
    const restaurant = this.getById(restaurantId);
    if (!restaurant) return;

    const item = restaurant.menu.find(i => i.id === itemId);
    if (!item) return;

    item.available = !item.available;
    this.saveToStorage();
  }
}

export const restaurantStore = new RestaurantStore();
export default restaurantStore;

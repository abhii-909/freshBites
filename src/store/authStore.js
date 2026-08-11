// Auth Store managing user session and profile
const AUTH_KEY = 'freshbite_auth_session';
const USERS_KEY = 'freshbite_users';

const DEFAULT_USERS = [
  {
    id: "user-customer",
    name: "John Doe",
    email: "customer@freshbite.com",
    password: "password",
    role: "customer",
    phone: "+1 (555) 019-2834",
    addresses: [
      { id: "addr-1", label: "Home", address: "123 Main Street, Apt 4B, New York, NY 10001" },
      { id: "addr-2", label: "Office", address: "Tech Hub Tower, Floor 12, New York, NY 10011" }
    ],
    selectedAddressId: "addr-1"
  },
  {
    id: "user-admin",
    name: "Alex Mercer",
    email: "admin@freshbite.com",
    password: "password",
    role: "admin",
    phone: "+1 (555) 014-9988",
    addresses: [],
    selectedAddressId: null
  }
];

class AuthStore {
  constructor() {
    this.currentUser = null;
    this.users = [];
    this.init();
  }

  init() {
    // Load all registered users
    const savedUsers = localStorage.getItem(USERS_KEY);
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    } else {
      this.users = [...DEFAULT_USERS];
      localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
    }

    // Load active session
    const activeSession = localStorage.getItem(AUTH_KEY);
    if (activeSession) {
      this.currentUser = JSON.parse(activeSession);
    }
  }

  save() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
    if (this.currentUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(this.currentUser));
      // Sync the user details in users database too
      const idx = this.users.findIndex(u => u.id === this.currentUser.id);
      if (idx !== -1) {
        this.users[idx] = { ...this.currentUser };
        localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
      }
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
    window.dispatchEvent(new CustomEvent('auth-change', { detail: this.currentUser }));
  }

  login(email, password) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      throw new Error("No account found with this email.");
    }
    if (user.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    this.currentUser = { ...user };
    this.save();
    return this.currentUser;
  }

  signup(name, email, password, role = 'customer') {
    const normalizedEmail = email.toLowerCase().trim();
    if (this.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error("An account already exists with this email.");
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: role, // 'customer' or 'admin'
      phone: "",
      addresses: [],
      selectedAddressId: null
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    this.save();
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    this.save();
  }

  updateProfile(name, email, phone) {
    if (!this.currentUser) return;
    this.currentUser.name = name;
    this.currentUser.email = email;
    this.currentUser.phone = phone;
    this.save();
  }

  addAddress(label, addressText) {
    if (!this.currentUser) return;
    const newAddr = {
      id: 'addr-' + Date.now(),
      label: label || 'Home',
      address: addressText
    };
    this.currentUser.addresses = this.currentUser.addresses || [];
    this.currentUser.addresses.push(newAddr);
    if (!this.currentUser.selectedAddressId) {
      this.currentUser.selectedAddressId = newAddr.id;
    }
    this.save();
    return newAddr;
  }

  removeAddress(addrId) {
    if (!this.currentUser) return;
    this.currentUser.addresses = this.currentUser.addresses.filter(a => a.id !== addrId);
    if (this.currentUser.selectedAddressId === addrId) {
      this.currentUser.selectedAddressId = this.currentUser.addresses[0]?.id || null;
    }
    this.save();
  }

  selectAddress(addrId) {
    if (!this.currentUser) return;
    this.currentUser.selectedAddressId = addrId;
    this.save();
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }
}

export const authStore = new AuthStore();
export default authStore;

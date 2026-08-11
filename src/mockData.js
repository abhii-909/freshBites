export const MOCK_RESTAURANTS = [
  {
    id: "rest-1",
    name: "The Gourmet Burger Co.",
    description: "Premium flame-grilled craft burgers, hand-cut fries, and artisanal shakes.",
    cuisine: ["Burgers", "American", "Fast Food"],
    rating: 4.7,
    ratingCount: 380,
    deliveryTime: "20-30 min",
    costForTwo: 300,
    vegOnly: false,
    featured: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    menu: [
      {
        id: "item-101",
        name: "Classic Cheeseburger",
        price: 9.99,
        description: "Juicy flame-grilled beef patty, cheddar cheese, lettuce, tomato, pickles, and our signature burger sauce on a toasted brioche bun.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        veg: false,
        category: "Burgers",
        available: true
      },
      {
        id: "item-102",
        name: "BBQ Bacon Burger",
        price: 11.99,
        description: "Beef patty loaded with crispy hickory-smoked bacon, sharp cheddar, onion rings, and smoky BBQ sauce.",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        veg: false,
        category: "Burgers",
        available: true
      },
      {
        id: "item-103",
        name: "Crispy Chicken Sandwich",
        price: 10.49,
        description: "Golden buttermilk fried chicken breast, spicy mayo, pickles, and shredded lettuce on a brioche bun.",
        image: "https://images.unsplash.com/photo-1627662236973-4f8259fa2441?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        veg: false,
        category: "Burgers",
        available: true
      },
      {
        id: "item-104",
        name: "Truffle Fries",
        price: 4.99,
        description: "Crispy hand-cut fries tossed in white truffle oil, grated parmesan, and fresh parsley, served with garlic aioli.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        veg: true,
        category: "Sides",
        available: true
      },
      {
        id: "item-105",
        name: "Loaded Nachos",
        price: 7.99,
        description: "Warm tortilla chips topped with cheese sauce, jalapenos, sour cream, guacamole, and fresh pico de gallo.",
        image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80",
        rating: 4.4,
        veg: true,
        category: "Sides",
        available: true
      },
      {
        id: "item-106",
        name: "Chocolate Milkshake",
        price: 5.49,
        description: "Rich and creamy dark chocolate milkshake topped with whipped cream and chocolate shavings.",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        veg: true,
        category: "Beverages",
        available: true
      }
    ]
  },
  {
    id: "rest-2",
    name: "Spice Symphony",
    description: "Authentic Indian curries, hand-stretched tandoori breads, and fragrant basmati biryanis.",
    cuisine: ["Indian", "Curry", "Tandoor"],
    rating: 4.8,
    ratingCount: 520,
    deliveryTime: "30-40 min",
    costForTwo: 400,
    vegOnly: false,
    featured: true,
    image: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=800&q=80",
    menu: [
      {
        id: "item-201",
        name: "Butter Chicken (Murgh Makhani)",
        price: 14.99,
        description: "Tender tandoori grilled chicken cooked in a rich, velvety tomato, butter, and cashew nut gravy.",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        veg: false,
        category: "Mains",
        available: true
      },
      {
        id: "item-202",
        name: "Paneer Butter Masala",
        price: 13.49,
        description: "Cubes of fresh cottage cheese cooked in a rich, creamy onion-tomato gravy with Indian spices.",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        veg: true,
        category: "Mains",
        available: true
      },
      {
        id: "item-203",
        name: "Vegetable Biryani",
        price: 12.99,
        description: "Fragrant basmati rice slow-cooked with assorted vegetables, saffron, mint, and exotic spices, served with raita.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        veg: true,
        category: "Mains",
        available: true
      },
      {
        id: "item-204",
        name: "Butter Naan",
        price: 2.99,
        description: "Traditional soft, leavened flatbread brushed with melted butter, freshly baked in a clay tandoor.",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        veg: true,
        category: "Breads",
        available: true
      },
      {
        id: "item-205",
        name: "Garlic Naan",
        price: 3.49,
        description: "Tandoori flatbread seasoned with fresh minced garlic and coriander, brushed with butter.",
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        veg: true,
        category: "Breads",
        available: true
      },
      {
        id: "item-206",
        name: "Mango Lassi",
        price: 3.99,
        description: "A cool, refreshing yogurt-based sweet drink blended with fresh sweet mango pulp.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        veg: true,
        category: "Beverages",
        available: true
      }
    ]
  },
  {
    id: "rest-3",
    name: "Mamma Mia Pizzeria",
    description: "Wood-fired artisanal pizzas, homemade pastas, and rich Italian desserts.",
    cuisine: ["Italian", "Pizza", "Pasta"],
    rating: 4.6,
    ratingCount: 290,
    deliveryTime: "25-35 min",
    costForTwo: 350,
    vegOnly: false,
    featured: false,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    menu: [
      {
        id: "item-301",
        name: "Margherita Pizza (12\")",
        price: 12.99,
        description: "Classic Neapolitan style with rich tomato sauce, fresh buffalo mozzarella, fresh basil, and a drizzle of extra virgin olive oil.",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        veg: true,
        category: "Pizzas",
        available: true
      },
      {
        id: "item-302",
        name: "Pepperoni Special (12\")",
        price: 14.99,
        description: "Wood-fired pizza topped with spicy Italian pepperoni, mozzarella cheese, and fresh oregano.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        veg: false,
        category: "Pizzas",
        available: true
      },
      {
        id: "item-303",
        name: "Fettuccine Alfredo",
        price: 13.99,
        description: "Creamy fettuccine tossed in a rich butter, heavy cream, and aged parmesan sauce, served with garlic bread.",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        veg: true,
        category: "Pastas",
        available: true
      },
      {
        id: "item-304",
        name: "Garlic Garlic Bread",
        price: 4.49,
        description: "Warm, toasted baguettes brushed with garlic butter, topped with melted mozzarella and fresh herbs.",
        image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        veg: true,
        category: "Sides",
        available: true
      },
      {
        id: "item-305",
        name: "Classic Tiramisu",
        price: 6.99,
        description: "Layered Italian dessert made with coffee-dipped ladyfingers, whipped mascarpone cream, and cocoa powder.",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        veg: true,
        category: "Desserts",
        available: true
      }
    ]
  },
  {
    id: "rest-4",
    name: "Wok & Roll",
    description: "Sizzling stir-fries, flavorful hand-pulled noodles, and steamed dumplings.",
    cuisine: ["Asian", "Chinese", "Noodles"],
    rating: 4.5,
    ratingCount: 195,
    deliveryTime: "15-25 min",
    costForTwo: 280,
    vegOnly: false,
    featured: false,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    menu: [
      {
        id: "item-401",
        name: "Kung Pao Chicken",
        price: 11.49,
        description: "Stir-fried chicken breast cubes with peanuts, bell peppers, chili peppers, and green onions in a sweet, savory, and spicy sauce.",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        veg: false,
        category: "Mains",
        available: true
      },
      {
        id: "item-402",
        name: "Veg Hakka Noodles",
        price: 9.99,
        description: "Stir-fried wheat noodles tossed with colorful julienned vegetables, soy sauce, and aromatic Chinese spices.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        veg: true,
        category: "Noodles",
        available: true
      },
      {
        id: "item-403",
        name: "Steamed Chicken Dim Sums (6 pcs)",
        price: 7.99,
        description: "Delicate translucent wrappers filled with minced seasoned chicken, steamed to perfection, served with chili oil.",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        veg: false,
        category: "Dumplings",
        available: true
      },
      {
        id: "item-404",
        name: "Crispy Spring Rolls (4 pcs)",
        price: 5.99,
        description: "Crispy fried rolls packed with shredded carrots, cabbage, and glass noodles, served with sweet chili dip.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
        rating: 4.3,
        veg: true,
        category: "Appetizers",
        available: true
      }
    ]
  },
  {
    id: "rest-5",
    name: "The Green Bowl",
    description: "100% Plant-based nutrient-dense bowls, organic smoothies, and healthy grain salads.",
    cuisine: ["Healthy", "Salads", "Vegetarian", "Vegan"],
    rating: 4.9,
    ratingCount: 420,
    deliveryTime: "15-20 min",
    costForTwo: 260,
    vegOnly: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    menu: [
      {
        id: "item-501",
        name: "Avocado Quinoa Salad",
        price: 10.99,
        description: "Fluffy organic quinoa, ripe avocado, cherry tomatoes, cucumbers, spinach, and toasted pumpkin seeds with a lemon-herb vinaigrette.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        veg: true,
        category: "Salads",
        available: true
      },
      {
        id: "item-502",
        name: "Mediterranean Hummus Wrap",
        price: 8.99,
        description: "Housemade smooth hummus, falafel, shredded carrots, baby spinach, olives, and vegan feta wrapped in a warm whole-wheat tortilla.",
        image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        veg: true,
        category: "Wraps",
        available: true
      },
      {
        id: "item-503",
        name: "Superfood Berry Smoothie",
        price: 6.49,
        description: "A rich blend of blueberries, strawberries, raspberries, banana, chia seeds, and almond milk topped with granola.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        veg: true,
        category: "Smoothies",
        available: true
      },
      {
        id: "item-504",
        name: "Organic Ginger Kombucha",
        price: 4.50,
        description: "Probiotic-rich raw fermented tea with a crisp, punchy ginger bite.",
        image: "https://images.unsplash.com/photo-1594911774802-8822a707cff3?auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        veg: true,
        category: "Beverages",
        available: true
      }
    ]
  },
  {
    id: "rest-6",
    name: "Sweet Treats Bakery",
    description: "Decadent desserts, freshly baked waffles, and gourmet milkshakes.",
    cuisine: ["Desserts", "Bakery", "Ice Cream"],
    rating: 4.4,
    ratingCount: 150,
    deliveryTime: "20-30 min",
    costForTwo: 220,
    vegOnly: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    menu: [
      {
        id: "item-601",
        name: "Belgian Chocolate Waffle",
        price: 8.49,
        description: "Freshly baked golden waffle, smothered in warm Belgian milk chocolate, served with a scoop of vanilla bean ice cream.",
        image: "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        veg: true,
        category: "Waffles",
        available: true
      },
      {
        id: "item-602",
        name: "Molten Chocolate Lava Cake",
        price: 6.99,
        description: "Rich chocolate cake with a warm, gooey liquid chocolate center, dusted with powdered sugar.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        veg: true,
        category: "Cakes",
        available: true
      },
      {
        id: "item-603",
        name: "Warm Apple Crumble Pie",
        price: 7.49,
        description: "Spiced caramelized apples under a golden, buttery streusel topping, baked to order and served warm.",
        image: "https://images.unsplash.com/photo-1507226983735-a838615193b0?auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        veg: true,
        category: "Pies",
        available: true
      }
    ]
  }
];

export const MOCK_PROMO_CODES = {
  "FRESH50": { type: "percent", value: 50, maxDiscount: 15.00, minOrder: 20.00 },
  "BITE10": { type: "percent", value: 10, maxDiscount: 5.00, minOrder: 10.00 },
  "FREEFEED": { type: "flat", value: 5.00, minOrder: 15.00 }
};

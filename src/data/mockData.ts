// src/data/mockData.ts

export interface Product {
  id: number;
  productId: string;
  name: string;
  brand: string;
  category: string;
  sellingPrice: number;
  mrp: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  stock: number;
  badge?: string;
  tags?: string[];
  // Backwards compatibility if needed
  price?: number;
  imageUrl?: string;
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createAt: string;
}

// Image curation for Categories
export const categoryImages: Record<string, string> = {
  "Vegetables": "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=400", // Fresh Veggies
  "Fruits": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=400", // Fruit Bowl
  "Dairy & Eggs": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400", // Eggs & Milk
  "Bakery": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400", // Bakery Bread
  "Beverages": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=400", // Juices
  "Snacks": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=400", // Chips/Snacks
  "Skincare": "https://images.unsplash.com/photo-1571781926291-280553feeb73?auto=format&fit=crop&q=80&w=400", // Skincare bottles
  "Makeup": "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400", // Makeup
  "Hair Care": "https://images.unsplash.com/photo-1595914026365-d72948d3568c?auto=format&fit=crop&q=80&w=400", // Shampoo
};

export const categories = Object.keys(categoryImages);

// Image curation for Brands
export const brandImages: Record<string, string> = {
  "FreshFarm": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=400", // Farm logo vibe
  "Nature's Best": "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=400", // Apple logo vibe
  "OrganicValley": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400", // Milk vibe
  "DailyPure": "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&q=80&w=400", // Juice vibe
  "GreenGrocer": "https://images.unsplash.com/photo-1595855709915-445c82368735?auto=format&fit=crop&q=80&w=400", // Broccoli vibe
  "Baker's Choice": "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80&w=400", // Bread vibe
  "LuxeBeauty": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=400",
  "GlowGenics": "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=400",
  "PureSkin": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
  "SnackTime": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&q=80&w=400",
};

export const brands = Object.keys(brandImages);

export const allProducts: Product[] = [
  {
    id: 1,
    productId: "1",
    name: "Fresh Organic Spinach",
    brand: "FreshFarm",
    category: "Vegetables",
    sellingPrice: 45,
    mrp: 60,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    reviews: 120,
    description: "Freshly picked organic spinach, perfect for salads and cooking.",
    stock: 100,
    badge: "FRESH",
  },
  {
    id: 2,
    productId: "2",
    name: "Red Apple Premium (1kg)",
    brand: "Nature's Best",
    category: "Fruits",
    sellingPrice: 120,
    mrp: 150,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400",
    rating: 4.5,
    reviews: 85,
    description: "Sweet and crunchy premium red apples.",
    stock: 100,
    badge: "BESTSELLER",
  },
  {
    id: 3,
    productId: "3",
    name: "Whole Milk (1L)",
    brand: "OrganicValley",
    category: "Dairy & Eggs",
    sellingPrice: 65,
    mrp: 70,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    reviews: 200,
    description: "Fresh whole milk from organic farms.",
    stock: 50,
    badge: "ESSENTIAL",
  },
  {
    id: 4,
    productId: "4",
    name: "Multigrain Bread",
    brand: "Baker's Choice",
    category: "Bakery",
    sellingPrice: 40,
    mrp: 50,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
    rating: 4.6,
    reviews: 95,
    description: "Healthy multigrain bread baked fresh daily.",
    stock: 30,
    badge: "FRESH",
  },
  {
    id: 5,
    productId: "5",
    name: "Bananas (1 Dozen)",
    brand: "Nature's Best",
    category: "Fruits",
    sellingPrice: 60,
    mrp: 75,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=400",
    rating: 4.7,
    reviews: 150,
    description: "Ripe and sweet bananas, rich in potassium.",
    stock: 200,
    badge: "POPULAR",
  },
  {
    id: 6,
    productId: "6",
    name: "Orange Juice (1L)",
    brand: "DailyPure",
    category: "Beverages",
    sellingPrice: 110,
    mrp: 130,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400",
    rating: 4.4,
    reviews: 60,
    description: "100% pure squeezed orange juice without added sugar.",
    stock: 80,
    badge: "CHILLED",
  },
  {
    id: 7,
    productId: "7",
    name: "Potato Chips - Salted",
    brand: "SnackTime",
    category: "Cereal & Snacks",
    sellingPrice: 35,
    mrp: 40,
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=400",
    rating: 4.3,
    reviews: 45,
    description: "Crispy salted potato chips, the perfect snack.",
    stock: 500,
    badge: "CRISPY",
  },
  {
    id: 8,
    productId: "8",
    name: "Broccoli",
    brand: "GreenGrocer",
    category: "Vegetables",
    sellingPrice: 80,
    mrp: 100,
    image: "https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    reviews: 110,
    description: "Fresh green broccoli, high in vitamins.",
    stock: 40,
    badge: "HEALTHY",
  },
  {
    id: 9,
    productId: "9",
    name: "Fresh Strawberries (500g)",
    brand: "Nature's Best",
    category: "Fruits",
    sellingPrice: 150,
    mrp: 200,
    image: "https://images.unsplash.com/photo-1518635017498-87f519b1a2df?auto=format&fit=crop&q=80&w=400",
    rating: 4.7,
    reviews: 230,
    description: "Sweet and juicy fresh strawberries.",
    stock: 50,
    badge: "SWEET",
  },
  {
    id: 10,
    productId: "10",
    name: "Chicken Breast (1kg)",
    brand: "FreshFarm",
    category: "Meat & Poultry",
    sellingPrice: 350,
    mrp: 450,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    reviews: 180,
    description: "Tender and fresh chicken breast fillets.",
    stock: 100,
    badge: "PROTEIN",
  },
  {
    id: 11,
    productId: "11",
    name: "Salmon Fillet (500g)",
    brand: "FreshFarm",
    category: "Fish & Seafood",
    sellingPrice: 650,
    mrp: 800,
    image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    reviews: 120,
    description: "Fresh Atlantic salmon fillet, rich in Omega-3.",
    stock: 40,
    badge: "PREMIUM",
  },
  {
    id: 12,
    productId: "12",
    name: "Brown Eggs (Dozen)",
    brand: "OrganicValley",
    category: "Dairy & Eggs",
    sellingPrice: 90,
    mrp: 110,
    image: "https://images.unsplash.com/photo-1569246294372-ed319c674f14?auto=format&fit=crop&q=80&w=400",
    rating: 4.7,
    reviews: 150,
    description: "Farm-fresh nutritious brown eggs.",
    stock: 200,
    badge: "FARM FRESH",
  },
  {
    id: 13,
    productId: "13",
    name: "Cola Drink (Can)",
    brand: "DailyPure",
    category: "Soft Drinks",
    sellingPrice: 40,
    mrp: 50,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400",
    rating: 4.2,
    reviews: 300,
    description: "Refreshing cola soft drink.",
    stock: 500,
    badge: "CHILLED",
  },
  {
    id: 14,
    productId: "14",
    name: "Avocado (Each)",
    brand: "Nature's Best",
    category: "Vegetables",
    sellingPrice: 80,
    mrp: 120,
    image: "https://images.unsplash.com/photo-1523049673856-42bc318684a4?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    reviews: 90,
    description: "Creamy ripe haas avocado.",
    stock: 150,
    badge: "SUPERFOOD",
  },
  {
    id: 15,
    productId: "15",
    name: "Red Wine (750ml)",
    brand: "LuxeBeauty", // Using existing brand keys to avoid errors, though mismatched conceptually
    category: "Wine",
    sellingPrice: 1200,
    mrp: 1500,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    reviews: 45,
    description: "Aged red wine with a rich floral bouquet.",
    stock: 50,
    badge: "PREMIUM",
  },
  {
    id: 16,
    productId: "16",
    name: "Dish Soap - Lemon",
    brand: "CleaningCo",
    category: "Cleaning Supplies",
    sellingPrice: 150,
    mrp: 180,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=400",
    rating: 4.6,
    reviews: 120,
    description: "Powerful grease-cutting dish soap with lemon scent.",
    stock: 200,
    badge: "EFFECTIVE",
  },
  {
    id: 17,
    productId: "17",
    name: "Lemon Soda (Can)",
    brand: "DailyPure",
    category: "Soft Drinks",
    sellingPrice: 40,
    mrp: 45,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
    rating: 4.5,
    reviews: 80,
    description: "Sparkling lemon soda.",
    stock: 300,
    badge: "FIZZY",
  },
  {
    id: 18,
    productId: "18",
    name: "Green Tea Bags (25 Pack)",
    brand: "Nature's Best",
    category: "Tea",
    sellingPrice: 150,
    mrp: 200,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    reviews: 150,
    description: "Antioxidant-rich organic green tea bags.",
    stock: 100,
    badge: "HEALTHY",
  },
  {
    id: 19,
    productId: "19",
    name: "Premium Arabica Coffee (250g)",
    brand: "LuxeBeauty",
    category: "Coffee",
    sellingPrice: 450,
    mrp: 600,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    reviews: 210,
    description: "Rich and aromatic medium roast Arabica coffee beans.",
    stock: 80,
    badge: "PREMIUM",
  },
  {
    id: 20,
    productId: "20",
    name: "Antibacterial Hand Wash (250ml)",
    brand: "CleaningCo",
    category: "Personal Hygiene",
    sellingPrice: 85,
    mrp: 99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    rating: 4.6,
    reviews: 320,
    description: "Gentle antibacterial hand wash with aloe vera.",
    stock: 150,
    badge: "ESSENTIAL",
  },
  {
    id: 21,
    productId: "21",
    name: "Baby Diapers (Pack of 50)",
    brand: "Nature's Best",
    category: "Babies",
    sellingPrice: 800,
    mrp: 1200,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    reviews: 500,
    description: "Soft and ultra-absorbent diapers for sensitive skin.",
    stock: 60,
    badge: "BESTSELLER",
  },
  {
    id: 22,
    productId: "22",
    name: "Glass Food Container Set",
    brand: "HomeBasic",
    category: "Home & Kitchen", // New Category
    sellingPrice: 550,
    mrp: 750,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400",
    rating: 4.7,
    reviews: 88,
    description: "Airtight glass containers for keeping food fresh.",
    stock: 45,
    badge: "DURABLE",
  }
];

export const blogs: Blog[] = [
  {
    id: 1,
    title: "5 Benefits of Organic Vegetables",
    description: "Discover why switching to organic vegetables can boost your health and immune system. From fewer pesticides to higher nutrient content, learn what makes organic the superior choice for your family's daily diet.",
    imageUrl: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=800",
    createAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "How to Keep Fruits Fresh Longer",
    description: "Tired of throwing away spoiled fruit? We share expert tips on storage, temperature control, and what fruits should never be stored together to maximize freshness and reduce waste in your kitchen.",
    imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800",
    createAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Healthy Snack Ideas for Kids",
    description: "Struggling to find snacks your kids will love that are also good for them? Check out our list of fun, easy, and nutritious snack recipes that will keep them energized throughout the day.",
    imageUrl: "https://images.unsplash.com/photo-1604423043491-096e70903332?auto=format&fit=crop&q=80&w=800",
    createAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

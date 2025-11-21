import React, { createContext, useContext, useState, useEffect,  } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../components/ProductCard';
export interface CartItem extends Product {
  quantity: number;
}
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: 'card' | 'paypal' | 'apple_pay';
    last4?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  checkout: (shippingInfo: any, paymentInfo: any) => Promise<string>;
  getOrderById: (orderId: string) => Order | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load cart and orders from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedOrders = localStorage.getItem('orders');
    
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
    
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

 const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
  setItems(prevItems => {
    const existingItem = prevItems.find(item => item.productId === newItem.productId);

    if (existingItem) {
      return prevItems.map(item =>
        item.productId === existingItem.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      return [...prevItems, { ...newItem, quantity: 1 }];
    }
  });
};



  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
  setItems(prevItems =>
    prevItems.map(item =>
      item.productId === id
        ? { ...item, quantity: newQuantity < 1 ? 1 : newQuantity }
        : item
    )
  );
};

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const checkout = async (shippingInfo: any, paymentInfo: any): Promise<string> => {
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const subtotal = getCartTotal();
    const shipping = subtotal > 75 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const orderId = `ORD-${Date.now()}`;
    
    const newOrder: Order = {
      id: orderId,
      items: [...items],
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      shippingAddress: shippingInfo,
      paymentMethod: paymentInfo
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();

    return orderId;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const value: CartContextType = {
    items,
    orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    checkout,
    getOrderById
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
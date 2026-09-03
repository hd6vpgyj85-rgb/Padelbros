import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type OrderStatus = "pendiente" | "en proceso" | "completado" | "cancelado";

export interface OrderItem {
  productId: string;
  name: string;
  level?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    nombre: string;
    apellido: string;
    telefono: string;
    correo: string;
  };
  address: {
    calle: string;
    colonia: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
    pais: string;
    referencias?: string;
  };
  paymentMethod: string;
  notes?: string;
  items: OrderItem[];
  total: number;
}

const STORAGE_KEY = "padelbros_orders";

function readStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

interface OrdersProviderProps {
  children: ReactNode;
}

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [orders, setOrders] = useState<Order[]>(() => readStoredOrders());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Storage unavailable — orders just won't persist across reloads.
    }
  }, [orders]);

  const addOrder = (order: Omit<Order, "id" | "createdAt" | "status">) => {
    const newOrder: Order = {
      ...order,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      status: "pendiente",
    };
    setOrders((current) => [newOrder, ...current]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
  };

  const value: OrdersContextValue = { orders, addOrder, updateOrderStatus };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within an OrdersProvider");
  return context;
}

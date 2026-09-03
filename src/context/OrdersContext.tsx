import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

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

interface OrderRow {
  id: string;
  created_at: string;
  status: OrderStatus;
  customer: Order["customer"];
  address: Order["address"];
  payment_method: string;
  notes: string | null;
  items: OrderItem[];
  total: number;
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    customer: row.customer,
    address: row.address,
    paymentMethod: row.payment_method,
    notes: row.notes ?? undefined,
    items: row.items,
    total: Number(row.total),
  };
}

interface OrdersContextValue {
  orders: Order[];
  isLoading: boolean;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error("No se pudieron cargar los pedidos", error);
      } else {
        setOrders((data as OrderRow[]).map(rowToOrder));
      }
      setIsLoading(false);
    };

    fetchOrders();

    // Los pedidos solo son visibles para el admin autenticado (ver RLS de la
    // tabla). Al iniciar/cerrar sesión hay que volver a pedirlos.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchOrders();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const addOrder = async (order: Omit<Order, "id" | "createdAt" | "status">) => {
    const { error } = await supabase.from("orders").insert({
      customer: order.customer,
      address: order.address,
      payment_method: order.paymentMethod,
      notes: order.notes ?? null,
      items: order.items,
      total: order.total,
    });

    if (error) throw error;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) throw error;
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
  };

  const value: OrdersContextValue = { orders, isLoading, addOrder, updateOrderStatus };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within an OrdersProvider");
  return context;
}

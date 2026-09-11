import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  token: string;
  purchasesCount: number;
  notes?: string;
  createdAt: string;
}

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  token: string;
  purchases_count: number;
  notes: string | null;
  created_at: string;
}

function rowToCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    token: row.token,
    purchasesCount: row.purchases_count,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

interface CustomersContextValue {
  customers: Customer[];
  isLoading: boolean;
  addCustomer: (customer: { name: string; phone: string; notes?: string }) => Promise<Customer>;
  updateCustomer: (id: string, updates: { name: string; phone: string; notes?: string }) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  setPurchasesCount: (id: string, purchasesCount: number) => Promise<void>;
}

const CustomersContext = createContext<CustomersContextValue | undefined>(undefined);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error("No se pudieron cargar los clientes", error);
      } else {
        setCustomers((data as CustomerRow[]).map(rowToCustomer));
      }
      setIsLoading(false);
    };

    fetchCustomers();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchCustomers();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const addCustomer: CustomersContextValue["addCustomer"] = async (customer) => {
    const { data, error } = await supabase
      .from("customers")
      .insert({ name: customer.name, phone: customer.phone, notes: customer.notes ?? null })
      .select()
      .single();

    if (error) throw error;
    const created = rowToCustomer(data as CustomerRow);
    setCustomers((current) => [created, ...current]);
    return created;
  };

  const updateCustomer: CustomersContextValue["updateCustomer"] = async (id, updates) => {
    const { data, error } = await supabase
      .from("customers")
      .update({ name: updates.name, phone: updates.phone, notes: updates.notes ?? null })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    const updated = rowToCustomer(data as CustomerRow);
    setCustomers((current) => current.map((customer) => (customer.id === id ? updated : customer)));
  };

  const deleteCustomer = async (id: string) => {
    const { error, count } = await supabase.from("customers").delete({ count: "exact" }).eq("id", id);
    if (error) throw error;
    if (!count) throw new Error("No se pudo eliminar el cliente. Verifica los permisos e intenta de nuevo.");
    setCustomers((current) => current.filter((customer) => customer.id !== id));
  };

  const setPurchasesCount = async (id: string, purchasesCount: number) => {
    const clamped = Math.max(0, purchasesCount);
    const { error } = await supabase.from("customers").update({ purchases_count: clamped }).eq("id", id);
    if (error) throw error;
    setCustomers((current) =>
      current.map((customer) => (customer.id === id ? { ...customer, purchasesCount: clamped } : customer)),
    );
  };

  const value: CustomersContextValue = {
    customers,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setPurchasesCount,
  };

  return <CustomersContext.Provider value={value}>{children}</CustomersContext.Provider>;
}

export function useCustomers(): CustomersContextValue {
  const context = useContext(CustomersContext);
  if (!context) throw new Error("useCustomers must be used within a CustomersProvider");
  return context;
}

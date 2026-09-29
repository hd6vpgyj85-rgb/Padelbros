import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getStoredCustomerToken } from "../utils/customerSession";

export function useProfileLink(): string {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAdmin(Boolean(data.session)));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAdmin) return "/admin";

  const customerToken = getStoredCustomerToken();
  return customerToken ? `/fidelidad/${customerToken}` : "/admin";
}

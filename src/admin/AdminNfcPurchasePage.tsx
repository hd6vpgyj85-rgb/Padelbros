import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "./AdminNfcPurchasePage.css";

type Status = "loading" | "success" | "error";

interface Result {
  name: string;
  purchasesCount: number;
}

function AdminNfcPurchasePage() {
  useDocumentTitle("Registrar compra | Padelbros");
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [result, setResult] = useState<Result | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current) return;
    hasRun.current = true;

    const addPurchase = async () => {
      const { data, error } = await supabase.rpc("add_loyalty_purchase_by_token", { p_token: token });

      if (error || !data || data.length === 0) {
        setErrorMessage(error?.message || "No se pudo registrar la compra.");
        setStatus("error");
        return;
      }

      const row = data[0] as { name: string; purchases_count: number };
      setResult({ name: row.name, purchasesCount: row.purchases_count });
      setStatus("success");
    };

    addPurchase();
  }, [token]);

  return (
    <div className="nfc-purchase">
      {status === "loading" && (
        <div className="nfc-purchase__card">
          <div className="nfc-purchase__spinner" aria-hidden="true" />
          <p className="nfc-purchase__label">Registrando compra...</p>
        </div>
      )}

      {status === "success" && result && (
        <div className="nfc-purchase__card nfc-purchase__card--success">
          <div className="nfc-purchase__check" aria-hidden="true">
            ✓
          </div>
          <p className="nfc-purchase__title">+1 compra registrada</p>
          <p className="nfc-purchase__name">{result.name}</p>
          <p className="nfc-purchase__count">{result.purchasesCount} compras acumuladas</p>
          <Link to="/admin/clientes" className="btn btn--primary nfc-purchase__btn">
            Volver
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="nfc-purchase__card nfc-purchase__card--error">
          <div className="nfc-purchase__cross" aria-hidden="true">
            ✕
          </div>
          <p className="nfc-purchase__title">No se pudo registrar</p>
          <p className="nfc-purchase__name">{errorMessage}</p>
          <Link to="/admin/clientes" className="btn btn--outline nfc-purchase__btn">
            Volver
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminNfcPurchasePage;

import { useState, type FormEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useCustomers } from "../context/CustomersContext";
import "./AdminProductFormPage.css";

function AdminCustomerFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id) && id !== "nuevo";
  const { customers, isLoading } = useCustomers();

  if (isLoading) return null;

  const existingCustomer = isEditing ? customers.find((customer) => customer.id === id) : undefined;
  if (isEditing && !existingCustomer) {
    return <Navigate to="/admin/clientes" replace />;
  }

  return (
    <AdminCustomerForm key={existingCustomer?.id ?? "new"} existingCustomer={existingCustomer} />
  );
}

interface AdminCustomerFormProps {
  existingCustomer?: { id: string; name: string; phone: string; notes?: string };
}

function AdminCustomerForm({ existingCustomer }: AdminCustomerFormProps) {
  const navigate = useNavigate();
  const { addCustomer, updateCustomer } = useCustomers();
  const isEditing = Boolean(existingCustomer);

  const [name, setName] = useState(existingCustomer?.name ?? "");
  const [phone, setPhone] = useState(existingCustomer?.phone ?? "");
  const [notes, setNotes] = useState(existingCustomer?.notes ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError("");
    try {
      if (isEditing && existingCustomer) {
        await updateCustomer(existingCustomer.id, { name: name.trim(), phone: phone.trim(), notes: notes.trim() || undefined });
        navigate("/admin/clientes");
      } else {
        const created = await addCustomer({ name: name.trim(), phone: phone.trim(), notes: notes.trim() || undefined });
        navigate(`/admin/clientes?qr=${created.id}`);
      }
    } catch {
      setSubmitError("No se pudo guardar el cliente. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-product-form container">
      <span className="eyebrow">Padelbros</span>
      <h1 className="admin-product-form__title">{isEditing ? "Editar cliente" : "Nuevo cliente"}</h1>

      <form onSubmit={handleSubmit}>
        <label className="admin-field">
          <span>Nombre *</span>
          <input type="text" required value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <label className="admin-field">
          <span>Teléfono *</span>
          <input
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="656 123 4567"
          />
        </label>

        <label className="admin-field">
          <span>Notas (opcional)</span>
          <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>

        {submitError && <p className="admin-product-form__error">{submitError}</p>}

        <button type="submit" className="btn btn--primary admin-product-form__submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear cliente"}
        </button>
      </form>
    </div>
  );
}

export default AdminCustomerFormPage;

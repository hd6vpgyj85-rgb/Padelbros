import { useState, type FormEvent } from "react";
import { useAdminAuth } from "./AdminAuthContext";
import "./AdminLoginPage.css";

function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const errorMessage = await login(email, password);
    setIsSubmitting(false);
    setError(errorMessage ?? "");
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <span className="admin-login__eyebrow">Padelbros</span>
        <h1 className="admin-login__title">Panel de administración</h1>

        <label className="admin-login__field">
          <span>Correo</span>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            className={error ? "admin-login__input--error" : ""}
            autoFocus
          />
        </label>

        <label className="admin-login__field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            className={error ? "admin-login__input--error" : ""}
          />
        </label>

        {error && <p className="admin-login__error">{error}</p>}

        <button type="submit" className="btn btn--primary admin-login__submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;

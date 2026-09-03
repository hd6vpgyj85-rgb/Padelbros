import { useState, type FormEvent } from "react";
import { useAdminAuth } from "./AdminAuthContext";
import "./AdminLoginPage.css";

function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const ok = login(password);
    if (!ok) {
      setError(true);
      return;
    }
    setError(false);
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <span className="admin-login__eyebrow">Padelbros</span>
        <h1 className="admin-login__title">Panel de administración</h1>

        <label className="admin-login__field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(false);
            }}
            className={error ? "admin-login__input--error" : ""}
            autoFocus
          />
        </label>

        {error && <p className="admin-login__error">Contraseña incorrecta.</p>}

        <button type="submit" className="btn btn--primary admin-login__submit">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;

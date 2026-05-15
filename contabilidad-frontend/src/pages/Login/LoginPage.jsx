import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo_empresa.jpg";

const ROLES = ["Administrador", "Contador", "Auditor", "Solo lectura"];

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Administrador");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!usuario || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    
    /*
    // ELIMINAR ESTO cuando uses el backend:
    // TODO: reemplazar con llamada real a tu API de autenticación
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    // Ejemplo de validación simple (reemplazar con auth real)
    if (usuario === "admin@empresa.com" && password === "12345678") {
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
    // FIN ELIMINAR

*/
    //LLamada a la API
    
    try {
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password, rol }),
    });

    if (!res.ok) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
      return;
    }

    const { token } = await res.json();
    localStorage.setItem("token", token);
    navigate("/dashboard");

    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    } 

    
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo + Nombre */}
        <div style={styles.brand}>
          {
            <img src={logo} alt="Logo" style={styles.logo} />
          }
          
          <div>
            <h1 style={styles.appName}>ContaMin</h1>
            <p style={styles.appSub}>Módulo de contabilidad</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Usuario</label>
          <input
            type="email"
            placeholder="correo@empresa.com"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={styles.input}
            autoComplete="username"
          />

          <label style={styles.label}>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="current-password"
          />

          <label style={styles.label}>Rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            style={{ ...styles.input, cursor: "pointer" }}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {error && <p style={styles.errorMsg}>{error}</p>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Verificando..." : "⮕ Ingresar"}
          </button>
        </form>

        <p style={styles.footer}>Acceso solo para personal autorizado</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  logoPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    background: "#e8f0fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 10,
    objectFit: "contain",
  },
  appName: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#1a1a2e",
    lineHeight: 1.2,
  },
  appSub: {
    margin: 0,
    fontSize: 13,
    color: "#6b7280",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginTop: 10,
    marginBottom: 2,
  },
  input: {
    padding: "10px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
    background: "#fafafa",
  },
  errorMsg: {
    color: "#dc2626",
    fontSize: 13,
    margin: "6px 0 0",
  },
  btn: {
    marginTop: 18,
    padding: "12px",
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 18,
    marginBottom: 0,
  },
};
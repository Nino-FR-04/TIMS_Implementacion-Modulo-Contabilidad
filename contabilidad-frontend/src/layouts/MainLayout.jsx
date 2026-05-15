import { NavLink, Outlet, useNavigate } from "react-router-dom";

import logo from "../assets/logo_empresa.jpg";

const menuItems = [
  { path: "/dashboard/dashboard-inicio",   label: "Dashboard",          icon: "○" },
  { path: "/dashboard/plan-cuentas",  label: "Plan de cuentas",  icon: "☰" },
  { path: "/dashboard/asientos-contables", label: "Asientos Contables", icon: "📄" },
  { path: "/dashboard/libro-diario",  label: "Libro diario",     icon: "📖" },
];

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: limpiar sesión/token aquí
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        {/* Marca */}
        <div style={styles.brand}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <div>
            <p style={styles.brandName}>ContaMin</p>
            <p style={styles.brandSub}>Módulo contabilidad</p>
          </div>
        </div>

        {/* Menú */}
        <nav>
          <p style={styles.menuLabel}>MENÚ</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) =>
                isActive ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem
              }
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout al fondo */}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          ⮐ Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO DERECHO */}
      <div style={styles.main}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.lockIcon}>🔒</span>
            <span style={styles.headerTitle}>Acceso al sistema</span>
          </div>
          <span style={styles.headerUser}>admin@empresa.com</span> {/* Eliminar*/}
          {/*<span style={styles.headerUser}>{localStorage.getItem("usuario")}</span>*/}
        </header>

        {/* PÁGINA ACTIVA */}
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#f0f2f5",
  },

  // --- SIDEBAR ---
  sidebar: {
    width: 220,
    minHeight: "100vh",
    background: "#fff",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    flexShrink: 0,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 18px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    objectFit: "contain",
  },
  brandName: {
    margin: 0,
    fontWeight: 700,
    fontSize: 15,
    color: "#1a1a2e",
  },
  brandSub: {
    margin: 0,
    fontSize: 11,
    color: "#6b7280",
  },
  menuLabel: {
    margin: "18px 18px 8px",
    fontSize: 11,
    fontWeight: 700,
    color: "#9ca3af",
    letterSpacing: "0.08em",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 18px",
    fontSize: 14,
    color: "#374151",
    textDecoration: "none",
    borderRadius: 0,
    transition: "background 0.15s",
  },
  navItemActive: {
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 600,
    borderRight: "3px solid #1d4ed8",
  },
  navIcon: {
    fontSize: 15,
    width: 20,
    textAlign: "center",
  },
  logoutBtn: {
    marginTop: "auto",
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 8,
    padding: "9px 14px",
    background: "none",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 13,
    color: "#6b7280",
    cursor: "pointer",
    textAlign: "left",
  },

  // --- HEADER ---
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  lockIcon: {
    fontSize: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a2e",
  },
  headerUser: {
    fontSize: 13,
    color: "#6b7280",
  },

  // --- CONTENIDO ---
  content: {
    padding: 28,
  },
};
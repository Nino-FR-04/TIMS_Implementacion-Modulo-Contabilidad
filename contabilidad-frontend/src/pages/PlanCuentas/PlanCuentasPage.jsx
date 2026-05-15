import { useState } from "react";

const TIPOS = ["Activo", "Pasivo", "Patrimonio", "Ingreso", "Gasto"];

const cuentasIniciales = [
  { id: 1, codigo: "1000", nombre: "Caja", tipo: "Activo",     descripcion: "Dinero en efectivo" },
  { id: 2, codigo: "1100", nombre: "Bancos", tipo: "Activo",   descripcion: "Cuentas bancarias" },
  { id: 3, codigo: "2000", nombre: "Proveedores", tipo: "Pasivo", descripcion: "Deudas con proveedores" },
  { id: 4, codigo: "4000", nombre: "Ventas", tipo: "Ingreso",  descripcion: "Ingresos por ventas" },
  { id: 5, codigo: "5000", nombre: "Sueldos", tipo: "Gasto",   descripcion: "Pago de sueldos" },
];

const modalVacio = { codigo: "", nombre: "", tipo: "Activo", descripcion: "" };

export default function PlanCuentasPage() {
  const [cuentas, setCuentas]       = useState(cuentasIniciales);

  //llamada a la API - Mostrar cuentas
  /*
  const [cuentas, setCuentas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/cuentas", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setCuentas(data));
  }, []);


  */




  const [busqueda, setBusqueda]     = useState("");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editando, setEditando]     = useState(null); // null = nueva cuenta
  const [form, setForm]             = useState(modalVacio);
  const [errores, setErrores]       = useState({});

  // --- Filtro de búsqueda ---
  const cuentasFiltradas = cuentas.filter(
    (c) =>
      c.codigo.includes(busqueda) ||
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- Abrir modal para nueva cuenta ---
  const abrirNueva = () => {
    setEditando(null);
    setForm(modalVacio);
    setErrores({});
    setModalOpen(true);
  };

  // --- Abrir modal para editar ---
  const abrirEditar = (cuenta) => {
    setEditando(cuenta.id);
    setForm({ ...cuenta });
    setErrores({});
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  // --- Validación ---
  const validar = () => {
    const e = {};
    if (!form.codigo.trim())  e.codigo  = "El código es obligatorio";
    if (!form.nombre.trim())  e.nombre  = "El nombre es obligatorio";
    if (
      cuentas.some(
        (c) => c.codigo === form.codigo.trim() && c.id !== editando
      )
    )
      e.codigo = "Ya existe una cuenta con ese código";
    return e;
  };

  const eliminarCuenta = (id) => {
  if (!window.confirm("¿Eliminar esta cuenta?")) return;
  setCuentas((prev) => prev.filter((c) => c.id !== id));

  // BACKEND - descomentar cuando esté listo
  /*
  await fetch(`http://localhost:8000/api/cuentas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  setCuentas((prev) => prev.filter((c) => c.id !== id));
  */
};

  // --- Guardar (nueva o edición) ---
  const guardar = async () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrores(e); return; }

    if (editando === null) {
      // Nueva cuenta eliminar
      setCuentas((prev) => [
        ...prev,
        { ...form, id: Date.now(), codigo: form.codigo.trim(), nombre: form.nombre.trim() },
      ]);

      //Guardar cuenta - Envia cuenta nueva al backend
      /*
      const res = await fetch("http://localhost:8000/api/cuentas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
        body: JSON.stringify(form),
      });
      const nuevaCuenta = await res.json();
      setCuentas((prev) => [...prev, nuevaCuenta]); // usa el id real que devuelve el backend

      */
    } else {
      // Editar existente
      setCuentas((prev) => //eliminar
        prev.map((c) => (c.id === editando ? { ...form, id: editando } : c))
      );

      //Envia cambios al backend
      /*
      await fetch(`http://localhost:8000/api/cuentas/${editando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
      });
      setCuentas((prev) =>
        prev.map((c) => (c.id === editando ? { ...form, id: editando } : c))
      );
      */

    }
    cerrarModal();
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrores((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  return (
    <div>
      {/* ENCABEZADO */}
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.titulo}>Plan de cuentas</h2>
          <p style={styles.subtitulo}>{cuentas.length} cuentas registradas</p>
        </div>
        <button style={styles.btnPrimario} onClick={abrirNueva}>
          + Nueva cuenta
        </button>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por código, nombre o tipo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={styles.buscador}
      />

      {/* TABLA */}
      <div style={styles.tablaWrapper}>
        <table style={styles.tabla}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Código</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Descripción</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.sinResultados}>
                  No se encontraron cuentas.
                </td>
              </tr>
            ) : (
              cuentasFiltradas.map((c, i) => (
                <tr
                  key={c.id}
                  style={i % 2 === 0 ? styles.trPar : styles.trImpar}
                >
                  <td style={styles.td}>
                    <span style={styles.codigo}>{c.codigo}</span>
                  </td>
                  <td style={styles.td}>{c.nombre}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...badgeColor(c.tipo) }}>
                      {c.tipo}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: "#6b7280" }}>{c.descripcion}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <button
                      style={styles.btnEditar}
                      onClick={() => abrirEditar(c)}
                    >
                      Editar
                    </button>
                    <button
                      style={{ ...styles.btnEditar, marginLeft: 8, background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
                      onClick={() => eliminarCuenta(c.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div style={styles.overlay} onClick={cerrarModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitulo}>
                {editando ? "Editar cuenta" : "Nueva cuenta"}
              </h3>
              <button style={styles.btnCerrar} onClick={cerrarModal}>✕</button>
            </div>

            <div style={styles.modalBody}>
              <label style={styles.label}>Código</label>
              <input
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                placeholder="Ej: 1000"
                style={errores.codigo ? { ...styles.input, ...styles.inputError } : styles.input}
              />
              {errores.codigo && <p style={styles.error}>{errores.codigo}</p>}

              <label style={styles.label}>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Caja"
                style={errores.nombre ? { ...styles.input, ...styles.inputError } : styles.input}
              />
              {errores.nombre && <p style={styles.error}>{errores.nombre}</p>}

              <label style={styles.label}>Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                style={{ ...styles.input, cursor: "pointer" }}
              >
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>

              <label style={styles.label}>Descripción</label>
              <input
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Opcional"
                style={styles.input}
              />
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.btnSecundario} onClick={cerrarModal}>
                Cancelar
              </button>
              <button style={styles.btnPrimario} onClick={guardar}>
                {editando ? "Guardar cambios" : "Agregar cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Color del badge según tipo
const badgeColor = (tipo) => {
  const map = {
    Activo:     { background: "#dbeafe", color: "#1d4ed8" },
    Pasivo:     { background: "#fce7f3", color: "#be185d" },
    Patrimonio: { background: "#ede9fe", color: "#6d28d9" },
    Ingreso:    { background: "#d1fae5", color: "#065f46" },
    Gasto:      { background: "#fee2e2", color: "#991b1b" },
  };
  return map[tipo] || { background: "#f3f4f6", color: "#374151" };
};

const styles = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  titulo: { margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" },
  subtitulo: { margin: "4px 0 0", fontSize: 13, color: "#6b7280" },

  btnPrimario: {
    padding: "10px 18px",
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSecundario: {
    padding: "10px 18px",
    background: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
  },

  buscador: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
    boxSizing: "border-box",
    background: "#fff",
  },

  tablaWrapper: {
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  tabla:  { width: "100%", borderCollapse: "collapse" },
  thead:  { background: "#f9fafb" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e5e7eb",
  },
  td:      { padding: "12px 16px", fontSize: 14, color: "#374151" },
  trPar:   { background: "#fff" },
  trImpar: { background: "#f9fafb" },
  sinResultados: { padding: 24, textAlign: "center", color: "#9ca3af", fontSize: 14 },

  codigo: {
    fontFamily: "monospace",
    fontWeight: 700,
    fontSize: 14,
    color: "#1a1a2e",
  },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  btnEditar: {
    padding: "5px 14px",
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 600,
  },

  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitulo: { margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" },
  btnCerrar: {
    background: "none",
    border: "none",
    fontSize: 18,
    color: "#9ca3af",
    cursor: "pointer",
    lineHeight: 1,
  },
  modalBody: {
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    background: "#f9fafb",
  },

  label: { fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 10 },
  input: {
    padding: "10px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    background: "#fafafa",
    outline: "none",
  },
  inputError: { borderColor: "#ef4444" },
  error: { margin: "2px 0 0", fontSize: 12, color: "#dc2626" },
};
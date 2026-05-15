import { useState } from "react";

const CUENTAS_DISPONIBLES = [
  { codigo: "101", nombre: "Caja" },
  { codigo: "102", nombre: "Bancos" },
  { codigo: "201", nombre: "Proveedores" },
  { codigo: "401", nombre: "Ventas" },
  { codigo: "502", nombre: "Gastos administrativos" },
  { codigo: "500", nombre: "Sueldos" },
];

const ASIENTOS_INICIALES = [
  {
    id: 3,
    fecha: "2026-05-10",
    descripcion: "Pago de planilla administrativa",
    lineas: [
      { cuenta: "502", nombre: "Gastos administrativos", debito: 3200, credito: 0 },
      { cuenta: "102", nombre: "Bancos",                 debito: 0,    credito: 3200 },
    ],
  },
  {
    id: 2,
    fecha: "2026-05-05",
    descripcion: "Venta de mercadería al contado",
    lineas: [
      { cuenta: "101", nombre: "Caja",   debito: 8500, credito: 0 },
      { cuenta: "401", nombre: "Ventas", debito: 0,    credito: 8500 },
    ],
  },
  {
    id: 1,
    fecha: "2026-05-01",
    descripcion: "Apertura de caja",
    lineas: [
      { cuenta: "101", nombre: "Caja",   debito: 5000, credito: 0 },
      { cuenta: "102", nombre: "Bancos", debito: 0,    credito: 5000 },
    ],
  },
];

const lineaVacia = () => ({ id: Date.now() + Math.random(), cuenta: "101", debito: 0, credito: 0 });

const fmt = (n) =>
  `S/ ${Number(n).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

const hoy = () => new Date().toISOString().split("T")[0];

export default function AsientosContablesPage() {
  const [asientos, setAsientos]       = useState(ASIENTOS_INICIALES);
  const [fechaDesde, setFechaDesde]   = useState("");
  const [fechaHasta, setFechaHasta]   = useState("");

  // Modal detalle
  const [modalDetalle, setModalDetalle] = useState(null);

  // Modal nuevo/editar
  const [modalForm, setModalForm]     = useState(false);
  const [editandoId, setEditandoId]   = useState(null);
  const [fecha, setFecha]             = useState(hoy());
  const [descripcion, setDesc]        = useState("");
  const [lineas, setLineas]           = useState([lineaVacia(), lineaVacia()]);
  const [errores, setErrores]         = useState({});

  // --- Filtro ---
  const asientosFiltrados = asientos.filter((a) => {
    if (fechaDesde && a.fecha < fechaDesde) return false;
    if (fechaHasta && a.fecha > fechaHasta) return false;
    return true;
  });

  // --- Importe total de un asiento ---
  const importe = (asiento) =>
    asiento.lineas.reduce((s, l) => s + (l.debito ?? 0), 0);

  // --- Abrir modal nuevo ---
  const abrirNuevo = () => {
    setEditandoId(null);
    setFecha(hoy());
    setDesc("");
    setLineas([lineaVacia(), lineaVacia()]);
    setErrores({});
    setModalForm(true);
  };

  // --- Abrir modal editar ---
  const abrirEditar = (asiento) => {
    setEditandoId(asiento.id);
    setFecha(asiento.fecha);
    setDesc(asiento.descripcion);
    setLineas(asiento.lineas.map((l) => ({ ...l, id: Date.now() + Math.random() })));
    setErrores({});
    setModalDetalle(null);
    setModalForm(true);
  };

  const cerrarForm = () => setModalForm(false);

  // --- Líneas ---
  const agregarLinea = () => setLineas((prev) => [...prev, lineaVacia()]);
  const eliminarLinea = (id) => {
    if (lineas.length <= 2) return;
    setLineas((prev) => prev.filter((l) => l.id !== id));
  };
  const actualizarLinea = (id, campo, valor) => {
    setLineas((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [campo]: valor } : l))
    );
  };

  // --- Totales balance ---
  const totalDebito  = lineas.reduce((s, l) => s + (parseFloat(l.debito)  || 0), 0);
  const totalCredito = lineas.reduce((s, l) => s + (parseFloat(l.credito) || 0), 0);
  const balanceado   = Math.abs(totalDebito - totalCredito) < 0.001 && totalDebito > 0;

  // --- Validar ---
  const validar = () => {
    const e = {};
    if (!descripcion.trim()) e.descripcion = "La descripción es obligatoria";
    if (!balanceado) e.balance = "El asiento no está balanceado";
    return e;
  };

  // --- Guardar ---
  const guardar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrores(e); return; }

    const lineasConNombre = lineas.map((l) => {
      const cta = CUENTAS_DISPONIBLES.find((c) => c.codigo === l.cuenta);
      return { ...l, nombre: cta?.nombre ?? l.cuenta };
    });

    if (editandoId === null) {
      // Nuevo
      const nuevoId = asientos.length > 0 ? Math.max(...asientos.map((a) => a.id)) + 1 : 1;
      setAsientos((prev) => [
        { id: nuevoId, fecha, descripcion, lineas: lineasConNombre },
        ...prev,
      ]);
    } else {
      // Editar
      setAsientos((prev) =>
        prev.map((a) =>
          a.id === editandoId ? { ...a, fecha, descripcion, lineas: lineasConNombre } : a
        )
      );
    }

    // BACKEND - descomentar cuando esté listo
    /*
    if (editandoId === null) {
      const res = await fetch("http://localhost:8000/api/asientos", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ fecha, descripcion, lineas }),
      });
      const nuevo = await res.json();
      setAsientos((prev) => [nuevo, ...prev]);
    } else {
      await fetch(`http://localhost:8000/api/asientos/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ fecha, descripcion, lineas }),
      });
      setAsientos((prev) =>
        prev.map((a) => (a.id === editandoId ? { ...a, fecha, descripcion, lineas } : a))
      );
    }
    */

    cerrarForm();
  };

  // --- Eliminar ---
  const eliminarAsiento = (id) => {
    if (!window.confirm("¿Eliminar este asiento?")) return;
    setAsientos((prev) => prev.filter((a) => a.id !== id));

    // BACKEND - descomentar cuando esté listo
    /*
    await fetch(`http://localhost:8000/api/asientos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setAsientos((prev) => prev.filter((a) => a.id !== id));
    */
  };

  return (
    <div style={styles.page}>

      {/* ENCABEZADO */}
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.titulo}>Asientos Contables</h2>
          <p style={styles.subtitulo}>Registro de operaciones financieras</p>
        </div>
        <button style={styles.btnPrimario} onClick={abrirNuevo}>
          + Nuevo asiento
        </button>
      </div>

      {/* FILTROS */}
      <div style={styles.filtroBar}>
        <span style={styles.filtroLabel}>Desde</span>
        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} style={styles.inputFecha} />
        <span style={styles.filtroLabel}>Hasta</span>
        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} style={styles.inputFecha} />
        <span style={styles.countLabel}>{asientosFiltrados.length} asientos</span>
      </div>

      {/* TABLA */}
      <div style={styles.tablaCard}>
        <table style={styles.tabla}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Descripción</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Importe</th>
              <th style={styles.th}>Líneas</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asientosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={styles.vacio}>No hay asientos registrados.</td>
              </tr>
            ) : (
              asientosFiltrados.map((a, i) => (
                <tr key={a.id} style={i % 2 === 0 ? styles.trPar : styles.trImpar}>
                  <td style={styles.td}><span style={styles.numero}>#{a.id}</span></td>
                  <td style={styles.td}>{a.fecha}</td>
                  <td style={styles.td}>{a.descripcion}</td>
                  <td style={{ ...styles.td, textAlign: "right", color: "#1d4ed8", fontWeight: 600 }}>
                    {fmt(importe(a))}
                  </td>
                  <td style={styles.td}>{a.lineas.length} líneas</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button style={styles.btnVer} onClick={() => setModalDetalle(a)}>Ver</button>
                    <button style={styles.btnEditar} onClick={() => abrirEditar(a)}>Editar</button>
                    <button style={styles.btnEliminar} onClick={() => eliminarAsiento(a.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETALLE */}
      {modalDetalle && (
        <div style={styles.overlay} onClick={() => setModalDetalle(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitulo}>Detalle del asiento</h3>
              <button style={styles.btnCerrar} onClick={() => setModalDetalle(null)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.detalleGrid}>
                <div>
                  <p style={styles.detalleLabel}>ASIENTO N°</p>
                  <p style={{ ...styles.detalleValor, color: "#1d4ed8" }}>#{modalDetalle.id}</p>
                </div>
                <div>
                  <p style={styles.detalleLabel}>FECHA</p>
                  <p style={styles.detalleValor}>{modalDetalle.fecha}</p>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={styles.detalleLabel}>DESCRIPCIÓN</p>
                <p style={styles.detalleValor}>{modalDetalle.descripcion}</p>
              </div>
              <hr style={{ borderColor: "#e5e7eb", marginBottom: 16 }} />
              <table style={styles.tabla}>
                <thead>
                  <tr style={styles.theadRow}>
                    <th style={styles.th}>Cuenta</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Débito (S/)</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Crédito (S/)</th>
                  </tr>
                </thead>
                <tbody>
                  {modalDetalle.lineas.map((l, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trPar : styles.trImpar}>
                      <td style={styles.td}>{l.cuenta} {l.nombre}</td>
                      <td style={{ ...styles.td, textAlign: "right", color: l.debito > 0 ? "#1d4ed8" : "#374151" }}>
                        {l.debito > 0 ? fmt(l.debito) : "—"}
                      </td>
                      <td style={{ ...styles.td, textAlign: "right", color: l.credito > 0 ? "#16a34a" : "#374151" }}>
                        {l.credito > 0 ? fmt(l.credito) : "—"}
                      </td>
                    </tr>
                  ))}
                  {/* Fila totales */}
                  <tr style={{ background: "#f9fafb", fontWeight: 700 }}>
                    <td style={styles.td}>TOTALES</td>
                    <td style={{ ...styles.td, textAlign: "right", color: "#1d4ed8" }}>
                      {fmt(modalDetalle.lineas.reduce((s, l) => s + (l.debito ?? 0), 0))}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right", color: "#16a34a" }}>
                      {fmt(modalDetalle.lineas.reduce((s, l) => s + (l.credito ?? 0), 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnSecundario} onClick={() => setModalDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO / EDITAR */}
      {modalForm && (
        <div style={styles.overlay} onClick={cerrarForm}>
          <div style={{ ...styles.modal, maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitulo}>
                {editandoId ? "Editar asiento" : "Nuevo Asiento Contable"}
              </h3>
              <button style={styles.btnCerrar} onClick={cerrarForm}>✕</button>
            </div>

            <div style={styles.modalBody}>
              {/* Fecha y Descripción */}
              <div style={styles.fila2col}>
                <div>
                  <label style={styles.label}>Fecha</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Descripción</label>
                  <input
                    type="text"
                    placeholder="Descripción del asiento"
                    value={descripcion}
                    onChange={(e) => { setDesc(e.target.value); setErrores((p) => ({ ...p, descripcion: undefined })); }}
                    style={errores.descripcion ? { ...styles.input, borderColor: "#ef4444" } : styles.input}
                  />
                  {errores.descripcion && <p style={styles.errorTxt}>{errores.descripcion}</p>}
                </div>
              </div>

              <hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

              {/* Detalles del asiento */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>Detalles del asiento</p>
                <button style={styles.btnAgregarLinea} onClick={agregarLinea}>+ Agregar línea</button>
              </div>

              {/* Cabecera líneas */}
              <div style={styles.lineasHeader}>
                <span style={{ flex: 3, fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Cuenta</span>
                <span style={{ flex: 2, fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", textAlign: "right" }}>Débito (S/)</span>
                <span style={{ flex: 2, fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", textAlign: "right" }}>Crédito (S/)</span>
                <span style={{ width: 32 }} />
              </div>

              {/* Filas líneas */}
              {lineas.map((l) => (
                <div key={l.id} style={styles.lineaFila}>
                  <select
                    value={l.cuenta}
                    onChange={(e) => actualizarLinea(l.id, "cuenta", e.target.value)}
                    style={{ ...styles.inputLinea, flex: 3 }}
                  >
                    {CUENTAS_DISPONIBLES.map((c) => (
                      <option key={c.codigo} value={c.codigo}>{c.codigo} – {c.nombre}</option>
                    ))}
                  </select>
                  <input
                    type="number" min="0" step="0.01"
                    value={l.debito}
                    onChange={(e) => actualizarLinea(l.id, "debito", e.target.value)}
                    style={{ ...styles.inputLinea, flex: 2, textAlign: "right" }}
                  />
                  <input
                    type="number" min="0" step="0.01"
                    value={l.credito}
                    onChange={(e) => actualizarLinea(l.id, "credito", e.target.value)}
                    style={{ ...styles.inputLinea, flex: 2, textAlign: "right" }}
                  />
                  <button style={styles.btnX} onClick={() => eliminarLinea(l.id)}>✕</button>
                </div>
              ))}

              {/* Totales balance */}
              <div style={styles.balanceBox}>
                <div style={styles.balanceFila}>
                  <span style={styles.balanceLabel}>Total Débito:</span>
                  <span style={{ ...styles.balanceValor, color: "#1d4ed8" }}>{fmt(totalDebito)}</span>
                </div>
                <div style={styles.balanceFila}>
                  <span style={styles.balanceLabel}>Total Crédito:</span>
                  <span style={{ ...styles.balanceValor, color: "#16a34a" }}>{fmt(totalCredito)}</span>
                </div>
                <div style={styles.balanceFila}>
                  <span style={styles.balanceLabel}>Balance:</span>
                  <span style={{ ...styles.balanceValor, color: balanceado ? "#16a34a" : "#dc2626" }}>
                    {balanceado ? "Balanceado ✓" : "Descuadrado ✗"}
                  </span>
                </div>
                {errores.balance && <p style={styles.errorTxt}>{errores.balance}</p>}
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.btnSecundario} onClick={cerrarForm}>Cancelar</button>
              <button style={styles.btnPrimario} onClick={guardar}>
                {editandoId ? "Guardar cambios" : "Registrar asiento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: 20 },

  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  titulo: { margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" },
  subtitulo: { margin: "4px 0 0", fontSize: 13, color: "#6b7280" },

  filtroBar: { display: "flex", alignItems: "center", gap: 10 },
  filtroLabel: { fontSize: 13, color: "#6b7280", fontWeight: 600 },
  inputFecha: { padding: "9px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#fff" },
  countLabel: { marginLeft: "auto", fontSize: 13, color: "#6b7280" },

  tablaCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" },
  tabla: { width: "100%", borderCollapse: "collapse" },
  theadRow: { background: "#f9fafb" },
  th: { padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e5e7eb" },
  td: { padding: "12px 16px", fontSize: 14, color: "#374151" },
  trPar: { background: "#fff" },
  trImpar: { background: "#f9fafb" },
  numero: { fontWeight: 700, color: "#1a1a2e" },
  vacio: { padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 14 },

  btnPrimario: { padding: "10px 18px", background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnSecundario: { padding: "10px 18px", background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, cursor: "pointer" },
  btnVer: { padding: "5px 12px", background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", marginRight: 6 },
  btnEditar: { padding: "5px 12px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", marginRight: 6 },
  btnEliminar: { padding: "5px 12px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#fff", borderRadius: 12, width: "100%", maxWidth: 520, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #e5e7eb" },
  modalTitulo: { margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e" },
  btnCerrar: { background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer" },
  modalBody: { padding: "20px 24px" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: "1px solid #e5e7eb", background: "#f9fafb" },

  detalleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  detalleLabel: { margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" },
  detalleValor: { margin: 0, fontSize: 16, fontWeight: 600, color: "#1a1a2e" },

  fila2col: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  input: { width: "100%", padding: "10px 14px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#fafafa", boxSizing: "border-box" },
  errorTxt: { margin: "4px 0 0", fontSize: 12, color: "#dc2626" },

  lineasHeader: { display: "flex", gap: 8, padding: "6px 0", marginBottom: 4 },
  lineaFila: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 },
  inputLinea: { padding: "8px 10px", border: "1.5px solid #d1d5db", borderRadius: 7, fontSize: 14, background: "#fff", minWidth: 0 },
  btnX: { width: 30, height: 30, border: "1px solid #e5e7eb", background: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#9ca3af", flexShrink: 0 },
  btnAgregarLinea: { padding: "6px 14px", background: "#fff", border: "1.5px solid #d1d5db", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" },

  balanceBox: { marginTop: 12, padding: "12px 16px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" },
  balanceFila: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  balanceLabel: { fontSize: 13, color: "#6b7280" },
  balanceValor: { fontSize: 13, fontWeight: 700 },
};
import { useNavigate } from "react-router-dom";

const ASIENTOS = [
  {
    id: 3,
    fecha: "2026-05-10",
    descripcion: "Pago de planilla administrativa",
    lineas: [
      { debito: 3200, credito: 0 },
      { debito: 0,    credito: 3200 },
    ],
  },
  {
    id: 2,
    fecha: "2026-05-05",
    descripcion: "Venta de mercadería al contado",
    lineas: [
      { debito: 8500, credito: 0 },
      { debito: 0,    credito: 8500 },
    ],
  },
  {
    id: 1,
    fecha: "2026-05-01",
    descripcion: "Aporte de capital inicial",
    lineas: [
      { debito: 50000, credito: 0 },
      { debito: 0,     credito: 50000 },
    ],
  },
];

const CUENTAS = [
  { tipo: "ACTIVO",     count: 2 },
  { tipo: "PASIVO",     count: 1 },
  { tipo: "PATRIMONIO", count: 1 },
  { tipo: "INGRESO",    count: 1 },
  { tipo: "GASTO",      count: 2 },
];

const tipoBadgeColor = (tipo) => {
  const map = {
    ACTIVO:     { background: "#dbeafe", color: "#1d4ed8" },
    PASIVO:     { background: "#fce7f3", color: "#be185d" },
    PATRIMONIO: { background: "#ede9fe", color: "#6d28d9" },
    INGRESO:    { background: "#d1fae5", color: "#065f46" },
    GASTO:      { background: "#fee2e2", color: "#991b1b" },
  };
  return map[tipo] || { background: "#f3f4f6", color: "#374151" };
};

const fmt = (n) =>
  `S/ ${Number(n).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

const totalDebito  = ASIENTOS.reduce((s, a) => s + a.lineas.reduce((ls, l) => ls + l.debito, 0), 0);
const totalCredito = ASIENTOS.reduce((s, a) => s + a.lineas.reduce((ls, l) => ls + l.credito, 0), 0);
const totalCuentas = CUENTAS.reduce((s, c) => s + c.count, 0);
const cuentasActivo = CUENTAS.find((c) => c.tipo === "ACTIVO")?.count ?? 0;
const balanceado = Math.abs(totalDebito - totalCredito) < 0.001;

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* ENCABEZADO */}
      <div>
        <h2 style={styles.titulo}>Dashboard</h2>
        <p style={styles.subtitulo}>Resumen general del sistema</p>
      </div>

      {/* TARJETAS */}
      <div style={styles.tarjetas}>
        {/* Total asientos */}
        <div style={styles.tarjeta}>
          <p style={styles.tarjetaLabel}>TOTAL ASIENTOS</p>
          <p style={styles.tarjetaValor}>{ASIENTOS.length}</p>
          <span style={{ ...styles.badge, background: "#dbeafe", color: "#1d4ed8" }}>
            Registros
          </span>
        </div>

        {/* Plan de cuentas */}
        <div style={styles.tarjeta}>
          <p style={styles.tarjetaLabel}>PLAN DE CUENTAS</p>
          <p style={styles.tarjetaValor}>{totalCuentas}</p>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            {cuentasActivo} cuentas de activo
          </span>
        </div>

        {/* Total débitos */}
        <div style={styles.tarjeta}>
          <p style={styles.tarjetaLabel}>TOTAL DÉBITOS</p>
          <p style={{ ...styles.tarjetaValor, fontSize: 22 }}>{fmt(totalDebito)}</p>
          <span style={{ ...styles.badge, background: "#fef3c7", color: "#92400e" }}>
            Movimientos
          </span>
        </div>

        {/* Total créditos */}
        <div style={styles.tarjeta}>
          <p style={styles.tarjetaLabel}>TOTAL CRÉDITOS</p>
          <p style={{ ...styles.tarjetaValor, fontSize: 22 }}>{fmt(totalCredito)}</p>
          <span style={{ ...styles.badge, background: "#d1fae5", color: "#065f46" }}>
            {balanceado ? "Balanceado" : "Descuadrado"}
          </span>
        </div>
      </div>

      {/* FILA INFERIOR */}
      <div style={styles.filaInferior}>

        {/* Últimos asientos */}
        <div style={{ ...styles.card, flex: 2 }}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitulo}>Últimos asientos</span>
            <button
              style={styles.btnVerTodos}
              onClick={() => navigate("/dashboard/asientos-contables")}
            >
              Ver todos
            </button>
          </div>

          <table style={styles.tabla}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Descripción</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {ASIENTOS.map((a, i) => (
                <tr key={a.id} style={i % 2 === 0 ? styles.trPar : styles.trImpar}>
                  <td style={styles.td}>{a.fecha}</td>
                  <td style={styles.td}>{a.descripcion}</td>
                  <td style={{ ...styles.td, textAlign: "right", color: "#1d4ed8", fontWeight: 600 }}>
                    {fmt(a.lineas.reduce((s, l) => s + l.debito, 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cuentas por tipo */}
        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitulo}>Cuentas por tipo</span>
          </div>
          <div style={styles.cuentasList}>
            {CUENTAS.map((c) => (
              <div key={c.tipo} style={styles.cuentasFila}>
                <span style={{ ...styles.badge, ...tipoBadgeColor(c.tipo) }}>
                  {c.tipo}
                </span>
                <span style={styles.cuentasCount}>{c.count} cuentas</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: 20 },
  titulo: { margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" },
  subtitulo: { margin: "4px 0 0", fontSize: 13, color: "#6b7280" },

  // Tarjetas
  tarjetas: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
  tarjeta: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  tarjetaLabel: { margin: 0, fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" },
  tarjetaValor: { margin: 0, fontSize: 32, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.1 },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, width: "fit-content" },

  // Fila inferior
  filaInferior: { display: "flex", gap: 16, alignItems: "flex-start" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid #e5e7eb" },
  cardTitulo: { fontSize: 14, fontWeight: 700, color: "#1a1a2e" },
  btnVerTodos: { padding: "5px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, cursor: "pointer", color: "#374151", fontWeight: 600 },

  // Tabla
  tabla: { width: "100%", borderCollapse: "collapse" },
  theadRow: { background: "#f9fafb" },
  th: { padding: "10px 18px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e5e7eb" },
  td: { padding: "12px 18px", fontSize: 14, color: "#374151" },
  trPar: { background: "#fff" },
  trImpar: { background: "#f9fafb" },

  // Cuentas por tipo
  cuentasList: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: 14 },
  cuentasFila: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cuentasCount: { fontSize: 13, color: "#6b7280", fontWeight: 600 },
};
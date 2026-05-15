import { useState } from "react";

const ASIENTOS = [
  {
    id: 1,
    fecha: "2026-05-01",
    descripcion: "Aporte de capital inicial",
    lineas: [
      { codigo: "102", nombre: "Bancos",        tipo: "ACTIVO",     debito: 50000, credito: 0 },
      { codigo: "301", nombre: "Capital social", tipo: "PATRIMONIO", debito: 0,     credito: 50000 },
    ],
  },
  {
    id: 2,
    fecha: "2026-05-05",
    descripcion: "Venta de mercadería al contado",
    lineas: [
      { codigo: "101", nombre: "Caja",   tipo: "ACTIVO",  debito: 8500, credito: 0 },
      { codigo: "401", nombre: "Ventas", tipo: "INGRESO", debito: 0,    credito: 8500 },
    ],
  },
  {
    id: 3,
    fecha: "2026-05-10",
    descripcion: "Pago de planilla administrativa",
    lineas: [
      { codigo: "502", nombre: "Gastos administrativos", tipo: "GASTO",  debito: 3200, credito: 0 },
      { codigo: "102", nombre: "Bancos",                 tipo: "ACTIVO", debito: 0,    credito: 3200 },
    ],
  },
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
  n > 0
    ? `S/ ${Number(n).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
    : null;

export default function LibroDiarioPage() {
  const [asientos] = useState(ASIENTOS);

  const totalDebito  = asientos.reduce((s, a) => s + a.lineas.reduce((ls, l) => ls + l.debito, 0), 0);
  const totalCredito = asientos.reduce((s, a) => s + a.lineas.reduce((ls, l) => ls + l.credito, 0), 0);

  return (
    <div style={styles.page}>

      {/* ENCABEZADO */}
      <div>
        <h2 style={styles.titulo}>Libro Diario</h2>
        <p style={styles.subtitulo}>Registro cronológico de asientos</p>
      </div>

      {/* TABLA */}
      <div style={styles.tablaCard}>
        <div style={styles.tablaTop}>
          <span style={styles.tablaTitulo}>Libro Diario — Registro Cronológico</span>
          <span style={styles.countLabel}>{asientos.length} asientos</span>
        </div>

        <table style={styles.tabla}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={{ ...styles.th, width: 60 }}>#</th>
              <th style={{ ...styles.th, width: 120 }}>Fecha</th>
              <th style={styles.th}>Descripción / Cuenta</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Débito (S/)</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Crédito (S/)</th>
            </tr>
          </thead>
          <tbody>
            {asientos.map((asiento) => (
              <>
                {/* Fila principal del asiento */}
                <tr key={`a-${asiento.id}`} style={styles.trAsiento}>
                  <td style={styles.td}>
                    <span style={styles.numero}>#{asiento.id}</span>
                  </td>
                  <td style={styles.td}>{asiento.fecha}</td>
                  <td style={{ ...styles.td, fontWeight: 700, color: "#1a1a2e" }}>
                    {asiento.descripcion}
                  </td>
                  <td style={{ ...styles.td, textAlign: "right", fontWeight: 700, color: "#1d4ed8" }}>
                    {fmt(asiento.lineas.reduce((s, l) => s + l.debito, 0))}
                  </td>
                  <td style={{ ...styles.td, textAlign: "right", fontWeight: 700, color: "#16a34a" }}>
                    {fmt(asiento.lineas.reduce((s, l) => s + l.credito, 0))}
                  </td>
                </tr>

                {/* Filas de líneas del asiento */}
                {asiento.lineas.map((linea, li) => (
                  <tr key={`l-${asiento.id}-${li}`} style={styles.trLinea}>
                    <td style={styles.td} />
                    <td style={styles.td} />
                    <td style={styles.td}>
                      <span style={styles.lineaCodigo}>{linea.codigo}</span>
                      <span style={styles.lineaNombre}>{linea.nombre}</span>
                      <span style={{ ...styles.badge, ...tipoBadgeColor(linea.tipo) }}>
                        {linea.tipo}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: "right", color: "#1d4ed8" }}>
                      {fmt(linea.debito)}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right", color: "#16a34a" }}>
                      {fmt(linea.credito)}
                    </td>
                  </tr>
                ))}

                {/* Separador visual entre asientos */}
                <tr key={`sep-${asiento.id}`}>
                  <td colSpan={5} style={styles.separador} />
                </tr>
              </>
            ))}

            {/* Totales */}
            <tr style={styles.trTotales}>
              <td colSpan={3} style={{ ...styles.td, fontWeight: 700, color: "#1a1a2e" }}>
                TOTALES
              </td>
              <td style={{ ...styles.td, textAlign: "right", fontWeight: 700, color: "#1d4ed8" }}>
                S/ {totalDebito.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </td>
              <td style={{ ...styles.td, textAlign: "right", fontWeight: 700, color: "#16a34a" }}>
                S/ {totalCredito.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: 20 },
  titulo: { margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" },
  subtitulo: { margin: "4px 0 0", fontSize: 13, color: "#6b7280" },

  tablaCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" },
  tablaTop: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid #e5e7eb" },
  tablaTitulo: { fontSize: 14, fontWeight: 700, color: "#1a1a2e" },
  countLabel: { fontSize: 13, color: "#6b7280" },

  tabla: { width: "100%", borderCollapse: "collapse" },
  theadRow: { background: "#f9fafb" },
  th: { padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e5e7eb" },
  td: { padding: "10px 16px", fontSize: 14, color: "#374151" },

  trAsiento: { background: "#fff", borderTop: "2px solid #e5e7eb" },
  trLinea:   { background: "#f9fafb" },
  trTotales: { background: "#f0f9ff", borderTop: "2px solid #bfdbfe" },
  separador: { padding: 0, height: 4, background: "#f3f4f6" },

  numero: { fontWeight: 700, color: "#1d4ed8", fontSize: 14 },
  lineaCodigo: { marginRight: 6, fontSize: 13, color: "#9ca3af", fontFamily: "monospace" },
  lineaNombre: { marginRight: 8, fontSize: 14, color: "#374151" },
  badge: { display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700 },
};
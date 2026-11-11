import { useMemo } from "react";
import { Activity, CircleCheck, ShieldAlert, TimerReset } from "lucide-react";
import { useApp } from "../context.jsx";
import { formatLabel } from "../lib/incidents.js";

const severityOrder = ["critica", "alta", "media", "baja"];
const statusOrder = ["abierto", "en_progreso", "contenido", "resuelto"];
const categoryOrder = ["phishing", "malware", "acceso_no_autorizado", "fuga_datos", "disponibilidad", "otro"];

function countValue(incidents, field, value) {
  return incidents.filter((incident) => incident[field] === value).length;
}

export default function AnalyticsPage() {
  const { incidents, loading } = useApp();
  const resolved = countValue(incidents, "status", "resuelto");
  const active = incidents.length - resolved;
  const critical = incidents.filter((incident) => incident.severity === "critica" && incident.status !== "resuelto").length;
  const rate = incidents.length ? Math.round((resolved / incidents.length) * 100) : 0;
  const categories = useMemo(() => categoryOrder.map((value) => ({
    value,
    count: incidents.filter((incident) => incident.problem_category === value).length,
  })).sort((a, b) => b.count - a.count), [incidents]);
  const highestCount = Math.max(1, ...categories.map(({ count }) => count));
  const trend = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toLocaleDateString("en-CA");
      return {
        key,
        label: date.toLocaleDateString("es-CO", { weekday: "short" }),
        count: incidents.filter((incident) => new Date(incident.created_at).toLocaleDateString("en-CA") === key).length,
      };
    });
  }, [incidents]);
  const maxDaily = Math.max(1, ...trend.map(({ count }) => count));
  const donutValues = severityOrder.map((severity) => countValue(incidents, "severity", severity));
  const donutParts = [];
  let start = 0;
  for (let index = 0; index < donutValues.length; index += 1) {
    const end = start + (incidents.length ? (donutValues[index] / incidents.length) * 100 : 0);
    donutParts.push(`var(--severity-color-${severityOrder[index]}) ${start}% ${end}%`);
    start = end;
  }
  const donutStyle = { background: incidents.length ? `conic-gradient(${donutParts.join(", ")})` : "var(--surface-raised)" };

  if (loading) return <div className="loading-state">Calculando métricas…</div>;

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">Métricas operativas</p><h1>Estadísticas y analítica</h1><p className="page-description">Indicadores calculados a partir de los incidentes disponibles para tu cuenta.</p></div>
        <span className="module-badge"><Activity size={15} /> Datos actuales de Supabase</span>
      </div>
      <section className="metric-grid analytics-metrics">
        <Metric icon={Activity} label="Total reportes" value={incidents.length} detail="Incidentes visibles" tone="blue" />
        <Metric icon={CircleCheck} label="Resueltos" value={`${rate}%`} detail={`${resolved} de ${incidents.length} reportes`} tone="green" />
        <Metric icon={TimerReset} label="Activos" value={active} detail="Pendientes de resolución" tone="amber" />
        <Metric icon={ShieldAlert} label="Críticos activos" value={critical} detail="Requieren atención prioritaria" tone="red" />
      </section>

      <div className="analytics-grid">
        <section className="card analytics-card">
          <div className="section-title"><div><p className="eyebrow">Últimos siete días</p><h2>Incidentes registrados</h2></div><span className="section-hint">Por fecha de creación</span></div>
          {incidents.length === 0 ? <EmptyChart /> : (
            <div className="weekly-chart" role="img" aria-label="Incidentes creados por día durante los últimos siete días">
              {trend.map(({ key, label, count }) => (
                <div className="weekly-column" key={key}>
                  <span className="weekly-count">{count || ""}</span>
                  <div className="weekly-bar-wrap"><span className="weekly-bar" style={{ height: `${count ? Math.max(8, (count / maxDaily) * 100) : 2}%` }} /></div>
                  <span className="weekly-label">{label}</span>
                </div>
              ))}
            </div>
          )}
          <div className="chart-caption">Total reportes <strong>{incidents.length}</strong><span>Resueltos <strong>{resolved}</strong></span></div>
        </section>

        <section className="card analytics-card">
          <div className="section-title"><div><p className="eyebrow">Clasificación</p><h2>Por categoría</h2></div></div>
          <div className="category-bars analytics-bars">
            {categories.map(({ value, count }) => (
              <div className="category-row" key={value}>
                <div className="category-meta"><span>{formatLabel(value)}</span><strong>{count}</strong></div>
                <div className="bar-track"><span style={{ width: `${(count / highestCount) * 100}%` }} /></div>
              </div>
            ))}
            <div className="category-row">
              <div className="category-meta"><span>Sin clasificar</span><strong>{incidents.filter((incident) => !incident.problem_category).length}</strong></div>
              <div className="bar-track"><span style={{ width: `${(incidents.filter((incident) => !incident.problem_category).length / highestCount) * 100}%` }} /></div>
            </div>
          </div>
        </section>
      </div>

      <div className="analytics-grid lower-analytics">
        <section className="card analytics-card severity-analytics">
          <div className="section-title"><div><p className="eyebrow">Priorización</p><h2>Distribución por severidad</h2></div></div>
          <div className="donut-layout">
            <div className="donut" style={donutStyle}><div><strong>{incidents.length}</strong><span>reportes</span></div></div>
            <div className="donut-legend">
              {severityOrder.map((severity, index) => (
                <div className="legend-row" key={severity}><span className={`legend-dot severity-${severity}`} /><span>{formatLabel(severity)}</span><strong>{donutValues[index]}</strong><small>{incidents.length ? `${Math.round((donutValues[index] / incidents.length) * 100)}%` : "0%"}</small></div>
              ))}
            </div>
          </div>
        </section>

        <section className="card analytics-card">
          <div className="section-title"><div><p className="eyebrow">Seguimiento</p><h2>Estado de los reportes</h2></div></div>
          <div className="status-bars">
            {statusOrder.map((status) => {
              const count = countValue(incidents, "status", status);
              return <div className="category-row" key={status}><div className="category-meta"><span>{formatLabel(status)}</span><strong>{count}</strong></div><div className="bar-track"><span className={`status-bar status-bar-${status}`} style={{ width: `${incidents.length ? (count / incidents.length) * 100 : 0}%` }} /></div></div>;
            })}
          </div>
          <p className="analytics-footnote">No se calcula MTTR: la bitácora actual no registra de forma explícita el momento de resolución.</p>
        </section>
      </div>
      <p className="data-footnote">Las cifras reflejan el conjunto de datos autorizado por las políticas de acceso, no necesariamente todos los incidentes del sistema.</p>
    </>
  );
}

function Metric({ icon: Icon, label, value, detail, tone }) {
  return <div className={`card metric-card metric-${tone}`}><div className="metric-top"><span>{label}</span><Icon size={17} /></div><strong className="metric-value">{value}</strong><span className="metric-hint">{detail}</span></div>;
}

function EmptyChart() {
  return <div className="chart-empty">Aún no hay datos para el periodo seleccionado.</div>;
}

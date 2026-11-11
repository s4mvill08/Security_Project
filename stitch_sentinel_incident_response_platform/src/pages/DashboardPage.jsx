import { Link } from "react-router-dom";
import {
  Activity, ArrowRight, ArrowUpRight, CircleCheck, Clock3, Plus, ShieldAlert,
  ShieldCheck, Siren,
} from "lucide-react";
import { useApp } from "../context.jsx";
import { formatDate, formatLabel, getIncidentCategory } from "../lib/incidents.js";

const severities = ["critica", "alta", "media", "baja"];
const categories = [
  ["phishing", "Phishing"],
  ["malware", "Malware"],
  ["acceso_no_autorizado", "Acceso no autorizado"],
  ["fuga_datos", "Fuga de datos"],
  ["disponibilidad", "Disponibilidad"],
  ["otro", "Otro"],
];

export default function DashboardPage() {
  const { session, incidents, loading, isAnalyst } = useApp();
  if (!session) return <WelcomePanel />;

  const active = incidents.filter((incident) => incident.status !== "resuelto").length;
  const open = incidents.filter((incident) => incident.status === "abierto").length;
  const inProgress = incidents.filter((incident) => incident.status === "en_progreso").length;
  const resolved = incidents.filter((incident) => incident.status === "resuelto").length;
  const critical = incidents.filter((incident) => incident.severity === "critica" && incident.status !== "resuelto").length;
  const recent = incidents.slice(0, 5);
  const categoryCounts = categories.map(([value, label]) => ({
    value,
    label,
    count: incidents.filter((incident) => getIncidentCategory(incident) === value).length,
  }));
  const severityCounts = severities.map((value) => ({
    value,
    count: incidents.filter((incident) => incident.severity === value).length,
  }));
  const maxCategory = Math.max(1, ...categoryCounts.map(({ count }) => count));
  const name = session.user.email?.split("@")[0] || "equipo SOC";

  return (
    <>
      <section className="hero-panel">
        <div>
          <p className="eyebrow"><span className="status-light" /> Centro de operaciones</p>
          <h1>Bienvenido, {name}</h1>
          <p className="page-description">
            {isAnalyst
              ? "Vista de analista: revisa, clasifica y da seguimiento a los incidentes registrados."
              : "Consulta el estado de tus reportes y registra cualquier incidente de seguridad."}
          </p>
        </div>
        <Link className="button button-primary" to="/incidentes/nuevo"><Plus size={17} /> Registrar incidente</Link>
      </section>

      <section className="metric-grid" aria-label="Resumen de incidentes">
        <Metric icon={ShieldAlert} label="Total de reportes" value={incidents.length} color="blue" />
        <Metric icon={Clock3} label="Pendientes" value={open} color="amber" hint="Abiertos para revisión" />
        <Metric icon={ArrowUpRight} label="En proceso" value={inProgress} color="blue" hint="Atención activa" />
        <Metric icon={CircleCheck} label="Resueltos" value={resolved} color="green" hint={`${active} activos`} />
      </section>

      {critical > 0 && (
        <div className="critical-banner">
          <Siren size={19} />
          <span><strong>{critical} {critical === 1 ? "incidente crítico" : "incidentes críticos"}</strong> aún requieren atención.</span>
          <Link to="/incidentes?severidad=critica">Revisar <ArrowRight size={14} /></Link>
        </div>
      )}

      <div className="dashboard-grid">
        <section className="card dashboard-card category-card">
          <div className="section-title"><div><p className="eyebrow">Distribución</p><h2>Incidentes por categoría</h2></div><span className="section-hint">{incidents.length} reportes</span></div>
          {incidents.length === 0 ? <p className="chart-empty">Las categorías aparecerán cuando los analistas clasifiquen los incidentes.</p> : (
            <div className="category-bars">
              {categoryCounts.filter(({ count }) => count > 0).sort((a, b) => b.count - a.count).map(({ value, label, count }) => (
                <div className="category-row" key={value}>
                  <div className="category-meta"><span>{label}</span><strong>{count}</strong></div>
                  <div className="bar-track"><span style={{ width: `${(count / maxCategory) * 100}%` }} /></div>
                </div>
              ))}
              {incidents.some((incident) => !incident.problem_category) && (
                <div className="category-row">
                  <div className="category-meta"><span>Sin clasificar</span><strong>{incidents.filter((incident) => !incident.problem_category).length}</strong></div>
                  <div className="bar-track"><span style={{ width: `${(incidents.filter((incident) => !incident.problem_category).length / maxCategory) * 100}%` }} /></div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="card dashboard-card priority-card">
          <div className="section-title"><div><p className="eyebrow">Severidad</p><h2>Prioridad de reportes</h2></div><ShieldCheck size={18} className="icon-muted" /></div>
          <div className="priority-list">
            {severityCounts.map(({ value, count }) => (
              <div className="priority-row" key={value}>
                <span className={`severity-pill severity-${value}`}>{formatLabel(value)}</span>
                <strong>{count}</strong>
                <span className="muted">{incidents.length ? `${Math.round((count / incidents.length) * 100)}%` : "0%"}</span>
              </div>
            ))}
          </div>
          <div className="card-footnote">Críticos activos: <strong>{critical}</strong></div>
        </section>
      </div>

      <section className="card recent-card">
        <div className="section-title">
          <div><p className="eyebrow">Actividad reciente</p><h2>Reportes recientes</h2></div>
          <Link className="text-link" to="/incidentes">Ver todos <ArrowRight size={15} /></Link>
        </div>
        {loading ? <div className="loading-state compact">Actualizando incidentes…</div> : recent.length === 0 ? (
          <div className="empty-inline"><ShieldCheck size={20} /><span>Aún no hay reportes. Cuando registres uno, aparecerá aquí.</span></div>
        ) : <IncidentTable incidents={recent} />}
      </section>
      <p className="data-footnote">La información de este panel corresponde a los incidentes visibles para tu cuenta.</p>
    </>
  );
}

function Metric({ icon: Icon, label, value, color, hint }) {
  return (
    <div className={`card metric-card metric-${color}`}>
      <div className="metric-top"><span>{label}</span><Icon size={17} /></div>
      <strong className="metric-value">{value}</strong>
      <span className="metric-hint">{hint || "Según los reportes visibles"}</span>
    </div>
  );
}

export function IncidentTable({ incidents, renderActions = null }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead><tr><th>Código</th><th>Incidente</th><th>Categoría</th><th>Prioridad</th><th>Estado</th><th>Actualizado</th><th aria-label="Acciones" /></tr></thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td><Link className="incident-code" to={`/seguimiento/${incident.id}`}>{incident.code}</Link></td>
              <td><Link className="incident-title" to={`/seguimiento/${incident.id}`}>{incident.title}</Link><span className="table-subtitle">{incident.source || "Sin origen indicado"}</span></td>
              <td>{incident.problem_category ? formatLabel(incident.problem_category) : <span className="muted">Sin clasificar</span>}</td>
              <td><span className={`severity-pill severity-${incident.severity}`}>{formatLabel(incident.severity)}</span></td>
              <td><span className={`status-pill status-${incident.status}`}>{formatLabel(incident.status)}</span></td>
              <td className="table-date">{formatDate(incident.updated_at)}</td>
              <td>{renderActions ? renderActions(incident) : <Link className="icon-button table-open" to={`/seguimiento/${incident.id}`} aria-label={`Ver ${incident.code}`}><ArrowRight size={16} /></Link>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WelcomePanel() {
  return (
    <div className="welcome-layout">
      <section className="hero-panel welcome-hero">
        <div>
          <p className="eyebrow"><span className="status-light" /> Plataforma de respuesta a incidentes</p>
          <h1>Protege y da seguimiento a tus reportes de seguridad</h1>
          <p className="page-description">Registra incidentes, consulta actualizaciones y colabora con el equipo de seguridad desde una sola consola.</p>
          <div className="welcome-actions"><Link className="button button-primary" to="/login">Iniciar sesión <ArrowRight size={16} /></Link><Link className="button button-outline" to="/ayuda">Explorar el centro de ayuda</Link></div>
        </div>
      </section>
      <section className="welcome-features">
        <div className="card feature-card"><ShieldAlert size={20} /><h2>Reporta</h2><p>Documenta un incidente y asigna una severidad inicial.</p></div>
        <div className="card feature-card"><Activity size={20} /><h2>Da seguimiento</h2><p>Consulta el estado actual y el historial de diagnóstico.</p></div>
        <div className="card feature-card"><ShieldCheck size={20} /><h2>Responde con control</h2><p>El acceso a cada reporte está protegido por roles y políticas RLS.</p></div>
      </section>
      <p className="data-footnote">Los reportes requieren iniciar sesión. El centro de ayuda está disponible sin cuenta.</p>
    </div>
  );
}

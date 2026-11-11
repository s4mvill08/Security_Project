import { useMemo, useState } from "react";
import { Download, Pencil, Plus, RefreshCw, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useApp } from "../context.jsx";
import { deleteIncident, formatLabel } from "../lib/incidents.js";
import { IncidentTable } from "./DashboardPage.jsx";

const statuses = ["abierto", "en_progreso", "contenido", "resuelto"];

function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export default function IncidentsPage() {
  const { incidents, loading, isAnalyst, session, refreshData, notify } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("buscar") || "";
  const status = searchParams.get("estado") || "";
  const severity = searchParams.get("severidad") || "";
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return incidents.filter((incident) => {
      const matchesSearch = !search || `${incident.code} ${incident.title} ${incident.description} ${incident.source || ""}`.toLowerCase().includes(search);
      return matchesSearch
        && (!status || incident.status === status)
        && (!severity || incident.severity === severity)
        && (!category || incident.problem_category === category);
    });
  }, [incidents, query, status, severity, category]);

  function updateFilter(key, value) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace: true });
  }

  async function handleDelete(incident) {
    if (!window.confirm(`¿Eliminar ${incident.code}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteIncident(incident.id);
      await refreshData();
      notify("Incidente eliminado.", "success");
    } catch (error) {
      notify(`No se pudo eliminar el incidente: ${error.message}`, "error");
    }
  }

  function clearFilters() {
    setCategory("");
    setSearchParams({});
  }

  function renderRowActions(incident) {
    if (incident.owner_user_id !== session?.user.id) return null;
    return (
      <div className="row-actions">
        {!isAnalyst && <Link className="icon-button" to={`/incidentes/${incident.id}/editar`} title={`Editar ${incident.code}`} aria-label={`Editar ${incident.code}`}><Pencil size={14} /></Link>}
        <button className="icon-button danger-icon" onClick={() => handleDelete(incident)} title={`Eliminar ${incident.code}`} aria-label={`Eliminar ${incident.code}`}><Trash2 size={14} /></button>
      </div>
    );
  }

  const visibleStatuses = statuses.map((value) => [value, incidents.filter((incident) => incident.status === value).length]);

  async function exportCsv() {
    const headers = ["Código", "Título", "Descripción", "Categoría", "Severidad", "Estado", "Origen", "Creado", "Actualizado"];
    const rows = filtered.map((incident) => [
      incident.code, incident.title, incident.description, incident.problem_category,
      incident.severity, incident.status, incident.source, incident.created_at, incident.updated_at,
    ]);
    const content = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "incidentes-sentinel.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Gestión de casos {isAnalyst && <span className="role-tag">Analista autorizado</span>}</p>
          <h1>Incidentes de seguridad</h1>
          <p className="page-description">{isAnalyst ? "Revisa los reportes disponibles para el equipo SOC." : "Consulta y administra los incidentes que registraste."}</p>
        </div>
        <div className="heading-actions">
          <button className="button button-outline" onClick={exportCsv} disabled={filtered.length === 0}><Download size={15} /> Exportar CSV</button>
          <button className="button button-outline" onClick={() => refreshData().catch((error) => notify(`No se pudo actualizar: ${error.message}`, "error"))}><RefreshCw size={15} /> Actualizar</button>
          <Link className="button button-primary" to="/incidentes/nuevo"><Plus size={16} /> Nuevo incidente</Link>
        </div>
      </div>

      <section className="status-summary" aria-label="Resumen por estado">
        <span className="summary-total">{incidents.length} reportes visibles</span>
        {visibleStatuses.map(([value, count]) => (
          <button key={value} className={`summary-status${status === value ? " selected" : ""}`} onClick={() => updateFilter("estado", status === value ? "" : value)}>
            <span className={`status-dot status-dot-${value}`} />{formatLabel(value)} <strong>{count}</strong>
          </button>
        ))}
      </section>

      <section className="card list-card">
        <div className="filters-row">
          <label className="filter-search"><Search size={16} /><input value={query} onChange={(event) => updateFilter("buscar", event.target.value)} placeholder="Buscar por código, título o descripción" /></label>
          <label className="filter-select"><span className="sr-only">Filtrar por categoría</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas las categorías</option><option value="phishing">Phishing</option><option value="malware">Malware</option><option value="acceso_no_autorizado">Acceso no autorizado</option><option value="fuga_datos">Fuga de datos</option><option value="disponibilidad">Disponibilidad</option><option value="otro">Otro</option></select></label>
          <label className="filter-select"><span className="sr-only">Filtrar por severidad</span><select value={severity} onChange={(event) => updateFilter("severidad", event.target.value)}><option value="">Todas las prioridades</option><option value="critica">Crítica</option><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select></label>
          <label className="filter-select"><span className="sr-only">Filtrar por estado</span><select value={status} onChange={(event) => updateFilter("estado", event.target.value)}><option value="">Todos los estados</option>{statuses.map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}</select></label>
          <button className="button button-quiet clear-filter" onClick={clearFilters}><SlidersHorizontal size={15} /> Limpiar</button>
        </div>
        {loading ? <div className="loading-state">Cargando incidentes…</div> : filtered.length ? (
          <>
            <IncidentTable incidents={filtered} renderActions={renderRowActions} />
            <div className="table-footer"><span>Mostrando {filtered.length} de {incidents.length} reportes</span><span>{isAnalyst ? "Vista de analista" : "Solo tus reportes pueden editarse o eliminarse"}</span></div>
          </>
        ) : (
          <div className="empty-state"><Search size={24} /><h2>No hay incidentes que coincidan</h2><p>Prueba con otros términos o borra los filtros.</p><button className="button button-outline" onClick={clearFilters}>Limpiar filtros</button></div>
        )}
      </section>
      <p className="data-footnote">Los incidentes visibles se limitan a tu cuenta o al alcance de tu autorización de analista.</p>
    </>
  );
}

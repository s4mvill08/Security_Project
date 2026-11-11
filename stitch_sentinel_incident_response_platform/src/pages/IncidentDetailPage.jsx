import { useEffect, useState } from "react";
import {
  Activity, ArrowLeft, CalendarClock, CircleCheck, ClipboardList, FileText,
  Pencil, ShieldAlert, UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context.jsx";
import {
  fetchIncidentHistory, formatDate, formatLabel, updateIncidentDiagnosis,
} from "../lib/incidents.js";

export default function IncidentDetailPage() {
  const { incidentId } = useParams();
  const { incidents, analysts, session, isAnalyst, loading, refreshData, notify } = useApp();
  const incident = incidents.find((item) => item.id === incidentId);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [diagnosisValues, setDiagnosisValues] = useState({});
  const canEdit = incident?.owner_user_id === session?.user.id && !isAnalyst;

  useEffect(() => {
    let active = true;
    if (!incidentId || !session) return undefined;
    setHistoryLoading(true);
    fetchIncidentHistory(incidentId)
      .then((rows) => { if (active) setHistory(rows); })
      .catch((error) => { if (active) notify(`No se pudo cargar el historial: ${error.message}`, "error"); })
      .finally(() => { if (active) setHistoryLoading(false); });
    return () => { active = false; };
  }, [incidentId, session, notify]);

  function handleDiagnosisChange(event) {
    setDiagnosisValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function saveDiagnosis(event) {
    event.preventDefault();
    if (!incident || !isAnalyst) return;
    const form = new FormData(event.currentTarget);
    const values = {
      severity: String(form.get("severity")),
      status: String(form.get("status")),
      problem_category: String(form.get("problemCategory")),
      diagnosis: String(form.get("diagnosis")).trim(),
      assigned_analyst_id: String(form.get("assignedAnalyst")) || null,
    };
    setSaving(true);
    try {
      const { historyError } = await updateIncidentDiagnosis(incident.id, values, session.user.id);
      await refreshData();
      const updatedHistory = await fetchIncidentHistory(incident.id);
      setHistory(updatedHistory);
      if (historyError) {
        notify(`El diagnóstico se guardó, pero no se pudo registrar en el historial: ${historyError.message}`, "error");
      } else {
        notify("Diagnóstico actualizado y añadido al historial.", "success");
      }
      setDiagnosisValues({});
    } catch (error) {
      notify(`No se pudo guardar el diagnóstico: ${error.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading-state">Cargando incidente…</div>;
  if (!incident) {
    return <section className="card empty-state"><ShieldAlert size={25} /><h1>Incidente no disponible</h1><p className="muted">No se encontró el reporte o no tienes permiso para consultarlo.</p><Link className="button button-outline" to="/incidentes"><ArrowLeft size={15} /> Volver a incidentes</Link></section>;
  }

  const assignedAnalyst = analysts.find((analyst) => analyst.id === incident.assigned_analyst_id);

  return (
    <div className="content-narrow">
      <div className="breadcrumb"><Link to="/">Dashboard</Link><span>/</span><Link to="/incidentes">Incidentes</Link><span>/</span><strong>{incident.code}</strong></div>
      <div className="detail-top-actions">
        <Link className="button button-quiet" to="/incidentes"><ArrowLeft size={15} /> Volver al listado</Link>
        {canEdit && <Link className="button button-outline" to={`/incidentes/${incident.id}/editar`}><Pencil size={15} /> Editar reporte</Link>}
      </div>
      <section className="card detail-hero">
        <div className="detail-labels"><span className="incident-code">{incident.code}</span><span className={`severity-pill severity-${incident.severity}`}>{formatLabel(incident.severity)}</span><span className={`status-pill status-${incident.status}`}>{formatLabel(incident.status)}</span></div>
        <h1>{incident.title}</h1>
        <div className="detail-meta"><span><CalendarClock size={14} /> Reportado {formatDate(incident.created_at)}</span><span><Activity size={14} /> Actualizado {formatDate(incident.updated_at)}</span></div>
      </section>

      <div className="detail-grid">
        <div className="detail-main">
          <section className="card detail-card">
            <div className="section-title"><div><p className="eyebrow">Reporte</p><h2>Descripción del incidente</h2></div><FileText size={18} className="icon-muted" /></div>
            <p className="description-copy">{incident.description}</p>
            <div className="detail-facts">
              <div><span>Origen o sistema</span><strong>{incident.source || "No indicado"}</strong></div>
              <div><span>Categoría</span><strong>{incident.problem_category ? formatLabel(incident.problem_category) : "Pendiente de clasificación"}</strong></div>
              <div><span>Responsable</span><strong>{assignedAnalyst ? `${assignedAnalyst.name} · ${assignedAnalyst.role}` : "Sin asignar"}</strong></div>
            </div>
          </section>
          <section className="card detail-card">
            <div className="section-title"><div><p className="eyebrow">Bitácora</p><h2>Historial de actualizaciones</h2></div><ClipboardList size={18} className="icon-muted" /></div>
            {historyLoading ? <p className="muted">Cargando historial…</p> : history.length === 0 ? (
              <div className="empty-inline"><Activity size={18} /><span>Aún no hay actualizaciones registradas para este incidente.</span></div>
            ) : (
              <ol className="timeline">
                {history.map((entry) => (
                  <li className="timeline-entry" key={entry.id}>
                    <span className={`timeline-marker timeline-${entry.event_type}`} />
                    <div className="timeline-content">
                      <div className="timeline-heading"><strong>{formatLabel(entry.event_type)}</strong><time>{formatDate(entry.created_at)}</time></div>
                      <p>{entry.message}</p>
                      <small>Cuenta responsable: {entry.performed_by || "No disponible"}</small>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="detail-aside">
          <section className="card response-card">
            <div className="section-title"><div><p className="eyebrow">Atención</p><h2>Estado del incidente</h2></div><CircleCheck size={18} className="icon-muted" /></div>
            <div className="response-status"><span className={`status-pill status-${incident.status}`}>{formatLabel(incident.status)}</span><span className="muted">Severidad {formatLabel(incident.severity).toLowerCase()}</span></div>
            {incident.diagnosis && <div className="diagnosis-preview"><span>Diagnóstico registrado</span><p>{incident.diagnosis}</p></div>}
            {canEdit && <p className="muted small-copy">Solo un analista autorizado puede cambiar la severidad, estado, clasificación o diagnóstico.</p>}
          </section>
          {isAnalyst && (
            <section className="card response-card analyst-card">
              <div className="section-title"><div><p className="eyebrow">Mesa SOC</p><h2>Actualizar diagnóstico</h2></div><UserRound size={18} className="icon-muted" /></div>
              <form className="form-stack" onSubmit={saveDiagnosis}>
                <label className="field"><span>Prioridad</span><select name="severity" value={diagnosisValues.severity ?? incident.severity} onChange={handleDiagnosisChange}><option value="critica">Crítica</option><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select></label>
                <label className="field"><span>Estado</span><select name="status" value={diagnosisValues.status ?? incident.status} onChange={handleDiagnosisChange}><option value="abierto">Abierto</option><option value="en_progreso">En proceso</option><option value="contenido">Contenido</option><option value="resuelto">Resuelto</option></select></label>
                <label className="field"><span>Categoría</span><select name="problemCategory" value={diagnosisValues.problemCategory ?? incident.problem_category ?? ""} onChange={handleDiagnosisChange} required><option value="">Selecciona una categoría</option><option value="phishing">Phishing</option><option value="malware">Malware</option><option value="acceso_no_autorizado">Acceso no autorizado</option><option value="fuga_datos">Fuga de datos</option><option value="disponibilidad">Disponibilidad</option><option value="otro">Otro</option></select></label>
                <label className="field"><span>Analista asignado</span><select name="assignedAnalyst" value={diagnosisValues.assignedAnalyst ?? incident.assigned_analyst_id ?? ""} onChange={handleDiagnosisChange}><option value="">Sin asignar</option>{analysts.map((analyst) => <option key={analyst.id} value={analyst.id}>{analyst.name} · {analyst.role}</option>)}</select></label>
                <label className="field"><span>Diagnóstico y hallazgos</span><textarea name="diagnosis" rows={5} maxLength={2000} value={diagnosisValues.diagnosis ?? incident.diagnosis ?? ""} onChange={handleDiagnosisChange} required placeholder="Documenta la causa identificada, evidencias revisadas y próximos pasos." /></label>
                <button className="button button-primary button-wide" disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
              </form>
            </section>
          )}
          <section className="card access-note"><ShieldAlert size={17} /><p>El historial y los cambios disponibles se controlan mediante las políticas de acceso de tu cuenta.</p></section>
        </aside>
      </div>
    </div>
  );
}

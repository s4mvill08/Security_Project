import { useState } from "react";
import { ArrowLeft, ArrowRight, Save, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createIncident, updateIncident } from "../lib/incidents.js";
import { useApp } from "../context.jsx";

export default function IncidentForm({ incident = null }) {
  const { session, isAnalyst, refreshData, notify } = useApp();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const canEdit = incident && incident.owner_user_id === session?.user.id && !isAnalyst;

  async function submitIncident(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      title: String(form.get("title")).trim(),
      description: String(form.get("description")).trim(),
      severity: String(form.get("severity")),
      source: String(form.get("source")).trim() || null,
    };
    setBusy(true);
    try {
      let savedIncident;
      if (incident) {
        await updateIncident(incident.id, values);
        savedIncident = incident;
      } else {
        savedIncident = await createIncident(values, session.user.id);
      }
      await refreshData();
      notify(incident ? "Incidente actualizado." : "Incidente registrado.", "success");
      navigate(`/seguimiento/${savedIncident.id}`);
    } catch (error) {
      notify(`No se pudo guardar el incidente: ${error.message}`, "error");
    } finally {
      setBusy(false);
    }
  }

  if (incident && !canEdit) {
    return (
      <section className="card empty-state">
        <ShieldAlert size={25} />
        <h1>Edición no disponible</h1>
        <p className="muted">Solo puedes editar los datos descriptivos de los reportes que creaste.</p>
        <Link className="button button-outline" to={`/seguimiento/${incident.id}`}>Volver al seguimiento</Link>
      </section>
    );
  }

  return (
    <div className="content-narrow">
      <div className="breadcrumb"><Link to="/">Dashboard</Link><span>/</span><Link to="/incidentes">Incidentes</Link><span>/</span><strong>{incident ? "Editar" : "Registrar"}</strong></div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Módulo de respuesta a incidentes</p>
          <h1>{incident ? "Editar incidente" : "Registrar nuevo incidente"}</h1>
          <p className="page-description">Describe lo ocurrido con la mayor claridad posible para facilitar el análisis y seguimiento.</p>
        </div>
        <span className="module-badge"><ShieldAlert size={15} /> SOC · IR</span>
      </div>
      <div className="priority-callout">
        <ShieldAlert size={19} />
        <div><strong>Protege la información sensible</strong><p>No incluyas contraseñas, tokens ni datos personales que no sean necesarios para investigar.</p></div>
      </div>
      <form className="card incident-form" onSubmit={submitIncident}>
        <div className="form-section">
          <span className="step-number">01</span>
          <div className="form-section-body">
            <div className="section-title"><h2>Información general</h2><span className="section-hint">Datos principales del reporte</span></div>
            <label className="field">
              <span>Título del incidente <i>*</i></span>
              <input name="title" maxLength={160} required defaultValue={incident?.title ?? ""} placeholder="Ej. Actividad sospechosa en una cuenta corporativa" />
            </label>
            <label className="field">
              <span>Origen o sistema involucrado</span>
              <input name="source" maxLength={100} defaultValue={incident?.source ?? ""} placeholder="Ej. SIEM, correo, endpoint, usuario" />
              <small>Opcional · máximo 100 caracteres</small>
            </label>
          </div>
        </div>
        <div className="form-section">
          <span className="step-number">02</span>
          <div className="form-section-body">
            <div className="section-title"><h2>Severidad</h2><span className="section-hint">Selecciona la prioridad inicial</span></div>
            <div className="severity-options">
              {[
                ["baja", "Baja", "Impacto limitado y sin afectación operativa."],
                ["media", "Media", "Afectación a un usuario o equipo aislado."],
                ["alta", "Alta", "Riesgo para varios usuarios o servicios."],
                ["critica", "Crítica", "Compromiso grave o servicio crítico afectado."],
              ].map(([value, label, hint]) => (
                <label key={value} className={`severity-option severity-${value}`}>
                  <input type="radio" name="severity" value={value} defaultChecked={incident?.severity === value || (!incident && value === "media")} />
                  <span className="severity-dot" /><strong>{label}</strong><small>{hint}</small>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="form-section">
          <span className="step-number">03</span>
          <div className="form-section-body">
            <div className="section-title"><h2>Descripción y evidencia</h2><span className="section-hint">No adjuntes información confidencial</span></div>
            <label className="field">
              <span>Descripción detallada <i>*</i></span>
              <textarea name="description" rows={7} maxLength={2000} required defaultValue={incident?.description ?? ""} placeholder="¿Qué ocurrió? ¿Cuándo lo detectaste? ¿Qué sistemas o usuarios están afectados?" />
              <small>Máximo 2000 caracteres. Incluye hechos observados y acciones realizadas.</small>
            </label>
          </div>
        </div>
        <div className="form-actions">
          <Link className="button button-outline" to={incident ? `/seguimiento/${incident.id}` : "/incidentes"}><ArrowLeft size={16} /> Cancelar</Link>
          <button className="button button-primary" disabled={busy}>
            {busy ? "Guardando..." : <><Save size={16} /> {incident ? "Guardar cambios" : "Registrar incidente"} <ArrowRight size={15} /></>}
          </button>
        </div>
      </form>
    </div>
  );
}

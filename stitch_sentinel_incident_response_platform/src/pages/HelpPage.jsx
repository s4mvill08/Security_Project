import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CircleAlert, CircleHelp, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const guides = [
  { code: "GUÍA 01", title: "Registrar un incidente", text: "Describe los hechos observados, indica el origen si lo conoces y selecciona una severidad inicial.", icon: CircleAlert },
  { code: "GUÍA 02", title: "Entender la severidad", text: "La severidad orienta la prioridad inicial. Un analista autorizado puede ajustarla tras revisar el impacto.", icon: ShieldCheck },
  { code: "GUÍA 03", title: "Consultar el seguimiento", text: "Abre un incidente para consultar su estado, clasificación, responsable y entradas disponibles en la bitácora.", icon: BookOpen },
  { code: "GUÍA 04", title: "Proteger tus datos", text: "No incluyas contraseñas, tokens ni datos personales innecesarios. Comparte evidencia por canales aprobados.", icon: ShieldCheck },
];

const severityRows = [
  ["critica", "Crítica", "Compromiso grave, exfiltración confirmada o afectación a un servicio crítico.", "Escalar inmediatamente al responsable de seguridad de tu organización."],
  ["alta", "Alta", "Intrusión sospechosa o afectación relevante en varios usuarios o sistemas.", "Notificar al equipo de seguridad y seguir sus instrucciones."],
  ["media", "Media", "Impacto acotado, actividad sospechosa bloqueada o incidente en un solo usuario.", "Registrar el caso para revisión y seguimiento."],
  ["baja", "Baja", "Evento de bajo impacto o consulta preventiva sin evidencia de compromiso.", "Documentar la observación y solicitar orientación cuando corresponda."],
];

const questions = [
  ["¿Qué debo hacer si sospecho que recibí un correo de phishing?", "No abras enlaces ni archivos adjuntos. Reporta el mensaje por el canal aprobado de tu organización y conserva los datos del remitente sin reenviar el contenido a otras personas."],
  ["¿Cómo consulto el avance de mi incidente?", "Inicia sesión, abre Incidentes y selecciona el código del reporte. La vista Seguimiento presenta el estado, el diagnóstico y las entradas de historial disponibles para tu cuenta."],
  ["¿Puedo cambiar la prioridad o el estado después de registrar un reporte?", "Puedes editar la descripción de tu propio reporte. Los cambios de severidad, estado, clasificación, asignación y diagnóstico están reservados a analistas autorizados."],
  ["¿Qué información no debo incluir en la descripción?", "No incluyas contraseñas, tokens de acceso, llaves privadas ni información personal ajena al análisis. Comparte evidencias sensibles usando los canales aprobados de tu organización."],
  ["¿A quién contacto ante un incidente crítico?", "Sigue el procedimiento de escalamiento y los datos de contacto definidos por tu organización. Esta plataforma no define ni sustituye los canales de emergencia de tu empresa."],
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filteredQuestions = useMemo(() => questions.filter(([question, answer]) => `${question} ${answer}`.toLowerCase().includes(normalized)), [normalized]);
  const filteredGuides = useMemo(() => guides.filter((guide) => `${guide.title} ${guide.text}`.toLowerCase().includes(normalized)), [normalized]);

  return (
    <>
      <section className="help-hero">
        <span className="help-badge"><BookOpen size={14} /> Guías de operación</span>
        <h1>Centro de ayuda y base de conocimiento</h1>
        <p>Orientación práctica para registrar, priorizar y consultar incidentes de seguridad.</p>
        <label className="help-search"><Search size={17} /><input aria-label="Buscar guías, severidad o preguntas frecuentes" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar guías, severidad o preguntas frecuentes" /></label>
      </section>

      <section className="guide-grid">
        {filteredGuides.map(({ code, title, text, icon: Icon }) => (
          <article className="card guide-card" key={code}><div className="guide-top"><span className="guide-icon"><Icon size={18} /></span><span className="guide-code">{code}</span></div><h2>{title}</h2><p>{text}</p>{title.includes("Registrar") && <Link className="guide-link" to="/incidentes/nuevo">Ir al formulario <ArrowRight size={14} /></Link>}</article>
        ))}
        {filteredGuides.length === 0 && <p className="empty-inline">No se encontraron guías para esa búsqueda.</p>}
      </section>

      <section className="section-block">
        <div className="section-title"><div><p className="eyebrow">Referencia rápida</p><h2>Orientación de severidad</h2></div><span className="section-hint">La prioridad final la define el equipo autorizado</span></div>
        <div className="card table-card table-scroll">
          <table className="data-table help-table"><thead><tr><th>Prioridad</th><th>Criterio orientativo</th><th>Acción recomendada</th></tr></thead><tbody>
            {severityRows.map(([value, severity, criteria, action]) => <tr key={value}><td><span className={`severity-pill severity-${value}`}>{severity}</span></td><td>{criteria}</td><td>{action}</td></tr>)}
          </tbody></table>
        </div>
      </section>

      <div className="help-bottom">
        <section className="section-block">
          <div className="section-title"><div><p className="eyebrow">Dudas operativas</p><h2>Preguntas frecuentes</h2></div><CircleHelp size={18} className="icon-muted" /></div>
          <div className="faq-list">
            {filteredQuestions.map(([question, answer]) => <details className="card faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
            {filteredQuestions.length === 0 && <p className="empty-inline">No se encontraron preguntas para esa búsqueda.</p>}
          </div>
        </section>
        <aside className="card help-contact">
          <span className="help-contact-icon"><CircleAlert size={20} /></span>
          <p className="eyebrow">Atención prioritaria</p>
          <h2>¿Necesitas reportar un incidente?</h2>
          <p>Para situaciones críticas, utiliza el canal de respuesta y escalamiento oficial de tu organización.</p>
          <Link className="button button-primary button-wide" to="/incidentes/nuevo">Registrar un incidente <ArrowRight size={15} /></Link>
          <small>Este portal no es un servicio de emergencia 24/7.</small>
        </aside>
      </div>
    </>
  );
}

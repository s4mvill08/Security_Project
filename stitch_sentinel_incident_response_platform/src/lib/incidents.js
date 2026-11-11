import { supabase } from "./supabase.js";

function requireSupabase() {
  if (!supabase) throw new Error("Configura las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
  return supabase;
}

export async function fetchIncidents() {
  const { data, error } = await requireSupabase()
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchAnalysts() {
  const { data, error } = await requireSupabase()
    .from("analysts")
    .select("id, name, role")
    .order("name");
  if (error) throw error;
  return data;
}

export async function fetchIncidentHistory(incidentId) {
  const { data, error } = await requireSupabase()
    .from("incident_updates")
    .select("id, event_type, message, performed_by, created_at")
    .eq("incident_id", incidentId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createIncident(values, ownerUserId) {
  const { data, error } = await requireSupabase()
    .from("incidents")
    .insert({ ...values, owner_user_id: ownerUserId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateIncident(incidentId, values) {
  const { error } = await requireSupabase()
    .from("incidents")
    .update(values)
    .eq("id", incidentId);
  if (error) throw error;
}

export async function deleteIncident(incidentId) {
  const { error } = await requireSupabase()
    .from("incidents")
    .delete()
    .eq("id", incidentId);
  if (error) throw error;
}

export async function updateIncidentDiagnosis(incidentId, values, userId) {
  const { error } = await requireSupabase()
    .from("incidents")
    .update(values)
    .eq("id", incidentId)
    .select("id")
    .single();
  if (error) throw error;

  const message = `${formatLabel(values.problem_category)}: ${values.diagnosis}`.slice(0, 1000);
  const historyResult = await requireSupabase()
    .from("incident_updates")
    .insert({
      incident_id: incidentId,
      event_type: "diagnostico",
      message,
      performed_by: userId,
    });

  return { historyError: historyResult.error };
}

export function formatLabel(value) {
  const labels = {
    critica: "Crítica",
    alta: "Alta",
    media: "Media",
    baja: "Baja",
    abierto: "Abierto",
    en_progreso: "En proceso",
    contenido: "Contenido",
    resuelto: "Resuelto",
    phishing: "Phishing",
    malware: "Malware",
    acceso_no_autorizado: "Acceso no autorizado",
    fuga_datos: "Fuga de datos",
    disponibilidad: "Disponibilidad",
    otro: "Otro",
    creado: "Creado",
    actualizado: "Actualizado",
    nota: "Nota",
    diagnostico: "Diagnóstico",
  };
  return labels[value] ?? value ?? "Sin clasificar";
}

export function formatDate(value, options = { dateStyle: "medium", timeStyle: "short" }) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-CO", options).format(new Date(value));
}

export function getIncidentCategory(incident) {
  return incident.problem_category || "sin_clasificar";
}

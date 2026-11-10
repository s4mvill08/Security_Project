// Reemplaza estos valores con la URL y la clave pública de tu proyecto Supabase.
const SUPABASE_URL = "https://eefmkfkntqdlkvlbueqm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GUKg35ZVSKqAtjpv-n_xbg_B-LSRHrC";

const isConfigured = !SUPABASE_URL.includes("TU-PROYECTO")
  && !SUPABASE_ANON_KEY.includes("TU-CLAVE-PUBLICA");
const client = isConfigured ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let currentUser = null;
let incidents = [];
let diagnosticIncidents = [];
let analystDirectory = [];
let isSecurityAnalyst = false;

// Muestra mensajes de éxito o error en la parte superior de la aplicación.
function showMessage(text, type = "success") {
  const message = document.querySelector("#message");
  message.textContent = text;
  message.className = `message ${type}`;
}

// Busca un incidente por su identificador sin cambiar la lista original.
function findIncident(incidentId) {
  for (const incident of incidents) {
    if (incident.id === incidentId) return incident;
  }
  return null;
}

// Limpia el mensaje anterior antes de empezar otra operación.
function clearMessage() {
  const message = document.querySelector("#message");
  message.textContent = "";
  message.className = "message hidden";
}

// Actualiza los paneles visibles cuando hay una sesión o se cierra sesión.
function updateScreen(session) {
  currentUser = session?.user ?? null;
  if (!currentUser) isSecurityAnalyst = false;
  document.querySelector("#loginPanel").classList.toggle("hidden", Boolean(currentUser) || !isConfigured);
  document.querySelector("#appPanel").classList.toggle("hidden", !currentUser);
  document.querySelector("#welcomePanel").classList.toggle("hidden", Boolean(currentUser) || !isConfigured);
  document.querySelector("#logoutButton").classList.toggle("hidden", !currentUser);
  document.querySelector("#diagnosticsNavigationLink").classList.toggle("hidden", !currentUser || !isSecurityAnalyst);
  if (!currentUser) showAppView("requests");
}

function showAppView(view) {
  if (view === "diagnostics" && (!currentUser || !isSecurityAnalyst)) {
    showMessage("El panel de diagnóstico es exclusivo para analistas autorizados.", "error");
    view = "requests";
  }

  document.querySelector("#requestsView").classList.toggle("hidden", view !== "requests");
  document.querySelector("#diagnosticsView").classList.toggle("hidden", view !== "diagnostics");
  for (const link of document.querySelectorAll("[data-app-view]")) {
    if (link.dataset.appView === view) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  const hash = view === "diagnostics" ? "#diagnostico" : "";
  if (window.location.hash !== hash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
  }
}

// La propia fila de acceso y las políticas RLS confirman el permiso de analista.
async function refreshAnalystAccess() {
  isSecurityAnalyst = false;
  document.querySelector("#diagnosticsNavigationLink").classList.add("hidden");
  if (currentUser) {
    const { data, error } = await client.from("analyst_access")
      .select("user_id").eq("user_id", currentUser.id).maybeSingle();
    if (error) throw error;
    isSecurityAnalyst = Boolean(data);
  }

  document.querySelector("#diagnosticsNavigationLink").classList.toggle("hidden", !currentUser || !isSecurityAnalyst);
  if (!isSecurityAnalyst && window.location.hash === "#diagnostico") showAppView("requests");
}

// Las políticas RLS devuelven al usuario solo sus reportes, o todos si es analista autorizado.
async function loadData() {
  await refreshAnalystAccess();
  const { data, error } = await client.from("incidents").select("*")
    .eq("owner_user_id", currentUser.id).order("created_at", { ascending: false });
  if (error) throw error;

  incidents = data;
  renderIncidents();
  if (isSecurityAnalyst) {
    await loadDiagnosticData();
    if (window.location.hash === "#diagnostico") showAppView("diagnostics");
  } else {
    diagnosticIncidents = [];
    analystDirectory = [];
  }
}

async function loadDiagnosticData() {
  const [incidentResult, analystResult] = await Promise.all([
    client.from("incidents")
      .select("id, code, title, description, severity, status, problem_category, diagnosis, assigned_analyst_id, created_at, updated_at, owner_user_id")
      .order("updated_at", { ascending: false }),
    client.from("analysts").select("id, name, role").order("name"),
  ]);
  if (incidentResult.error) throw incidentResult.error;
  if (analystResult.error) throw analystResult.error;

  diagnosticIncidents = incidentResult.data;
  analystDirectory = analystResult.data;
  renderDiagnosticIncidents();
}

// Dibuja la tabla, aplica los filtros actuales y actualiza los contadores.
function renderIncidents() {
  const query = document.querySelector("#searchInput").value.trim().toLowerCase();
  const selectedStatus = document.querySelector("#statusFilter").value;
  const visibleIncidents = [];
  let openCount = 0;
  let progressCount = 0;
  let criticalCount = 0;

  for (const incident of incidents) {
    const matchesText = `${incident.code} ${incident.title} ${incident.description}`.toLowerCase().includes(query);
    if (matchesText && (!selectedStatus || incident.status === selectedStatus)) visibleIncidents.push(incident);
    if (incident.status === "abierto") openCount += 1;
    if (incident.status === "en_progreso") progressCount += 1;
    if (incident.severity === "critica" && incident.status !== "resuelto") criticalCount += 1;
  }

  const rows = document.querySelector("#incidentRows");
  rows.replaceChildren();

  for (const incident of visibleIncidents) {
    const row = document.createElement("tr");
    const titleCell = document.createElement("td");
    const code = document.createElement("strong");
    const title = document.createElement("div");
    const severityCell = document.createElement("td");
    const severity = document.createElement("span");
    const statusCell = document.createElement("td");
    const dateCell = document.createElement("td");
    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");

    code.textContent = incident.code;
    title.textContent = incident.title;
    title.className = "muted small";
    titleCell.append(code, title);

    severity.textContent = formatLabel(incident.severity);
    severity.className = `badge badge-${incident.severity}`;
    severityCell.append(severity);
    statusCell.textContent = formatLabel(incident.status);
    dateCell.textContent = new Date(incident.created_at).toLocaleDateString("es");

    actions.className = "actions";
    actions.append(
      makeActionButton("Editar", "edit", incident.id),
      makeActionButton("Eliminar", "delete", incident.id, true),
    );
    actionsCell.append(actions);
    row.append(titleCell, severityCell, statusCell, dateCell, actionsCell);
    rows.append(row);
  }

  document.querySelector("#emptyMessage").classList.toggle("hidden", visibleIncidents.length > 0);
  document.querySelector("#totalCount").textContent = String(incidents.length);
  document.querySelector("#openCount").textContent = String(openCount);
  document.querySelector("#progressCount").textContent = String(progressCount);
  document.querySelector("#criticalCount").textContent = String(criticalCount);
}

// Convierte valores como "en_progreso" en etiquetas fáciles de leer.
function formatLabel(value) {
  const labels = {
    critica: "Crítica",
    alta: "Alta",
    media: "Media",
    baja: "Baja",
    abierto: "Abierto",
    en_progreso: "En progreso",
    contenido: "Contenido",
    resuelto: "Resuelto",
    creado: "Creado",
    actualizado: "Actualizado",
    nota: "Nota",
    diagnostico: "Diagnóstico",
    phishing: "Phishing",
    malware: "Malware",
    acceso_no_autorizado: "Acceso no autorizado",
    fuga_datos: "Fuga de datos",
    disponibilidad: "Disponibilidad",
    otro: "Otro",
  };
  return labels[value] ?? value;
}

function renderDiagnosticIncidents() {
  const query = document.querySelector("#diagnosticSearch").value.trim().toLocaleLowerCase("es");
  const selectedStatus = document.querySelector("#diagnosticStatusFilter").value;
  const visibleIncidents = diagnosticIncidents.filter((incident) => {
    const matchesText = `${incident.code} ${incident.title} ${incident.description}`.toLocaleLowerCase("es").includes(query);
    return matchesText && (!selectedStatus || incident.status === selectedStatus);
  });

  const rows = document.querySelector("#diagnosticRows");
  rows.replaceChildren();
  for (const incident of visibleIncidents) {
    const row = document.createElement("tr");
    const reportCell = document.createElement("td");
    const code = document.createElement("strong");
    const title = document.createElement("div");
    const severityCell = document.createElement("td");
    const categoryCell = document.createElement("td");
    const statusCell = document.createElement("td");
    const updatedCell = document.createElement("td");
    const diagnosisCell = document.createElement("td");
    const actionCell = document.createElement("td");

    code.textContent = incident.code;
    title.className = "muted small";
    title.textContent = incident.title;
    reportCell.append(code, title);
    severityCell.textContent = formatLabel(incident.severity);
    categoryCell.textContent = incident.problem_category ? formatLabel(incident.problem_category) : "Sin clasificar";
    statusCell.textContent = formatLabel(incident.status);
    updatedCell.textContent = new Date(incident.updated_at ?? incident.created_at).toLocaleDateString("es");
    diagnosisCell.className = "muted small";
    diagnosisCell.textContent = incident.diagnosis
      ? `${incident.diagnosis.slice(0, 85)}${incident.diagnosis.length > 85 ? "…" : ""}`
      : "Pendiente";
    actionCell.append(makeActionButton("Revisar", "diagnose", incident.id));
    row.append(reportCell, severityCell, categoryCell, statusCell, updatedCell, diagnosisCell, actionCell);
    rows.append(row);
  }

  document.querySelector("#diagnosticEmptyMessage").classList.toggle("hidden", visibleIncidents.length > 0);
  const openCount = diagnosticIncidents.filter((incident) => incident.status !== "resuelto").length;
  document.querySelector("#diagnosticsSummary").textContent =
    `${diagnosticIncidents.length} casos · ${openCount} pendientes de resolución`;
  renderAnalystOptions();
}

function renderAnalystOptions() {
  const select = document.querySelector("#diagnosticAssignedAnalyst");
  const selectedAnalyst = select.value;
  select.replaceChildren(new Option("Sin asignar", ""));
  for (const analyst of analystDirectory) {
    select.add(new Option(`${analyst.name} · ${analyst.role}`, analyst.id));
  }
  select.value = selectedAnalyst;
}

function openDiagnosticForm(incidentId) {
  if (!isSecurityAnalyst) {
    showMessage("No tienes autorización para acceder al panel de diagnóstico.", "error");
    return;
  }
  const incident = diagnosticIncidents.find((item) => item.id === incidentId);
  if (!incident) return;

  document.querySelector("#diagnosticForm").reset();
  document.querySelector("#diagnosticIncidentId").value = incident.id;
  document.querySelector("#diagnosticReportCode").textContent = incident.code;
  document.querySelector("#diagnosticReportTitle").textContent = incident.title;
  document.querySelector("#diagnosticReportDescription").textContent = incident.description;
  document.querySelector("#diagnosticSeverity").value = incident.severity;
  document.querySelector("#diagnosticStatus").value = incident.status;
  document.querySelector("#diagnosticCategory").value = incident.problem_category ?? "";
  document.querySelector("#diagnosticAssignedAnalyst").value = incident.assigned_analyst_id ?? "";
  document.querySelector("#diagnosticDiagnosis").value = incident.diagnosis ?? "";
  document.querySelector("#diagnosticDialog").showModal();
}

async function saveDiagnosis(event) {
  event.preventDefault();
  clearMessage();
  if (!currentUser || !isSecurityAnalyst) {
    showMessage("No tienes autorización para guardar diagnósticos.", "error");
    return;
  }

  const form = new FormData(event.currentTarget);
  const incidentId = form.get("incidentId");
  const diagnosis = form.get("diagnosis").trim();
  const problemCategory = form.get("problemCategory");
  const incidentUpdate = {
    severity: form.get("severity"),
    status: form.get("status"),
    problem_category: problemCategory,
    diagnosis,
    assigned_analyst_id: form.get("assignedAnalyst") || null,
  };

  let historyError = null;
  try {
    const { error } = await client.from("incidents").update(incidentUpdate)
      .eq("id", incidentId).select("id").single();
    if (error) throw error;

    const historyMessage = `${formatLabel(problemCategory)}: ${diagnosis}`.slice(0, 1000);
    const historyResult = await client.from("incident_updates").insert({
      incident_id: incidentId,
      event_type: "diagnostico",
      message: historyMessage,
      performed_by: currentUser.id,
    });
    historyError = historyResult.error;
  } catch (error) {
    showMessage("No se pudo guardar el diagnóstico: " + error.message, "error");
    return;
  }

  document.querySelector("#diagnosticDialog").close();
  try {
    await loadData();
  } catch (error) {
    showMessage("El diagnóstico se guardó, pero no se pudo actualizar la lista: " + error.message, "error");
    return;
  }
  if (historyError) {
    showMessage("El diagnóstico se guardó, pero no se pudo registrar en el historial: " + historyError.message, "error");
    return;
  }
  showMessage("Diagnóstico guardado y añadido al historial.");
}

// Crea un botón de acción vinculado al incidente sin insertar texto HTML dinámico.
function makeActionButton(label, action, id, isDanger = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `button button-small${isDanger ? " button-danger" : ""}`;
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
}

// Abre el formulario vacío o con los datos del incidente seleccionado.
function openIncidentForm(incident = null) {
  const form = document.querySelector("#incidentForm");
  form.reset();
  document.querySelector("#incidentId").value = incident?.id ?? "";
  document.querySelector("#incidentDialogTitle").textContent = incident ? "Editar solicitud" : "Nueva solicitud";

  if (incident) {
    document.querySelector("#title").value = incident.title;
    document.querySelector("#description").value = incident.description;
    document.querySelector("#severity").value = incident.severity;
    document.querySelector("#source").value = incident.source ?? "";
  }

  document.querySelector("#incidentDialog").showModal();
}

// Crea o actualiza una solicitud propia; Supabase aplica las mismas restricciones con RLS.
async function saveIncident(event) {
  event.preventDefault();
  clearMessage();
  if (!currentUser) {
    showMessage("Inicia sesión para administrar tus solicitudes.", "error");
    return;
  }

  const form = new FormData(event.currentTarget);
  const incidentId = form.get("incidentId");
  const incidentData = {
    title: form.get("title").trim(),
    description: form.get("description").trim(),
    severity: form.get("severity"),
    source: form.get("source").trim() || null,
  };

  try {
    if (incidentId) {
      const { error } = await client.from("incidents")
        .update(incidentData).eq("id", incidentId);
      if (error) throw error;
    } else {
      const { error } = await client.from("incidents")
        .insert({ ...incidentData, owner_user_id: currentUser.id });
      if (error) throw error;
    }

    document.querySelector("#incidentDialog").close();
    await loadData();
    showMessage(incidentId ? "Solicitud actualizada." : "Solicitud creada.");
  } catch (error) {
    showMessage("No se pudo guardar la solicitud: " + error.message, "error");
  }
}

// La base de datos impide eliminar solicitudes que pertenezcan a otra cuenta.
async function deleteIncident(incidentId) {
  const incident = findIncident(incidentId);
  if (!incident || !window.confirm(`¿Eliminar ${incident.code}? Esta acción no se puede deshacer.`)) return;

  try {
    const { error } = await client.from("incidents").delete().eq("id", incidentId);
    if (error) throw error;
    await loadData();
    showMessage("Solicitud eliminada.");
  } catch (error) {
    showMessage("No se pudo eliminar la solicitud: " + error.message, "error");
  }
}

// Inicia sesión con el correo y la contraseña de Supabase Authentication.
async function signIn(event) {
  event.preventDefault();
  clearMessage();
  const form = new FormData(event.currentTarget);
  try {
    const { error } = await client.auth.signInWithPassword({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (error) throw error;
    showMessage("Sesión iniciada.");
  } catch (error) {
    showMessage("No se pudo iniciar sesión: " + error.message, "error");
  }
}

// Crea una cuenta de práctica en Supabase Authentication.
async function signUp() {
  clearMessage();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;
  if (!email || password.length < 6) {
    showMessage("Escribe un correo y una contraseña de al menos 6 caracteres.", "error");
    return;
  }

  try {
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.session) showMessage("Cuenta creada. Revisa tu correo para confirmar el registro y luego inicia sesión.");
    else showMessage("Cuenta creada e inicio de sesión completado.");
  } catch (error) {
    showMessage("No se pudo crear la cuenta: " + error.message, "error");
  }
}

// Cierra la sesión activa en Supabase.
async function signOut() {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
  } catch (error) {
    showMessage("No se pudo cerrar sesión: " + error.message, "error");
  }
}

// Actualiza la pantalla cuando Supabase detecta un cambio de sesión.
function handleAuthChange(_event, session) {
  updateScreen(session);
  if (session) {
    setTimeout(() => loadData().catch(handleDataLoadError), 0);
  } else {
    incidents = [];
    diagnosticIncidents = [];
    analystDirectory = [];
  }
}

// Informa que falló la carga posterior a un cambio de sesión.
function handleDataLoadError(error) {
  showMessage("No se pudieron cargar los datos. Ejecuta el SQL de configuración: " + error.message, "error");
}

// Abre el formulario para crear un incidente.
function handleNewIncidentClick() {
  if (!currentUser) {
    showMessage("Inicia sesión para crear una solicitud.", "error");
    return;
  }
  openIncidentForm();
}

// Abre el formulario desde el menú cuando ya hay una sesión activa.
function handleReportNavigationClick(event) {
  if (!currentUser) return;
  event.preventDefault();
  openIncidentForm();
}

function handleAppNavigationClick(event) {
  const link = event.target.closest("a[data-app-view]");
  if (!link) return;
  event.preventDefault();
  showAppView(link.dataset.appView);
}

// Permite verificar la contraseña sin modificar el valor escrito.
function togglePasswordVisibility(event) {
  const button = event.currentTarget;
  const password = document.querySelector("#password");
  const isVisible = password.type === "password";
  password.type = isVisible ? "text" : "password";
  button.textContent = isVisible ? "Ocultar" : "Mostrar";
  button.setAttribute("aria-pressed", String(isVisible));
}

// Cierra el formulario de incidente sin guardar.
function handleCancelIncidentClick() {
  document.querySelector("#incidentDialog").close();
}

// Ejecuta la acción correspondiente al botón pulsado en la tabla.
function handleIncidentRowsClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === "edit") openIncidentForm(findIncident(id));
  if (action === "delete") deleteIncident(id);
}

function handleDiagnosticRowsClick(event) {
  const button = event.target.closest('button[data-action="diagnose"]');
  if (button) openDiagnosticForm(button.dataset.id);
}

function handleCancelDiagnosticClick() {
  document.querySelector("#diagnosticDialog").close();
}

// Conecta los eventos de los formularios y restaura la sesión al abrir la página.
async function startApp() {
  document.querySelector("#newIncidentButton").addEventListener("click", handleNewIncidentClick);
  document.querySelector("#cancelIncidentButton").addEventListener("click", handleCancelIncidentClick);
  document.querySelector("#incidentForm").addEventListener("submit", saveIncident);
  document.querySelector("#diagnosticForm").addEventListener("submit", saveDiagnosis);
  document.querySelector("#loginForm").addEventListener("submit", signIn);
  document.querySelector("#togglePassword").addEventListener("click", togglePasswordVisibility);
  document.querySelector("#signupButton").addEventListener("click", signUp);
  document.querySelector("#logoutButton").addEventListener("click", signOut);
  document.querySelector("#searchInput").addEventListener("input", renderIncidents);
  document.querySelector("#statusFilter").addEventListener("change", renderIncidents);
  document.querySelector("#incidentRows").addEventListener("click", handleIncidentRowsClick);
  document.querySelector("#diagnosticRows").addEventListener("click", handleDiagnosticRowsClick);
  document.querySelector("#diagnosticSearch").addEventListener("input", renderDiagnosticIncidents);
  document.querySelector("#diagnosticStatusFilter").addEventListener("change", renderDiagnosticIncidents);
  document.querySelector("#cancelDiagnosticButton").addEventListener("click", handleCancelDiagnosticClick);
  document.querySelector(".site-nav").addEventListener("click", handleAppNavigationClick);
  document.querySelector("#reportNavigationLink").addEventListener("click", handleReportNavigationClick);

  if (!isConfigured) {
    document.querySelector("#setupMessage").classList.remove("hidden");
    updateScreen(null);
    return;
  }

  client.auth.onAuthStateChange(handleAuthChange);
  const { data, error } = await client.auth.getSession();
  if (error) {
    showMessage("No se pudo comprobar la sesión: " + error.message, "error");
    return;
  }
  updateScreen(data.session);
  if (data.session) {
    await loadData();
    if (window.location.hash === "#loginPanel") openIncidentForm();
    else if (window.location.hash === "#diagnostico" && isSecurityAnalyst) showAppView("diagnostics");
  }
}

// Muestra errores que impidieron completar la inicialización de la página.
function handleStartupError(error) {
  showMessage("No se pudo iniciar la aplicación: " + error.message, "error");
}

startApp().catch(handleStartupError);

import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import AuthForm from "./components/AuthForm.jsx";
import { AppContext, useApp } from "./context.jsx";
import { isSupabaseConfigured, supabase } from "./lib/supabase.js";
import { fetchAnalysts, fetchIncidents } from "./lib/incidents.js";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import IncidentDetailPage from "./pages/IncidentDetailPage.jsx";
import IncidentForm from "./components/IncidentForm.jsx";
import IncidentsPage from "./pages/IncidentsPage.jsx";

function RequireAuth({ children }) {
  const { session, loading } = useApp();
  const location = useLocation();
  if (loading) return <div className="loading-state">Conectando con el centro de operaciones…</div>;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [analysts, setAnalysts] = useState([]);
  const [isAnalyst, setIsAnalyst] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [notice, setNotice] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setNotice({ message, type });
  }, []);

  const refreshData = useCallback(async () => {
    if (!session?.user) {
      setIncidents([]);
      setAnalysts([]);
      setIsAnalyst(false);
      return;
    }

    const [{ data: access, error: accessError }, incidentData] = await Promise.all([
      supabase.from("analyst_access").select("user_id").eq("user_id", session.user.id).maybeSingle(),
      fetchIncidents(),
    ]);
    if (accessError) throw accessError;

    const analystAccess = Boolean(access);
    const directory = analystAccess ? await fetchAnalysts() : [];
    setIncidents(incidentData);
    setAnalysts(directory);
    setIsAnalyst(analystAccess);
  }, [session]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setIncidents([]);
        setAnalysts([]);
        setIsAnalyst(false);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      setSession(data.session);
    }).catch((error) => {
      notify(`No se pudo comprobar la sesión: ${error.message}`, "error");
    }).finally(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, [notify]);

  useEffect(() => {
    let active = true;
    if (!session?.user) {
      setIncidents([]);
      setAnalysts([]);
      setIsAnalyst(false);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    refreshData()
      .catch((error) => {
        if (active) notify(`No se pudieron cargar los incidentes: ${error.message}`, "error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [session, refreshData, notify]);

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) notify(`No se pudo cerrar sesión: ${error.message}`, "error");
  }

  const contextValue = useMemo(() => ({
    supabase,
    isConfigured: isSupabaseConfigured,
    session,
    incidents,
    analysts,
    isAnalyst,
    loading,
    notice,
    notify,
    dismissNotice: () => setNotice(null),
    refreshData,
    signOut,
  }), [session, incidents, analysts, isAnalyst, loading, notice, notify, refreshData]);

  return (
    <AppContext.Provider value={contextValue}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="login" element={<AuthForm />} />
          <Route path="ayuda" element={<HelpPage />} />
          <Route path="incidentes" element={<RequireAuth><IncidentsPage /></RequireAuth>} />
          <Route path="incidentes/nuevo" element={<RequireAuth><IncidentForm /></RequireAuth>} />
          <Route path="incidentes/:incidentId/editar" element={<RequireAuth><IncidentFormRoute /></RequireAuth>} />
          <Route path="seguimiento" element={<RequireAuth><Navigate to="/incidentes" replace /></RequireAuth>} />
          <Route path="seguimiento/:incidentId" element={<RequireAuth><IncidentDetailPage /></RequireAuth>} />
          <Route path="estadisticas" element={<RequireAuth><AnalyticsPage /></RequireAuth>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}

function IncidentFormRoute() {
  const { incidents, loading } = useApp();
  const { pathname } = useLocation();
  const incidentId = pathname.split("/")[2];
  const incident = incidents.find((item) => item.id === incidentId);
  if (loading) return <div className="loading-state">Cargando incidente…</div>;
  if (!incident) return <div className="loading-state">No se encontró el incidente o no tienes permiso para verlo.</div>;
  return <IncidentForm incident={incident} />;
}

function NotFoundPage() {
  return (
    <section className="card empty-state">
      <h1>Página no encontrada</h1>
      <p className="muted">La ruta solicitada no existe.</p>
      <a className="button button-primary" href="/">Volver al dashboard</a>
    </section>
  );
}

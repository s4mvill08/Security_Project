import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity, BarChart3, CircleHelp, LayoutDashboard, LogOut, PlusCircle,
  Search, Shield, ShieldAlert, TicketCheck, UserRound,
} from "lucide-react";
import { useApp } from "../context.jsx";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/incidentes/nuevo", label: "Registrar incidente", icon: PlusCircle },
  { to: "/incidentes", label: "Incidentes", icon: ShieldAlert },
  { to: "/seguimiento", label: "Seguimiento", icon: Activity },
  { to: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { to: "/ayuda", label: "Ayuda", icon: CircleHelp },
];

export default function AppShell() {
  const { session, incidents, signOut, notice, dismissNotice, isAnalyst } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const activeCount = incidents.filter((incident) => incident.status !== "resuelto").length;

  function searchIncidents(event) {
    if (event.key === "Enter" && event.currentTarget.value.trim()) {
      navigate(`/incidentes?buscar=${encodeURIComponent(event.currentTarget.value.trim())}`);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="SENTINEL inicio">
          <span className="brand-mark"><Shield size={22} /></span>
          <span><strong>SENTINEL</strong><small>SOC · Seguridad</small></span>
        </NavLink>
        <div className="monitor-status"><span className="status-light" /> Consola operativa</div>
        <p className="nav-caption">Espacio de trabajo</p>
        <nav className="side-nav" aria-label="Navegación principal">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="footer-tag">{isAnalyst ? "ANALISTA SOC" : "GESTIÓN SEGURA"}</span>
          <p>Los permisos dependen de tu cuenta y de las políticas de Supabase.</p>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="global-search">
            <Search size={16} aria-hidden="true" />
            <input
              aria-label="Buscar incidentes"
              placeholder="Buscar por código, título o descripción..."
              onKeyDown={searchIncidents}
              key={`${location.pathname}${location.search}`}
            />
            <kbd>Enter</kbd>
          </div>
          <div className="topbar-status"><Shield size={15} /> Acceso protegido</div>
          {session ? (
            <div className="account-menu">
              <span className="account-avatar"><UserRound size={17} /></span>
              <span className="account-email">{session.user.email}</span>
              <button className="icon-button" onClick={signOut} title="Cerrar sesión" aria-label="Cerrar sesión">
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <NavLink className="button button-outline button-compact" to="/login">Iniciar sesión</NavLink>
          )}
        </header>

        <main className="page-content">
          {notice && (
            <div className={`notice notice-${notice.type}`} role="status" aria-live="polite">
              <span>{notice.message}</span>
              <button className="notice-dismiss" onClick={dismissNotice} aria-label="Cerrar mensaje">×</button>
            </div>
          )}
          {activeCount > 0 && (
            <div className="active-strip">
              <TicketCheck size={16} />
              <span><strong>{activeCount}</strong> {activeCount === 1 ? "incidente activo" : "incidentes activos"}</span>
              <span className="strip-note">Datos visibles según tu acceso</span>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

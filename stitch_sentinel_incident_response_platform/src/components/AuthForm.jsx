import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Shield } from "lucide-react";
import { useApp } from "../context.jsx";

export default function AuthForm() {
  const { supabase, session, isConfigured, notify } = useApp();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.from?.pathname || "/";

  if (session) return <div className="auth-page"><div className="card auth-card"><h1>Ya tienes una sesión activa</h1><Link className="button button-primary" to="/">Ir al dashboard <ArrowRight size={16} /></Link></div></div>;

  async function submitAuth(event) {
    event.preventDefault();
    if (!supabase) {
      notify("Configura la conexión a Supabase antes de iniciar sesión.", "error");
      return;
    }
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        notify("Sesión iniciada correctamente.", "success");
        navigate(destination, { replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        notify(
          data.session
            ? "Cuenta creada e inicio de sesión completado."
            : "Cuenta creada. Revisa tu correo para confirmar el registro.",
          "success",
        );
        if (data.session) navigate(destination, { replace: true });
      }
    } catch (error) {
      notify(`No se pudo ${mode === "login" ? "iniciar sesión" : "crear la cuenta"}: ${error.message}`, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="card auth-card">
        <span className="auth-icon"><Shield size={24} /></span>
        <p className="eyebrow">Acceso a la consola SOC</p>
        <h1>{mode === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}</h1>
        <p className="muted">{mode === "login"
          ? "Inicia sesión para consultar y gestionar tus incidentes."
          : "Regístrate con tu correo para crear y seguir tus reportes."}</p>
        {!isConfigured && (
          <div className="setup-callout" role="alert">
            <strong>Falta conectar Supabase</strong>
            <p>Configura <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en el archivo <code>.env</code>.</p>
          </div>
        )}
        <form className="form-stack" onSubmit={submitAuth}>
          <label className="field">
            <span>Correo electrónico</span>
            <span className="input-icon"><Mail size={16} /><input name="email" type="email" autoComplete="username" required /></span>
          </label>
          <label className="field">
            <span>Contraseña</span>
            <span className="input-icon"><LockKeyhole size={16} /><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required /></span>
          </label>
          <button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)}>
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          </button>
          <button className="button button-primary button-wide" disabled={busy || !isConfigured}>
            {busy ? "Procesando..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            <ArrowRight size={16} />
          </button>
        </form>
        <p className="auth-switch">
          {mode === "login" ? "¿Aún no tienes cuenta?" : "¿Ya tienes una cuenta?"}{" "}
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </section>
    </div>
  );
}

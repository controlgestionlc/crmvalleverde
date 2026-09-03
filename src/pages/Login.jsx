import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Field, inputClass } from "../components/ui";
import logo from "../assets/logo.png";

const ERROR_MESSAGES = {
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/user-not-found": "No existe una cuenta con ese correo.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/invalid-email": "El correo no es válido.",
};

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError("No se pudo iniciar sesión con Google.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Valle Verde Inmobiliaria" className="h-14 w-auto" />
        </div>

        <div className="bg-white border border-line rounded-lg p-6">
          <h1 className="font-display text-xl mb-1">
            {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
          </h1>
          <p className="text-sm text-ink/50 mb-6">
            {mode === "login" ? "Accede al CRM de Inmobiliaria Valle Verde." : "Regístrate para empezar a usar el CRM."}
          </p>

          <form onSubmit={handleSubmit}>
            <Field label="Correo">
              <input
                type="email"
                required
                autoComplete="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Contraseña">
              <input
                type="password"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={6}
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            {error && <p className="text-sm text-danger mb-4">{error}</p>}

            <Button type="submit" disabled={busy} className="w-full justify-center">
              {busy ? "Un momento…" : mode === "login" ? "Entrar" : "Crear cuenta"}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-line flex-1" />
            <span className="text-xs text-ink/40">o</span>
            <div className="h-px bg-line flex-1" />
          </div>

          <Button variant="ghost" onClick={handleGoogle} disabled={busy} className="w-full justify-center">
            Continuar con Google
          </Button>

          <p className="text-sm text-ink/50 text-center mt-6">
            {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button
              type="button"
              className="text-forest font-medium hover:underline"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            >
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

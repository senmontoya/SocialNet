import React, { useState } from "react";
import Navbar from "../components/navbar.jsx";
import { supabase } from "../supabaseClient.js";
import '../style/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      switch (error.message) {
        case "Invalid login credentials":
          setError("Correo o contraseña incorrectos. Por favor, verifica tus datos.");
          break;
        case "User not found":
          setError("No encontramos una cuenta con ese correo. ¿Estás registrado?");
          break;
        case "Too many requests":
          setError("Demasiados intentos. Espera un momento antes de intentar de nuevo.");
          break;
        default:
          setError("Algo salió mal al iniciar sesión. Intenta de nuevo más tarde.");
          console.error("Error no manejado:", error.message);
      }
    } else {
      window.location.href = '/dashboard'; 
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    });

    if (error) {
      switch (error.message) {
        case "Error getting user info":
          setError("No pudimos obtener tu información de Google. Intenta de nuevo.");
          break;
        case "OAuth provider error":
          setError("Hubo un problema con Google. Por favor, intenta más tarde.");
          break;
        default:
          setError("Algo salió mal al iniciar con Google. Intenta de nuevo.");
          console.error("Error no manejado:", error.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-login">
        <div className="login-form-container">
          <h2 className="mb-4 text-center">Iniciar Sesión</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-iniciarsesion">Iniciar Sesión</button>
            </div>

            <div className="text-center mt-3">
              <a href="#">Recuperar Contraseña</a>
            </div>
            <div className="text-center mt-2">
              ¿No tienes una cuenta? <a href="/register">Regístrate</a>
            </div>
          </form>

          <hr className="my-4" />

          <button 
            className="btn btn-outline-danger w-100"
            onClick={signInWithGoogle}
          >
            <i className="bi bi-google me-2"></i>
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
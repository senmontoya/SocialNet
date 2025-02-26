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
            setError(error.message);
        } else {
            window.location.href = '/dashboard'; // Redirect to dashboard on success
        }
    };

    const signInWithGoogle = async () => {
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + '/dashboard' },
        });

        if (error) setError(error.message);
    };

    return (
        <>
            <Navbar />
            <section className="login-section">
                <div className="container-login d-flex align-items-center justify-content-center w-100">
                    <div className="login-form-container p-5 mt-5 rounded shadow bg-light text-dark">
                        <h2 className="text-center mb-4 ank">Iniciar Sesión</h2>
                        
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
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

                            <div className="mb-4">
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

                            <div className="mb-4 form-check">
                                <input type="checkbox" name="connected" className="form-check-input" id="rememberMe" />
                                <label htmlFor="rememberMe" className="form-check-label">Recuérdame</label>
                            </div>

                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                            </div>

                            <div className="row text-center">
                              <span className="p-2"><a href="#">Recuperar Contraseña</a></span>
                              <span>¿No tienes una cuenta? <a href="/register">Regístrate</a></span>
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
            </section>
        </>
    );
}

export default Login;
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
            window.location.href = '/dashboard'; 
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

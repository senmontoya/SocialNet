import React, { useState } from "react";
import Navbar from "../components/navbar.jsx";
import logo from "../assets/img/logo.png";
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
            window.location.href = '/dashboard'; // Redirigir al dashboard si el login es exitoso
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
            <section>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="row w-100 shadow-lg bg-white rounded-4 overflow-hidden">
                    
                    {/* Sección del Formulario de Login */}
                    <div className="col-lg-7 col-md-12 p-5">
                        <h2 className="mb-4 text-center">Iniciar Sesión</h2>

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
                                <button type="submit" className="btn btn-iniciarsesion w-100">Iniciar Sesión</button>
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

                    {/* Sección del Logo */}
                    <div className="col-lg-5 d-none d-lg-flex bg-logo align-items-center justify-content-center">
                    <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "80%" }} />
                    </div>

                </div>
            </div>
            </section>
        </>
    );
}

export default Login;

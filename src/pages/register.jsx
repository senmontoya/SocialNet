import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";
import "../style/register.css";
import logo from "../assets/img/logo.png";


const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        country: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReview = () => {
        alert(`Revisando datos:\n${JSON.stringify(formData, null, 2)}`);
    };

    const handleGoogleRegister = () => {
        alert("Redirigiendo a Google para registrarse...");
    };

    return (
        <>
            <Navbar />

            <section className="register-section">
                <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
                    <div className="row w-100 shadow-lg bg-white rounded-4 overflow-hidden">
                        <div className="col-lg-7 col-md-12 p-5">
                            <h2 className="register-title text-center">Crea tu cuenta</h2>

                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de usuario</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Ej: JuanPerez"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="ejemplo@correo.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">País</label>
                                    <select
                                        className="form-select"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona tu país</option>
                                        <option value="SV">El Salvador</option>
                                        <option value="MX">México</option>
                                        <option value="US">Estados Unidos</option>
                                        <option value="AR">Argentina</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        placeholder="+503 7489-6356"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="button" className="btn btn-review" onClick={handleReview}>
                                        Revisar Datos
                                    </button>
                                    <button type="button" className="btn btn-google" onClick={handleGoogleRegister}>
                                        Registrarse con Google
                                    </button>
                                </div>

                                <p className="mt-3 text-center">
                                    ¿Ya tienes una cuenta?
                                    <a href="/login" className="text-primary text-decoration-none fw-bold">
                                        {" "}
                                        Iniciar sesión
                                    </a>
                                </p>
                            </form>
                        </div>

                        <div className=" col-lg-5 d-none d-lg-flex bg-section align-items-center justify-content-center">
                            <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "80%" }} />
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Register;

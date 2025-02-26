import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";
import "../style/register.css";
import logo from "../assets/img/logo.png";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    countryCode: "+503",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const hasRunRef = useRef(false); // Bandera para evitar doble ejecución

  const countryOptions = [
    { name: "Canadá", code: "+1", length: 10, formatExample: "416-555-1234" },
    { name: "Estados Unidos", code: "+1", length: 10, formatExample: "123-456-7890" },
    { name: "México", code: "+52", length: 10, formatExample: "55-1234-5678" },
    { name: "Belice", code: "+501", length: 7, formatExample: "123-4567" },
    { name: "Costa Rica", code: "+506", length: 8, formatExample: "1234-5678" },
    { name: "El Salvador", code: "+503", length: 8, formatExample: "7000-1234" },
    { name: "Guatemala", code: "+502", length: 8, formatExample: "1234-5678" },
    { name: "Honduras", code: "+504", length: 8, formatExample: "1234-5678" },
    { name: "Nicaragua", code: "+505", length: 8, formatExample: "1234-5678" },
    { name: "Panamá", code: "+507", length: 7, formatExample: "123-4567" },
    { name: "Argentina", code: "+54", length: 10, formatExample: "11-1234-5678" },
    { name: "Bolivia", code: "+591", length: 8, formatExample: "1234-5678" },
    { name: "Brasil", code: "+55", length: 11, formatExample: "11-91234-5678" },
    { name: "Chile", code: "+56", length: 9, formatExample: "9-1234-5678" },
    { name: "Colombia", code: "+57", length: 10, formatExample: "312-345-6789" },
    { name: "Ecuador", code: "+593", length: 9, formatExample: "9-1234-5678" },
    { name: "Guyana", code: "+592", length: 7, formatExample: "123-4567" },
    { name: "Paraguay", code: "+595", length: 9, formatExample: "981-234-567" },
    { name: "Perú", code: "+51", length: 9, formatExample: "912-345-678" },
    { name: "Surinam", code: "+597", length: 7, formatExample: "123-4567" },
    { name: "Uruguay", code: "+598", length: 8, formatExample: "91-234-567" },
    { name: "Venezuela", code: "+58", length: 10, formatExample: "412-345-6789" },
    { name: "Antigua y Barbuda", code: "+1-268", length: 7, formatExample: "123-4567" },
    { name: "Bahamas", code: "+1-242", length: 7, formatExample: "123-4567" },
    { name: "Barbados", code: "+1-246", length: 7, formatExample: "123-4567" },
    { name: "Cuba", code: "+53", length: 8, formatExample: "5-123-4567" },
    { name: "Dominica", code: "+1-767", length: 7, formatExample: "123-4567" },
    { name: "República Dominicana", code: "+1-809", length: 7, formatExample: "123-4567" },
    { name: "Granada", code: "+1-473", length: 7, formatExample: "123-4567" },
    { name: "Haití", code: "+509", length: 8, formatExample: "1234-5678" },
    { name: "Jamaica", code: "+1-876", length: 7, formatExample: "123-4567" },
    { name: "San Cristóbal y Nieves", code: "+1-869", length: 7, formatExample: "123-4567" },
    { name: "Santa Lucía", code: "+1-758", length: 7, formatExample: "123-4567" },
    { name: "San Vicente y las Granadinas", code: "+1-784", length: 7, formatExample: "123-4567" },
    { name: "Trinidad y Tobago", code: "+1-868", length: 7, formatExample: "123-4567" },
    { name: "Alemania", code: "+49", length: 10, formatExample: "151-234-5678" },
    { name: "España", code: "+34", length: 9, formatExample: "612-345-678" },
    { name: "Francia", code: "+33", length: 9, formatExample: "6-12-34-56-78" },
    { name: "Italia", code: "+39", length: 10, formatExample: "312-345-6789" },
    { name: "Reino Unido", code: "+44", length: 10, formatExample: "7123-456-789" },
    { name: "Países Bajos", code: "+31", length: 9, formatExample: "6-1234-5678" },
    { name: "Portugal", code: "+351", length: 9, formatExample: "912-345-678" },
    { name: "Rusia", code: "+7", length: 10, formatExample: "912-345-6789" },
    { name: "Suiza", code: "+41", length: 9, formatExample: "76-234-5678" },
  ];

  useEffect(() => {
    const checkSession = async () => {
      if (hasRunRef.current) return; // Evita doble ejecución
      hasRunRef.current = true;

      const { data: { session } } = await supabase.auth.getSession();
      console.log("useEffect - Sesión detectada:", session ? "Sí" : "No");
      if (session) {
        const { data: existingUsuario } = await supabase
          .from("usuarios")
          .select("id_usuario")
          .eq("id_registro", session.user.id)
          .single();
        if (existingUsuario) {
          console.log("useEffect - Usuario existente, navegando a /dashboard");
          navigate("/dashboard");
        } else {
          console.log("useEffect - Sesión activa pero no usuario completo, procesando OAuth");
          await handleOAuthCallback(session);
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "countryCode" ? { phone: "" } : {}),
    }));
  };

  const selectedCountry = countryOptions.find((c) => c.code === formData.countryCode);
  const isPhoneValid = formData.phone.length === selectedCountry?.length;

  const handleReview = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.email || !formData.password || !isPhoneValid) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }
    setShowModal(true);
  };

  const handleEmailSubmit = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      console.log("handleEmailSubmit - Iniciando registro por correo");
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { nick: formData.username } },
      });

      if (error) throw error;

      const userId = data.user.id;
      console.log("handleEmailSubmit - Usuario creado con ID:", userId);

      console.log("handleEmailSubmit - Insertando en usuarios_registro");
      const { error: registroError } = await supabase.from("usuarios_registro").insert({
        id_registro: userId,
        nick: formData.username,
        email: formData.email,
        fecha_registro: new Date().toISOString(),
      });
      if (registroError) throw registroError;

      console.log("handleEmailSubmit - Insertando en usuarios");
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .insert({ id_registro: userId, telefono: `${formData.countryCode}${formData.phone}` })
        .select()
        .single();
      if (usuarioError) throw usuarioError;

      setSuccess(true);
      setFormData({ username: "", email: "", password: "", countryCode: "+503", phone: "" });
      console.log("handleEmailSubmit - Limpiando sesión y navegando a /create-profile");
      await supabase.auth.signOut();
      navigate("/create-profile", { state: { userId: usuarioData.id_usuario } });
    } catch (error) {
      setError(error.message);
      console.error("handleEmailSubmit - Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    console.log("handleGoogleRegister - Iniciando registro con Google");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/register" },
    });
  };

  const handleOAuthCallback = async (session) => {
    const user = session.user;
    const userId = user.id;
    const email = user.email;
    const nick = user.user_metadata.full_name || email.split("@")[0];
    console.log("handleOAuthCallback - Procesando sesión para userId:", userId);

    const { data: existingRegistro } = await supabase
      .from("usuarios_registro")
      .select("id_registro")
      .eq("id_registro", userId)
      .single();

    if (!existingRegistro) {
      console.log("handleOAuthCallback - Insertando en usuarios_registro");
      const { error: registroError } = await supabase.from("usuarios_registro").insert({
        id_registro: userId,
        nick,
        email,
        fecha_registro: new Date().toISOString(),
      });
      if (registroError) throw registroError;

      console.log("handleOAuthCallback - Insertando en usuarios");
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .insert({ id_registro: userId, telefono: "No proporcionado" })
        .select()
        .single();
      if (usuarioError) throw usuarioError;

      console.log("handleOAuthCallback - Navegando a /create-profile");
      navigate("/create-profile", { state: { userId: usuarioData.id_usuario } });
    } else {
      console.log("handleOAuthCallback - Navegando a /dashboard");
      const { data: usuarioData } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("id_registro", userId)
        .single();
      navigate("/dashboard", { state: { userId: usuarioData.id_usuario } });
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <section className="register-section">
        <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
          <div className="row w-100 shadow-lg bg-white rounded-4 overflow-hidden">
            <div className="col-lg-7 col-md-12 p-5">
              <h2 className="register-title text-center">Crea tu cuenta</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">Registro exitoso</div>}
              {loading && <div className="alert alert-info">Cargando...</div>}

              <form onSubmit={handleReview}>
                <div className="mb-3">
                  <label className="form-label">Nombre de usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Ej: JuanPerez"
                    value={formData.username}
                    onChange={handleChange}
                    required
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
                    required
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
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">País</label>
                  <select
                    className="form-select"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona tu país</option>
                    {countryOptions.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Teléfono ({selectedCountry?.length} dígitos)
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    placeholder={selectedCountry?.formatExample}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={selectedCountry?.length}
                    pattern={`[0-9]{${selectedCountry?.length}}`}
                    title={`Ingresa exactamente ${selectedCountry?.length} dígitos`}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-review"
                    disabled={loading || !isPhoneValid}
                  >
                    Crear Cuenta
                  </button>
                  <button
                    type="button"
                    className="btn btn-google"
                    onClick={handleGoogleRegister}
                    disabled={loading}
                  >
                    Registrarse con Google
                  </button>
                </div>

                <p className="mt-3 text-center">
                  ¿Ya tienes una cuenta?{" "}
                  <a href="/login" className="text-primary text-decoration-none fw-bold">
                    Iniciar sesión
                  </a>
                </p>
              </form>
            </div>

            <div className="col-lg-5 d-none d-lg-flex bg-section align-items-center justify-content-center">
              <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "80%" }} />
            </div>
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirma tus datos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Nombre de usuario</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label">País</label>
              <select
                className="form-select"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
              >
                {countryOptions.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">
                Teléfono ({selectedCountry?.length} dígitos)
              </label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={selectedCountry?.length}
                placeholder={selectedCountry?.formatExample}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleEmailSubmit}
              disabled={!isPhoneValid}
            >
              Confirmar y registrar
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
};

export default Register;
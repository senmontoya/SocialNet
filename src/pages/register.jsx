import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";
import "../style/register.css";
import logo from "../assets/img/logo.png";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    countryCode: "+503",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const hasRunRef = useRef(false);

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
      if (hasRunRef.current) return;
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
          console.log("useEffect - Sesión activa pero no usuario completo, procesando callback");
          await handleCallback(session);
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

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const selectedCountry = countryOptions.find((c) => c.code === formData.countryCode);
  const isPhoneValid = formData.phone.length === selectedCountry?.length;

  const handleReview = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !isPhoneValid) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setShowModal(true);
  };

  const handleEmailSubmit = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      if (isBlocked) {
        setError("Has excedido el número de intentos. Por favor, intenta de nuevo más tarde.");
        console.log("handleEmailSubmit - Registro bloqueado por intentos fallidos");
        return;
      }

      console.log("handleEmailSubmit - Iniciando registro por correo");
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { nick: formData.username } },
      });

      if (error) {
        console.log("handleEmailSubmit - Error en signUp:", error.message);
        throw error;
      }

      console.log("handleEmailSubmit - Registro exitoso, procesando sesión");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("handleEmailSubmit - No se encontró sesión activa, intentando refrescar");
        const { data: refreshedSession } = await supabase.auth.refreshSession();
        if (!refreshedSession.session) throw new Error("No se pudo obtener sesión activa");
        await handleCallback(refreshedSession.session);
      } else {
        await handleCallback(session);
      }

      setSuccess(true);
      setFormData({ username: "", email: "", password: "", confirmPassword: "", countryCode: "+503", phone: "" });
      setFailedAttempts(0);
    } catch (error) {
      setFailedAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          setIsBlocked(true);
          setError("Has excedido el número de intentos. Por favor, espera antes de intentar de nuevo.");
          console.log("handleEmailSubmit - Bloqueo activado, intentos:", newAttempts);
        } else {
          setError(`Error: ${error.message}. Intentos restantes: ${5 - newAttempts}`);
          console.log("handleEmailSubmit - Intento fallido, restantes:", 5 - newAttempts);
        }
        return newAttempts;
      });
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

  const handleCallback = async (session) => {
    const user = session.user;
    const userId = user.id;
    const email = user.email;
    const nick = user.user_metadata.full_name || user.user_metadata.nick || email.split("@")[0];
    console.log("handleCallback - Procesando sesión para userId:", userId);

    const { data: existingRegistro } = await supabase
      .from("usuarios_registro")
      .select("id_registro")
      .eq("id_registro", userId)
      .single();

    if (!existingRegistro) {
      console.log("handleCallback - Insertando en usuarios_registro");
      const { error: registroError } = await supabase.from("usuarios_registro").insert({
        id_registro: userId,
        nick,
        email,
        fecha_registro: new Date().toISOString(),
      });
      if (registroError) throw registroError;

      console.log("handleCallback - Insertando en usuarios");
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .insert({ id_registro: userId, telefono: formData.phone ? `${formData.countryCode}${formData.phone}` : "No proporcionado" })
        .select()
        .single();
      if (usuarioError) throw usuarioError;

      console.log("handleCallback - Navegando a /create-profile con userId:", usuarioData.id_usuario);
      navigate("/create-profile", { state: { userId: usuarioData.id_usuario } });
    } else {
      console.log("handleCallback - Navegando a /dashboard");
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
              {isBlocked && (
                <div className="alert alert-warning">
                  Cuenta bloqueada por demasiados intentos fallidos. Intenta de nuevo más tarde.
                </div>
              )}

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
                    disabled={isBlocked}
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
                    disabled={isBlocked}
                  />
                </div>

                <div className="mb-3 position-relative">
                  <label className="form-label">Contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isBlocked}
                  />
                  <span
                    onClick={toggleShowPassword}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "70%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </span>
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isBlocked}
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
                    disabled={isBlocked}
                  >
                    <option value="">Selecciona tu país</option>
                    {countryOptions.map((country) => (
                      <option key={`${country.code}-${country.name}`} value={country.code}>
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
                    disabled={isBlocked}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-review"
                    disabled={loading || !isPhoneValid || isBlocked}
                  >
                    Crear Cuenta
                  </button>
                  <button
                    type="button"
                    className="btn btn-google d-flex align-items-center justify-content-center"
                    onClick={handleGoogleRegister}
                    disabled={loading || isBlocked}
                  >
                    <i className="bi bi-google me-2"></i>
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
                  <option key={`${country.code}-${country.name}`} value={country.code}>
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
              disabled={!isPhoneValid || isBlocked}
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
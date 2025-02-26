import React, { useState, useEffect } from "react";
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

  const countryOptions = [
    { name: "El Salvador", code: "+503", length: 8, formatExample: "7000-1234" },
    { name: "México", code: "+52", length: 10, formatExample: "55-1234-5678" },
    { name: "Estados Unidos", code: "+1", length: 10, formatExample: "123-456-7890" },
    { name: "Argentina", code: "+54", length: 10, formatExample: "11-1234-5678" },
  ];

  useEffect(() => {
    const checkSessionAndHandleCallback = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        setError(`Error getting session: ${error.message}`);
        return;
      }
      if (sessionData.session) {
        handleOAuthCallback(sessionData.session);
      }
    };
    checkSessionAndHandleCallback();
  }, []);

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

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!isPhoneValid) {
      setError(`Phone number must be ${selectedCountry.length} digits for ${selectedCountry.name}.`);
      return;
    }

    setShowModal(true);
  };

  const handleEmailSubmit = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { nick: formData.username },
        },
      });

      if (authError) {
        throw new Error(
          authError.message.includes("already registered")
            ? "This email is already registered. Try logging in."
            : "Could not create your account. Please try again."
        );
      }
      if (!authData.user) throw new Error("There was a problem creating your account.");

      const userId = authData.user.id;

      // Use upsert instead of insert to avoid duplicate key errors
      const { error: registroError } = await supabase
        .from("usuarios_registro")
        .upsert(
          {
            id_registro: userId,
            nick: formData.username,
            email: formData.email,
            fecha_registro: new Date().toISOString(),
          },
          { onConflict: "id_registro" } // Specify the conflict target
        );

      if (registroError) {
        throw new Error("Error saving your data in usuarios_registro: " + registroError.message);
      }

      // Check if the user already exists in usuarios before inserting
      const { data: existingUsuario, error: checkUsuarioError } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("id_registro", userId)
        .single();

      let usuarioData;
      if (!existingUsuario) {
        const { data, error: usuarioError } = await supabase
          .from("usuarios")
          .insert({
            id_registro: userId,
            telefono: `${formData.countryCode}${formData.phone}`,
          })
          .select()
          .single();

        if (usuarioError) throw new Error("Error saving your phone number in usuarios: " + usuarioError.message);
        usuarioData = data;
      } else {
        usuarioData = existingUsuario;
      }

      setSuccess(true);
      setFormData({ username: "", password: "", email: "", phone: "", countryCode: "+503" });
      navigate("/create-profile", { state: { userId: usuarioData.id_usuario } });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173/register",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw new Error("Could not connect with Google. Please try again.");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleOAuthCallback = async (session) => {
    setLoading(true);

    try {
      const user = session.user;
      const userId = user.id;
      const email = user.email;
      const nick = user.user_metadata.full_name || email.split("@")[0];

      // Use upsert to handle existing records
      const { error: registroError } = await supabase
        .from("usuarios_registro")
        .upsert(
          {
            id_registro: userId,
            nick: nick,
            email: email,
            fecha_registro: new Date().toISOString(),
          },
          { onConflict: "id_registro" }
        );

      if (registroError) throw new Error("Error saving in usuarios_registro: " + registroError.message);

      // Check if the user exists in usuarios before inserting
      const { data: existingUsuario, error: checkUsuarioError } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("id_registro", userId)
        .single();

      let usuarioData;
      if (!existingUsuario) {
        const { data, error: usuarioError } = await supabase
          .from("usuarios")
          .insert({
            id_registro: userId,
            telefono: "Not provided",
          })
          .select()
          .single();
        if (usuarioError) throw new Error("Error saving in usuarios: " + usuarioError.message);
        usuarioData = data;
      } else {
        usuarioData = existingUsuario;
      }

      setSuccess(true);
      navigate("/create-profile", { state: { userId: usuarioData.id_usuario } });
      window.history.replaceState({}, document.title, "/register");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // The rest of your JSX remains unchanged
  return (
    <>
      <Navbar />
      <section className="register-section">
        <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
          <div className="row w-100 shadow-lg bg-white rounded-4 overflow-hidden">
            <div className="col-lg-7 col-md-12 p-5">
              <h2 className="register-title text-center">Crea tu cuenta</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">Registration successful</div>}
              {loading && <div className="alert alert-info">Loading...</div>}

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
                    title={`Enter exactly ${selectedCountry?.length} digits`}
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
                Teléfono ({selectedCountry.length} dígitos)
              </label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={selectedCountry.length}
                placeholder={selectedCountry.formatExample}
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
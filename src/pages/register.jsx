// src/components/Register.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Register() {
  const [formData, setFormData] = useState({
    nick: '',
    password: '',
    email: '',
    phone: '',
    countryCode: '+503'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionAndHandleCallback = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        setError(`Error al obtener la sesión: ${error.message}`);
        return;
      }
      if (sessionData.session) {
        handleOAuthCallback(sessionData.session);
      }
    };
    checkSessionAndHandleCallback();
  }, []);

  const countryOptions = [
    { name: 'Canadá', code: '+1', length: 10, formatExample: '416-555-1234' },
    { name: 'Estados Unidos', code: '+1', length: 10, formatExample: '123-456-7890' },
    { name: 'México', code: '+52', length: 10, formatExample: '55-1234-5678' },
    { name: 'Belice', code: '+501', length: 7, formatExample: '123-4567' },
    { name: 'Costa Rica', code: '+506', length: 8, formatExample: '1234-5678' },
    { name: 'El Salvador', code: '+503', length: 8, formatExample: '7000-1234' },
    { name: 'Guatemala', code: '+502', length: 8, formatExample: '1234-5678' },
    { name: 'Honduras', code: '+504', length: 8, formatExample: '1234-5678' },
    { name: 'Nicaragua', code: '+505', length: 8, formatExample: '1234-5678' },
    { name: 'Panamá', code: '+507', length: 7, formatExample: '123-4567' },
    { name: 'Argentina', code: '+54', length: 10, formatExample: '11-1234-5678' },
    { name: 'Bolivia', code: '+591', length: 8, formatExample: '1234-5678' },
    { name: 'Brasil', code: '+55', length: 11, formatExample: '11-91234-5678' },
    { name: 'Chile', code: '+56', length: 9, formatExample: '9-1234-5678' },
    { name: 'Colombia', code: '+57', length: 10, formatExample: '312-345-6789' },
    { name: 'Ecuador', code: '+593', length: 9, formatExample: '9-1234-5678' },
    { name: 'Guyana', code: '+592', length: 7, formatExample: '123-4567' },
    { name: 'Paraguay', code: '+595', length: 9, formatExample: '981-234-567' },
    { name: 'Perú', code: '+51', length: 9, formatExample: '912-345-678' },
    { name: 'Surinam', code: '+597', length: 7, formatExample: '123-4567' },
    { name: 'Uruguay', code: '+598', length: 8, formatExample: '91-234-567' },
    { name: 'Venezuela', code: '+58', length: 10, formatExample: '412-345-6789' },
    { name: 'Antigua y Barbuda', code: '+1-268', length: 7, formatExample: '123-4567' },
    { name: 'Bahamas', code: '+1-242', length: 7, formatExample: '123-4567' },
    { name: 'Barbados', code: '+1-246', length: 7, formatExample: '123-4567' },
    { name: 'Cuba', code: '+53', length: 8, formatExample: '5-123-4567' },
    { name: 'Dominica', code: '+1-767', length: 7, formatExample: '123-4567' },
    { name: 'República Dominicana', code: '+1-809', length: 7, formatExample: '123-4567' },
    { name: 'Granada', code: '+1-473', length: 7, formatExample: '123-4567' },
    { name: 'Haití', code: '+509', length: 8, formatExample: '1234-5678' },
    { name: 'Jamaica', code: '+1-876', length: 7, formatExample: '123-4567' },
    { name: 'San Cristóbal y Nieves', code: '+1-869', length: 7, formatExample: '123-4567' },
    { name: 'Santa Lucía', code: '+1-758', length: 7, formatExample: '123-4567' },
    { name: 'San Vicente y las Granadinas', code: '+1-784', length: 7, formatExample: '123-4567' },
    { name: 'Trinidad y Tobago', code: '+1-868', length: 7, formatExample: '123-4567' },
    { name: 'Alemania', code: '+49', length: 10, formatExample: '151-234-5678' },
    { name: 'España', code: '+34', length: 9, formatExample: '612-345-678' },
    { name: 'Francia', code: '+33', length: 9, formatExample: '6-12-34-56-78' },
    { name: 'Italia', code: '+39', length: 10, formatExample: '312-345-6789' },
    { name: 'Reino Unido', code: '+44', length: 10, formatExample: '7123-456-789' },
    { name: 'Países Bajos', code: '+31', length: 9, formatExample: '6-1234-5678' },
    { name: 'Portugal', code: '+351', length: 9, formatExample: '912-345-678' },
    { name: 'Rusia', code: '+7', length: 10, formatExample: '912-345-6789' },
    { name: 'Suiza', code: '+41', length: 9, formatExample: '76-234-5678' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === 'countryCode' ? { phone: '' } : {})
    }));
  };

  const selectedCountry = countryOptions.find(c => c.code === formData.countryCode);
  const isPhoneValid = formData.phone.length === selectedCountry?.length;

  const handleEmailPreview = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.nick || !formData.email || !formData.password) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (!isPhoneValid) {
      setError(`El número de teléfono debe tener ${selectedCountry.length} dígitos para ${selectedCountry.name}.`);
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
          data: { nick: formData.nick }
        }
      });

      if (authError) {
        throw new Error(authError.message.includes('already registered') ? 
          'Este correo ya está registrado. Intenta iniciar sesión.' : 
          'No pudimos crear tu cuenta. Por favor, intenta de nuevo.');
      }
      if (!authData.user) throw new Error('Ocurrió un problema al crear tu cuenta.');

      const userId = authData.user.id;

      const { error: registroError } = await supabase
        .from('usuarios_registro')
        .insert({
          id_registro: userId,
          nick: formData.nick,
          email: formData.email,
          fecha_registro: new Date().toISOString()
        });

      if (registroError) {
        throw new Error(registroError.message.includes('duplicate key') ? 
          'El nombre de usuario o correo ya está en uso.' : 
          'Error al guardar tus datos en usuarios_registro.');
      }

      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          id_registro: userId,
          telefono: `${formData.countryCode}${formData.phone}`
        })
        .select()
        .single();

      if (usuarioError) throw new Error('Error al guardar tu número de teléfono en usuarios.');

      // No creamos perfil aquí, lo dejamos para /create-profile
      setSuccess(true);
      setFormData({ nick: '', password: '', email: '', phone: '', countryCode: '+503' });
      navigate('/create-profile', { state: { userId: usuarioData.id_usuario } });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:5173/register',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw new Error('No pudimos conectar con Google. Intenta de nuevo.');
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
      const nick = user.user_metadata.full_name || email.split('@')[0];

      const { data: existingRegistro, error: checkError } = await supabase
        .from('usuarios_registro')
        .select('id_registro')
        .eq('id_registro', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error('Error al verificar tu registro: ' + checkError.message);
      }

      let usuarioData;
      if (!existingRegistro) {
        const { error: registroError } = await supabase
          .from('usuarios_registro')
          .insert({
            id_registro: userId,
            nick: nick,
            email: email,
            fecha_registro: new Date().toISOString()
          });
        if (registroError) throw new Error('Error al guardar en usuarios_registro: ' + registroError.message);

        const { data, error: usuarioError } = await supabase
          .from('usuarios')
          .insert({
            id_registro: userId,
            telefono: 'No proporcionado'
          })
          .select()
          .single();
        if (usuarioError) throw new Error('Error al guardar en usuarios: ' + usuarioError.message);
        usuarioData = data;
      } else {
        const { data, error: usuarioError } = await supabase
          .from('usuarios')
          .select('id_usuario')
          .eq('id_registro', userId)
          .single();
        if (usuarioError) throw new Error('Error al recuperar tu perfil: ' + usuarioError.message);
        usuarioData = data;
      }

      
      setSuccess(true);
      navigate('/create-profile', { state: { userId: usuarioData.id_usuario } });
      window.history.replaceState({}, document.title, '/register');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Únete a SocialNet</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">Registro exitoso</div>}
              {loading && <div className="alert alert-info">Cargando...</div>}

              <form onSubmit={handleEmailPreview}>
                <div className="mb-3">
                  <label htmlFor="nick" className="form-label">Nombre de usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nick"
                    name="nick"
                    value={formData.nick}
                    onChange={handleChange}
                    required
                    placeholder="Nombre de usuario"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo electronico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@eSync.com"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Mínimo 12 caracteres"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="countryCode" className="form-label">Pais</label>
                  <select
                    className="form-select"
                    id="countryCode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    required
                  >
                    {countryOptions.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Telefono ({selectedCountry.length} digitos)
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={selectedCountry.length}
                    placeholder={selectedCountry.formatExample}
                    pattern={`[0-9]{${selectedCountry.length}}`}
                    title={`Ingresa exactamente ${selectedCountry.length} dígitos`}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading || !isPhoneValid}>
                  Crear cuenta
                </button>
              </form>

              <button
                onClick={handleGoogleSignIn}
                className="btn btn-outline-dark w-100"
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-google me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                </svg>
                Registrarse con Google
              </button>
            </div>
            <div className="card-footer text-muted text-center">
              ¿Ya tienes cuenta? <a href="/login">Inicia sesion</a>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirma tus datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="modalNick" className="form-label">Nombre de usuario</label>
            <input
              type="text"
              className="form-control"
              id="modalNick"
              name="nick"
              value={formData.nick}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="modalEmail" className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="modalEmail"
              name="email"
              value={formData.email}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="modalCountryCode" className="form-label">País</label>
            <select
              className="form-select"
              id="modalCountryCode"
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
            <label htmlFor="modalPhone" className="form-label">
              Teléfono ({selectedCountry.length} dígitos)
            </label>
            <input
              type="tel"
              className="form-control"
              id="modalPhone"
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
          <Button variant="primary" onClick={handleEmailSubmit} disabled={!isPhoneValid}>
            Confirmar y registrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Register;
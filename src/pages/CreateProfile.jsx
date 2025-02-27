import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import "../style/createprofile.css"
import Navbar from '../components/navbar';
import logo from "../assets/img/logo.png";


function CreateProfile() {
  const [formData, setFormData] = useState({
    url_pagina_web: '',
    ciudad: '',
    descripcion: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  useEffect(() => {
    const checkSessionAndUserId = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session || !userId) {
        setError('Debes estar autenticado y registrado para crear un perfil.');
        navigate('/register');
      }
    };
    checkSessionAndUserId();
  }, [navigate, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!userId) {
      setError('No se pudo identificar tu cuenta. Por favor, regístrate de nuevo.');
      setLoading(false);
      return;
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('No estás autenticado. Por favor, inicia sesión nuevamente.');
      }

      const { data: existingProfile, error: checkError } = await supabase
        .from('perfiles')
        .select('id_perfil')
        .eq('id_usuario', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error('Error al verificar el perfil existente: ' + checkError.message);
      }

      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('perfiles')
          .insert({
            id_usuario: userId,
            url_pagina_web: formData.url_pagina_web || null,
            ciudad: formData.ciudad || null,
            descripcion: formData.descripcion || null
          });

        if (insertError) {
          throw new Error('No pudimos guardar tu perfil. Intenta de nuevo.');
        }
      } else {
        setError('Ya tienes un perfil creado. Redirigiendo...');
        navigate('/dashboard');
        return;
      }

      setSuccess(true);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="create-profile-section">
        <div className="container vh-100 d-flex justify-content-center align-items-center">
          <div className="row w-75 shadow-lg bg-white rounded-4 overflow-hidden">

            {/* Sección izquierda - Formulario */}
            <div className="col-md-7 p-5 create-profile-form-container">
              <h2 className="mb-4 text-center">Completa tu perfil</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">¡Perfil creado exitosamente!</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Página web (opcional)</label>
                  <input
                    type="url"
                    className="form-control"
                    name="url_pagina_web"
                    placeholder="https://tuweb.com"
                    value={formData.url_pagina_web}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Ciudad (opcional)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ciudad"
                    placeholder="Ejemplo: San Salvador"
                    value={formData.ciudad}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción (opcional)</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    placeholder="Cuéntanos sobre ti..."
                    rows="3"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn create-profile-btn" disabled={loading}>
                    Guardar perfil
                  </button>
                </div>
              </form>
            </div>

            {/* Sección derecha - Texto "CREA TU PERFIL" y Logo */}
            <div className="col-md-5 d-flex flex-column align-items-center justify-content-center text-white create-profile-right-section">
              <h1 className="text-uppercase text-center fw-bold mb-4">¡Únete creando un perfil!</h1>
              <img src={logo} alt="Logo" className="create-profile-logo"/>
            </div>

          </div>
        </div>
      </section>
    </>
  );

}

export default CreateProfile;

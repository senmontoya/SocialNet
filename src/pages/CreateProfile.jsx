// src/components/CreateProfile.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import "../style/createprofile.css"

function CreateProfile() {
  const [formData, setFormData] = useState({
    url_pagina_web: '',
    ciudad: '',
    pais: '',
    fecha_nacimiento: '',
    foto_perfil: null,
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
      [name]: name === 'foto_perfil' ? e.target.files[0] : value
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

      // Verificar si ya existe un perfil para este usuario
      const { data: existingProfile, error: checkError } = await supabase
        .from('perfiles')
        .select('id_perfil')
        .eq('id_usuario', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error('Error al verificar el perfil existente: ' + checkError.message);
      }

      if (!existingProfile) {
        // Crear nuevo perfil si no existe
        const { error: insertError } = await supabase
          .from('perfiles')
          .insert({
            id_usuario: userId,
            url_pagina_web: formData.url_pagina_web || null,
            ciudad: formData.ciudad || null,
            pais: formData.pais || null,
            fecha_nacimiento: formData.fecha_nacimiento || null,
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
    <div className="profile-container mt-5">
      <div className="profile-row">
        <div className="profile-col">
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>Crea tu perfil en SocialNet</h3>
            </div>
            <div className="profile-card-body">
              {error && <div className="profile-alert profile-alert-danger">{error}</div>}
              {success && <div className="profile-alert profile-alert-success">¡Perfil creado exitosamente!</div>}
              {loading && <div className="profile-alert profile-alert-info">Cargando...</div>}

              <form onSubmit={handleSubmit}>
                <div className="profile-form-group">
                  <label htmlFor="url_pagina_web" className="profile-form-label">Página web (opcional)</label>
                  <input
                    type="url"
                    className="profile-form-control"
                    id="url_pagina_web"
                    name="url_pagina_web"
                    value={formData.url_pagina_web}
                    onChange={handleChange}
                    placeholder="https://tuweb.com"
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="ciudad" className="profile-form-label">Ciudad (opcional)</label>
                  <input
                    type="text"
                    className="profile-form-control"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Ejemplo: San Salvador"
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="descripcion" className="profile-form-label">Descripción (opcional)</label>
                  <textarea
                    className="profile-form-control"
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Cuéntanos sobre ti..."
                    rows="3"
                  />
                </div>

                <button type="submit" className="profile-btn" disabled={loading}>
                  Guardar perfil
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProfile;

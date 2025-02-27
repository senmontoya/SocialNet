import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import "../style/createprofile.css";
import Navbar from '../components/navbar';
import logo from "../assets/img/logo.png";

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

  const convertToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), { type: 'image/webp' }));
            } else {
              reject(new Error('No se pudo convertir la imagen a WebP.'));
            }
          },
          'image/webp',
          0.8
        );
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen.'));
      reader.onerror = () => reject(new Error('Error al leer el archivo.'));

      reader.readAsDataURL(file);
    });
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
      const authUserId = user.id;

      let fotoPerfilUrl = null;
      if (formData.foto_perfil) {
        const webpImage = await convertToWebP(formData.foto_perfil);
        const fileName = `${authUserId}-${Date.now()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from('profile-pics')
          .upload(fileName, webpImage, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error('No pudimos subir tu foto de perfil. Intenta de nuevo.');
        }

        const { data: publicUrlData } = supabase.storage
          .from('profile-pics')
          .getPublicUrl(fileName);

        if (!publicUrlData) throw new Error('No se pudo obtener la URL de tu foto de perfil.');
        fotoPerfilUrl = publicUrlData.publicUrl;
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
            pais: formData.pais || null,
            fecha_nacimiento: formData.fecha_nacimiento || null,
            foto_perfil: fotoPerfilUrl,
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
                    placeholder="https://e-Dynamycs.com"
                    value={formData.url_pagina_web}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Ciudad</label>
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
                  <label className="form-label">Pais</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pais"
                    placeholder="Ejemplo: El Salvador"
                    value={formData.pais}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Foto de perfil</label>
                  <input
                    type="file"
                    className="form-control"
                    name="foto_perfil"
                    accept="image/*"
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
                    {loading ? 'Guardando...' : 'Guardar perfil'}
                  </button>
                </div>
              </form>
            </div>

            {/* Sección derecha - Texto "CREA TU PERFIL" y Logo */}
            <div className="col-md-5 d-flex flex-column align-items-center justify-content-center text-white create-profile-right-section">
              <h1 className="text-uppercase text-center fw-bold mb-4">¡Únete creando un perfil!</h1>
              <img src={logo} alt="Logo" className="create-profile-logo" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreateProfile;
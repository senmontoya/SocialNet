import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ModalEditProfile from "../components/ModalEditProfile";
import "../style/editProfile.css";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    nick: "",
    email: "",
    descripcion: "",
    foto_perfil: "",
    ciudad: "",
    pais: "",
    fecha_nacimiento: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        const userId = session.user.id;
        const { data: registroData, error: registroError } = await supabase
          .from("usuarios_registro")
          .select("id_registro, nick, email")
          .eq("id_registro", userId)
          .single();

        if (registroError) throw registroError;

        const { data: usuarioData, error: usuarioError } = await supabase
          .from("usuarios")
          .select("id_usuario")
          .eq("id_registro", registroData.id_registro)
          .single();

        if (usuarioError) throw usuarioError;

        const { data: perfilData, error: perfilError } = await supabase
          .from("perfiles")
          .select("descripcion, foto_perfil, ciudad, pais, fecha_nacimiento")
          .eq("id_usuario", usuarioData.id_usuario)
          .single();

        if (perfilError && perfilError.code !== "PGRST116") throw perfilError;

        // Obtener la URL pública de la foto de perfil desde Supabase Storage
        let fotoPerfilUrl = null;
        if (perfilData?.foto_perfil) {
          const { data: publicUrlData } = supabase.storage
            .from("profile-pics")
            .getPublicUrl(perfilData.foto_perfil);
          fotoPerfilUrl = publicUrlData.publicUrl;
        }

        setUserData({
          nick: registroData.nick,
          email: registroData.email,
          descripcion: perfilData?.descripcion || "Sin descripción",
          foto_perfil: fotoPerfilUrl, // Será null si no hay foto
          ciudad: perfilData?.ciudad || "",
          pais: perfilData?.pais || "",
          fecha_nacimiento: perfilData?.fecha_nacimiento || "",
        });
      } catch (err) {
        setError("Error al cargar los datos del perfil: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="edit-background section-sidebar">
          <p>Cargando...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="edit-background section-sidebar">
          <div className="alert alert-danger">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="edit-background section-sidebar">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card shadow-lg p-4">
                <div className="row align-items-center">
                  <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
                    {userData.foto_perfil ? (
                      <img
                        src={userData.foto_perfil}
                        alt="Foto de perfil"
                        className="rounded-circle"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.style.display = "none"; // Ocultar imagen rota
                          e.target.nextSibling.style.display = "block"; // Mostrar ícono
                          console.error("Error cargando la imagen");
                        }}
                      />
                    ) : null}
                    {/* Ícono de Bootstrap si no hay foto o falla la carga */}
                    <i
                      className="bi bi-person-circle"
                      style={{
                        fontSize: "150px",
                        color: "#6c757d",
                        display: userData.foto_perfil ? "none" : "block", // Mostrar solo si no hay foto
                      }}
                    ></i>
                  </div>

                  <div className="col-12 col-md-8">
                    <div className="d-flex align-items-center flex-wrap mb-2">
                      <h3 className="me-3 mb-0">{userData.nick}</h3>
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowModal(true)}
                        className="btn-sm"
                      >
                        Editar Perfil
                      </Button>
                    </div>
                    <div className="d-flex flex-wrap mb-2">
                      <p className="me-4 mb-1">
                        <strong>12</strong> Artículos
                      </p>
                      <p className="me-4 mb-1">
                        <strong>45</strong> Contactos
                      </p>
                      <p className="mb-1">
                        <strong>1</strong> Seguidos
                      </p>
                    </div>
                    <p className="text-muted mb-0">{userData.descripcion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-4">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card shadow-lg p-4 text-center">
                <h4 className="text-muted">Coming Soon</h4>
                <p className="text-muted">
                  Próximamente verás tus publicaciones aquí.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ModalEditProfile
        show={showModal}
        handleClose={() => setShowModal(false)}
        userData={userData}
        setUserData={setUserData}
      />
    </>
  );
};

export default EditProfile;

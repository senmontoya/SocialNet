import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { supabase } from "../supabaseClient";
import DOMPurify from "dompurify";

const ModalEditProfile = ({ show, handleClose, userData, setUserData }) => {
  const [formData, setFormData] = useState({ ...userData });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session.user.id;

      
      const { error: registroError } = await supabase
        .from("usuarios_registro")
        .update({ nick: formData.nick, email: formData.email })
        .eq("id_registro", userId);

      if (registroError) throw registroError;

      
      const { data: usuarioData } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("id_registro", userId)
        .single();

      let fotoPerfilPath = formData.foto_perfil;


      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-pics")
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        fotoPerfilPath = fileName;
      } else if (fotoPerfilPath?.startsWith("http")) {
        fotoPerfilPath = fotoPerfilPath.split("/").pop();
      }

      // Sanitizar la descripción contra XSS
      const sanitizedDescription = DOMPurify.sanitize(formData.descripcion);

      // Actualizar o insertar en perfiles
      const perfilUpdates = {
        ciudad: formData.ciudad || "",
        pais: formData.pais || "",
        fecha_nacimiento: formData.fecha_nacimiento || null,
        descripcion: sanitizedDescription,
        foto_perfil: fotoPerfilPath,
      };

      const { data: existingProfile } = await supabase
        .from("perfiles")
        .select("id_perfil")
        .eq("id_usuario", usuarioData.id_usuario)
        .single();

      if (existingProfile) {
        const { error: updateError } = await supabase
          .from("perfiles")
          .update(perfilUpdates)
          .eq("id_usuario", usuarioData.id_usuario);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("perfiles")
          .insert({ ...perfilUpdates, id_usuario: usuarioData.id_usuario });
        if (insertError) throw insertError;
      }

      let newFotoPerfilUrl = "https://via.placeholder.com/150";
      if (fotoPerfilPath) {
        newFotoPerfilUrl = `https://rjinofvjhblfavdhiwjg.supabase.co/storage/v1/object/public/profile-pics/${fotoPerfilPath}`;
      }

      setUserData({ ...formData, foto_perfil: newFotoPerfilUrl, descripcion: sanitizedDescription });
      handleClose();
    } catch (err) {
      setError("No pudimos guardar tus cambios. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nick">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              name="nick"
              value={formData.nick}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="ciudad">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              name="ciudad"
              value={formData.ciudad || ""}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pais">
            <Form.Label>País</Form.Label>
            <Form.Control
              type="text"
              name="pais"
              value={formData.pais || ""}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fecha_nacimiento">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento || ""}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="foto_perfil">
            <Form.Label>Foto de Perfil</Form.Label>
            {formData.foto_perfil && (
              <div className="mb-2">
                <img
                  src={formData.foto_perfil}
                  alt="Foto de perfil actual"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEditProfile;
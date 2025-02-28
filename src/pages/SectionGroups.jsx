import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/sidebar";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "../style/group.css";

function SectionGroup() {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupType, setGroupType] = useState("publico");
  const [publishPermissions, setPublishPermissions] = useState("todos");
  const [tags, setTags] = useState("");
  const [requiresModeration, setRequiresModeration] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showJoinPopup, setShowJoinPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("grupos")
          .select("id_grupo, nombre, descripcion, id_usuario_creador, tipo, permisos_publicacion, etiquetas, requiere_moderacion");

        if (error) throw error;

        const creatorIds = [...new Set(data.map((group) => group.id_usuario_creador))];
        const { data: creatorsData, error: creatorsError } = await supabase
          .from("usuarios")
          .select("id_usuario, id_registro")
          .in("id_usuario", creatorIds);

        if (creatorsError) throw creatorsError;

        const { data: registroData, error: registroError } = await supabase
          .from("usuarios_registro")
          .select("id_registro, nick")
          .in("id_registro", creatorsData.map((creator) => creator.id_registro));

        if (registroError) throw registroError;

        const creatorMap = new Map(registroData.map((user) => [user.id_registro, user.nick]));
        const creatorsIdMap = new Map(creatorsData.map((creator) => [creator.id_usuario, creator.id_registro]));
        const enrichedGroups = data.map((group) => ({
          ...group,
          creatorName: creatorMap.get(creatorsIdMap.get(group.id_usuario_creador)),
        }));

        setGroups(enrichedGroups || []);
      } catch (err) {
        setError("Error al cargar los grupos: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [navigate]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setGroupName("");
    setGroupDescription("");
    setGroupType("publico");
    setPublishPermissions("todos");
    setTags("");
    setRequiresModeration(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const userId = session.user.id;

      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("id_registro", userId)
        .single();

      if (usuarioError) throw usuarioError;

      const idUsuario = usuarioData.id_usuario;

      const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);

      const { data: groupData, error: groupError } = await supabase
        .from("grupos")
        .insert([
          {
            nombre: groupName,
            descripcion: groupDescription,
            id_usuario_creador: idUsuario,
            tipo: groupType,
            permisos_publicacion: publishPermissions,
            etiquetas: tagsArray,
            requiere_moderacion: requiresModeration,
          },
        ])
        .select("id_grupo, nombre, descripcion, id_usuario_creador, tipo, permisos_publicacion, etiquetas, requiere_moderacion")
        .single();

      if (groupError) throw groupError;

      const { error: moderatorError } = await supabase
        .from("moderadores")
        .insert([{ id_usuario: idUsuario, id_grupo: groupData.id_grupo }]);

      if (moderatorError) throw moderatorError;

      const { data: creatorData, error: creatorError } = await supabase
        .from("usuarios_registro")
        .select("nick")
        .eq("id_registro", userId)
        .single();

      if (creatorError) throw creatorError;

      const enrichedGroupData = {
        ...groupData,
        creatorName: creatorData.nick,
      };

      setGroups((prevGroups) => [enrichedGroupData, ...prevGroups]);
      closeModal();
    } catch (err) {
      setError("Error al crear el grupo: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(selectedGroup && selectedGroup.id_grupo === group.id_grupo ? null : group);
  };

  const handleJoinClick = () => {
    setShowJoinPopup(true);
  };

  const closeJoinPopup = () => {
    setShowJoinPopup(false);
  };

  const handleOutsideClick = (e) => {
    // Cierra el popup de "Unirse" si se hace clic fuera
    if (e.target.className.includes("custom-modal") && showJoinPopup) {
      closeJoinPopup();
    }
    // Cierra el modal de creación si se hace clic fuera
    if (e.target.className.includes("custom-modal") && showModal) {
      closeModal();
    }
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="section-header group-background">
          <p>Cargando...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Sidebar />
        <div className="section-header group-background">
          <div className="alert alert-danger">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="section-header group-background">
        <button className="btn btn-primary" onClick={openModal}>
          Crear grupo
        </button>

        {showModal && (
          <div
            className="modal fade show custom-modal"
            tabIndex="-1"
            style={{ display: "block" }}
            aria-modal="true"
            onClick={handleOutsideClick} // Añadido aquí para cerrar al hacer clic fuera
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crear Grupo</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="groupName" className="form-label">
                        Nombre del Grupo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="groupDescription" className="form-label">
                        Descripción del Grupo
                      </label>
                      <textarea
                        className="form-control"
                        id="groupDescription"
                        rows="3"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        required
                        disabled={loading}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="groupType" className="form-label">
                        Tipo de Grupo
                      </label>
                      <select
                        className="form-control"
                        id="groupType"
                        value={groupType}
                        onChange={(e) => setGroupType(e.target.value)}
                        required
                        disabled={loading}
                      >
                        <option value="publico">Público</option>
                        <option value="privado">Privado</option>
                        <option value="secreto">Secreto</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="publishPermissions" className="form-label">
                        ¿Quién puede publicar?
                      </label>
                      <select
                        className="form-control"
                        id="publishPermissions"
                        value={publishPermissions}
                        onChange={(e) => setPublishPermissions(e.target.value)}
                        required
                        disabled={loading}
                      >
                        <option value="todos">Todos los miembros</option>
                        <option value="moderadores">Solo moderadores</option>
                        <option value="admin">Solo el administrador</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="tags" className="form-label">
                        Etiquetas (separadas por comas)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Ej: amigos, deportes, música"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="requiresModeration"
                        checked={requiresModeration}
                        onChange={(e) => setRequiresModeration(e.target.checked)}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="requiresModeration">
                        ¿Requiere moderación para publicaciones?
                      </label>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}
                        disabled={loading}
                      >
                        Cerrar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="my-groups">
          <h3>Grupos</h3>
          <ul className="list-group">
            {groups.length === 0 ? (
              <li className="list-group-item">No hay grupos creados</li>
            ) : (
              groups.map((group) => (
                <li
                  className="list-group-item"
                  key={group.id_grupo}
                  onClick={() => handleGroupClick(group)}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{group.nombre}</strong>
                  <p>{group.descripcion}</p>
                  {selectedGroup && selectedGroup.id_grupo === group.id_grupo && (
                    <div className="group-details mt-2">
                      <p>Creador: {group.creatorName || "Desconocido"}</p>
                      <p>Tipo: {group.tipo === "publico" ? "Público" : group.tipo === "privado" ? "Privado" : "Secreto"}</p>
                      <p>Publicaciones: {group.permisos_publicacion === "todos" ? "Todos los miembros" : group.permisos_publicacion === "moderadores" ? "Solo moderadores" : "Solo administrador"}</p>
                      <p>Etiquetas: {group.etiquetas.join(", ") || "Ninguna"}</p>
                      <p>Moderación: {group.requiere_moderacion ? "Sí" : "No"}</p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinClick();
                        }}
                      >
                        Unirse
                      </Button>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>

        {showJoinPopup && (
          <div
            className="modal fade show custom-modal"
            tabIndex="-1"
            style={{ display: "block" }}
            aria-modal="true"
            onClick={handleOutsideClick}
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Unirse al Grupo</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeJoinPopup}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Próximamente</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SectionGroup;
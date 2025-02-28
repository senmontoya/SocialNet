import { useState } from "react";
import Sidebar from "../components/sidebar";
import '../style/group.css';

function SectionGroup() {
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groups, setGroups] = useState([]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newGroup = { name: groupName, description: groupDescription };
        setGroups([...groups, newGroup]);
        setGroupName('');
        setGroupDescription('');
        closeModal();
    };

    return (
        <>
            <Sidebar />
            <div className="section-header group-background">
                <button className="btn btn-primary" onClick={openModal}>Crear grupo</button>

                {showModal && (
                    <div className="modal fade show custom-modal" tabindex="-1" style={{ display: 'block' }} aria-modal="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Crear Grupo</h5>
                                    <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="groupName" className="form-label">Nombre del Grupo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="groupName"
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="groupDescription" className="form-label">Descripción del Grupo</label>
                                            <textarea
                                                className="form-control"
                                                id="groupDescription"
                                                rows="3"
                                                value={groupDescription}
                                                onChange={(e) => setGroupDescription(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                            <button type="submit" className="btn btn-primary">Guardar cambios</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="my-groups">
                    <h3>Mis Grupos</h3>
                    <ul className="list-group">
                        {groups.length === 0 ? (
                            <li className="list-group-item">No tienes grupos creados</li>
                        ) : (
                            groups.map((group, index) => (
                                <li className="list-group-item" key={index}>
                                    <strong>{group.name}</strong>
                                    <p>{group.description}</p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default SectionGroup;

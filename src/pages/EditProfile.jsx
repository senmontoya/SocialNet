import { useState } from 'react';
import Sidebar from "../components/sidebar";
import '../style/editProfile.css';

function EditProfile() {
    const [showModal, setShowModal] = useState(false);

    const handleModalToggle = () => setShowModal(!showModal);

    return(
        <>  
            <Sidebar />
            <div className="edit-background section-sidebar">
                <button className="btn btn-primary" onClick={handleModalToggle}>
                    Editar Perfil
                </button>

                {showModal && (
                    <div className="custom-modal">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Perfil</h5>
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        data-bs-dismiss="modal" 
                                        aria-label="Close" 
                                        onClick={handleModalToggle}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="profileImage" className="form-label">Foto de Perfil</label>
                                            <input type="file" className="form-control-file" id="profileImage" />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Descripción</label>
                                            <textarea 
                                                className="form-control" 
                                                id="description" 
                                                rows="3"
                                                placeholder="Escribe una breve descripción de ti."
                                            ></textarea>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="birthdate" className="form-label">Fecha de Nacimiento</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="birthdate"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="country" className="form-label">País</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="country" 
                                                placeholder="Ingresa tu país"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="country" className="form-label">Ciudad</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="country" 
                                                placeholder="Ingresa tu ciudad"
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary m-2" 
                                        onClick={handleModalToggle}
                                    >
                                        Cerrar
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default EditProfile;

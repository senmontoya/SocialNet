import { useState } from "react";
import Sidebar from "../components/sidebar";
import "../style/group.css";

function Group() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Sidebar />
            <section className="section-header">
                <div>
                    <button type="button" className="btn btn-primary">
                        Primary
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                        data-bs-toggle="modal"
                        data-bs-target="#groupModal"
                    >
                        Crear grupo
                    </button>
                </div>

                {/* Modal (Bootstrap) */}
                <div
                    className={`modal fade ${showModal ? "show d-block" : ""}`}
                    id="groupModal"
                    tabIndex="-1"
                    aria-labelledby="groupModalLabel"
                    aria-hidden={!showModal}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="groupModalLabel">
                                    Crear Grupo
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Ingrese los detalles del grupo.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                    data-bs-dismiss="modal"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => alert("Cambios guardados")}
                                >
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Group;

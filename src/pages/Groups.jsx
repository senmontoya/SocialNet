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
                    <button type="button" class="btn btn-primary">Primary</button>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        Crear grupo
                    </button>
                </div>

                {/* Modal */}
                <div className={`modal-dialog ${showModal ? "" : "d-none"}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Crear Grupo</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
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
            </section>
        </>
    );
}

export default Group;

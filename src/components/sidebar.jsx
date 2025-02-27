import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../style/sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <nav className="nav flex-column">
                <a className="nav-link">
                    <span className="descripcion">SocialNet</span>
                </a>
                <a className="nav-link">
                    <span>
                        <i class="bi bi-house-fill"></i>
                    </span>
                    <span className="descripcion">Home</span>

                </a>
                <Link to='/Groups'>
                    <a className="nav-link">
                        <span className="icon">
                            <i className="bi bi-people-fill"></i>
                        </span>
                        <span className="descripcion">Grupos</span>
                    </a>
                </Link>
                <a className="nav-link" href="">
                    <span className="icon">
                        <i className="bi bi-bell"></i>
                    </span>
                    <span className="descripcion">Notificaciones</span>
                </a>
                <a className="nav-link" href="">
                    <span className="icon">
                        <i className="bi bi-gear"></i>
                    </span>
                    <span className="descripcion">Configuración</span>
                </a>
                <a className="nav-link" href="">
                    <span className="icon">
                        <i className="bi bi-box-arrow-left"></i>
                    </span>
                    <span className="descripcion">Cerrar Sesión</span>
                </a>
            </nav>
        </div>
    );
};

export default Sidebar;

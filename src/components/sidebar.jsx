import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../style/sidebar.css";
import { supabase } from "../supabaseClient"; 

const Sidebar = () => {
  const navigate = useNavigate(); 

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err); 
    }
  };

  return (
    <div className="sidebar">
      <nav className="nav flex-column">
        <a className="nav-link">
          <span className="descripcion">SocialNet</span>
        </a>
        <Link to="/EditProfile">
          <a className="nav-link">
            <span className="icon">
              <i className="bi bi-person-circle"></i>
            </span>
            <span className="descripcion">Perfil</span>
          </a>
        </Link>
        <a className="nav-link">
          <span>
            <i className="bi bi-house-fill"></i>
          </span>
          <span className="descripcion">Home</span>
        </a>
        <Link to="/SectionGroups">
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
        <a className="nav-link" onClick={handleSignOut} style={{ cursor: "pointer" }}>
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
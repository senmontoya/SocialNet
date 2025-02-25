import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/navbar.css";
import logo from '../assets/img/logo.png';

const Navbar = () => {
    return(     
        <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-custom">
            <div className="container-fluid">
                <a className="navbar-brand d-flex align-items-center" href="#">
                    <img src={logo} alt="Logo SocialNet" width="50" height="50" className="me-2"/>
                    <span>SocialNet</span>
                </a>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">Welcome</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#">Membresias</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#">Nosotros</a>
                        </li>
                    </ul>
                </div>
                <form className="d-flex">
                    <button className="btn btn-outline-primary me-2" type="button" onClick={() => window.location.href='/register'}>Registrate</button>
                    <button className="btn btn-primary" type="submit">Iniciar Sesion</button>
                </form>
            </div>
        </nav>
    );
}

export default Navbar;
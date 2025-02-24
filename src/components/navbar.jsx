import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/navbar.css";
import logo from '../assets/img/logo.png';

const Navbar = () => {
    return(     
        <nav class="navbar navbar-expand-lg navbar-light bg-light navbar-custom">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center" href="#">
                    <img src={logo} alt="Logo SocialNet" width="50" height="50" class="me-2"/>
                    <span>SocialNet</span>
                </a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Welcome</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#">Membresias</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#">Nosotros</a>
                        </li>
                    </ul>
                </div>
                <form class="d-flex">
                    <button class="btn btn-outline-primary me-2" type="submit">Registrate</button>
                    <button class="btn btn-primary" type="submit">Iniciar Sesion</button>
                </form>
            </div>
        </nav>
        
    );
}

export default Navbar;
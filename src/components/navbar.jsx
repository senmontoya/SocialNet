import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../style/navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    return(
       
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
                   <a className="navbar-brand me-auto" href="#">SocialNet</a>
                   <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                   <div className="offcanvas-header">
                       <h5 className="offcanvas-title" id="offcanvasNavbarLabel">SocialNet</h5>
                       <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                   </div>
                   <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                            <li className="nav-item">
                                <Link to="/" className="nav-link mx-lg-2" aria-current="page" href="#">Home</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-lg-2" href="#">Acerca De</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-lg-2" href="#">Contactanos</a>
                            </li>
                        </ul>
                    </div>
               </div>
               <a href="#" className="login-button">Login</a>
               <button className="navbar-toggler pe-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
               <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
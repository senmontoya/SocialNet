import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../style/navbar.css";


const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand me-auto" to="/">SocialNet</Link>

                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">SocialNet</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                            <li className="nav-item">

                                <Link className="nav-link mx-lg-2" to="/">Home</Link>

                            </li>
                            <li className="nav-item">
                                <Link className="nav-link mx-lg-2" to="/about">Acerca De</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link mx-lg-2" to="/contact">Contactanos</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Link to="/login" className="btn btn-login2">Login</Link>

                <button className="navbar-toggler pe-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

            </div>
        </nav>
    );
}

export default Navbar;

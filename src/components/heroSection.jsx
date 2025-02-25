    import React from "react";
    import { Link } from "react-router-dom";
    import 'bootstrap/dist/css/bootstrap.min.css';
    import "../style/hero-section.css";
    
    const HeroSection = () => {
        return (
            <>

                <section className="hero-section">
                    <div className="container d-flex align-items-center justify-content-center fs-1 text-white flex-column">
                        <h1>Bienvenido a SocialNet</h1>
                        <h2 style={{fontSize: '1.2rem', textAlign: 'center'}}>Tu espacio para conectar, compartir y descubrir lo que más te apasiona. ¡Estamos emocionados de que formes parte de nuestra comunidad! No olvides explorar, interactuar y, por supuesto, disfrutar de cada momento. ¡Haz de SocialNet tu lugar para estar!</h2>
                        <div className="d-flex justify-content-between">
                            <Link to="/Login" className="btn btn-primary">Iniciar Sesion</Link>
                            <button type="button" class="btn btn-outline-primary" style={{marginLeft: '20px'}}>Registrate</button>
                        </div>
                    </div>
                </section>
            
            
            
            </>

        );
    }

    export default HeroSection;

import React, { useState } from "react";
import Navbar from "../components/navbar.jsx";
import "../style/login.css";
import { supabase } from "../supabaseClient.js";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) setError(error.message);
  };

  const signInWithGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) setError(error.message);
  };

  return (
    <div className="background-login justify-content-center align-items-center">
      <Navbar />
      <h1 className="text-center mt-5 text-light bl-semi">SocialNet</h1>
      <h5 className="text-center d-flex justify-content-center mt-3 text-light w-75 mx-auto">
        ¡Bienvenido a SocialNet! Tu espacio para conectar, compartir y descubrir lo que más te apasiona. ¡Estamos emocionados de que formes parte de nuestra comunidad! No olvides explorar, interactuar y, por supuesto, disfrutar de cada momento. ¡Haz de SocialNet tu lugar para estar!
      </h5>
      <div className="container-md">
        <div className="card mt-5 mb-3 p-3 shadow-lg card-position">
          <div className="row g-0">
            <div className="col-md-4">
              {/* Imagen aquí */}
            </div>
            <div className="col-md-8">
              <div className="card-body text-center">
                <h1 className="card-title ank-caps m-5">Inicia Sesion</h1>
                <p className="card-text fs-6">
                  Inicia sesion en tu cuenta para acceder a todas las funcionalidades de SocialNet. Disfruta de contenido exclusivo y mantente conectado con tu comunidad.
                </p>
                {error && <p className="text-danger">{error}</p>} {/* Display error if exists */}
                <form className="col-sm m-5" onSubmit={handleLogin}>
                  <div className="col-md-6 m-4 mx-auto">
                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="inputEmail4" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-6 m-4 mx-auto">
                    <label htmlFor="inputPassword4" className="form-label">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="inputPassword4" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-sm m-5">
                    <div className="col-md-6 m-4 mx-auto">
                      <button 
                        type="submit" 
                        className="btn btn-primary text-center btn-sm w-100"
                      >
                        Iniciar Sesion
                      </button>
                    </div>
                    <div className="col-md-6 m-4 mx-auto">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary text-center btn-sm w-100" 
                        onClick={signInWithGoogle}
                      >
                        <i className="bi bi-google"></i>
                        <span className="ms-2">Iniciar Sesion con Google</span>
                      </button>
                    </div>
                  </div>
                </form>
                <p className="card-text m-5">
                  <small className="text-dark">¿No tienes cuenta? <span className="text-primary">Registrate</span></small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
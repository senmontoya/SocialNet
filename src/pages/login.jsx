import React, { useState } from "react";
import Navbar from "../components/navbar.jsx";
import LoginSection from "../components/loginSection.jsx"
import { supabase } from "../supabaseClient.js";

function Login () {
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
      }
    
    return (
        <>
          <Navbar/>
          <section className="login-section">
            <div className="container d-flex align-items-center justify-content-center fs-1 text-white flex-column">
                

            </div>
            
          </section>

        </>

    );
}

export default Login;
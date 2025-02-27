import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar"
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        const userId = session.user.id;
        const { data: registroData, error: registroError } = await supabase
          .from("usuarios_registro")
          .select("nick, email")
          .eq("id_registro", userId)
          .single();

        if (registroError) throw registroError;

        setUserData(registroData);
      } catch (err) {
        setError("Error al cargar los datos del usuario");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err) {
      setError("Error al cerrar sesión");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center mt-5">
          <p>Cargando...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container text-center mt-5">
          <div className="alert alert-danger">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar/>
      <main className="main-content">
        <h2 className="text-center mb-4 text-light">Bienvenido a tu Dashboard</h2>
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
         <h4 className="card-title text-center">Datos del usuario</h4>
         <div className="card-body">
           <p><strong>Nombre de usuario:</strong> {userData?.nick}</p>
           <p><strong>Correo:</strong> {userData?.email}</p>
           <Button 
            variant="danger"
            onClick={handleSignOut}
            className="w-100 mt-3"
           >
            Cerrar Sesion
           </Button>
         </div>
        </div>

      </main>
      
    </>
  );
};

export default Dashboard;
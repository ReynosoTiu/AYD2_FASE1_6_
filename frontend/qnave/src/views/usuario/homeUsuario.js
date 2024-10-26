import React, { useEffect, useState } from "react";
import HeaderUsuario from "../../components/header_usuario/headerUsuario";
import API_URL from "../../config/config";

function HomeUsuario() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/driver/getUserInfo/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setNombreUsuario(data.NombreCompleto);
        } else {
          setError("Error al obtener la información del usuario. Por favor, intenta de nuevo.");
        }
      } catch (error) {
        setError("No se pudo conectar con el servidor. Intenta nuevamente más tarde.");
      } finally {
        setCargando(false);
      }
    };

    if (userId) {
      fetchUserInfo();
    } else {
      setError("Usuario no identificado.");
      setCargando(false);
    }
  }, [userId]);

  return (
    <>
      <HeaderUsuario />
      {cargando ? (
        <h3><center>Cargando...</center></h3>
      ) : error ? (
        <h3><center>{error}</center></h3>
      ) : (
        <h3><center>Hola {nombreUsuario}, bienvenido a la aplicación de QNAVE</center></h3>
      )}
    </>
  );
}

export default HomeUsuario;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AsistenteVerInformacion() {
  const { tipo, id } = useParams();
  const [datos, setDatos] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let url = "";
      if (tipo === "usuario") {
        url = `http://localhost:5000/usuario/consultar?id=${id}`;
      } else {
        url = `http://localhost:5000/conductor/consultar?id=${id}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setDatos(data);
        } else {
          setMensaje("Error al cargar la información.");
        }
      } catch (error) {
        console.error("Error al cargar la información:", error);
        setMensaje("Error al cargar la información.");
      }
    };

    fetchData();
  }, [id, tipo]);

  const handleDarDeBaja = async () => {
    let url = "";
    if (tipo === "usuario") {
      url = `http://localhost:5000/usuario/darbaja?id=${id}`;
    } else {
      url = `http://localhost:5000/conductor/darbaja?id=${id}`;
    }

    try {
      const response = await fetch(url, {
        method: "UPDATE",
      });

      if (response.ok) {
        setMensaje(`${tipo === "usuario" ? "Usuario" : "Conductor"} dado de baja con éxito.`);
        navigate("/");
      } else {
        setMensaje("Error al dar de baja.");
      }
    } catch (error) {
      console.error("Error al dar de baja:", error);
      setMensaje("Error al dar de baja.");
    }
  };

  if (!datos) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Información Completa de {tipo === "usuario" ? "Usuario" : "Conductor"}</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      <div className="border p-4 rounded shadow-sm" style={{ backgroundColor: "#f7f7f7" }}>
        {tipo === "usuario" ? (
          <div>
            <p><strong>Nombre Completo:</strong> {datos.nombre}</p>
            <p><strong>Fecha de Nacimiento:</strong> {datos.fechaNacimiento}</p>
            <p><strong>Género:</strong> {datos.genero}</p>
            <p><strong>Correo:</strong> {datos.correo}</p>
            <p><strong>Número de Celular:</strong> {datos.celular}</p>
          </div>
        ) : (
          <div>
            <p><strong>Nombre Completo:</strong> {datos.nombre}</p>
            <p><strong>Teléfono:</strong> {datos.telefono}</p>
            <p><strong>Edad:</strong> {datos.edad}</p>
            <p><strong>DPI:</strong> {datos.dpi}</p>
            <p><strong>Correo Electrónico:</strong> {datos.correo}</p>
            <p><strong>Placa del Vehículo:</strong> {datos.placa}</p>
            <p><strong>Marca del Vehículo:</strong> {datos.marca}</p>
            <p><strong>Año del Vehículo:</strong> {datos.anioVehiculo}</p>
            <p><strong>Dirección:</strong> {datos.direccion}</p>
            <p><strong>Estado de la Cuenta:</strong> {datos.estadoCuenta}</p>
          </div>
        )}
        <div className="mt-3">
          <button className="btn btn-danger" onClick={handleDarDeBaja}>
            Dar de Baja
          </button>
        </div>
      </div>
    </div>
  );
}

export default AsistenteVerInformacion;

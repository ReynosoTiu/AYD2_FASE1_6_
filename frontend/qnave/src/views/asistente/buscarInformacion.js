import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function AsistenteBuscarInformacion() {
  const [tipoBusqueda, setTipoBusqueda] = useState("usuario");
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleBuscar = async () => {
    let url = "";
    if (tipoBusqueda === "usuario") {
      url = `http://localhost:5000/usuario/consultar?busqueda=${busqueda}`;
    } else if (tipoBusqueda === "conductor") {
      url = `http://localhost:5000/conductor/consultar?busqueda=${busqueda}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setResultados(data);
      } else {
        setMensaje("Error al consultar los datos");
      }
    } catch (error) {
      console.error("Error al realizar la consulta:", error);
      setMensaje("Error al realizar la consulta.");
    }
  };

  const handleVerMasInformacion = (id) => {
    navigate(`/verinfo/${tipoBusqueda}/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2 style={{ color: "#6dbd48" }}>Buscador de Usuarios y Conductores</h2>
      <div className="border p-4 rounded shadow-sm" style={{ backgroundColor: "#f7f7f7" }}>
        <div className="mb-3">
          <label className="form-label">Buscar por:</label>
          <select
            className="form-select"
            value={tipoBusqueda}
            onChange={(e) => setTipoBusqueda(e.target.value)}
          >
            <option value="usuario">Usuario</option>
            <option value="conductor">Conductor</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre, Código o Estado</label>
          <input
            type="text"
            className="form-control"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#6dbd48", borderColor: "#6dbd48" }}
          onClick={handleBuscar}
        >
          Buscar
        </button>
      </div>

      {mensaje && <div className="alert alert-warning mt-3">{mensaje}</div>}

      {resultados.length > 0 && (
        <div className="mt-4">
          <h4 style={{ color: "#6dbd48" }}>Resultados:</h4>
          <ul className="list-group">
            {resultados.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {item.nombre} (Código: {item.id})
                <button
                  className="btn btn-info"
                  onClick={() => handleVerMasInformacion(item.id)}
                >
                  Ver Más Información
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AsistenteBuscarInformacion;
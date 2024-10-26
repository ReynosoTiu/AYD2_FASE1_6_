import API_URL from "../../config/config";
import React, { useEffect, useState } from "react";

function ModificarInformacionConductor() {
  const [driverData, setDriverData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Cargar la información del conductor al iniciar la página
    fetch(`${API_URL}/asistant/getDriverById/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar la información del conductor.");
        }
        return response.json();
      })
      .then((data) => {
        setDriverData(data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    // Preparar los datos para el envío
    const updateData = {
      ConductorID: driverData.UsuarioID,
      NombreCompleto: driverData.NombreCompleto,
      Telefono: driverData.Telefono,
      Edad: driverData.Edad,
      DPI: driverData.DPI,
      CorreoElectronico: driverData.CorreoElectronico,
      Fotografia: null,
      FotografiaVehiculo: null,
      Genero: driverData.Genero,
      EstadoCivil: driverData.EstadoCivil,
      Direccion: driverData.Direccion,
    };

    // Realizar la solicitud POST para actualizar los datos
    fetch(`${API_URL}/driver/updateDriver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ocurrió un error al actualizar la información.");
        }
        return response.json();
      })
      .then(() => {
        setSuccessMessage("Datos actualizados con éxito.");
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setSuccessMessage("");
      });
  };

  return (
    <div className="container">
      <h2>Modificar Información del Conductor</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {driverData ? (
        <form>
          <div className="form-group">
            <label>Nombre Completo:</label>
            <input
              type="text"
              className="form-control"
              name="NombreCompleto"
              value={driverData.NombreCompleto}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="text"
              className="form-control"
              name="Telefono"
              value={driverData.Telefono}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Edad:</label>
            <input
              type="number"
              className="form-control"
              name="Edad"
              value={driverData.Edad}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>DPI:</label>
            <input
              type="text"
              className="form-control"
              name="DPI"
              value={driverData.DPI}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              className="form-control"
              name="CorreoElectronico"
              value={driverData.CorreoElectronico}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Género:</label>
            <input
              type="text"
              className="form-control"
              name="Genero"
              value={driverData.Genero}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Estado Civil:</label>
            <input
              type="text"
              className="form-control"
              name="EstadoCivil"
              value={driverData.EstadoCivil}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              className="form-control"
              name="Direccion"
              value={driverData.Direccion}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdate}
          >
            Actualizar Información
          </button>
        </form>
      ) : (
        <p>Cargando información del conductor...</p>
      )}
    </div>
  );
}

export default ModificarInformacionConductor;

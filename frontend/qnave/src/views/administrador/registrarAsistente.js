import API_URL from "../../config/config";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function RegistrarAsistente() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    edad: "",
    dpi: "",
    correoElectronico: "",
    genero: "",
    estadoCivil: "",
    direccion: "",
    numeroCuenta: "",
    fotografia: "",
    cv: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [codigoEmpleado, setCodigoEmpleado] = useState("");
  const [contrasenaTemporal, setContrasenaTemporal] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [name]: reader.result.split(",")[1], // Guardamos solo la parte base64
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/asistant/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NombreCompleto: formData.nombreCompleto,
          Telefono: formData.telefono,
          Edad: Number(formData.edad),
          DPI: formData.dpi,
          CorreoElectronico: formData.correoElectronico,
          Genero: formData.genero,
          EstadoCivil: formData.estadoCivil,
          Direccion: formData.direccion,
          NumeroCuenta: formData.numeroCuenta,
          Fotografia: formData.fotografia,
          CV: formData.cv,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message);
        setCodigoEmpleado(data.CodigoEmpleado);
        setContrasenaTemporal(data.ContrasenaTemporal);
      } else {
        setResponseMessage("Hubo un error al registrar el asistente.");
      }
    } catch (error) {
      console.error("Error al registrar asistente:", error);
      setResponseMessage("Hubo un error al registrar el asistente.");
    }
  };

  const handleClose = () => {
    setResponseMessage("");
    setCodigoEmpleado("");
    setContrasenaTemporal("");
  };

  return (
    <div className="container mt-5">
      <h2>Registrar Asistente</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre Completo</label>
          <input
            type="text"
            name="nombreCompleto"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Edad</label>
          <input
            type="number"
            name="edad"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">DPI</label>
          <input
            type="text"
            name="dpi"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            name="correoElectronico"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Género</label>
          <input
            type="text"
            name="genero"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado Civil</label>
          <input
            type="text"
            name="estadoCivil"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Número de Cuenta</label>
          <input
            type="text"
            name="numeroCuenta"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fotografía</label>
          <input
            type="file"
            name="fotografia"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Currículum</label>
          <input
            type="file"
            name="cv"
            className="form-control"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Dar de Alta
        </button>
      </form>

      {responseMessage && (
        <div className="alert alert-success mt-4" role="alert">
          <h4 className="alert-heading">Éxito!</h4>
          <p>{responseMessage}</p>
          <p>Código Empleado: {codigoEmpleado}</p>
          <p>Contraseña Temporal: {contrasenaTemporal}</p>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

export default RegistrarAsistente;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function AsistenteSolicitudEmpleos() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    edad: "",
    dpi: "",
    correo: "",
    cv: null,
    fotografia: null,
    genero: "",
    estadoCivil: "",
    cuenta: "",
    direccion: ""
  });

  const [responseMessage, setResponseMessage] = useState(""); // Para mostrar mensajes de éxito o error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("nombreCompleto", formData.nombreCompleto);
    data.append("telefono", formData.telefono);
    data.append("edad", formData.edad);
    data.append("dpi", formData.dpi);
    data.append("correo", formData.correo);
    data.append("cv", formData.cv);
    data.append("fotografia", formData.fotografia);
    data.append("genero", formData.genero);
    data.append("estadoCivil", formData.estadoCivil);
    data.append("cuenta", formData.cuenta);
    data.append("direccion", formData.direccion);

    try {
      const response = await fetch("http://localhost:5000/conductor/registrar", {
        method: "POST",
        body: data
      });

      if (response.ok) {
        const result = await response.json();
        setResponseMessage("Solicitud enviada con éxito: " + result.message);
      } else {
        setResponseMessage("Error al enviar la solicitud.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Hubo un problema con la solicitud.");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4" style={{ color: "#6dbd48" }}>Enviar Solicitud</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm" style={{ backgroundColor: "#f7f7f7" }}>
        <div className="mb-3">
          <label className="form-label">Nombre Completo</label>
          <input
            type="text"
            className="form-control"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Número de Teléfono</label>
          <input
            type="tel"
            className="form-control"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Edad</label>
          <input
            type="number"
            className="form-control"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Número de DPI</label>
          <input
            type="text"
            className="form-control"
            name="dpi"
            value={formData.dpi}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Papelería Completa (CV)</label>
          <input
            type="file"
            className="form-control"
            name="cv"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fotografía</label>
          <input
            type="file"
            className="form-control"
            name="fotografia"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Género</label>
          <select
            className="form-select"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione su género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Estado Civil</label>
          <select
            className="form-select"
            name="estadoCivil"
            value={formData.estadoCivil}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione su estado civil</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viudo">Viudo</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Número de Cuenta</label>
          <input
            type="text"
            className="form-control"
            name="cuenta"
            value={formData.cuenta}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección de Domicilio</label>
          <textarea
            className="form-control"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#6dbd48", borderColor: "#6dbd48" }}>
          Enviar Solicitud
        </button>
      </form>

      {responseMessage && (
        <div className="alert mt-4" style={{ color: "#6dbd48" }}>
          {responseMessage}
        </div>
      )}
    </div>
  );
}

export default AsistenteSolicitudEmpleos;

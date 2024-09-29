import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function AsistenteSolicitudEmpleos() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    edad: "",
    dpi: "",
    correo: "",
    cvBase64: "",  // Aquí almacenaremos el CV en formato Base64
    fotografiaBase64: "",  // Aquí almacenaremos la fotografía en formato Base64
    genero: "",
    estadoCivil: "",
    cuenta: "",
    direccion: ""
  });

  const [mensaje, setMensaje] = useState("");

  // Función para convertir un archivo en Base64
  const convertirArchivoABase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Elimina el encabezado de la cadena Base64
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const base64 = await convertirArchivoABase64(files[0]);
      setFormData({ ...formData, [`${name}Base64`]: base64 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nombreCompleto: formData.nombreCompleto,
      telefono: formData.telefono,
      edad: parseInt(formData.edad), // Convertimos a número
      dpi: formData.dpi,
      correo: formData.correo,
      cvBase64: formData.cvBase64, // CV en Base64
      fotografiaBase64: formData.fotografiaBase64, // Fotografía en Base64
      genero: formData.genero,
      estadoCivil: formData.estadoCivil,
      cuenta: formData.cuenta,
      direccion: formData.direccion
    };

    try {
      // Realizamos la solicitud POST o UPDATE
      const response = await fetch("http://localhost:5000/conductor/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setMensaje("Solicitud enviada con éxito.");
      } else {
        setMensaje("Error al enviar la solicitud.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setMensaje("Hubo un problema con la solicitud.");
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
          <label className="form-label">Papelería Completa (CV) <small>(Solo PDF)</small></label>
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
          <label className="form-label">Fotografía <small>(Solo PNG, JPEG)</small></label>
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

      {mensaje && (
        <div className="alert mt-4" style={{ color: "#6dbd48" }}>
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default AsistenteSolicitudEmpleos;

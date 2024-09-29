import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    genero: "",
    correo: "",
    telefono: "",
    password: "",
    confirmarPassword: ""
  });

  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const [errores, setErrores] = useState({});

  // Función para manejar el cambio en los inputs
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      // Convertir imágenes y PDF a base64
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [name]: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showConfirmarPassword, setShowConfirmarPassword] = useState(false);

  const toggleConfirmarPasswordVisibility = () => {
    setShowConfirmarPassword(!showConfirmarPassword);
  };

  // Validar los campos
  const validarCampos = () => {
    const {
        nombreCompleto,
        fechaNacimiento,
        genero,
        correo,
        telefono,
        password,
        confirmarPassword
    } = formData;

    const nuevosErrores = {};

    if (!nombreCompleto)
      nuevosErrores.nombreCompleto = "El nombre es obligatorio.";
    if (!fechaNacimiento) nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    if (!genero) nuevosErrores.genero = "El genero es obligatorio";
    if (!correo.includes("@")) nuevosErrores.correo = "Correo inválido.";
    if (telefono.length !== 8) nuevosErrores.telefono = "Teléfono inválido.";
    if (!password) nuevosErrores.password = "La contraseña es obligatoria";
    if (confirmarPassword !== password) nuevosErrores.confirmarPassword = "La contraseña es diferente";
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) {
      setAlerta({
        mensaje: "Por favor, complete todos los campos correctamente",
        tipo: "danger",
      });
      return;
    }

    try {
      const response = await fetch(
        "http://api.ejemplo.com/registro-usuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setAlerta({
          mensaje: "Datos registrados correctamente, revise su e-mail",
          tipo: "success",
        });
      } else {
        setAlerta({
          mensaje: "Ocurrió un error al tratar de registrar sus datos",
          tipo: "danger",
        });
      }
    } catch (error) {
      setAlerta({
        mensaje: "Ocurrió un error al tratar de registrar sus datos",
        tipo: "danger",
      });
    }
    window.scrollTo(0, 0);
    setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 5000); // Ocultar la alerta después de 5 segundos
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <Card
            className="p-4 shadow-lg"
            style={{ borderRadius: "20px", background: "#f8f9fa" }}
          >
            <h3 className="text-center mb-4" style={{ color: "#007bff" }}>
              Registro de Usuario
            </h3>
            {alerta.mensaje && (
              <Alert variant={alerta.tipo} className="mt-3">
                {alerta.mensaje}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Datos del Usuario */}
              <h5 className="text-primary">Datos del Usuario</h5>
              <hr />
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreCompleto"
                  placeholder="Ingrese su nombre completo"
                  onChange={handleInputChange}
                  value={formData.nombreCompleto}
                  isInvalid={!!errores.nombreCompleto}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.nombreCompleto}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha de nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  onChange={handleInputChange}
                  value={formData.fechaNacimiento}
                  isInvalid={!!errores.fechaNacimiento}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.fechaNacimiento}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Género</Form.Label>
                <Form.Select
                  name="genero"
                  onChange={handleInputChange}
                  value={formData.genero}
                  isInvalid={!!errores.genero}
                >
                  <option value="">Elige un género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errores.genero}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  placeholder="ejemplo@correo.com"
                  onChange={handleInputChange}
                  value={formData.correo}
                  isInvalid={!!errores.correo}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.correo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono (Guatemala)</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  placeholder="8 digitos sin espacios, ni guiones"
                  onChange={handleInputChange}
                  value={formData.telefono}
                  maxLength={12}
                  isInvalid={!!errores.telefono}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.telefono}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Ingrese su contraseña"
                    onChange={handleInputChange}
                    value={formData.password}
                    isInvalid={!!errores.password}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errores.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirmar contraseña</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showConfirmarPassword ? "text" : "password"}
                    name="confirmarPassword"
                    placeholder="Confirme su contraseña"
                    onChange={handleInputChange}
                    value={formData.confirmarPassword}
                    isInvalid={!!errores.confirmarPassword}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={toggleConfirmarPasswordVisibility}
                  >
                    {showConfirmarPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errores.confirmarPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-center mt-4">
                <Button type="submit" className="btn btn-primary">
                  Registrarse
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistroUsuario;

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

const RegistroConductor = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    edad: "",
    dpi: "",
    correo: "",
    genero: "",
    estadoCivil: "",
    direccion: "",
    foto: null,
    placa: "P",
    marca: "",
    anio: "",
    curriculum: null,
    fotoVehiculo: null,
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

  // Validar los campos
  const validarCampos = () => {
    const {
      nombreCompleto,
      telefono,
      edad,
      dpi,
      correo,
      genero,
      estadoCivil,
      direccion,
      foto,
      placa,
      marca,
      anio,
      curriculum,
      fotoVehiculo,
    } = formData;

    const nuevosErrores = {};

    if (!nombreCompleto)
      nuevosErrores.nombreCompleto = "El nombre es obligatorio.";
    if (telefono.length !== 8) nuevosErrores.telefono = "Teléfono inválido.";
    if (edad < 18 || edad > 99) nuevosErrores.edad = "Edad fuera de rango.";
    if (dpi.length !== 13) nuevosErrores.dpi = "DPI inválido.";
    if (!correo.includes("@")) nuevosErrores.correo = "Correo inválido.";
    if (!genero) nuevosErrores.genero = "Seleccione un género.";
    if (!estadoCivil) nuevosErrores.estadoCivil = "Seleccione un estado civil.";
    if (!direccion) nuevosErrores.direccion = "La dirección es obligatoria.";
    if (!foto) nuevosErrores.foto = "La foto es obligatoria.";
    if (placa.length !== 7) nuevosErrores.placa = "Placa inválida.";
    if (!marca) nuevosErrores.marca = "La marca del vehículo es obligatoria.";
    if (anio.length !== 4) nuevosErrores.anio = "Año inválido.";
    if (!curriculum) nuevosErrores.curriculum = "El curriculum es obligatorio.";
    if (!fotoVehiculo)
      nuevosErrores.fotoVehiculo = "La foto del vehículo es obligatoria.";

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
        "http://api.ejemplo.com/registro-conductor",
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
              Registro de Conductor
            </h3>
            {alerta.mensaje && (
              <Alert variant={alerta.tipo} className="mt-3">
                {alerta.mensaje}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Datos del Conductor */}
              <h5 className="text-primary">Datos del Conductor</h5>
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
                <Form.Label>Edad</Form.Label>
                <Form.Control
                  type="number"
                  name="edad"
                  placeholder="Solo mayores de 18 años"
                  min="18"
                  max="99"
                  onChange={handleInputChange}
                  value={formData.edad}
                  isInvalid={!!errores.edad}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.edad}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>DPI</Form.Label>
                <Form.Control
                  type="text"
                  name="dpi"
                  placeholder="DPI sin espacios, ni guiones"
                  onChange={handleInputChange}
                  value={formData.dpi}
                  maxLength={15}
                  isInvalid={!!errores.dpi}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.dpi}
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
                <Form.Label>Género</Form.Label>
                <Form.Select
                  name="genero"
                  onChange={handleInputChange}
                  value={formData.genero}
                  isInvalid={!!errores.genero}
                >
                  <option value="">Seleccione su género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errores.genero}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado Civil</Form.Label>
                <Form.Select
                  name="estadoCivil"
                  onChange={handleInputChange}
                  value={formData.estadoCivil}
                  isInvalid={!!errores.estadoCivil}
                >
                  <option value="">Seleccione su estado civil</option>
                  <option value="soltero">Soltero</option>
                  <option value="casado">Casado</option>
                  <option value="divorciado">Divorciado</option>
                  <option value="viudo">Viudo</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errores.estadoCivil}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Dirección de Domicilio</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  placeholder="Ingrese su dirección"
                  onChange={handleInputChange}
                  value={formData.direccion}
                  isInvalid={!!errores.direccion}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.direccion}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fotografía Personal</Form.Label>
                <Form.Control
                  type="file"
                  name="foto"
                  accept="image/*"
                  onChange={handleInputChange}
                  isInvalid={!!errores.foto}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.foto}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Datos del Vehículo */}
              <h5 className="text-primary mt-4">Datos del Vehículo</h5>
              <hr />

              <Form.Group className="mb-3">
                <Form.Label>Fotografía del Vehículo</Form.Label>
                <Form.Control
                  type="file"
                  name="fotoVehiculo"
                  accept="image/*"
                  onChange={handleInputChange}
                  isInvalid={!!errores.fotoVehiculo}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.fotoVehiculo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Número de Placa</Form.Label>
                <Form.Control
                  type="text"
                  name="placa"
                  placeholder="PXXX-XXX"
                  onChange={handleInputChange}
                  value={formData.placa}
                  maxLength={7}
                  isInvalid={!!errores.placa}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.placa}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Marca del Vehículo</Form.Label>
                <Form.Control
                  type="text"
                  name="marca"
                  placeholder="Ingrese la marca del vehículo"
                  onChange={handleInputChange}
                  value={formData.marca}
                  isInvalid={!!errores.marca}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.marca}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Año del Vehículo</Form.Label>
                <Form.Control
                  type="number"
                  name="anio"
                  placeholder="Ingrese el año del vehículo"
                  onChange={handleInputChange}
                  value={formData.anio}
                  maxLength={4}
                  isInvalid={!!errores.anio}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.anio}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Curriculum Vitae (PDF)</Form.Label>
                <Form.Control
                  type="file"
                  name="curriculum"
                  accept=".pdf"
                  onChange={handleInputChange}
                  isInvalid={!!errores.curriculum}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.curriculum}
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

export default RegistroConductor;

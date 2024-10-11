import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
  Modal,
} from "react-bootstrap";

const RegistroConductor = () => {
  const [formData, setFormData] = useState({
    NombreCompleto: "",
    Telefono: "",
    Edad: "",
    DPI: "",
    CorreoElectronico: "",
    Genero: "",
    EstadoCivil: "",
    Direccion: "",
    Fotografia: null,
    NumeroPlaca: "",
    MarcaVehiculo: "",
    AnioVehiculo: "",
    CV: null,
    FotografiaVehiculo: null,
  });

  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const [errores, setErrores] = useState({});
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: "",
    body: "",
  });

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
      NombreCompleto,
      Telefono,
      Edad,
      DPI,
      CorreoElectronico,
      Genero,
      EstadoCivil,
      Direccion,
      Fotografia,
      NumeroPlaca,
      MarcaVehiculo,
      AnioVehiculo,
      CV,
      FotografiaVehiculo,
    } = formData;

    const nuevosErrores = {};

    if (!NombreCompleto)
      nuevosErrores.NombreCompleto = "El nombre es obligatorio.";
    if (Telefono.length !== 8) nuevosErrores.Telefono = "Teléfono inválido.";
    if (Edad < 18 || Edad > 99) nuevosErrores.Edad = "Edad fuera de rango.";
    if (DPI.length !== 13) nuevosErrores.DPI = "DPI inválido.";
    if (!CorreoElectronico.includes("@"))
      nuevosErrores.CorreoElectronico = "CorreoElectronico inválido.";
    if (!Genero) nuevosErrores.Genero = "Seleccione un género.";
    if (!EstadoCivil) nuevosErrores.EstadoCivil = "Seleccione un estado civil.";
    if (!Direccion) nuevosErrores.Direccion = "La dirección es obligatoria.";
    if (!Fotografia) nuevosErrores.Fotografia = "La Fotografia es obligatoria.";
    if (NumeroPlaca.length !== 6)
      nuevosErrores.NumeroPlaca = "NumeroPlaca inválida.";
    if (!MarcaVehiculo)
      nuevosErrores.MarcaVehiculo =
        "La MarcaVehiculo del vehículo es obligatoria.";
    if (AnioVehiculo.length !== 4) nuevosErrores.AnioVehiculo = "Año inválido.";
    if (!CV) nuevosErrores.CV = "El CV es obligatorio.";
    if (!FotografiaVehiculo)
      nuevosErrores.FotografiaVehiculo = "La foto del vehículo es obligatoria.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) {
      setModalInfo({
        show: true,
        title: "AVISO",
        body: <p>Existen campos vacios, todos los campos son obligatorios.</p>,
        headerClass: "bg-danger text-white", //color de encabezado
        buttonClass: "bg-danger text-white", //color del boton
      });
      return;
    }

    try {
      const response = await fetch(
        "http://34.173.74.193:8080/api/driver/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        setModalInfo({
          show: true,
          title: data.message,
          body: (
            <div>
              <p>Código de Empleado: {data.CodigoEmpleado}</p>
              <p>Contraseña Temporal: {data.ContrasenaTemporal}</p>
              <p>Código de Conductor: {data.ConductorID}</p>
              <p>
                Guarde estos datos en un lugar seguro ya que son sus
                credenciales de inicio de sesión y REVISE SU CORREO ELECTRONICO
                para validar su autenticidad.
              </p>
            </div>
          ),
          headerClass: "bg-success text-white",
          buttonClass: "bg-success text-white",
        });
      } else if (response.status === 400) {
        setModalInfo({
          show: true,
          title: "Error en el registro",
          body: <p>{data.error}</p>,
          headerClass: "bg-danger text-white",
          buttonClass: "bg-danger text-white",
        });
      }
    } catch (error) {
      setModalInfo({
        show: true,
        title: "Error de conexión",
        body: <p>Ocurrió un error al tratar de registrar sus datos.</p>,
        headerClass: "bg-danger text-white",
        buttonClass: "bg-danger text-white",
      });
    }
    //window.scrollTo(0, 0);
  };
  const handleCloseModal = () => setModalInfo({ ...modalInfo, show: false });

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
              {/* DATOS DEL CONDUCTOR */}
              <h5 className="text-primary">Datos del Conductor</h5>
              <hr />
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="NombreCompleto"
                  placeholder="Ingrese su nombre completo"
                  onChange={handleInputChange}
                  value={formData.NombreCompleto}
                  isInvalid={!!errores.NombreCompleto}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.NombreCompleto}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono (Guatemala)</Form.Label>
                <Form.Control
                  type="text"
                  name="Telefono"
                  placeholder="8 digitos sin espacios, ni guiones"
                  onChange={handleInputChange}
                  value={formData.Telefono}
                  maxLength={12}
                  isInvalid={!!errores.Telefono}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.Telefono}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Edad</Form.Label>
                <Form.Control
                  type="number"
                  name="Edad"
                  placeholder="Solo mayores de 18 años"
                  min="18"
                  max="99"
                  onChange={handleInputChange}
                  value={formData.Edad}
                  isInvalid={!!errores.Edad}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.Edad}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>DPI</Form.Label>
                <Form.Control
                  type="text"
                  name="DPI"
                  placeholder="DPI sin espacios, ni guiones"
                  onChange={handleInputChange}
                  value={formData.DPI}
                  maxLength={15}
                  isInvalid={!!errores.DPI}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.DPI}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CorreoElectronico Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="CorreoElectronico"
                  placeholder="ejemplo@CorreoElectronico.com"
                  onChange={handleInputChange}
                  value={formData.CorreoElectronico}
                  isInvalid={!!errores.CorreoElectronico}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.CorreoElectronico}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Género</Form.Label>
                <Form.Select
                  name="Genero"
                  onChange={handleInputChange}
                  value={formData.Genero}
                  isInvalid={!!errores.Genero}
                >
                  <option value="">Seleccione su género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errores.Genero}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado Civil</Form.Label>
                <Form.Select
                  name="EstadoCivil"
                  onChange={handleInputChange}
                  value={formData.EstadoCivil}
                  isInvalid={!!errores.EstadoCivil}
                >
                  <option value="">Seleccione su estado civil</option>
                  <option value="soltero">Soltero</option>
                  <option value="casado">Casado</option>
                  <option value="divorciado">Divorciado</option>
                  <option value="viudo">Viudo</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errores.EstadoCivil}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Dirección de Domicilio</Form.Label>
                <Form.Control
                  type="text"
                  name="Direccion"
                  placeholder="Ingrese su dirección"
                  onChange={handleInputChange}
                  value={formData.Direccion}
                  isInvalid={!!errores.Direccion}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.Direccion}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fotografía Personal</Form.Label>
                <Form.Control
                  type="file"
                  name="Fotografia"
                  accept="image/*"
                  onChange={handleInputChange}
                  isInvalid={!!errores.Fotografia}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.Fotografia}
                </Form.Control.Feedback>
              </Form.Group>

              {/* DATOS DEL VEHICULO */}
              <h5 className="text-primary mt-4">Datos del Vehículo</h5>
              <hr />

              <Form.Group className="mb-3">
                <Form.Label>Fotografía del Vehículo</Form.Label>
                <Form.Control
                  type="file"
                  name="FotografiaVehiculo"
                  accept="image/*"
                  onChange={handleInputChange}
                  isInvalid={!!errores.FotografiaVehiculo}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.FotografiaVehiculo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Número de Placa</Form.Label>
                <Form.Control
                  type="text"
                  name="NumeroPlaca"
                  placeholder="Ejemplo: 457CFT"
                  onChange={handleInputChange}
                  value={formData.NumeroPlaca}
                  maxLength={6}
                  isInvalid={!!errores.NumeroPlaca}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.NumeroPlaca}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>MarcaVehiculo del Vehículo</Form.Label>
                <Form.Control
                  type="text"
                  name="MarcaVehiculo"
                  placeholder="Ingrese la Marca del vehículo"
                  onChange={handleInputChange}
                  value={formData.MarcaVehiculo}
                  isInvalid={!!errores.MarcaVehiculo}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.MarcaVehiculo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Año del Vehículo</Form.Label>
                <Form.Control
                  type="number"
                  name="AnioVehiculo"
                  placeholder="Ingrese el año del vehículo"
                  onChange={handleInputChange}
                  value={formData.AnioVehiculo}
                  maxLength={4}
                  isInvalid={!!errores.AnioVehiculo}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.AnioVehiculo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CV Vitae (PDF)</Form.Label>
                <Form.Control
                  type="file"
                  name="CV"
                  accept=".pdf"
                  onChange={handleInputChange}
                  isInvalid={!!errores.CV}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.CV}
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
      <Modal
        show={modalInfo.show}
        onHide={handleCloseModal}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="rounded"
      >
        <Modal.Header closeButton className={modalInfo.headerClass}>
          <Modal.Title>{modalInfo.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div
            className="alert alert-warning d-flex align-items-center"
            role="alert"
          >
            <i
              className="bi bi-exclamation-triangle-fill me-3"
              style={{ fontSize: "2rem", color: "#ffcc00" }}
            ></i>
            <div>{modalInfo.body}</div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-light"
            className={`${modalInfo.buttonClass} px-4 py-2 rounded-pill shadow-sm`}
            onClick={handleCloseModal}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
      ;
    </Container>
  );
};

export default RegistroConductor;

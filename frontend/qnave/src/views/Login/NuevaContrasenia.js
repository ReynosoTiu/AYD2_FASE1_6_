import API_URL from "../../config/config";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";

function CambioContrasenia() {
  const { userId } = useParams(); // Recibe el userId desde la URL
  const navigate = useNavigate();

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const handleCambioContrasenia = async (e) => {
    e.preventDefault();

    // Validaciones de contraseña nueva
    if (nuevaContrasena.length < 8) {
      setMensaje("La nueva contraseña debe tener al menos 8 caracteres.");
      setTipoMensaje("danger");
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setMensaje("Las nuevas contraseñas no coinciden.");
      setTipoMensaje("danger");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/general/pwdChange`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UsuarioID: userId, // Obtenido desde la URL
          ContrasenaActual: contrasenaActual,
          NuevaContrasena: nuevaContrasena,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMensaje("Cambio de contraseña exitoso");
        setTipoMensaje("success");

        // Redirigir a la página de inicio de sesión después de 5 segundos
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        // Manejo de errores
        setMensaje(data.error || "Error al cambiar la contraseña.");
        setTipoMensaje("danger");
      }
    } catch (error) {
      setMensaje("Ocurrió un error al intentar cambiar la contraseña.");
      setTipoMensaje("danger");
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 5000);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card
            className="p-4 shadow-lg"
            style={{ borderRadius: "20px", background: "#f8f9fa" }}
          >
            <h2 className="text-center mb-4" style={{ color: "#007bff" }}>
              Cambiar Contraseña
            </h2>
            {mensaje && (
              <Alert
                variant={tipoMensaje}
                className="mt-3 mx-auto"
                style={{ width: "80%" }}
              >
                {mensaje}
              </Alert>
            )}
            <Form onSubmit={handleCambioContrasenia}>
              <Form.Group controlId="contrasenaActual" className="mb-3">
                <Form.Label
                  className="text-center w-100"
                  style={{ fontSize: "1.2rem", color: "#007bff" }}
                >
                  Contraseña Actual:
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña actual"
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "1rem",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="nuevaContrasena" className="mb-3">
                <Form.Label
                  className="text-center w-100"
                  style={{ fontSize: "1.2rem", color: "#007bff" }}
                >
                  Nueva Contraseña:
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su nueva contraseña"
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "1rem",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="confirmarContrasena" className="mb-3">
                <Form.Label
                  className="text-center w-100"
                  style={{ fontSize: "1.2rem", color: "#007bff" }}
                >
                  Confirmar Nueva Contraseña:
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirme su nueva contraseña"
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "1rem",
                  }}
                />
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    borderRadius: "10px",
                    padding: "10px 30px",
                    fontSize: "1.2rem",
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#0056b3")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#007bff")
                  }
                >
                  Cambiar Contraseña
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CambioContrasenia;

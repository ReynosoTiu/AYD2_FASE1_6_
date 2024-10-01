import React, { useState, useEffect } from "react";
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
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      nombre_usuario: nombreUsuario,
      contrasenia: contrasenia,
    };

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.status === 200) {
        const data = await response.json();
        setMensaje(data.message);
        setTipoMensaje("success");

        // Redirigir según el rol
        localStorage.setItem("rol", data.user.role);
        if (data.user.role === "ABOGADO") {
          navigate("/abogado");
        } else if (data.user.role === "ASISTENTE") {
          navigate("/asistente");
        }
      } else if (response.status === 403) {
        setMensaje("El nombre de usuario no existe");
        setTipoMensaje("danger");
      } else if (response.status === 401) {
        setMensaje("Contraseña incorrecta");
        setTipoMensaje("danger");
      } else if (response.status === 500) {
        setMensaje(
          "Error del servidor. Por favor, inténtelo de nuevo más tarde."
        );
        setTipoMensaje("danger");
      }
    } catch (error) {
      setMensaje("Ocurrió un error al intentar iniciar sesión");
      setTipoMensaje("danger");
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card
            className="p-4 shadow-lg"
            style={{ borderRadius: "20px", background: "#f8f9fa" }}
          >
            <h3 className="text-center mb-4" style={{ color: "#007bff" }}>
              Iniciar Sesión
            </h3>
            {mensaje && (
              <Alert
                variant={tipoMensaje}
                className="mt-3 mx-auto"
                style={{ width: "80%" }}
              >
                {mensaje}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreUsuario" className="mb-3">
                <Form.Label
                  className="text-center w-100"
                  style={{ fontSize: "1.2rem", color: "#007bff" }}
                >
                  Nombre de Usuario
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su nombre de usuario"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "1rem",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="contrasenia" className="mb-3">
                <Form.Label
                  className="text-center w-100"
                  style={{ fontSize: "1.2rem", color: "#007bff" }}
                >
                  Contraseña
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    padding: "15px",
                    fontSize: "1rem",
                  }}
                />
              </Form.Group>

              <div className="d-flex justify-content-center mb-3">
                <Link
                  to="/recuperar-contrasenia"
                  style={{ color: "#007bff", textDecoration: "none" }}
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                >
                  Recuperar Contraseña
                </Link>
              </div>

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
                  Ingresar
                </Button>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Link
                  to="/registro-usuario"
                  className="mx-3"
                  style={{ color: "#007bff", textDecoration: "none" }}
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                >
                  Registrar Usuario
                </Link>
                <Link
                  to="/registro-conductor"
                  className="mx-3"
                  style={{ color: "#007bff", textDecoration: "none" }}
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                >
                  Registrar Conductor
                </Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;

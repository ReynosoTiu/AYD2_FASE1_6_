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
      CodigoEmpleado: nombreUsuario,
      Contrasena: contrasenia,
    };

    try {
      const response = await fetch(
        "http://34.173.74.193:5000/api/general/logIn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        // Caso de éxito (código 200)
        setMensaje(data.message);
        setTipoMensaje("success");

        // Verificar si es necesario redirigir al cambio de contraseña
        if (data.temporal) {
          // Redirigir al cambio de contraseña y enviar el userId
          navigate(`/cambioContrasenia/${data.userId}`);
        } else {
          //--->Guardar userId en localStorage
          localStorage.setItem("userId", data.userId);

          // Redirigir según el tipo de usuario
          if (data.tipoUsuario === "Administrador") {
            navigate("/administrador"); //FALTA REDIRECCIONAR LA PAGINA DEADMINISTRADOR
          } else if (data.tipoUsuario === "Usuario") {
            navigate("/"); //FALTA REDIRECCIONAR LA PAGINA DE USUARIO
          } else if (data.tipoUsuario === "Conductor") {
            navigate("/conductor");
          } else if (data.tipoUsuario === "Asistente") {
            navigate("/asistente");
          }
        }
      } else if (response.status === 400 || response.status === 404) {
        // Manejo de errores 400 y 404
        setMensaje(data.error);
        setTipoMensaje("danger");
      } else if (response.status === 401) {
        // Manejo de error 401
        setMensaje("Contraseña incorrecta");
        setTipoMensaje("danger");
      } else if (response.status === 500) {
        // Manejo de error 500
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
                  placeholder="Ingrese e-mail o codigo de empleado"
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
                  //FALTA REDIRIGIR LA CONTRASEÑA A SU PAGINA CORRESPONDIENTE
                  to="/"
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

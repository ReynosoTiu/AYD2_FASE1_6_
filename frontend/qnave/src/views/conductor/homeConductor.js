import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Modal, Alert, Form } from "react-bootstrap";

function HomeConductor() {
  const [trips, setTrips] = useState([]); // Inicializa como un array vacío
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // Estado para el mensaje temporal
  const [acceptedTripId, setAcceptedTripId] = useState(null); // Estado para el viaje aceptado
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Estado para el modal de pago
  const [currentTripId, setCurrentTripId] = useState(null); // Estado para el viaje actual
  //PARA LA CANCELACION
  const [showCancelModal, setShowCancelModal] = useState(false); // Estado para el modal de cancelar
  const [cancelReason, setCancelReason] = useState(""); // Motivo de cancelación
  const [cancelJustification, setCancelJustification] = useState(""); // Justificación opcional

  // PARA REPORTAR PROBLEMA
  const [showReportModal, setShowReportModal] = useState(false); // Estado para el modal de reportar problema
  const [reportCategory, setReportCategory] = useState(""); // Categoría del problema
  const [reportDescription, setReportDescription] = useState(""); // Descripción del problema
  const [reportImage, setReportImage] = useState(null); // Imagen del problema (base64)
  const [imageError, setImageError] = useState(false); // Estado para errores de la imagen

  // Función para obtener la lista de viajes
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(
          "http://34.173.74.193:5000/api/driver/getTripList"
        );
        if (!response.ok) {
          throw new Error("Error en la solicitud de viajes");
        }
        const data = await response.json();
        // Verifica si data es un array y actúa en consecuencia
        if (Array.isArray(data)) {
          setTrips(data);
        } else {
          console.error("La respuesta de la API no es un array", data);
          setTrips([]); // Si no es un array, establece trips como vacío
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Función para obtener la información del usuario
  const handleViewProfile = async (usuarioID) => {
    try {
      const response = await fetch(
        `http://34.173.74.193:5000/api/driver/getUserInfo/${usuarioID}`
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud de información del usuario");
      }
      const data = await response.json();
      setUserInfo(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Función para aceptar el viaje
  const handleAcceptTrip = async (viajeID) => {
    const conductorID = localStorage.getItem("userId"); // Obtiene el ConductorID del localStorage
    const tripData = {
      ConductorID: conductorID,
      ViajeID: viajeID,
    };

    try {
      const response = await fetch(
        "http://34.173.74.193:5000/api/driver/acceptDrive",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        }
      );

      if (response.ok) {
        setMessage("Viaje iniciado con éxito");
        setAcceptedTripId(viajeID); // Establece el viaje aceptado
      } else {
        setMessage("No fue posible aceptar el viaje");
      }
    } catch (error) {
      console.error("Error al aceptar el viaje:", error);
      setMessage("No fue posible aceptar el viaje");
    }

    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  // Función para cancelar el viaje
  const handleCancelTrip = () => {
    // Implementar lógica para cancelar el viaje
    setShowCancelModal(true); // Muestra el modal de cancelar viaje
  };

  // Función para procesar la cancelación del viaje
  const processCancelTrip = async () => {
    if (!cancelReason) {
      setMessage("El motivo de cancelación es obligatorio");
      return;
    }

    const conductorID = localStorage.getItem("userId"); // Obtiene el ConductorID del localStorage
    const tripData = {
      viajeId: currentTripId,
      motivoCancelacion: cancelReason,
      justificacion: cancelJustification || null,
      usuarioId: null,
      conductorId: conductorID,
    };

    try {
      const response = await fetch(
        "http://34.173.74.193:5000/api/driver/cancelDrive",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        }
      );

      if (response.ok) {
        setMessage("Cancelación exitosa");
        setTimeout(() => {
          window.location.reload(); // Refresca la página después de 5 segundos
        }, 5000);
      } else {
        setMessage("No se pudo cancelar el viaje");
      }
    } catch (error) {
      console.error("Error al cancelar el viaje:", error);
      setMessage("No se pudo cancelar el viaje");
    }

    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
      setMessage("");
    }, 5000);
    setShowCancelModal(false); // Cierra el modal de cancelación
  };

  // Función para convertir la imagen a base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Función para manejar la subida de la imagen
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setReportImage(base64);
      } catch (error) {
        console.error("Error al convertir la imagen:", error);
        setImageError(true);
      }
    }
  };

  // Función para enviar el reporte de problema
  const handleSendReport = async () => {
    if (!reportCategory || !reportDescription) {
      setMessage("La categoría y descripción son obligatorias");
      return;
    }

    const conductorID = localStorage.getItem("userId"); // Obtiene el ConductorID del localStorage
    const tripData = {
      viajeId: currentTripId,
      usuarioId: null,
      conductorId: conductorID,
      categoria: reportCategory,
      descripcion: reportDescription,
      evidencia: reportImage || null,
    };

    try {
      const response = await fetch(
        "http://34.173.74.193:5000/api/driver/reportProblem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        }
      );

      if (response.status === 201) {
        setMessage("Problema reportado exitosamente");
      } else {
        setMessage("Error al reportar el problema");
      }
    } catch (error) {
      console.error("Error al reportar el problema:", error);
      setMessage("Error al reportar el problema");
    }

    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
      setMessage("");
    }, 5000);
    setShowReportModal(false); // Cierra el modal de reporte
  };

  // Función para mostrar el modal de reporte
  const handleReportTrip = (viajeID) => {
    setCurrentTripId(viajeID); // Establece el viaje actual
    setShowReportModal(true); // Muestra el modal de reportar problema
  };

  // Función para cerrar el modal de reporte
  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportCategory("");
    setReportDescription("");
    setReportImage(null);
    setImageError(false);
  };

  // Función para mostrar el modal de pago
  const handleFinalizeTrip = (viajeID) => {
    setCurrentTripId(viajeID); // Establece el viaje actual
    setShowPaymentModal(true); // Muestra el modal de pago
  };

  // Función para procesar el pago
  const processPayment = async (pagoRecibido) => {
    const tripData = {
      ViajeID: currentTripId,
      PagoRecibido: pagoRecibido,
    };

    try {
      const response = await fetch(
        "http://34.173.74.193:5000/api/driver/endDrive",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        }
      );

      if (response.ok) {
        setMessage("Viaje finalizado");
        // Añade un delay de 5 segundos antes de refrescar la página
        setTimeout(() => {
          window.location.reload(); // Refresca la página
        }, 5000); // 5000 ms = 5 segundos
      } else {
        setMessage("No se pudo finalizar el viaje");
      }
    } catch (error) {
      console.error("Error al finalizar el viaje:", error);
      setMessage("No se pudo finalizar el viaje");
    }

    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
      setMessage("");
    }, 5000);
    setShowPaymentModal(false); // Cierra el modal de pago
    setAcceptedTripId(null); // Reiniciar el viaje aceptado
  };

  // Función para cerrar el modal de perfil
  const handleCloseModal = () => {
    setShowModal(false);
    setUserInfo(null);
  };

  // Función para cerrar el modal de pago
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setCurrentTripId(null); // Reinicia el ID del viaje actual
  };

  // Función para cerrar el modal de cancelar
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason("");
    setCancelJustification("");
  };

  return (
    <div className="container mt-4">
      {message && <Alert variant="info">{message}</Alert>}{" "}
      {/* Mostrar mensaje temporal */}
      <Row>
        {loading ? (
          <p>Cargando...</p>
        ) : trips.length > 0 ? (
          trips.map((trip) => (
            <Col md={3} key={trip.ViajeID} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Viaje ID: {trip.ViajeID}</Card.Title>
                  <Card.Text>
                    <strong>Zona Inicio:</strong> {trip.ZonaInicio}
                    <br />
                    <strong>Zona Fin:</strong> {trip.ZonaFin}
                    <br />
                    <strong>Tarifa:</strong> ${trip.Tarifa}
                  </Card.Text>
                  <Button
                    onClick={() => handleViewProfile(trip.UsuarioID)}
                    className="me-2"
                  >
                    Ver perfil
                  </Button>
                  <Button
                    onClick={() => handleAcceptTrip(trip.ViajeID)}
                    variant="success"
                    disabled={acceptedTripId !== null} // Bloquea el botón si ya hay un viaje aceptado
                  >
                    Aceptar viaje
                  </Button>
                  {acceptedTripId === trip.ViajeID && ( // Mostrar botones adicionales solo si se ha aceptado el viaje
                    <div className="mt-3">
                      <Button
                        variant="danger"
                        onClick={handleCancelTrip}
                        className="me-2"
                      >
                        Cancelar viaje
                      </Button>
                      <Button
                        variant="warning"
                        onClick={handleReportTrip}
                        className="me-2"
                      >
                        Reportar viaje
                      </Button>
                      <Button
                        variant="info"
                        onClick={() => handleFinalizeTrip(trip.ViajeID)}
                      >
                        Finalizar viaje
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No hay viajes disponibles.</p>
        )}
      </Row>
      {/* Modal para la información del usuario */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Información del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userInfo ? (
            <>
              <p>
                <strong>Nombre Completo:</strong> {userInfo.NombreCompleto}
              </p>
              <p>
                <strong>Teléfono:</strong> {userInfo.Telefono}
              </p>
              <p>
                <strong>Correo Electrónico:</strong>{" "}
                {userInfo.CorreoElectronico}
              </p>
            </>
          ) : (
            <p>Cargando información del usuario...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para el pago */}
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
        <Modal.Header closeButton>
          <Modal.Title>¿El pago fue realizado?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            variant="success"
            onClick={() => processPayment(true)}
            className="me-2"
          >
            Sí
          </Button>
          <Button
            variant="danger"
            onClick={() => processPayment(false)}
            className="me-2"
          >
            No
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaymentModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal de cancelar viaje */}
      <Modal show={showCancelModal} onHide={handleCloseCancelModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Viaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="motivoCancelacion">
              <Form.Label>Motivo de cancelación (obligatorio)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="justificacion" className="mt-3">
              <Form.Label>Justificación (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={cancelJustification}
                onChange={(e) => setCancelJustification(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCancelModal}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={processCancelTrip}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para reportar problemas */}
      <Modal show={showReportModal} onHide={handleCloseReportModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reportar Problema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reportCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                required
              >
                <option value="">Seleccione una categoría</option>
                <option value="problemas con el pasajero">
                  Problemas con el pasajero
                </option>
                <option value="fallo tecnico">Fallo técnico</option>
                <option value="problema de pago">Problema de pago</option>
                <option value="otro">Otro</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="reportDescription" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="reportImage" className="mt-3">
              <Form.Label>Adjuntar Imagen (opcional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imageError && (
                <p className="text-danger">Error al subir la imagen</p>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReportModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSendReport}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HomeConductor;

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Modal, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from '../../components/header_usuario/headerUsuario';
import API_URL from "../../config/config";

const CancelarViaje = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal de éxito
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const statusViaje = 'En curso';
  const [loading, setLoading] = useState(true);
  const [viajeActivo, setViajeActivo] = useState(false);
  const [noViajeActivo, setNoViajeActivo] = useState(false);
  const [error, setError] = useState(false);
  const [viaje, setViaje] = useState(null);
  const userId = localStorage.getItem("userId");

  const idUsuario = localStorage.getItem('userId');

  useEffect(() => {
    const verificarViajeActivo = async () => {
      try {
        const response = await fetch(`${API_URL}/users/active_trip/${idUsuario}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setViaje(data[0]);
            setViajeActivo(true);
          } else {
            setNoViajeActivo(true);
          }
        } else {
          throw new Error('Error al verificar el viaje activo.');
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    verificarViajeActivo();
  }, [idUsuario]);

  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => setShowModal(false);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  const handleCancelViaje = async () => {
    const datosAEnviar = {
      viajeId: viaje.idViaje,
      motivoCancelacion: motivoCancelacion,
      justificacion: 'Cancelacion',
      usuarioId: userId,
      conductorId: viaje.idConductor,
      quienCancela: 'Usuario'
    };

    try {
      const response = await fetch(`${API_URL}/users/cancel_trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosAEnviar),
      });

      if (response.ok) {
        setViajeActivo(false); // Desactivar viaje en la interfaz
        setShowModal(false);
        setShowSuccessModal(true); // Mostrar el modal de éxito
      } else {
        throw new Error('Error al cancelar el viaje.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al cancelar el viaje.');
    }
  };

  const renderLoadingModal = () => (
    <Modal show={loading} backdrop="static" centered>
      <Modal.Body>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Verificando estado del viaje...</p>
      </Modal.Body>
    </Modal>
  );

  const renderNoViajeModal = () => (
    <Modal show={noViajeActivo} onHide={() => setNoViajeActivo(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>No hay Viaje Activo</Modal.Title>
      </Modal.Header>
      <Modal.Body>No tienes ningún viaje activo actualmente.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setNoViajeActivo(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Viaje Cancelado</Modal.Title>
      </Modal.Header>
      <Modal.Body>El viaje ha sido cancelado exitosamente.</Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleCloseSuccessModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (error) return <div>Error al verificar el viaje activo.</div>;

  return (
    <>
      <HeaderUsuario />
      {renderLoadingModal()}
      {renderNoViajeModal()}
      {renderSuccessModal()} {/* Modal de éxito */}
      {!loading && viajeActivo && (
        <Container className="mt-5">
          <Card className="mx-auto mb-4 p-3 shadow-smp-4 border rounded shadow" style={{ maxWidth: '40%' }}>
            <h2 className="text-center mb-4">Información del Viaje</h2>
            <Form>
              <Form.Group controlId="puntoA" className="mb-3">
                <Form.Label>Punto de Partida A</Form.Label>
                <Form.Control type="text" value={viaje.puntoPartida} readOnly />
              </Form.Group>

              <Form.Group controlId="puntoB" className="mb-3">
                <Form.Label>Punto de Llegada B</Form.Label>
                <Form.Control type="text" value={viaje.puntoLlegada} readOnly />
              </Form.Group>

              <Form.Group controlId="tarifa" className="mb-3">
                <Form.Label>Tarifa del Viaje</Form.Label>
                <Form.Control type="text" value={`Q ${viaje.Tarifa}`} readOnly />
              </Form.Group>

              <Form.Group controlId="statusViaje" className="mb-3">
                <Form.Label>Estado del Viaje</Form.Label>
                <Form.Control type="text" value={statusViaje} readOnly />
              </Form.Group>

              {statusViaje !== 'Cancelado' && (
                <Row className="mt-3">
                  <Col className="text-end">
                    <Button variant="danger" onClick={handleShowModal}>
                      Cancelar Viaje
                    </Button>
                  </Col>
                </Row>
              )}
            </Form>
          </Card>
        </Container>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Viaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="motivoCancelacion">
            <Form.Label>Motivo de Cancelación</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={motivoCancelacion}
              onChange={(e) => setMotivoCancelacion(e.target.value)}
              placeholder="Escribe el motivo de la cancelación"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelViaje}
            disabled={!motivoCancelacion.trim()}
          >
            Confirmar Cancelación
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelarViaje;

import React, { useState } from 'react';
import { Container, Card, Form, Button, Modal, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from '../../components/header_usuario/headerUsuario';

const CancelarViaje = () => {
  const [showModal, setShowModal] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [statusViaje, setStatusViaje] = useState('En curso');
  const tarifa = 120;
  const puntoA = 'Zona 1';
  const puntoB = 'Zona 10';

  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => setShowModal(false);

  const handleCancelViaje = () => {
    setStatusViaje('Cancelado');
    setShowModal(false);
  };

  return (
    <>
      <HeaderUsuario />
      <Container className="mt-5">
        <Card className="mx-auto mb-4 p-3 shadow-smp-4 border rounded shadow" style={{ maxWidth: '40%' }}>
          <h2 className="text-center mb-4">Información del Viaje</h2>
          <Form>
            <Form.Group controlId="puntoA" className="mb-3">
              <Form.Label>Punto de Partida A</Form.Label>
              <Form.Control type="text" value={puntoA} readOnly />
            </Form.Group>

            <Form.Group controlId="puntoB" className="mb-3">
              <Form.Label>Punto de Llegada B</Form.Label>
              <Form.Control type="text" value={puntoB} readOnly />
            </Form.Group>

            <Form.Group controlId="tarifa" className="mb-3">
              <Form.Label>Tarifa del Viaje</Form.Label>
              <Form.Control type="text" value={`Q${tarifa}`} readOnly />
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

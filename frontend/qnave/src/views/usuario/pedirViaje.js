import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from "../../components/header_usuario/headerUsuario";
import API_URL from "../../config/config";

const puntoPartidaA = [
  { id: 1, title: 'Zona 1' },
  { id: 2, title: 'Zona 2' },
  { id: 3, title: 'Zona 3' },
  { id: 4, title: 'Zona 4' },
  { id: 5, title: 'Zona 5' },
  { id: 6, title: 'Zona 6' },
  { id: 7, title: 'Zona 7' },
  { id: 8, title: 'Zona 8' },
  { id: 9, title: 'Zona 9' },
  { id: 10, title: 'Zona 10' },
  { id: 11, title: 'Zona 11' }
];

const puntoPartidaB = [
  { id: 2, title: 'Zona 2' },
  { id: 3, title: 'Zona 3' },
  { id: 4, title: 'Zona 4' },
  { id: 5, title: 'Zona 5' },
  { id: 6, title: 'Zona 6' },
  { id: 7, title: 'Zona 7' },
  { id: 8, title: 'Zona 8' },
  { id: 9, title: 'Zona 9' },
  { id: 10, title: 'Zona 10' },
  { id: 11, title: 'Zona 11' },
  { id: 12, title: 'Zona 12' }
];

const tarifas = {
  'Zona 1': { 'Zona 2': 10.00, 'Zona 3': 15.00, 'Zona 4': 20.00, 'Zona 5': 20.00, 'Zona 6': 25.00, 'Zona 7': 30.00, 'Zona 8': 30.00, 'Zona 9': 40.00, 'Zona 10': 50.00, 'Zona 11': 50.00, 'Zona 12': 25.00 },
  'Zona 2': { 'Zona 3': 25.00, 'Zona 4': 25.00, 'Zona 5': 25.00, 'Zona 6': 30.00, 'Zona 7': 40.00, 'Zona 8': 40.00, 'Zona 9': 60.00, 'Zona 10': 70.00, 'Zona 11': 50.00, 'Zona 12': 35.00 },
  'Zona 3': { 'Zona 4': 20.00, 'Zona 5': 30.00, 'Zona 6': 35.00, 'Zona 7': 25.00, 'Zona 8': 25.00, 'Zona 9': 40.00, 'Zona 10': 45.00, 'Zona 11': 40.00, 'Zona 12': 30.00 },
  'Zona 4': { 'Zona 5': 15.00, 'Zona 6': 25.00, 'Zona 7': 25.00, 'Zona 8': 25.00, 'Zona 9': 15.00, 'Zona 10': 30.00, 'Zona 11': 35.00, 'Zona 12': 35.00 },
  'Zona 5': { 'Zona 6': 15.00, 'Zona 7': 25.00, 'Zona 8': 35.00, 'Zona 9': 25.00, 'Zona 10': 35.00, 'Zona 11': 40.00, 'Zona 12': 40.00 },
  'Zona 6': { 'Zona 7': 30.00, 'Zona 8': 35.00, 'Zona 9': 40.00, 'Zona 10': 50.00, 'Zona 11': 65.00, 'Zona 12': 60.00 },
  'Zona 7': { 'Zona 8': 25.00, 'Zona 9': 35.00, 'Zona 10': 40.00, 'Zona 11': 40.00, 'Zona 12': 40.00 },
  'Zona 8': { 'Zona 9': 25.00, 'Zona 10': 35.00, 'Zona 11': 35.00, 'Zona 12': 35.00 },
  'Zona 9': { 'Zona 10': 15.00, 'Zona 11': 35.00, 'Zona 12': 30.00 },
  'Zona 10': { 'Zona 11': 50.00, 'Zona 12': 50.00 },
  'Zona 11': { 'Zona 12': 50.00 }
};

const PedirViaje = () => {
  const [puntoA, setPuntoA] = useState('');
  const [puntoB, setPuntoB] = useState('');
  const [tarifa, setTarifa] = useState(0.00);
  const [showModal, setShowModal] = useState(false);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // Modal para mostrar el mensaje de error

  useEffect(() => {
    if (puntoA && puntoB) {
      setShowModal(true);
      setTimeout(() => {
        const calculatedTarifa = tarifas[puntoA]?.[puntoB] || 0.00;
        setTarifa(calculatedTarifa);
        setShowModal(false);
      }, 2000);
    } else {
      setTarifa(0.00);
    }
  }, [puntoA, puntoB]);

  const filteredPuntoB = puntoPartidaB.filter(punto => {
    const selectedId = puntoPartidaA.find(p => p.title === puntoA)?.id;
    return selectedId ? punto.id > selectedId : true;
  });

  const verificarViajePendiente = async (userId) => {
    try {
      const response = await fetch(${API_URL}`/users/new_trip/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new Error('Error al verificar el viaje pendiente.');
      }
    } catch (error) {
      return false;
    }
  };

  const solicitarViaje = async () => {
    const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde el localStorage

    if (!puntoA || !puntoB) {
      alert('Por favor selecciona un punto de partida y llegada.');
      return;
    }

    // Verificar si ya hay un viaje pendiente
    const tieneViajePendiente = await verificarViajePendiente(userId);
    if (tieneViajePendiente) {
      setShowErrorModal(true); // Mostrar el modal de error si hay un viaje pendiente
      return;
    }

    const datosAEnviar = {
      zonaInicio: puntoA, 
      zonaFin: puntoB, 
      usuarioId: userId
    };

    try {
      const response = await fetch(`${API_URL}/users/request_trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosAEnviar),
      });

      if (response.ok) {
        setShowModalSuccess(true);
      } else {
        alert('Error al solicitar el viaje. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      alert('Ocurrió un error al conectar con el servidor.');
    }
  };

  return (
    <>
      <HeaderUsuario />
      <Container className="mt-5">
        <Card className="mx-auto mb-4 p-3 shadow-smp-4 border rounded shadow" style={{ maxWidth: '40%' }}>
          <h2 className="text-center mb-4">Pedir Viaje</h2>
          <Form>
            <Form.Group controlId="puntoA" className="mb-3">
              <Form.Label>Selecciona el punto de partida</Form.Label>
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                <Form.Select
                  value={puntoA}
                  onChange={(e) => setPuntoA(e.target.value)}
                  required
                >
                  <option value="">Selecciona una zona</option>
                  {puntoPartidaA.map((punto) => (
                    <option key={punto.id} value={punto.title}>{punto.title}</option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>

            <Form.Group controlId="puntoB" className="mb-3">
              <Form.Label>Selecciona el punto de llegada</Form.Label>
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                <Form.Select
                  value={puntoB}
                  onChange={(e) => setPuntoB(e.target.value)}
                  required
                >
                  <option value="">Selecciona una zona</option>
                  {filteredPuntoB.map((punto) => (
                    <option key={punto.id} value={punto.title}>{punto.title}</option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>

            <Row>
              <Col>
                <p>Tarifa estimada: Q {tarifa.toFixed(2)}</p>
              </Col>
              <Col className="d-flex justify-content-end">
                <Button variant="primary" onClick={solicitarViaje}>Solicitar Viaje</Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Modal de error */}
        <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>Ya tienes un viaje pendiente o aceptado. Por favor completa ese viaje antes de solicitar uno nuevo.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowErrorModal(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de carga */}
        <Modal show={showModal}>
          <Modal.Header>
            <Modal.Title>Cargando...</Modal.Title>
          </Modal.Header>
          <Modal.Body>Calculando la tarifa estimada, por favor espera.</Modal.Body>
        </Modal>

        {/* Modal de carga */}
        <Modal show={showModalSuccess}>
          <Modal.Header>
            <Modal.Title>Solicitud Exitosa</Modal.Title>
          </Modal.Header>
          <Modal.Body>Su viaje se solicito con exito.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalSuccess(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default PedirViaje;

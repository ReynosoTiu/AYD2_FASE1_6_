import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from "../../components/header_usuario/headerUsuario";

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
  'Zona 1': { 'Zona 2': 10, 'Zona 3': 15, 'Zona 4': 20, 'Zona 5': 20, 'Zona 6': 25, 'Zona 7': 30, 'Zona 8': 30, 'Zona 9': 40, 'Zona 10': 50, 'Zona 11': 50, 'Zona 12': 25 },
  'Zona 2': { 'Zona 3': 25, 'Zona 4': 25, 'Zona 5': 25, 'Zona 6': 30, 'Zona 7': 40, 'Zona 8': 40, 'Zona 9': 60, 'Zona 10': 70, 'Zona 11': 50, 'Zona 12': 35 },
  'Zona 3': { 'Zona 4': 20, 'Zona 5': 30, 'Zona 6': 35, 'Zona 7': 25, 'Zona 8': 25, 'Zona 9': 40, 'Zona 10': 45, 'Zona 11': 40, 'Zona 12': 30 },
  'Zona 4': { 'Zona 5': 15, 'Zona 6': 25, 'Zona 7': 25, 'Zona 8': 25, 'Zona 9': 15, 'Zona 10': 30, 'Zona 11': 35, 'Zona 12': 35 },
  'Zona 5': { 'Zona 6': 15, 'Zona 7': 25, 'Zona 8': 35, 'Zona 9': 25, 'Zona 10': 35, 'Zona 11': 40, 'Zona 12': 40 },
  'Zona 6': { 'Zona 7': 30, 'Zona 8': 35, 'Zona 9': 40, 'Zona 10': 50, 'Zona 11': 65, 'Zona 12': 60 },
  'Zona 7': { 'Zona 8': 25, 'Zona 9': 35, 'Zona 10': 40, 'Zona 11': 40, 'Zona 12': 40 },
  'Zona 8': { 'Zona 9': 25, 'Zona 10': 35, 'Zona 11': 35, 'Zona 12': 35 },
  'Zona 9': { 'Zona 10': 15, 'Zona 11': 35, 'Zona 12': 30 },
  'Zona 10': { 'Zona 11': 50, 'Zona 12': 50 },
  'Zona 11': { 'Zona 12': 50 }
};

const PedirViaje = () => {
  const [puntoA, setPuntoA] = useState('');
  const [puntoB, setPuntoB] = useState('');
  const [tarifa, setTarifa] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (puntoA && puntoB) {
      setShowModal(true);
      setTimeout(() => {
        const calculatedTarifa = tarifas[puntoA]?.[puntoB] || 0;
        setTarifa(calculatedTarifa);
        setShowModal(false);
      }, 2000);
    } else {
      setTarifa(0);
    }
  }, [puntoA, puntoB]);

  const filteredPuntoB = puntoPartidaB.filter(punto => {
    const selectedId = puntoPartidaA.find(p => p.title === puntoA)?.id;
    return selectedId ? punto.id > selectedId : true;
  });

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
                  style={{ width: '400px', fontSize: '0.9rem' }}
                  value={puntoA}
                  onChange={(e) => {
                    setPuntoA(e.target.value);
                    setPuntoB('');
                  }}
                >
                  <option value="">Selecciona un punto de partida</option>
                  {puntoPartidaA.map((punto) => (
                    <option key={punto.id} value={punto.title}>
                      {punto.title}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>

            <Form.Group controlId="puntoB" className="mb-3">
              <Form.Label>Selecciona el punto de llegada</Form.Label>
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                <Form.Select
                  style={{ width: '400px', fontSize: '0.9rem' }}
                  value={puntoB}
                  onChange={(e) => setPuntoB(e.target.value)}
                  disabled={!puntoA}
                >
                  <option value="">Selecciona un punto de llegada</option>
                  {filteredPuntoB.map((punto) => (
                    <option key={punto.id} value={punto.title}>
                      {punto.title}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>

            <Form.Group controlId="tarifa" className="mb-3">
              <Form.Label>Tarifa</Form.Label>
              <Form.Control
                style={{ width: '400px', fontSize: '0.9rem' }}
                type="text"
                value={`Q ${tarifa}`}
                readOnly
              />
            </Form.Group>

            <Row className="mt-3">
              <Col className="text-end">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (puntoA && puntoB) {
                      alert(`Punto de partida y llegada seleccionados con éxito: ${puntoA} -> ${puntoB}. Tarifa: Q${tarifa}`);
                      setPuntoA('');
                      setPuntoB('');
                    } else {
                      alert('Por favor selecciona un punto de partida y llegada.');
                    }
                  }}
                  style={{ marginRight: '10px' }}
                >
                  Solicitar viaje
                </Button>
                <Button variant="danger" onClick={() => navigate('/usuario/home')}>
                  Cancelar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>

      <Modal show={showModal} backdrop="static" keyboard={false}>
        <Modal.Body className="text-center">
          <h4>Calculando...</h4>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PedirViaje;

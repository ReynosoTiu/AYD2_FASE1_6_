import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Modal, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from '../../components/header_usuario/headerUsuario';

const ReportarProblema = () => {
  const [tipoProblema, setTipoProblema] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [viajeActivo, setViajeActivo] = useState(false);
  const [noViajeActivo, setNoViajeActivo] = useState(false);
  const [error, setError] = useState(false);
  const [viaje, setViaje] = useState(null);
  const [conductor, setConductor] = useState(null);
  const [descripcionProblema, setDescripcionProblema] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Nuevo estado para el modal de éxito
  const idUsuario = localStorage.getItem('userId');

  useEffect(() => {
    const verificarViajeActivo = async () => {
      try {
        const response = await fetch(`http://34.173.74.193:5000/api/users/active_trip/${idUsuario}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setViaje(data[0]);
            setViajeActivo(true);
            const idConductor = data[0].idConductor;
            const responseConductor = await fetch(`http://34.173.74.193:5000/api/users/driver_information/${idConductor}`);
            if (responseConductor.ok) {
              const dataConductor = await responseConductor.json();
              setConductor(dataConductor);
            } else {
              setError(true);
            }
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

  const handleTipoProblemaChange = (e) => {
    setTipoProblema(e.target.value);
  };

  const handleDescripcionProblemaChange = (e) => {
    setDescripcionProblema(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const problemaData = {
      viajeId: viaje.idViaje,
      usuarioId: idUsuario,
      conductorId: viaje.idConductor,
      categoria: 'Reporte de usuarios',
      descripcion: descripcionProblema
    };

    try {
      const response = await fetch('http://34.173.74.193:5000/api/users/report_problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problemaData),
      });

      if (response.ok) {
        // Manejar éxito
        setShowSuccessModal(true); // Mostrar el modal de éxito
        setDescripcionProblema('');
      } else {
        // Manejar error
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      alert('Error al enviar el reporte');
    } finally {
      setSending(false);
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
      <Modal.Body>No tienes ningún viaje activo actualmente. No puedes reportar un problema.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setNoViajeActivo(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Éxito</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Problema reportado exitosamente.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderForm = () => (
    <Container className="mt-5">
      <Card className="mx-auto mb-4 p-3 shadow-smp-4 border rounded shadow" style={{ maxWidth: '40%' }}>
        <h2 className="text-center mb-4">Reportar un Problema</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="tipoProblema" className="mb-3">
            <Form.Label>Seleccione el tipo de problema</Form.Label>
            <Form.Select value={tipoProblema} onChange={handleTipoProblemaChange}>
              <option value="">Seleccione...</option>
              <option value="conductor">Problema con el Conductor</option>
              <option value="otro">Otro Problema</option>
            </Form.Select>
          </Form.Group>

          {tipoProblema === 'conductor' && (
            <>
              <Form.Group controlId="nombreConductor" className="mb-3">
                <Form.Label>Nombre del Conductor</Form.Label>
                <Form.Control
                  type="text"
                  value={conductor?.NombreCompleto || "Información no disponible"}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="numeroPlaca" className="mb-3">
                <Form.Label>Número de Placa</Form.Label>
                <Form.Control
                  type="text"
                  value={conductor?.NumeroPlaca || "Información no disponible"}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="descripcionProblemaConductor" className="mb-3">
                <Form.Label>Descripción del Problema</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Describa el problema con el conductor"
                  rows={3}
                  value={descripcionProblema}
                  onChange={handleDescripcionProblemaChange}
                />
              </Form.Group>
            </>
          )}

          {tipoProblema === 'otro' && (
            <>
              <Form.Group controlId="descripcionOtroProblema" className="mb-3">
                <Form.Label>Descripción del Problema</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Describa el problema"
                  rows={3}
                  value={descripcionProblema}
                  onChange={handleDescripcionProblemaChange}
                />
              </Form.Group>

              <Form.Group controlId="fechaProblema" className="mb-3">
                <Form.Label>Fecha del Inconveniente</Form.Label>
                <Form.Control
                  type="date"
                />
              </Form.Group>
            </>
          )}

          <Row className="mt-3">
            <Col className="text-end">
              <Button variant="primary" type="submit" className="mt-3" disabled={!viajeActivo || sending}>
                {sending ? 'Enviando...' : 'Enviar Reporte'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );

  if (loading) return renderLoadingModal();
  if (noViajeActivo) return renderNoViajeModal();
  if (error) return <div>Error al verificar el viaje activo.</div>;

  return (
    <>
      <HeaderUsuario />
      {viajeActivo && renderForm()}
      {renderSuccessModal()} {/* Renderizar el modal de éxito */}
    </>
  );
};

export default ReportarProblema;

import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from '../../components/header_usuario/headerUsuario';
import API_URL from "../../config/config";

const CancelarYCalificarViaje = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [loading, setLoading] = useState(true);
  const [viajeActivo, setViajeActivo] = useState(false);
  const [noViajeActivo, setNoViajeActivo] = useState(false);
  const [error, setError] = useState(false);
  const [viaje, setViaje] = useState(null);
  const [rating, setRating] = useState(0);
  const [conductor, setConductor] = useState(null);
  const [noConductor, setNoConductor] = useState(false);
  const [comentario, setComentario] = useState(''); // Estado para el comentario
  const userId = localStorage.getItem("userId");
  const statusViaje = 'En curso';

  useEffect(() => {
    const verificarViajeActivo = async () => {
      try {
        const response = await fetch(`${API_URL}/users/active_trip/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setViaje(data[0]);
            setViajeActivo(true);
            const idConductor = data[0].idConductor;
            const responseConductor = await fetch(`${API_URL}/users/driver_information/${idConductor}`);
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
  }, [userId]);

  const handleShowCancelModal = () => setShowCancelModal(true);
  const handleCloseCancelModal = () => setShowCancelModal(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setComentario(''); // Limpiar el comentario al cerrar el modal
  };

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
        setShowCancelModal(false);
        setShowSuccessModal(true); // Mostrar el modal de éxito de cancelación
      } else {
        throw new Error('Error al cancelar el viaje.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al cancelar el viaje.');
    }
  };

  const handleOpenRatingModal = () => {
    setShowSuccessModal(false); // Cerrar modal de éxito de cancelación
    setShowRatingModal(true); // Abrir modal para calificar al conductor
  };

  const handleRateConductor = async () => {
    const datosAEnviar = {
      viajeID: viaje.idViaje, 
      usuarioID: userId, 
      conductorID: viaje.idConductor, 
      estrellas: rating, 
      comentario: comentario // Incluir el comentario en la calificación
    };

    console.log(datosAEnviar)
    try {
      const response = await fetch(`${API_URL}/users/rateDriver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar),
      });

      if (response.ok) {
        setShowRatingModal(false); // Cerrar modal de calificación
        alert('Has calificado al conductor exitosamente.');
      } else {
        alert('Error al calificar al conductor.');
      }
    } catch {
      alert('Hubo un problema al calificar al conductor.');
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

  const renderNoConductorModal = () => (
    <Modal show={noConductor} onHide={() => setNoConductor(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>No hay Conductor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Aún no hay conductor asignado para este viaje.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setNoConductor(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );

  const renderStars = () => (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: 'pointer', color: star <= rating ? '#ffc107' : '#e4e5e9', fontSize: '2.5rem' }}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );

  if (error) return <div>Error al verificar el viaje activo.</div>;

  return (
    <>
      <HeaderUsuario />
      {renderLoadingModal()}
      {renderNoViajeModal()}
      {renderNoConductorModal()}

      {/* Modal de éxito para la cancelación */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Acción Exitosa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          El viaje ha sido cancelado exitosamente.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleOpenRatingModal}>
            Calificar al Conductor
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para calificar al conductor */}
      <Modal show={showRatingModal} onHide={handleCloseRatingModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Califica al Conductor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {conductor && (
            <>
              <p>Conductor: {conductor.NombreCompleto}</p>
              {renderStars()}
              <Form.Group className="mt-3">
                <Form.Label>Comentario:</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={comentario} 
                  onChange={(e) => setComentario(e.target.value)} 
                  placeholder="Escribe tu comentario aquí..." 
                />
              </Form.Group>
            </>
          )}
          <Button className="mt-3" variant="primary" onClick={handleRateConductor}>
            Enviar Calificación
          </Button>
        </Modal.Body>
      </Modal>

      {!loading && viajeActivo && (
        <Container className="mt-5">
          <Card className="mx-auto mb-4 p-3 shadow border rounded" style={{ maxWidth: '40%' }}>
            <h2 className="text-center mb-4">Información del Viaje</h2>
            <Form>
              <Form.Group controlId="puntoA" className="mb-3">
                <Form.Label>Punto de Partida A</Form.Label>
                <Form.Control type="text" value={viaje.puntoPartida} readOnly />
              </Form.Group>

              <Form.Group controlId="puntoB" className="mb-3">
                <Form.Label>Punto de Partida B</Form.Label>
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

              <Button variant="danger" onClick={handleShowCancelModal}>
                Cancelar Viaje
              </Button>
            </Form>
          </Card>
        </Container>
      )}

      {/* Modal para cancelar viaje */}
      <Modal show={showCancelModal} onHide={handleCloseCancelModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Viaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Motivo de Cancelación:</Form.Label>
            <Form.Control as="textarea" rows={3} value={motivoCancelacion} onChange={(e) => setMotivoCancelacion(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCancelModal}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={handleCancelViaje}>
            Confirmar Cancelación
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelarYCalificarViaje;

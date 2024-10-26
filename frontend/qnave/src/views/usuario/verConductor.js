import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from '../../components/header_usuario/headerUsuario';

const VerConductor = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [conductor, setConductor] = useState(null);
  const [noConductor, setNoConductor] = useState(false);
  const idUsuario = localStorage.getItem('userId'); // Asegúrate de que el id esté almacenado correctamente

  useEffect(() => {
    const fetchConductorInfo = async () => {
      try {
        const response = await fetch(`http://34.30.112.78:5000/api/users/active_trip/${idUsuario}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const idConductor = data[0].idConductor;
            const responseConductor = await fetch(`http://34.30.112.78:5000/api/users/driver_information/${idConductor}`);
            if (responseConductor.ok) {
              const dataConductor = await responseConductor.json();
              setConductor(dataConductor);
            } else {
              setError(true);
            }
          } else {
            setNoConductor(true); // No hay conductor disponible
          }
        } else {
          throw new Error('Error al verificar el viaje pendiente.');
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchConductorInfo();
  }, [idUsuario]);

  // Modales
  const renderLoadingModal = () => (
    <Modal show={loading} backdrop="static" centered>
      <Modal.Body>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando información del conductor...</p>
      </Modal.Body>
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
        <button className="btn btn-secondary" onClick={() => setNoConductor(false)}>Cerrar</button>
      </Modal.Footer>
    </Modal>
  );

  const renderConductorInfo = () => (
    <Container className="mt-5">
      <Card className="mx-auto mb-4 p-3 shadow-smp-4 border rounded shadow" style={{ maxWidth: '40%' }}>
        <h2 className="text-center mb-4">Información del Conductor</h2>
        <Form>
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

          <Form.Group controlId="marcaAutomovil" className="mb-3">
            <Form.Label>Marca del Automóvil</Form.Label>
            <Form.Control
              type="text"
              value={conductor?.MarcaVehiculo || "Información no disponible"}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="fotoAutomovil" className="mb-3">
            <Form.Label>Foto del Automóvil</Form.Label>
            {conductor?.FotografiaVehiculo ? (
              <img
                src={`data:image/png;base64,${conductor.FotografiaVehiculo}`} // Prefijo + la imagen en base64
                alt="Automóvil"
                className="img-fluid mt-2"
                style={{ maxHeight: '200px' }}
              />
            ) : (
              <p>Información no disponible</p>
            )}
          </Form.Group>
        </Form>
      </Card>
    </Container>
  );

  if (error) return <div>Error al cargar la información del conductor.</div>;

  return (
    <>
      <HeaderUsuario />
      {renderLoadingModal()}
      {renderNoConductorModal()}
      {!loading && !noConductor && conductor && renderConductorInfo()}
    </>
  );
};

export default VerConductor;

import React from 'react';
import { Container, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from '../../components/header_usuario/headerUsuario';

const VerConductor = () => {
  return (
    <>
      <HeaderUsuario />
      <Container className="mt-5">
        <Card className="mx-auto mb-4 p-3 shadow-smp-4 border rounded shadow" style={{ maxWidth: '40%' }}>
          <h2 className="text-center mb-4">Información del Conductor</h2>
          <Form>
            <Form.Group controlId="nombreConductor" className="mb-3">
              <Form.Label>Nombre del Conductor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del conductor"
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="numeroPlaca" className="mb-3">
              <Form.Label>Número de Placa</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el número de placa"
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="marcaAutomovil" className="mb-3">
              <Form.Label>Marca del Automóvil</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la marca del automóvil"
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="fotoAutomovil" className="mb-3">
              <Form.Label>Foto del Automóvil</Form.Label>
              <img
                src="URL_DE_LA_IMAGEN"
                alt="Automóvil"
                className="img-fluid mt-2"
                style={{ maxHeight: '200px' }}
              />
            </Form.Group>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default VerConductor;

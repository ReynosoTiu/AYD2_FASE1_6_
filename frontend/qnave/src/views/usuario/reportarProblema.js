import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from '../../components/header_usuario/headerUsuario';

const ReportarProblema = () => {
  const [tipoProblema, setTipoProblema] = useState('');

  const handleTipoProblemaChange = (e) => {
    setTipoProblema(e.target.value);
  };

  return (
    <>
      <HeaderUsuario />
      <Container className="mt-5">
        <Card className="mx-auto mb-4 p-3 shadow-smp-4 border rounded shadow" style={{ maxWidth: '40%' }}>
          <h2 className="text-center mb-4">Reportar un Problema</h2>
          <Form>
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
                    placeholder="Ingrese el nombre del conductor"
                  />
                </Form.Group>

                <Form.Group controlId="numeroPlaca" className="mb-3">
                  <Form.Label>Número de Placa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el número de placa"
                  />
                </Form.Group>

                <Form.Group controlId="descripcionProblemaConductor" className="mb-3">
                  <Form.Label>Descripción del Problema</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Describa el problema con el conductor"
                    rows={3}
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
                    <Button variant="primary" type="submit" className="mt-3">
                    Enviar Reporte
                    </Button>
                </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default ReportarProblema;

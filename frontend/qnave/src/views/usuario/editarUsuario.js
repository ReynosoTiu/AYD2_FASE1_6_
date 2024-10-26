import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUsuario from "../../components/header_usuario/headerUsuario";

//const idUsuario = localStorage.getItem('userId');
const idUsuario = 2;
const EditarUsuario = ({ userId }) => { // Asumiendo que userId se pasa como prop
    const [errores, setErrores] = useState({});
    const [formData, setFormData] = useState({
        NombreCompleto: '',
        FechaNacimiento: '',
        DPI: '',
        Edad: '',
        Genero: '',
        EstadoCivil: '',
        CorreoElectronico: '',
        Telefono: '',
        Direccion: ''
    });

    // Validar los campos
    const validarCampos = () => {
        const {
            NombreCompleto,
            FechaNacimiento,
            DPI,
            Edad,
            Genero,
            EstadoCivil,
            Correo,
            Telefono,
            Direccion,
        } = formData;

        const nuevosErrores = {};

        if (!NombreCompleto)
        nuevosErrores.NombreCompleto = "El nombre es obligatorio.";
        if (!FechaNacimiento) nuevosErrores.FechaNacimiento = "La fecha de nacimiento es obligatoria.";
        if (!DPI) nuevosErrores.DPI = "El dpi es obligatorio";
        if (!Edad) nuevosErrores.Edad = "La edad es obligatorio";
        if (!Genero) nuevosErrores.Genero = "El genero es obligatorio";
        if (!EstadoCivil) nuevosErrores.EstadoCivil = "El estado civil es obligatorio";
        if (!Correo.includes("@")) nuevosErrores.Correo = "Correo inválido.";
        if (Telefono.length !== 8) nuevosErrores.Telefono = "Teléfono inválido.";
        if (!Direccion) nuevosErrores.Direccion = "La direccion es obligatoria";
        
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });

    useEffect(() => {
        const obtenerInformacionUsuario = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/getUserInfo/${idUsuario}`); // Cambia 'tu-api-url' por la URL real de tu API
                if (!response.ok) {
                    throw new Error('No se pudo obtener la información del usuario');
                }
                const data = await response.json();
                if (data.FechaNacimiento) {
                    const fecha = new Date(data.FechaNacimiento);
                    data.FechaNacimiento = fecha.toISOString().split('T')[0];
                }
                setFormData(data);
            } catch (error) {
                setAlerta({ mensaje: error.message, tipo: "danger" });
            }
        };
        obtenerInformacionUsuario();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario

        try {
            const response = await fetch(`http://localhost:5000/users/getUserInfo/${userId}`, {
                method: 'PUT', // Cambia el método según lo que necesites (PUT o PATCH)
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al guardar los cambios');
            }

            setAlerta({ mensaje: "Información actualizada con éxito", tipo: "success" });
            // Opcional: puedes redirigir o limpiar el formulario aquí

        } catch (error) {
            setAlerta({ mensaje: error.message, tipo: "danger" });
        }
    };

    return (
        <>
            <HeaderUsuario />
            <Container className="mt-5 d-flex justify-content-center">
                <Card className="mx-auto mb-4 p-3 shadow-smp-4 border rounded shadow" style={{ width: '100%', maxWidth: '500px' }}>
                    <h2 className="text-center mb-4">Editar Información del Usuario</h2>
                    {alerta.mensaje && (
                        <Alert variant={alerta.tipo} className="mt-3">
                            {alerta.mensaje}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="nombreCompleto" className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                name="NombreCompleto"
                                value={formData.NombreCompleto}
                                onChange={handleInputChange}
                                isInvalid={!!errores.NombreCompleto}
                            />
                        </Form.Group>
                        <Form.Group controlId="fechaNacimiento" className="mb-3">
                            <Form.Label>Fecha de Nacimiento</Form.Label>
                            <Form.Control
                                type="date"
                                name="FechaNacimiento"
                                value={formData.FechaNacimiento}
                                onChange={handleInputChange}
                                isInvalid={!!errores.FechaNacimiento}
                            />
                        </Form.Group>
                        <Form.Group controlId="dpi" className="mb-3">
                            <Form.Label>DPI</Form.Label>
                            <Form.Control
                                type="text"
                                name="DPI"
                                value={formData.DPI}
                                onChange={handleInputChange}
                                isInvalid={!!errores.DPI}
                            />
                        </Form.Group>
                        <Form.Group controlId="edad" className="mb-3">
                            <Form.Label>Edad</Form.Label>
                            <Form.Control
                                type="number"
                                name="Edad"
                                value={formData.Edad}
                                onChange={handleInputChange}
                                isInvalid={!!errores.Edad}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>Género</Form.Label>
                        <Form.Select
                            name="Genero"
                            onChange={handleInputChange}
                            value={formData.Genero}
                            isInvalid={!!errores.Genero} // Cambia esto si usas un objeto de errores diferente
                        >
                            <option value="">Elige un género</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errores.Genero} {/* Cambia esto si usas un objeto de errores diferente */}
                        </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>Estado Civil</Form.Label>
                        <Form.Select
                            name="EstadoCivil" // Asegúrate de que el nombre coincida con tu objeto formData
                            onChange={handleInputChange}
                            value={formData.EstadoCivil} // Cambia esto para que coincida con el nombre en formData
                            isInvalid={!!errores.EstadoCivil} // Cambia esto si usas un objeto de errores diferente
                        >
                            <option value="">Elige tu estado civil</option>
                            <option value="Soltero">Soltero</option>
                            <option value="Casado">Casado</option>
                            <option value="Divorciado">Divorciado</option> {/* Agrega más opciones según sea necesario */}
                            <option value="Viudo">Viudo</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errores.EstadoCivil} {/* Muestra el mensaje de error, si lo hay */}
                        </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="correoElectronico" className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="CorreoElectronico"
                                value={formData.CorreoElectronico}
                                onChange={handleInputChange}
                                isInvalid={!!errores.CorreoElectronico}
                            />
                        </Form.Group>
                        <Form.Group controlId="telefono" className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="Telefono"
                                value={formData.Telefono}
                                onChange={handleInputChange}
                                isInvalid={!!errores.Telefono}
                            />
                        </Form.Group>
                        <Form.Group controlId="direccion" className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="Direccion"
                                value={formData.Direccion}
                                onChange={handleInputChange}
                                isInvalid={!!errores.Direccion}
                            />
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="primary" type="submit">Guardar Cambios</Button>
                            <Button variant="secondary" className="ms-2">Cancelar</Button>
                        </div>
                    </Form>
                </Card>
            </Container>
        </>
    );
};

export default EditarUsuario;

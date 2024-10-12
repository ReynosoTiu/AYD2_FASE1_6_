import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetalleSolicitud = () => {
    const { id } = useParams();
    const [solicitud, setSolicitud] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSolicitud = async () => {
            try {
                const response = await fetch(`http://34.173.74.193:5000/api/asistant/getDriverPending/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                setSolicitud(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSolicitud();
    }, [id]);

    if (!solicitud) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleProcesarSolicitud = async (idEstado) => {
        try {
            const response = await fetch(`http://34.173.74.193:5000/api/asistant/aproveRejectDriver`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idConductor: id,
                    estado: idEstado
                }),
            });

            if (!response.ok) {
                throw new Error('Error al intentar dar de baja al conductor');
            }
            if(idEstado=== 1){
                alert('Conductor aprobado');
            }else{
                alert('Conductor rechazado');
            }
            
            navigate('/asistente/solicitudes');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Detalles del Solicitud</h2>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h3 className="card-title">{solicitud.NombreCompleto}</h3>
                            <p className="card-text"><strong>Teléfono:</strong> {solicitud.Telefono}</p>
                            <p className="card-text"><strong>Correo Electrónico:</strong> {solicitud.CorreoElectronico}</p>
                            <p className="card-text"><strong>Dirección:</strong> {solicitud.Direccion}</p>
                            <p className="card-text"><strong>Estado Civil:</strong> {solicitud.EstadoCivil}</p>
                        </div>
                        <div className="col-md-6">
                            <p className="card-text"><strong>Número de Placa:</strong> {solicitud.NumeroPlaca}</p>
                            <p className="card-text"><strong>Marca del Vehículo:</strong> {solicitud.MarcaVehiculo}</p>
                            <p className="card-text"><strong>Año del Vehículo:</strong> {solicitud.AnioVehiculo}</p>
                            <div className='row'>
                                <div className='col'>
                                    <div className='d-flex justify-content-center'><button className="btn btn-success" onClick={() => handleProcesarSolicitud(1)}>Aceptar</button></div>
                                </div>
                                <div className='col'>
                                    <div className='d-flex justify-content-start'><button className="btn btn-danger" onClick={() => handleProcesarSolicitud(2)}>Rechazar</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 row" >
                        <div className='col'>
                            <div className='d-flex justify-content-center'><img src={`${solicitud.Fotografia}`} alt="Fotografia del Solicitud" className="img-fluid" style={{ height: "200px" }} /></div>
                        </div>
                        <div className='col'>
                            <div className='d-flex justify-content-center'><img src={`${solicitud.FotografiaVehiculo}`} alt="Fotografia del Vehículo" className="img-fluid" style={{ height: "200px" }} /></div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <object data={`${solicitud.CV}`} type="application/pdf" width="100%" height="600">
                            <a href={`${solicitud.CV}`} download="CV.pdf">Descargar CV</a>
                        </object>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleSolicitud;

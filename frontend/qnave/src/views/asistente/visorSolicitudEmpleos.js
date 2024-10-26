import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function VisorSolicitudEmpleos() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            setCargando(true);
            try {
                const response = await fetch('http://334.30.112.78:5000/api/asistant/getDriverPendingList');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setSolicitudes(data);
                setCargando(false);
            } catch (err) {
                setError(err.message);
                setCargando(false);
            }
        };

        fetchSolicitudes();
    }, []);

    const solicitudesFiltrados = solicitudes.filter(solicitud =>
        solicitud.NombreCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
        solicitud.CorreoElectronico.toString().includes(filtro)
    );

    if (cargando) return <p>Cargando solicitudes...</p>;
    if (error) return <h5>{error}</h5>;

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre o email..."
                        value={filtro}
                        onChange={e => setFiltro(e.target.value)}
                    />
                </div>
            </div>
            <div className="row mt-3">
                {solicitudesFiltrados.map((solicitud) => (
                    <div className="col-md-4 mb-3" key={solicitud.UsuarioID}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{solicitud.NombreCompleto}</h5>
                                <p className="card-text">{solicitud.Telefono}</p>
                                <p className="card-text">{solicitud.CorreoElectronico}</p>
                                <Link to={`/asistente/solicitudes/${solicitud.UsuarioID}`} className="btn btn-primary">
                                    <i className="fa fa-eye" aria-hidden="true"></i> Ver Detalles
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisorSolicitudEmpleos;
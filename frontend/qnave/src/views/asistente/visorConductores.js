import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function VisorConductores() {
    const [conductores, setConductores] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConductores = async () => {
            setCargando(true);
            try {
                const response = await fetch('http://localhost:5000/api/asistant/getDriversList');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setConductores(data);
                setCargando(false);
            } catch (err) {
                setError(err.message);
                setCargando(false);
            }
        };

        fetchConductores();
    }, []);

    const conductoresFiltrados = conductores.filter(conductor =>
        conductor.NombreCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
        conductor.CorreoElectronico.toString().includes(filtro)
    );

    if (cargando) return <p>Cargando conductores...</p>;
    if (error) return <p>Error: {error}</p>;

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
                {conductoresFiltrados.map((conductor) => (
                    <div className="col-md-4 mb-3" key={conductor.UsuarioID}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{conductor.NombreCompleto}</h5>
                                <p className="card-text">{conductor.Telefono}</p>
                                <p className="card-text">{conductor.CorreoElectronico}</p>
                                <p className="card-text">{conductor.NumeroPlaca}</p>
                                <Link to={`/asistente/conductores/${conductor.UsuarioID}`} className="btn btn-primary">
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

export default VisorConductores;
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function VisorUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConductores = async () => {
            setCargando(true);
            try {
                const response = await fetch('http://334.30.112.78:5000/api/asistant/getUsers');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsuarios(data);
                setCargando(false);
            } catch (err) {
                setError(err.message);
                setCargando(false);
            }
        };

        fetchConductores();
    }, []);

    const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.NombreCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.CorreoElectronico.toString().includes(filtro)
    );

    if (cargando) return <p>Cargando usuarios...</p>;
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
                {usuariosFiltrados.map((usuario) => (
                    <div className="col-md-4 mb-3" key={usuario.UsuarioID}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{usuario.NombreCompleto}</h5>
                                <p className="card-text">{usuario.Telefono}</p>
                                <p className="card-text">{usuario.CorreoElectronico}</p>
                                <Link to={`/asistente/usuarios/${usuario.UsuarioID}`} className="btn btn-primary">
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

export default VisorUsuarios;
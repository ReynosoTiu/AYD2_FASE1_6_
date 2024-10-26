import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViajesAcordeon from './ViajesAcordeon';

const DetalleConductor = () => {
    const { id } = useParams();
    const [conductor, setConductor] = useState(null);
    const [listTrip, setListTrip] = useState([]);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [comentario, setComentario] = useState('');
    const [comentarioError, setComentarioError] = useState('');
    const navigate = useNavigate();

    const [telefono, setTelefono] = useState('');
    const [marcaVehiculo, setMarcaVehiculo] = useState('');
    const [numeroPlaca, setNumeroPlaca] = useState('');

    useEffect(() => {
        const fetchConductor = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/asistant/getDriverById/${id}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch');
                }
                setConductor(data);
                setTelefono(data.Telefono);
                setMarcaVehiculo(data.MarcaVehiculo);
                setNumeroPlaca(data.NumeroPlaca);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchConductor();
    }, [id]);

    const handleUpdateConductor = async () => {
        try {
            const asistente = localStorage.getItem("userId");
            const response = await fetch(`http://localhost:5000/api/asistant/updateConductor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    telefono,
                    marcaVehiculo,
                    numeroPlaca,
                    asistente
                }),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar la información del conductor');
            }
            alert('Información del conductor actualizada exitosamente');
        } catch (err) {
            setError(err.message);
        }
    };

    if (!conductor) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleDarDeBaja = async () => {
        if (!comentario.trim()) {
            setComentarioError('El comentario es obligatorio.');
            return;
        }
        try {
            let asistente = localStorage.getItem("userId");
            const response = await fetch("http://localhost:5000/api/asistant/unSuscribeUser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    motivo: comentario,
                    asistenteNombre: `Asistente con id ${asistente}`
                }),
            });

            if (!response.ok) {
                throw new Error('Error al intentar dar de baja al conductor');
            }
            alert('Conductor dado de baja exitosamente');
            navigate('/asistente/conductores');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Detalles del Conductor</h2>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h3 className="card-title">{conductor.NombreCompleto}</h3>
                            <input className="form-control my-2" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
                            <input className="form-control my-2" value={marcaVehiculo} onChange={(e) => setMarcaVehiculo(e.target.value)} placeholder="Marca del Vehículo" />
                            <input className="form-control my-2" value={numeroPlaca} onChange={(e) => setNumeroPlaca(e.target.value)} placeholder="Número de Placa" />
                            <button className="btn btn-primary" onClick={handleUpdateConductor}>Actualizar Información</button>
                        </div>
                        <div className="col-md-6">
                            <p className="card-text"><strong>Número de Placa:</strong> {conductor.NumeroPlaca}</p>
                            <p className="card-text"><strong>Marca del Vehículo:</strong> {conductor.MarcaVehiculo}</p>
                            <p className="card-text"><strong>Año del Vehículo:</strong> {conductor.AnioVehiculo}</p>
                            <p className="card-text" style={{ color: conductor.EstadoCuenta === 'Activo' ? 'green' : 'red' }}>
                                <strong>Estado de Cuenta:</strong> {conductor.EstadoCuenta}
                            </p>
                            <button className="btn btn-danger" disabled={conductor.EstadoCuenta !== 'Activo'} onClick={() => setModalVisible(true)}>Dar de baja</button>
                        </div>
                    </div>
                    <div className="mt-3 row" >
                        <div className='col'>
                            <div className='d-flex justify-content-center'><img src={`${conductor.Fotografia}`} alt="Fotografia del Conductor" className="img-fluid" style={{ height: "200px" }} /></div>
                        </div>
                        <div className='col'>
                            <div className='d-flex justify-content-center'><img src={`${conductor.FotografiaVehiculo}`} alt="Fotografia del Vehículo" className="img-fluid" style={{ height: "200px" }} /></div>
                        </div>
                    </div>
                    <div>
                        <ViajesAcordeon viajes={listTrip} tipo={"conductor"} id_filtro={id}/>
                    </div>
                    <div className="mt-4">
                        <object data={`${conductor.CV}`} type="application/pdf" width="100%" height="300">
                            <a href={`${conductor.CV}`} download="CV.pdf">Descargar CV</a>
                        </object>
                    </div>
                </div>
            </div>
            <div className={`modal ${modalVisible ? 'show' : ''}`} tabIndex="-1" style={{ display: modalVisible ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmar Baja</h5>
                            <button type="button" className="close" onClick={() => setModalVisible(false)}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Por favor, ingrese un comentario sobre la razón para dar de baja al conductor:</p>
                            <textarea className="form-control" value={comentario} onChange={e => setComentario(e.target.value)}></textarea>
                            {comentarioError && <div className="alert alert-danger mt-2">{comentarioError}</div>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={handleDarDeBaja}>Confirmar Baja</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleConductor;

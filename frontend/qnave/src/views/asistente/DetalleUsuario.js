import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViajesAcordeon from './viajesAcordeon';

const DetalleUsuario = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [listTrip, setListTrip] = useState([]);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [comentario, setComentario] = useState('');
    const [comentarioError, setComentarioError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`http://34.173.74.193:5000/api/asistant/getUserById/${id}`);
                const data = await response.json();
                if (!response.ok) {
                    if(data.message){
                        throw new Error(data.message);
                    }else{
                        throw new Error('Failed to fetch');
                    }
                }
                setUsuario(data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchTripList = async () => {
            try {
                const response = await fetch(`http://34.173.74.193:5000/api/general/getTripList`);
                const data = await response.json();
                if (!response.ok) {
                    if(data.message){
                        throw new Error(data.message);
                    }else{
                        throw new Error('Failed to fetch');
                    }
                }
                setListTrip(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTripList();
        fetchUsuario();
    }, [id]);

    if (!usuario) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleDarDeBaja = async () => {
        if (!comentario.trim()) {
            setComentarioError('El comentario es obligatorio.');
            return;
        }
        try {
            let asistente = localStorage.getItem("userId");
            const response = await fetch(`http://34.173.74.193:5000/api/asistant/unSuscribeUser`, {
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
                throw new Error('Error al intentar dar de baja al usuario');
            }
            alert('Usuario dado de baja exitosamente');
            navigate('/asistente/usuarios');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Detalles del Usuario</h2>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h3 className="card-title">{usuario.NombreCompleto}</h3>
                            <p className="card-text"><strong>Teléfono:</strong> {usuario.Telefono}</p>
                            <p className="card-text"><strong>Correo Electrónico:</strong> {usuario.CorreoElectronico}</p>
                            <p className="card-text"><strong>Dirección:</strong> {usuario.Direccion}</p>
                            <p className="card-text"><strong>Estado Civil:</strong> {usuario.EstadoCivil}</p>
                            <p className="card-text"><strong>No. CUI:</strong> {usuario.DPI}</p>
                            <p className="card-text"><strong>Genero:</strong> {usuario.Genero}</p>
                        </div>
                        <div className="col-md-6">
                            <p className="card-text"><strong>Cantidad de viajes realizados:</strong> {usuario.TotalViajes}</p>
                            <p className="card-text"><strong>Calificacion:</strong> {usuario.TotalViajes==0?'--':usuario.Calificacion}</p>
                            <p className="card-text"><strong>FechaRegistro:</strong> {(new Date(usuario.FechaRegistro)).toDateString()}</p>
                            <p className="card-text" style={{ color: usuario.Activo ? 'green' : 'red' }}>
                                <strong>Estado:</strong> {usuario.Activo ? 'Activo' : 'Inactivo'}
                            </p>
                            <button className="btn btn-danger" onClick={() => setModalVisible(true)} disabled={!usuario.Activo}>Dar de baja</button>
                        </div>
                    </div>
                    <div className="mt-3 row" style={{ display: usuario.Fotografia ? 'block' : 'none' }}>
                        <div className='col'>
                            <div className='d-flex justify-content-center'><img src={`data:image/jpeg;base64,${usuario.Fotografia}`} alt="Fotografia del Usuario" className="img-fluid" style={{ height: "200px" }} /></div>
                        </div>
                    </div>
                    <div>
                        <ViajesAcordeon viajes={listTrip} tipo={"usuario"} id_filtro={id}/>
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
                            <p>Por favor, ingrese un comentario sobre la razón para dar de baja al usuario:</p>
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

export default DetalleUsuario;

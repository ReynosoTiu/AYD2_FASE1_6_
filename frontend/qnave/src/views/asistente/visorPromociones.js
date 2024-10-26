import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function VisorPromociones() {
    const [promociones, setPromociones] = useState([]);
    //const [filtro, setFiltro] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevaPromocion, setNuevaPromocion] = useState({
        descripcion: '',
        descuento: '',
        fechaInicio: '',
        fechaFin: ''
    });

    useEffect(() => {
        fetchPromociones();
    }, []);

    const fetchPromociones = async () => {
        setCargando(true);
        try {
            const response = await fetch('http://localhost:5000/api/asistant/getDiscounts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPromociones(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const handleCrearPromocion = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/asistant/generateDiscounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaPromocion)
            });
            if (!response.ok) {
                throw new Error('Failed to create promotion');
            }
            setModalVisible(false);
            alert("Promocion creada")
            fetchPromociones();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEliminarPromocion = async (ofertaId) => {
        try {
            const data = {
                id: ofertaId
            }
            const response = await fetch(`http://localhost:5000/api/asistant/deleteDiscount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Failed to delete promotion');
            }
            alert("Promocion eliminada")
            fetchPromociones();
        } catch (err) {
            setError(err.message);
        }
    };

    if (cargando) return <p>Cargando promociones...</p>;
    if (error) return <p>Error: {error}</p>;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="container mt-3">
            <button className='btn btn-small btn-success' onClick={() => setModalVisible(true)}>Crear promocion</button>
            <div className="row mt-3">
                {promociones.map((promo) => (
                    <div className="col-md-4 mb-3" key={promo.OfertaID}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{promo.Descripcion}</h5>
                                <p className="card-text">Descuento: {promo.Descuento}</p>
                                <p className="card-text">Desde: {formatDate(promo.FechaInicio)}</p>
                                <p className="card-text">Hasta: {formatDate(promo.FechaFin)}</p>
                                <p className="card-text" style={{ color: promo.Activo ? 'green' : 'red' }}>Hasta: {promo.Activo ? 'Activo' : 'Inactivo'}</p>
                                <button className="btn btn-danger" disabled={!promo.Activo} onClick={() => handleEliminarPromocion(promo.OfertaID)}>
                                    Eliminar Promoción
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`modal ${modalVisible ? 'show' : ''}`} tabIndex="-1" style={{ display: modalVisible ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Crear Nueva Promoción</h5>
                            <button type="button" className="close" onClick={() => setModalVisible(false)}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input type="text" className="form-control my-2" placeholder="Descripción" value={nuevaPromocion.descripcion} onChange={e => setNuevaPromocion({ ...nuevaPromocion, descripcion: e.target.value })} />
                            <input type="text" className="form-control my-2" placeholder="Descuento" value={nuevaPromocion.descuento} onChange={e => setNuevaPromocion({ ...nuevaPromocion, descuento: e.target.value })} />
                            <input type="date" className="form-control my-2" placeholder="Fecha de inicio" value={nuevaPromocion.fechaInicio} onChange={e => setNuevaPromocion({ ...nuevaPromocion, fechaInicio: e.target.value })} />
                            <input type="date" className="form-control my-2" placeholder="Fecha de fin" value={nuevaPromocion.fechaFin} onChange={e => setNuevaPromocion({ ...nuevaPromocion, fechaFin: e.target.value })} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleCrearPromocion}>Crear Promoción</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisorPromociones;


import React, { useEffect, useState } from 'react';

function ReporteVehiculos() {
    const [vehiculos, setVehiculos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/asistant/getVehiculeReport')
            .then(response => response.json())
            .then(data => setVehiculos(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="container mt-3">
            <div className="row">
                {vehiculos.map(vehiculo => (
                    <div className="col-md-4 mb-3" key={vehiculo.ConductorID}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src={`${vehiculo.FotografiaVehiculo}`} className="card-img-top" alt="Vehículo" />
                            <div className="card-body">
                                <h5 className="card-title">{vehiculo.MarcaVehiculo} - {vehiculo.AnioVehiculo}</h5>
                                <p className="card-text">Placa: {vehiculo.NumeroPlaca}</p>
                                <p className="card-text">Estado: {vehiculo.Estatus}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReporteVehiculos;

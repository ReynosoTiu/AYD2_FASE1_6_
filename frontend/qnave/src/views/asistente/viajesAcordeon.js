import React from 'react';

const ViajesAcordeon = ({ viajes, tipo, id_filtro }) => {
    let viajesFiltrados = viajes;
  if(tipo === "conductor"){
    viajesFiltrados = viajes.filter(viaje => viaje.ConductorID == id_filtro);
  }else if (tipo === "usuario") {
    viajesFiltrados = viajes.filter(viaje => viaje.UsuarioID == id_filtro);
  }

  return (
    <div className="accordion" id="acordeonViajes">
      {viajesFiltrados.map((viaje, index) => (
        <div className="card" key={viaje.ViajeID}>
          <div className="card-header" id={`heading${viaje.ViajeID}`}>
            <h2 className="mb-0">
              <button className="btn btn-link" type="button" data-toggle="collapse" data-target={`#collapse${viaje.ViajeID}`} aria-expanded="true" aria-controls={`collapse${viaje.ViajeID}`}>
                Viaje {viaje.ViajeID} - {viaje.ZonaInicio} a {viaje.ZonaFin}
              </button>
            </h2>
          </div>
          <div id={`collapse${viaje.ViajeID}`} className="collapse" aria-labelledby={`heading${viaje.ViajeID}`} data-parent="#acordeonViajes">
            <div className="card-body">
              <p><strong>Inicio:</strong> {new Date(viaje.FechaHoraInicio).toLocaleString()}</p>
              <p><strong>Fin:</strong> {viaje.FechaHoraFin ? new Date(viaje.FechaHoraFin).toLocaleString() : 'En curso'}</p>
              <p><strong>Tarifa:</strong> Q. {viaje.Tarifa.toFixed(2)}</p>
              <p><strong>Estado:</strong> {viaje.Estado}</p>
              <p><strong>Pago Recibido:</strong> {viaje.PagoRecibido ? 'Sí' : 'No'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViajesAcordeon;
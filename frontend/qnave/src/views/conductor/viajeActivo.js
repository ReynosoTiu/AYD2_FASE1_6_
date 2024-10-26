import API_URL from "../../config/config";
import React, { useEffect, useState } from "react";

function ViajeActivo() {
  const [tripInfo, setTripInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showEndTripForm, setShowEndTripForm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pagoRecibido, setPagoRecibido] = useState("");
  const [estrellas, setEstrellas] = useState("");
  const [comentario, setComentario] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchActiveTrip = async () => {
      try {
        const response = await fetch(`${API_URL}/driver/active_trip/${userId}`);
        if (response.status === 200) {
          const data = await response.json();
          setTripInfo(data);
        } else {
          setErrorMessage("No tiene ningún viaje activo en este momento");
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
        setErrorMessage(
          "Ocurrió un error al obtener la información del viaje."
        );
      }
    };
    fetchActiveTrip();
  }, [userId]);

  const handleCancelTrip = async () => {
    try {
      const response = await fetch(`${API_URL}/driver/cancelDrive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viajeId: tripInfo.idViaje,
          motivoCancelacion,
          justificacion,
          usuarioId: tripInfo.idUsuario,
          conductorId: userId,
        }),
      });

      if (response.status === 200) {
        alert("Cancelación exitosa");
        setShowCancelForm(false);
      } else {
        alert("Ocurrió un error al cancelar su viaje");
      }
    } catch (error) {
      console.error("Error canceling trip:", error);
      alert("Ocurrió un error al cancelar su viaje");
    }
  };

  const handleReportProblem = async () => {
    try {
      const response = await fetch(`${API_URL}/driver/reportProblem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viajeId: tripInfo.idViaje,
          usuarioId: tripInfo.idUsuario,
          conductorId: userId,
          categoria,
          descripcion,
          evidencia: null,
        }),
      });

      if (response.status === 201) {
        alert("Problema reportado con éxito");
        setShowReportForm(false);
      } else {
        alert("Ocurrió un error al reportar el problema");
      }
    } catch (error) {
      console.error("Error reporting problem:", error);
      alert("Ocurrió un error al reportar el problema");
    }
  };

  const handleEndTrip = async () => {
    try {
      const response = await fetch(`${API_URL}/driver/endDrive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ViajeID: tripInfo.idViaje,
          PagoRecibido: pagoRecibido === "si" ? true : false,
        }),
      });

      if (response.status === 200) {
        setShowEndTripForm(false);
        setShowRatingModal(true);
      } else {
        alert("Ocurrió un error al finalizar el viaje");
      }
    } catch (error) {
      console.error("Error ending trip:", error);
      alert("Ocurrió un error al finalizar el viaje");
    }
  };

  const handleRateUser = async () => {
    try {
      const response = await fetch(`${API_URL}/driver/rateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viajeID: tripInfo.idViaje,
          usuarioID: tripInfo.idUsuario,
          conductorID: userId,
          estrellas: parseInt(estrellas),
          comentario,
        }),
      });

      if (response.status === 201) {
        alert("Viaje finalizado con éxito");
        setShowRatingModal(false);
      } else {
        alert("Ocurrió un error al finalizar el viaje");
      }
    } catch (error) {
      console.error("Error rating user:", error);
      alert("Ocurrió un error al calificar al cliente");
    }
  };

  return (
    <div className="container mt-5">
      {errorMessage ? (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      ) : tripInfo ? (
        <div className="card shadow-lg p-4">
          <h3 className="card-title text-center mb-4">Viaje Activo</h3>
          <div className="card-body">
            <p>
              <strong>Viaje ID:</strong> {tripInfo.idViaje}
            </p>
            <p>
              <strong>Tarifa:</strong> ${tripInfo.Tarifa}
            </p>
            <p>
              <strong>Punto de Partida:</strong> {tripInfo.puntoPartida}
            </p>
            <p>
              <strong>Punto de Llegada:</strong> {tripInfo.puntoLlegada}
            </p>
            <p>
              <strong>Nombre del Usuario:</strong> {tripInfo.nombreUsuario}
            </p>
          </div>
          <div className="card-footer d-flex justify-content-around">
            <button
              className="btn btn-danger"
              onClick={() => setShowCancelForm(true)}
            >
              Cancelar Viaje
            </button>
            <button
              className="btn btn-warning"
              onClick={() => setShowReportForm(true)}
            >
              Reportar Problema
            </button>
            <button
              className="btn btn-success"
              onClick={() => setShowEndTripForm(true)}
            >
              Finalizar Viaje
            </button>
          </div>

          {/* Formulario de Cancelación */}
          {showCancelForm && (
            <div className="mt-4 p-3 border rounded bg-light">
              <h5>Cancelar Viaje</h5>
              <div className="form-group">
                <label>Motivo de Cancelación</label>
                <input
                  type="text"
                  className="form-control"
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Ingrese el motivo de la cancelación"
                />
              </div>
              <div className="form-group mt-3">
                <label>Justificación</label>
                <textarea
                  className="form-control"
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  placeholder="Ingrese la justificación"
                />
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowCancelForm(false)}
                >
                  Cerrar
                </button>
                <button className="btn btn-primary" onClick={handleCancelTrip}>
                  Enviar
                </button>
              </div>
            </div>
          )}

          {/* Formulario de Reporte de Problema */}
          {showReportForm && (
            <div className="mt-4 p-3 border rounded bg-light">
              <h5>Reportar Problema</h5>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  className="form-control"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="problemas con el pasajero">
                    Problemas con el pasajero
                  </option>
                  <option value="fallos tecnicos">Fallos técnicos</option>
                  <option value="problemas de pago">Problemas de pago</option>
                  <option value="problemas con el auto">
                    Problemas con el auto
                  </option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label>Descripción</label>
                <textarea
                  className="form-control"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describa el problema"
                />
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowReportForm(false)}
                >
                  Cerrar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleReportProblem}
                >
                  Enviar
                </button>
              </div>
            </div>
          )}

          {/* Formulario de Finalizar Viaje */}
          {showEndTripForm && (
            <div className="mt-4 p-3 border rounded bg-light">
              <h5>¿El pago fue realizado?</h5>
              <select
                className="form-control"
                value={pagoRecibido}
                onChange={(e) => setPagoRecibido(e.target.value)}
              >
                <option value="">Seleccione una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowEndTripForm(false)}
                >
                  Cerrar
                </button>
                <button className="btn btn-primary" onClick={handleEndTrip}>
                  Enviar
                </button>
              </div>
            </div>
          )}

          {/* Modal de Calificación del Cliente */}
          {showRatingModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Calificar al Cliente</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowRatingModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <label>Calificación (Estrellas)</label>
                    <select
                      className="form-control"
                      value={estrellas}
                      onChange={(e) => setEstrellas(e.target.value)}
                    >
                      <option value="">Seleccione una calificación</option>
                      <option value="1">1 estrella</option>
                      <option value="2">2 estrellas</option>
                      <option value="3">3 estrellas</option>
                      <option value="4">4 estrellas</option>
                      <option value="5">5 estrellas</option>
                    </select>
                    <label className="mt-3">Comentario</label>
                    <textarea
                      className="form-control"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Ingrese un comentario"
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowRatingModal(false)}
                    >
                      Cerrar
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleRateUser}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center">Cargando...</p>
      )}
    </div>
  );
}

export default ViajeActivo;

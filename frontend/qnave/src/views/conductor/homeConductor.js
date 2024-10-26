import API_URL from "../../config/config";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Cambia useHistory por useNavigate

function HomeConductor() {
  const [trips, setTrips] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate(); // Usa useNavigate aquí
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchActiveTrip = async () => {
      const response = await fetch(`${API_URL}/driver/active_trip/${userId}`);
      if (response.status !== 200) {
        fetchTripList();
      } else {
        setErrorMessage(
          "No puede aceptar mas viajes, Ya tiene un viaje activo."
        );
      }
    };

    const fetchTripList = async () => {
      const response = await fetch(`${API_URL}/driver/getTripList`);
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      } else {
        setErrorMessage("No hay viajes disponibles en este momento");
      }
    };

    fetchActiveTrip();
  }, [userId]);

  const handleAcceptTrip = async (tripId) => {
    const response = await fetch(`${API_URL}/driver/acceptDrive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ConductorID: userId,
        ViajeID: tripId,
      }),
    });

    if (response.status === 200) {
      alert("Viaje aceptado con éxito");
      navigate("/viajeActivo");
    } else {
      alert("No se pudo aceptar el viaje");
    }
  };

  const handleViewProfile = async (usuarioID) => {
    console.log("UsuarioID:", usuarioID); // Verifica el UsuarioID
    const response = await fetch(`${API_URL}/driver/getUserInfo/${usuarioID}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Respuesta de la API:", data); // Verifica la respuesta
      setUserInfo(data);
      setShowModal(true);
    } else {
      alert("Error al obtener la información del usuario");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setUserInfo(null);
  };

  return (
    <div className="container">
      <h2>Lista de Viajes</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="row">
        {trips.map((trip) => (
          <div className="col-md-3" key={trip.ViajeID}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Viaje ID: {trip.ViajeID}</h5>
                <p className="card-text">Zona Inicio: {trip.ZonaInicio}</p>
                <p className="card-text">Zona Fin: {trip.ZonaFin}</p>
                <p className="card-text">Tarifa: {trip.Tarifa} $</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAcceptTrip(trip.ViajeID)}
                >
                  Aceptar Viaje
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleViewProfile(trip.UsuarioID)}
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && userInfo && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Información del Usuario</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Nombre:</strong> {userInfo.NombreCompleto}
                </p>
                <p>
                  <strong>Teléfono:</strong> {userInfo.Telefono}
                </p>
                <p>
                  <strong>Correo:</strong> {userInfo.CorreoElectronico}
                </p>
                <p>
                  <strong>Calificacion:</strong> {userInfo.NumeroEstrellas}{" "}
                  <strong> Estrellas</strong>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeConductor;

import { Routes, Route, Outlet } from "react-router-dom";
import HeaderConductor from "./components/header_conductor/headerConductor";
import HeaderAsistente from "./components/header_asistente/headerAsistente";
import HeaderAdministrador from "./components/header_admin/headerAdmin";
import HomeConductor from "./views/conductor/homeConductor";
import Login from "./views/Login/Login";
import RegistrarConductor from "./views/conductor/registrarConductor";
//import HomeAsistente from "./views/asistente/homeAsistente";
import VisorConductores from "./views/asistente/visorConductores";
import DetalleConductor from "./views/asistente/DetalleConductor";
import VisorUsuarios from "./views/asistente/visorUsuarios";
import DetalleUsuario from "./views/asistente/DetalleUsuario";
import VisorSolicitudEmpleos from "./views/asistente/visorSolicitudEmpleos";
import DetalleSolicitud from "./views/asistente/DetalleSolicitud";
import CambiarContrasenia from "./views/Login/NuevaContrasenia";
import RegistroUsuario from "./views/usuario/registrarUsuario";
import HomeUsuario from "./views/usuario/homeUsuario";
import PedirViaje from "./views/usuario/pedirViaje";
import VerConductor from "./views/usuario/verConductor";
import ReportarProblema from "./views/usuario/reportarProblema";
import CancelarViaje from "./views/usuario/cancelarViaje";
import HomeAdministrador from "./views/administrador/homeAdmin";
import EditarUsuario from "./views/usuario/editarUsuario";
import ViajeActivo from "./views/conductor/viajeActivo";
import ModificarInformacionConductor from "./views/conductor/modificarConductor";
import GananciasConductor from "./views/conductor/gananciasConductor";
import RegistrarAsistente from "./views/administrador/registrarAsistente";
import EliminarAsistente from "./views/administrador/eliminarAsistente";
import Calificaciones from "./views/administrador/verCalificaciones";
import EstadisticasUso from "./views/administrador/estadisticasUso";

function LayoutConductor() {
  return <HeaderConductor></HeaderConductor>;
}

function LayoutAdministrador() {
  return <HeaderAdministrador></HeaderAdministrador>;
}

function LayoutAsistente() {
  return (
    <>
      <HeaderAsistente />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <div className="container-fluid">
      <Routes>
        <Route path="/" element={<Login />}></Route>

        <Route element={<LayoutAdministrador />}>
          <Route path="/administrador" element={<HomeAdministrador />}></Route>
          <Route
            path="/registro-asistente"
            element={<RegistrarAsistente />}
          ></Route>
          <Route
            path="/eliminar-asistente"
            element={<EliminarAsistente />}
          ></Route>
          <Route path="/calificaciones" element={<Calificaciones />}></Route>
          <Route path="/estadisticas-uso" element={<EstadisticasUso />}></Route>
        </Route>

        <Route
          path="/cambioContrasenia/:userId"
          element={<CambiarContrasenia />}
        ></Route>
        <Route
          path="/registro-conductor"
          element={<RegistrarConductor />}
        ></Route>
        <Route element={<LayoutConductor />}>
          <Route path="/conductor" element={<HomeConductor />}></Route>
          <Route path="/viajeActivo" element={<ViajeActivo />}></Route>
          <Route
            path="/modificar-conductor"
            element={<ModificarInformacionConductor />}
          ></Route>
          <Route
            path="/ganancias-conductor"
            element={<GananciasConductor />}
          ></Route>
        </Route>
        <Route path="/asistente" element={<LayoutAsistente />}>
          <Route index element={<VisorConductores />} />
          <Route path="conductores" element={<VisorConductores />} />
          <Route path="conductores/:id" element={<DetalleConductor />} />
          <Route path="usuarios" element={<VisorUsuarios />} />
          <Route path="usuarios/:id" element={<DetalleUsuario />} />
          <Route path="solicitudes" element={<VisorSolicitudEmpleos />} />
          <Route path="solicitudes/:id" element={<DetalleSolicitud />} />
        </Route>
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
        <Route path="/usuario/home" element={<HomeUsuario />} />
        <Route path="/usuario/pedirviaje" element={<PedirViaje />} />
        <Route path="/usuario/verconductor" element={<VerConductor />} />
        <Route
          path="/usuario/reportarproblema"
          element={<ReportarProblema />}
        />
        <Route path="/usuario/cancelarviaje" element={<CancelarViaje />} />
        <Route path="/usuario/editarusuario" element={<EditarUsuario />} />
      </Routes>
    </div>
  );
}

export default App;

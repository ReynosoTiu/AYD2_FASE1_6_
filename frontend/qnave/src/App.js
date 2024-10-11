import { Routes, Route, Outlet } from "react-router-dom";
import HeaderConductor from "./components/header_conductor/headerConductor";
import HeaderAsistente from "./components/header_asistente/headerAsistente";
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
import RegistroUsuario from "./views/usuario/registrarUsuario";
import HomeUsuario from "./views/usuario/homeUsuario";
import PedirViaje from "./views/usuario/pedirViaje";
import VerConductor from "./views/usuario/verConductor";
import ReportarProblema from "./views/usuario/reportarProblema";
import CancelarViaje from "./views/usuario/cancelarViaje";
import CambiarContrasenia from "./views/Login/NuevaContrasenia";

function LayoutConductor() {
  return <HeaderConductor></HeaderConductor>;
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
        <Route
          path="/cambioContrasenia/:userId"
          element={<CambiarContrasenia />}
        ></Route>
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
          <Route path="/conductor" element={<HomeConductor />}></Route>
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

        <Route
          path="/registro-usuario"
          element={<RegistroUsuario />}
        ></Route>
        <Route
          path="/usuario/home"
          element={<HomeUsuario />}
        ></Route>
        <Route
          path="/usuario/pedirviaje"
          element={<PedirViaje />}
        ></Route>
          <Route
          path="/usuario/verconductor"
          element={<VerConductor />}
        ></Route>
          <Route
          path="/usuario/reportarproblema"
          element={<ReportarProblema />}
        ></Route>
          <Route
          path="/usuario/cancelarviaje"
          element={<CancelarViaje />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
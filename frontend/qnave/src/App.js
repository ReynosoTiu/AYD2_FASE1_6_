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
          path="/registro-conductor"
          element={<RegistrarConductor />}
        ></Route>
        <Route element={<LayoutConductor />}>
          <Route path="/" element={<HomeConductor />}></Route>
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
      </Routes>
    </div>
  );
}

export default App;

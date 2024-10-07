import { Routes, Route, Outlet } from "react-router-dom";
import HeaderConductor from "./components/header_conductor/headerConductor";
import HeaderAsistente from "./components/header_asistente/headerAsistente";
import HomeConductor from "./views/conductor/homeConductor";
//import HomeAsistente from "./views/asistente/homeAsistente";
import AsistenteBuscarInformacion from "./views/asistente/buscarInformacion";
import AsistenteSolicitudEmpleos from "./views/asistente/SolicitudEmpleos";
import AsistenteVerInformacion from "./views/asistente/verInformacion";
import Login from "./views/Login/Login";
import RegistrarConductor from "./views/conductor/registrarConductor";
import RegistroUsuario from "./views/usuario/registrarUsuario";
import HomeUsuario from "./views/usuario/homeUsuario";
import PedirViaje from "./views/usuario/pedirViaje";
import VerConductor from "./views/usuario/verConductor";
import ReportarProblema from "./views/usuario/reportarProblema";
import CancelarViaje from "./views/usuario/cancelarViaje";

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

        <Route element={<LayoutAsistente />}>
          <Route path="/asistente" element={<AsistenteBuscarInformacion />} />
          <Route
            path="/asistente/solicitudes"
            element={<AsistenteSolicitudEmpleos />}
          />
          <Route
            path="/asistente/verinfo/:tipo/:id"
            element={<AsistenteVerInformacion />}
          />
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

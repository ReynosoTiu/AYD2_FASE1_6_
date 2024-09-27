import { Routes, Route, Outlet  } from "react-router-dom";
import HeaderConductor from "./components/header_conductor/headerConductor";
import HeaderAsistente from "./components/header_asistente/headerAsistente";
import HomeConductor from "./views/conductor/homeConductor";
//import HomeAsistente from "./views/asistente/homeAsistente";
import AsistenteBuscarInformacion from "./views/asistente/buscarInformacion";
import AsistenteSolicitudEmpleos from "./views/asistente/SolicitudEmpleos";
import AsistenteVerInformacion from "./views/asistente/verInformacion";

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
        <Route element={<LayoutConductor />}>
          <Route path="/" element={<HomeConductor />} />
        </Route>
        <Route element={<LayoutAsistente />}>
          <Route path="/asistente" element={<AsistenteBuscarInformacion />} />
          <Route path="/asistente/solicitudes" element={<AsistenteSolicitudEmpleos />} />
          <Route path="/asistente/verinfo/:tipo/:id" element={<AsistenteVerInformacion />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

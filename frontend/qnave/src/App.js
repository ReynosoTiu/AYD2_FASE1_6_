import { Routes, Route } from "react-router-dom";
import HeaderConductor from "./components/header_conductor/headerConductor";
import HomeConductor from "./views/conductor/homeConductor";
import Login from "./views/Login/Login";
import RegistrarConductor from "./views/conductor/registrarConductor";
function LayoutConductor() {
  return <HeaderConductor></HeaderConductor>;
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
          <Route path="/homeConductor" element={<HomeConductor />}></Route>
        </Route>
      </Routes>
    </div>
  );
}
export default App;

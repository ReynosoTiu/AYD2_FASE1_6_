import { Routes, Route } from "react-router-dom";
import HeaderConductor from "./components/header_conductor/headerConductor";
import HomeConductor from "./views/conductor/homeConductor";

function LayoutConductor() {
  return <HeaderConductor></HeaderConductor>;
}

function App() {
  return (
    <div className="container-fluid">
      <Routes>
        <Route element={<LayoutConductor />}>
          <Route path="/" element={<HomeConductor />}></Route>
        </Route>
      </Routes>
    </div>
  );
}
export default App;

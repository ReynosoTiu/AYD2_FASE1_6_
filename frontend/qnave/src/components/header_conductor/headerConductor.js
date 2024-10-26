import { Outlet, Link } from "react-router-dom";
import logo from "../../assets/logo/auto.png";
import styles from "./headerConductor.module.scss";

function HeaderConductor() {
  return (
    <div>
      <nav className={"navbar navbar-expand-lg bg-body-tertiary mb-4"}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="logo" className={styles.logo} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" to="/conductor">
                  <strong>Viajes Disponibles</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/viajeActivo">
                  <strong>Viaje Activo</strong>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default HeaderConductor;

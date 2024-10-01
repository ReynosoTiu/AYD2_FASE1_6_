import { Link } from "react-router-dom";
import logo from "../../assets/logo/auto.png";
import styles from "./headerAsistente.module.scss";

function HeaderAsistente() {
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
                <Link className="nav-link active" to="/asistente">
                  <strong>Ver información</strong>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/asistente/solicitudes">
                  <strong>Aceptar solicitudes</strong>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeaderAsistente;

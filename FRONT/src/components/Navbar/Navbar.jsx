import style from "./navbar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import img from "../../Img/EasySchool.png";

function Navbar() {
  const location = useLocation();

  // Define una variable para el estilo del enlace Home
  let homeLinkStyle = style.links;

  // Si estamos en la página de inicio, establece un estilo diferente para el enlace Home
  if (location.pathname === "/") {
    homeLinkStyle = `${style.links} ${style.hidden}`; // Añade una clase CSS para ocultar el enlace
  }
  return (
    <>
      <nav className={style.navbar}>
        <div className={style.container_navbar}>
          <div className={style.container_logo}>
            <img src={img} alt="imagen" />
          </div>
          <div className={style.div_links}>
            <NavLink className={homeLinkStyle} to={"/"}>
              Home
            </NavLink>
            <NavLink className={style.links} to={"/testimonios"}>
              Testimonios
            </NavLink>
            <NavLink className={style.links} to={"/login"}>
              Ingresar
            </NavLink>
            <NavLink className={style.links} to={"/contact"}>
              Contáctenos
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

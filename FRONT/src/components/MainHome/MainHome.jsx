import style from "./mainHome.module.css";
import niños from "../../Img/niños.jpg";
import factura from "../../Img/facturacion.png";
import pasarela from "../../Img/pasarelaDePago.png";
import mensajeria from "../../Img/mensajeria.png";
import Maps from "../MapsView/MapsView";

function MainHome() {
  return (
    <>
      <main className={style.main}>
        <div className={style.container_to_about_us}>
          <div className={style.container_about_us}>
            <div>
              <img src={niños} alt="imagen referencial" />
            </div>
            <div>
              <h2>¿Quiénes somos?</h2>
              <p>
                {" "}
                Somos una plataforma educativa que nace con la visión de
                transformar la experiencia educativa en instituciones de todos
                los tamaños. Nos dedicamos a proporcionar soluciones integrales
                para la gestión, comunicación y aprendizaje en entornos
                educativos.
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2>¿Donde Estamos?</h2>
          <p>
            Actualmente nos ubicamos en la ciudad de Córdoba, barrio de Nva
            Córdoba
          </p>
          <Maps />
        </div>

        <div className={style.container_to_offers}>
          <div className={style.container_offers}>
            <h2>¿Qué te ofrecemos?</h2>
            <div className={style.offers}>
              <div className={style.offers_detail}>
                <img src={factura} alt="Facturación Electrónica" />
                <h3>Gestión y Control</h3>
                <p>
                  Como usuario, ya sea padre/tutor o administrador, tendrá una
                  gestión y control completo de su perfil.
                </p>
              </div>
              <div className={style.offers_detail}>
                <img src={pasarela} alt="Pasarela de Pago" />
                <h3>Pago OnLine</h3>
                <p>
                  Podrás realizar todos tus pagos como matrícula, uniforme,
                  paquetes escolares, etc, utilizando tu tarjeta de crédito o
                  débito y por medio de la plataforma de{" "}
                  <strong>Mercado Pago</strong>.
                </p>
              </div>
              <div className={style.offers_detail}>
                <img src={mensajeria} alt="Sistema de mensajería" />
                <h3>Sistema de mensajería</h3>
                <p>
                  Contamos con nuestro servidor de mensajería dedicado para la
                  gestión y envío de correos electrónicos relevantes como pagos
                  o inscripciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default MainHome;

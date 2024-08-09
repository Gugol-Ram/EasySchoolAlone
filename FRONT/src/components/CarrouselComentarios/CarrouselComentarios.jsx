import { useEffect, useState } from "react";
import style from "./carrousel.module.css";
import StarsRating from "./StarsRating";
const { VITE_BACK_URL } = import.meta.env;

const CarrouselComentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${VITE_BACK_URL}/valoracion`)
      .then((response) => response.json())
      .then((data) => setComentarios(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.ceil(comentarios.length / 2) - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === Math.ceil(comentarios.length / 2) - 1 ? 0 : prevIndex + 1
    );
  };

  const changeDate = (date) => {
    const fechaConvertida = new Date(date);
    const dia = fechaConvertida.getDate().toString().padStart(2, "0");
    const mes = (fechaConvertida.getMonth() + 1).toString().padStart(2, "0");
    const año = fechaConvertida.getFullYear().toString().slice(-2);
    const fechaFormateada = `${dia}/${mes}/${año}`;
    return fechaFormateada;
  };

  return (
    <div className={style.backgroundContainer}>
      <div className={style.carouselContainer}>
        <h2>
          <strong>Lo que dicen nuestros usuarios</strong>
        </h2>
        <div className={style.carousel}>
          <button className={style.prevButton} onClick={prevSlide}>
            ❮
          </button>
          <div className={style.slidesContainer}>
            <div
              className={style.slide}
              style={{ transform: `translateX(-${currentIndex * 50}%)` }}
            >
              {comentarios.map((comment, index) => (
                <div key={index} className={style.slideItem}>
                  <div className={style.container_details}>
                    <div className={style.container_details_first}>
                      <b>Nivel de satisfacción: </b>
                      <StarsRating satisfaction={comment.satisfaction} />
                      <b>{changeDate(comment.createdAt)}</b>
                    </div>
                    <h5>
                      <b>Facilidad de Uso:</b> {comment.easeOfUse}
                    </h5>
                    <h5>
                      <b>Proceso de Registro:</b> {comment.registrationProcess}
                    </h5>
                    <h5>
                      <b>Interfaz de Usuario:</b> {comment.userInterface}
                    </h5>
                    <h5>
                      <b>Recomendación:</b>{" "}
                      {comment.recommendation ? "Sí" : "No"}
                    </h5>
                    <h5>
                      <b>Comentarios Adicionales:</b>{" "}
                      {comment.additionalComments}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className={style.nextButton} onClick={nextSlide}>
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarrouselComentarios;

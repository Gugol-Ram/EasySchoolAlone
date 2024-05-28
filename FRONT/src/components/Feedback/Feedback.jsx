import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createValoracion,
  hasParentRated,
} from "../../redux/actions/actions-valoraciones";
import { useDispatch } from "react-redux";
import Alert from "sweetalert2";
import { useNavigate } from "react-router-dom";
import style from "./feedback.module.css";

const FeedbackForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parentId = sessionStorage.getItem("parentId");
  const [feedback, setFeedback] = useState({
    easeOfUse: "",
    satisfaction: "",
    registrationProcess: "",
    features: "ok",
    userInterface: "",
    recommendation: "",
    additionalComments: "",
    parentId: parentId,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
    console.log(feedback);
  };

  const handleSubmit = async (event) => {
    console.log(feedback);
    event.preventDefault();
    dispatch(createValoracion({ ...feedback }));
    dispatch(hasParentRated(parentId));
    await Alert.fire({
      icon: "success",
      title: "Gracias por su opinion! Redirigiendo a 'Mi Perfil'...",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    setTimeout(() => {
      navigate("/viewParent/myProfile");
    }, 100);
  };

  return (
    <div className={style.main_container}>
      <div className={`container mt-5 ${style.form_container}`}>
        <h2 className="mb-4">Su opinión es importante.</h2>
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${style.form_group}`}>
            <label>
              ¿Cómo calificaría la facilidad de uso de nuestra plataforma de
              inscripción?
            </label>
            <select
              className="form-control"
              name="easeOfUse"
              onChange={handleChange}
              value={feedback.easeOfUse}
            >
              <option value="">Seleccionar</option>
              <option value="Excelente">Excelente</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Deficiente">Deficiente</option>
            </select>
          </div>
          <div className={`form-group ${style.form_group}`}>
            <label htmlFor="satisfaction">
              En una escala del 1 al 10, ¿cuál es su nivel de satisfacción
              general con nuestra plataforma?
            </label>
            <input
              value={feedback.satisfaction}
              onChange={handleChange}
              type="number"
              className="form-control"
              id="satisfaction"
              min="1"
              max="10"
              name="satisfaction"
            />
          </div>

          <div className={`form-group ${style.form_group}`}>
            <label htmlFor="registrationProcess">
              ¿Cómo fue su experiencia durante el proceso de registro de padres
              y estudiantes?
            </label>
            <textarea
              onChange={handleChange}
              className="form-control"
              id="registrationProcess"
              rows="3"
              name="registrationProcess"
              value={feedback.registrationProcess}
            ></textarea>
          </div>
          <div className={`form-group ${style.form_group}`}>
            <label htmlFor="userInterface">
              ¿Cómo calificaría la apariencia y la interfaz de usuario de la
              plataforma?
            </label>
            <textarea
              onChange={handleChange}
              className="form-control"
              id="userInterface"
              name="userInterface"
              rows="3"
              value={feedback.userInterface}
            ></textarea>
          </div>

          <div className={`form-group ${style.form_group}`}>
            <label>¿Recomendaría nuestra plataforma a otros padres?</label>
            <select
              className="form-control"
              name="recommendation"
              onChange={handleChange}
              value={feedback.recommendation}
              id="recommendation"
            >
              <option value="">Seleccionar</option>
              <option value="true">Si</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className={`form-group ${style.form_group}`}>
            <label htmlFor="additionalComments">
              Comentarios adicionales o sugerencias
            </label>
            <textarea
              onChange={handleChange}
              className="form-control"
              id="additionalComments"
              name="additionalComments"
              rows="3"
              value={feedback.additionalComments}
            ></textarea>
            <br />
          </div>
          <div className={`text-center ${style.text_center}`}>
            <button
              type="submit"
              className={`btn btn-primary ${style.btn_primary}`}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

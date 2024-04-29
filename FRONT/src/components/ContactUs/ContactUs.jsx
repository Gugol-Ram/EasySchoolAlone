import { useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
// import { useTranslation } from "react-i18next";
// import style from "./contact.module.css";

export const ContactUs = () => {
  // handleSubmit = (event) => {
  //   event.preventDefault();

  // }
  // const { t } = useTranslation();

  const form = useRef();
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      setSubmitError(
        "Error al enviar el formulario, campos incorrectos y/o faltantes"
      );

      return;
    }

    emailjs
      .sendForm("service_gk06hl3", "template_tdatoc8", form.current, {
        publicKey: "xtx7KNmACAjuGgqli",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          setIsSent(true); // Establecer el estado de envío exitoso a true
          resetForm();
          setSubmitError(""); // Limpiar el mensaje de error al enviar con éxito
        },
        (error) => {
          console.log("FAILED...", error.text);
          setSubmitError("Error en el formulario");
        }
      );
  };

  const validateForm = () => {
    const name = form.current.user_name.value.trim();
    const email = form.current.user_email.value.trim();
    const subject = form.current.user_subject.value.trim();

    const errors = {};

    if (name.length < 3) {
      errors.name = "El nombre debe tener 3 o más carácteres";
    }

    if (subject.length < 3) {
      errors.subject = "Asunto inválido";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Utilice un correo válido";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (errors) {
      setTimeout(() => {
        setErrors("");
      }, 5000);
    }
    if (submitError) {
      setTimeout(() => {
        setSubmitError("");
      }, 5000);
    }
  });

  const resetForm = () => {
    // Resetea los valores de los campos del formulario
    form.current.reset();
    setErrors({});
  };

  return (
    <section id="contact">
      <div className="row section-head">
        <div className="two columns header-col">
          <h1>
            <span>Contacto</span>
          </h1>
        </div>
        <div className="ten columns">
          <p className="lead">
            ¿Te gustaría contactarme o consultarme algo más? No dudes en
            enviarme un mensaje por medio de este formulario, o a traves de mis
            redes que se encuentran al final clickeando sobre los íconos, y te
            responderé a la brevedad.?
          </p>
        </div>
      </div>
      <div className="row">
        <div className="eight columns">
          <form ref={form} onSubmit={sendEmail}>
            <fieldset>
              <div>
                <label htmlFor="contactName">
                  Nombre <span className="required">*</span>
                </label>
                {errors.name && (
                  <div className="error" style={{ color: "red" }}>
                    {errors.name}
                  </div>
                )}
                <input
                  type="text"
                  defaultValue=""
                  size={35}
                  id="contactName"
                  name="user_name"
                />
              </div>
              <div>
                <label htmlFor="contactEmail">
                  Correo Electrónico <span className="required">*</span>
                </label>
                {errors.email && (
                  <div className="error" style={{ color: "red" }}>
                    {errors.email}
                  </div>
                )}
                <input
                  type="text"
                  defaultValue=""
                  size={35}
                  name="user_email"
                />
              </div>
              <div>
                <label htmlFor="contactSubject">
                  Asunto
                  <span className="required">*</span>
                </label>
                {errors.subject && (
                  <div
                    className="error"
                    style={{ color: "red", marginTop: "0px" }}
                  >
                    {errors.subject}
                  </div>
                )}
                <input
                  type="text"
                  defaultValue=""
                  size={35}
                  id="contactSubject"
                  name="user_subject"
                />
              </div>
              <div>
                <label htmlFor="contactMessage">
                  Mensaje
                  <span className="required">*</span>
                </label>
                <textarea
                  cols={50}
                  rows={15}
                  id="contactMessage"
                  name="message"
                  defaultValue={""}
                />
                <label htmlFor="">¿Listo?</label>
                <input className="submit" type="submit" value="Envíar" />
                {submitError && (
                  <div className="error" style={{ color: "darkred" }}>
                    <strong>{submitError}</strong>
                  </div>
                )}
              </div>
            </fieldset>
          </form>
          {isSent && ( // Mostrar el mensaje de alerta si el correo se ha enviado con éxito
            <div className="alert success" style={{ color: "darkgreen" }}>
              <strong>¡Mensaje enviado con éxito!</strong>
            </div>
          )}
        </div>
        <aside className="four columns footer-widgets">
          <div className="widget widget_contact">
            <h4>EasySchool</h4>
            <p className="address">
              Solúciones Educativas.
              <br />
              Córdoba, Argentina.
              <br />
              <span>Próximamente</span>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ContactUs;

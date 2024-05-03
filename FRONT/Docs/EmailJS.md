# EMAILJS PARA FORMULARIO DE CONTACTO.

Crear cuenta en emailjs. una vez creada la cuenta crear un nuevo servicio al que vincularemos el correo encargado de envíar el email ya que hay que utilizar un correo electrónico real.

Una vez configurado el servicio también configuraremos el template(plantilla) del correo con la info que consideremos necesaria.

En la plantilla tenemos campos como `{{from_name}}` o `{{user_name}}`, `{{user_email}}` `{{message}}` etc. estos campos son los que deberemos utilizar en el código JS para el form de contácto para "atrapar" los datos necesarios como la información del contacto o el mensaje. En el campo `{{toEmail}}` será el correo al cuál queremos que nos lleguen los mensajes enviados por medio del form(distinto al correo que utilizamos para crear el servicio).

Por último en el apartado `Account` obtenemos nuestra `Public Key` que también sera necesaria para el código.

Recapitulando, de EmailJS requeriremos: `Service ID` `Template ID` y `Public Key`.

Instalar dependencias necesarias en el FRONT. `npm install @emailjs/browser` O `npm install emailjs-com`. Actualmente utilizo la primera, pero ambas deberia ser funcionales, sólo cambia la forma de importarlo/ejecutarlo en el componente necesario.

Importamos emailJS y cualquier otra dependencia necesaria para el funcionamiento/personalización del form:

```
import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import styles from "./contact.module.css";
```

En nuestra función encargada del formulario necesitaremos invocar a emailjs y el metodo `sendForm`, al cuál le pasaremos los ID del servicio y del template respectivamente, un metodo `form.current` para indicar que es lo que hay en ese momento en el formulario y fialmente nuestra `public Key`.

Esperamos la respuesta de la promesa y manejamos adecuadamente mensajes y/o reset del formulario para el caso de éxito o fracaso según corresponda.

```
export const Contact = () => {

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
      .sendForm("SERVICE ID", "TEMPLATE ID", form.current, {
        publicKey: "PUBLIC KEY",
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
...resto del codigo y renderizado...
}
```

Esto sería la parte puntual de `emailJs`. Luego tenemos lo referido a validaciones o resets propios del formulario pero que en sí no tienen relación a la configuración del envío de emails.

## CONSIDERACIÓN ESPECIAL

Lo normal sería guardar nuestras credenciales sensibles como la public key en un archivo de entornos `.env` pero la misma documentación de EmailJS indica que esto no es posible(alparecer para evitar usar el servicio como spam) intente de varias formas pero al definirlo como constantes llega como `undefined` y obtengo el error en e formulario.

# Usar NodeMailer para envío de correos como notificación.

Utilizaremos una cuenta de gmail para esto, hay varias formas algunas más complejas que otras pero esta es muy sencilla y rapida.

Iniciamos sesión en la cuenta gmail que utilizaremos a tal fin(puede ser la personal pero lo ideal sería utilizar una distinta)

Necesitamos que tenga activa la verificación en dos pasos, si no es asi, la activamos desde el apartado de seguridad -> verificación en dos pasos. Para esto necesitaremos un teléfono al cual será enviado un PIN para activarla.

Una vez activada la verificación, en la barra de búsqueda buscaremos 'contraseñas de aplciaciones', una vez allí solo hay que colocar un nombre representativo y nos devolverá una contraseña. GUARDARLA ya que no es recuperable, hay que borrar y volver a crear la app sino.

Instalamos el paquete de nodemailer en nuestro proyecto:

```
npm install nodemailer
```

Luego necesitaremos crear nuestro 'transporter' o controlador dedicado a loguearnos con la cuenta que hará la funcion de envio de correos.

Requerimos nodemailer y lo necesario para las autenticaciones que guardaremos en .env

```
const nodemailer = require("nodemailer");
require("dotenv").config();
const { NODE_MAILER_USER, NODE_MAILER_PASS } = process.env;
```

Creamos nuestro transporter que deberá retornar la creación del mismo, usando como servicio gmail, y en la propiedad auth le pasamos nuestro usuario(el correo electronico usado para generar la contraseña) y la password generada

```
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      // type:"OAuth2",
      user: `${NODE_MAILER_USER}`, // Replace with your Gmail email
      pass: `${NODE_MAILER_PASS}`, // Replace with your Gmail password
    },
  });
};
```

Por último creamos una fn extra para finalizar el proceso de nodemailer utilizando el metodo close en el transporter:

```
const closeTransporter = () => {
  if (transporter) {
    transporter.close();
    console.log("Nodemailer cerrado");
  } else {
    console.log("Nodemailer transporter no inicializado");
  }
};
```

Hasta aqui la función para loguearnos en nodemailer y permitir el envio de mensajes. Ahora necesitaremos crear distintos 'controladores' según cuantos procesos tengamos que requieran el envío de un correo, mejor hacerlos por archivos separados.

# Controladores independientes.

Necesitaremos importar el transporter que creamos previamente, y la cuenta de correo desde dotenv para c/u

## Registro Nuevo Usuario

```
const { createTransporter } = require("../nodemail/transporter");//lugar donde este nuestro transporter
require("dotenv").config();
const { NODE_MAILER_USER } = process.env;
```

Creamos la función que enviara el mensaje, le pasamos el correo de quien se registró en este caso para poder invocarlo en el cuerpo del mensaje.

Esperamos a que se inicie una nueva instancia del transporter entonces en el cuerpo del correo utilizaremos la estructura típica de un correo como, remitente, receptor, asunto y mensaje.

Por último finalizamos con una especie de try catch en el cual en el transporter utilizamos el metodo "sendMail" y le pasamos como parametro lo contenido en el mailOptions(el mensaje básicamente) y junto a ello un estado de error y otro de información para manejar un estado de exito o fracaso según corresponda.

```
const sendConfirmationEmail = (userEmail) => {
     const transporter = createTransporter();
     const mailOptions = {
          from: `EasySchool <${NODE_MAILER_USER}>`, //aqui el correo que usamos para nodemailer
          to: userEmail, //el correo con el que se registraron
          subject: 'Confirmacion de registro de usuario',
          //todo esto de arriba seria el 'encabezado'
          html: `
            <p>Estimado usuario,</p>

            <p>Le extendemos un cordial saludo y agradecemos su registro en la aplicación EasySchool.</p>

            <p>
                Agradecemos su participación y esperamos que disfrute de todos los beneficios que nuestra comunidad educativa tiene para ofrecer.
            </p>

            <p>Atentamente,</p>
            <p>El equipo de EasySchool</p>

            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc7lASO96V-SoGbSwGyJpHoF1OTaycauf-LL-gBRW76MDaSXT0DJc_h7gYA8_aQRqcyAI&usqp=CAU" alt="EasySchool Image">
        `
     };
     transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
               console.error('Error sending email:', error);
          } else {
               console.log('Email sent:', info.response);
          }
     });
};
```

### Verificación Padre, Estudiante y Admin.

Repetimos el proceso para cada uno, lo único que variará será el mensaje contenido en el correo básicamente(en este caso).

#### ¿Y cómo se 'ejecuta' el envío del correo?

Esta acción se realiza desde el controller de createUser en el caso de alta mediante el uso del formulario de nuevos usuarios(forma 'tradicional') tipo padre o tipo admin; y también desde el controller de Auth0 en caso de registrarnos usando dicha herramienta.

```
const createUser = async (req, res) => {
     try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          req.body.password = hashedPassword;
          const user = await User.create(req.body);
          if (user.type === "Admin") {
               sendConfirmationEmailAdmin(req.body.email);
          }
          else { sendConfirmationEmail(req.body.email); }
          return res.status(201).json(user);
     } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
     }
};
```

Y respecto a las validaciones de padres y estudiantes por parte del administrador, será desde el controller del Admin.

En lo posible crear un nuevo usuario con un correo verdadero, sino gmail queda rebotando en el intento de envio de correo y es un poco molesto, y si consideramos que podemos haber hecho 10 pruebas de usuarios nuevos se vuelve exponencial jaja

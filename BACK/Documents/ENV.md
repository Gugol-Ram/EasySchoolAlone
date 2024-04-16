# Variables Requeridas en nuestro archivo .env

# CONEXION DB Y CLIENTE/SERVIDOR

DB_USER = "Nuestro nombre de usuario POSTGRESS"

DB_PASSWORD = "Contraseña del mismo"

DB_HOST = localhost

DB_NAME = usertest

PORT = 3000

FRONT_URL=http://localhost:5173

BACK_URL=http://localhost:3000

# AUTENTICACION DE 3ROS

GOOGLE_CLIENT_ID=...

GOOGLE_CLIENT_SECRET=...

(Información que obtendremos desde nuestra cuenta de Auth0)

# JASON WEB TOKEN

JWT_SECRET = Token genérico creado por nosotros mismos(Es aleatorio, 30 caracteres)

# MERCADO PAGO

ACCESS_TOKEN= Token del usuario de prueba creado en nuestra cuenta de MP, debe comenzar con TEST (para pagos ficticios).

# NODE MAILER

NODE_MAILER_USER= dirección de correo que hará las veces de casilla automática para envío de notificaciones

NODE_MAILER_PASS= password generada desde la cuenta elegida(no es la contraseña del correo, se genera una desde la cuenta, info extra en NodeMailer.md)

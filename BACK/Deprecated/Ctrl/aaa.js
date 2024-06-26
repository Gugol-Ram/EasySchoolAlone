const mercadopago = require("mercadopago");
require("dotenv").config({ path: "./.env" });
const { FRONT_URL, BACK_URL } = process.env;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const { Mpago, Parents, Grade, Estudiante } = require("../../src/config/db");

mercadopago.configure({
  access_token: ACCESS_TOKEN,
});
console.log(ACCESS_TOKEN);

const createOrder = (req, res) => {
  // const producto = req.body;
  const { id, title, price, quantity } = req.body;
  const parentid = req.body.parentid;
  const estudianteId = req.body.studentId;
  const gradeId = req.body.gradeId;

  // try {
  let preference = {
    items: [
      {
        id: id,
        title: title,
        unit_price: price,
        currency_id: "ARS",
        quantity: quantity,
      },
    ],
    back_urls: {
      success: `${FRONT_URL}/viewParent/myProfile`, // cuando es pago exitoso nos regresa al perfil de padre donde realiza el pago
      failure: `${FRONT_URL}/viewParent/myProfile`,
      pending: `${FRONT_URL}/viewParent/myProfile`,
    },
    payment_methods: {
      installments: 1,
    },
    notification_url:
      "https://2167-186-28-102-128.ngrok-free.app/webhook" /*`${BACK_URL}/webhook`*/,
    external_reference: `${String(estudianteId)},${String(gradeId)},${String(
      parentid
    )}`,
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(400).json({ message: error.message }));
  console.log("esto es el preference", preference);
  // console.log(response);

  //   const respuesta = await mercadopago.preferences.create(preference);
  //   return res.status(200).json(respuesta.response.init_point);
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).json({ message: error.message });
  // }
};

const receiveWebhook = async (req, res) => {
  try {
    const payment = req.query;
    console.log("esto es req.query de MP", payment);
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);
      const idtransaccion = data.body.id;
      const emailuser = data.body.payer.email;
      const descripcion = data.body.description;
      const amountransaccion = data.body.transaction_amount;
      const amountschool = data.body.transaction_details.net_received_amount;
      const fapro = data.body.date_approved;
      const statepaymet = data.body.status;
      const statusdetail = data.body.status_detail;

      if (data.body.status === "approved") {
        const externalReferenceParts = data.body.external_reference.split(",");
        const estudianteId = externalReferenceParts[0];
        const gradeId = externalReferenceParts[1];
        const parentid = externalReferenceParts[2];
        await updateEstadoPago(estudianteId);
        await updateGradeQuota(gradeId);

        let parents = await Parents.findOne({
          where: {
            id: parentid,
          },
        });

        let nombreUsuario = "";
        let apellidoUsuario = "";

        if (parents) {
          nombreUsuario = parents.name;
          apellidoUsuario = parents.lastName;
        }

        console.log(nombreUsuario, apellidoUsuario);

        await Mpago.create({
          iduser: parentid,
          idtrans: idtransaccion,
          nombreuser: nombreUsuario,
          apellidouser: apellidoUsuario,
          email: emailuser,
          descripcion: descripcion,
          monto: amountransaccion,
          montoschool: amountschool,
          fechPago: fapro,
          status: statepaymet,
          statusdetail: statusdetail,
        });
      }
    }
    return res.status(200).json(`${FRONT_URL}/viewParent/myProfile`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const updateEstadoPago = async (estudianteId) => {
  try {
    const estudiante = await Estudiante.findByPk(estudianteId);
    if (!estudiante) {
      console.log("Estudiante not found with ID:", estudianteId);
      return;
    }
    estudiante.estadoPago = true;
    await estudiante.save();
    console.log(
      "Estado de pago actualizado para el estudiante con ID:",
      estudianteId
    );
  } catch (error) {
    console.error("Error updating estadoPago:", error.message);
    throw error;
  }
};

const updateGradeQuota = async (gradeId) => {
  try {
    const grade = await Grade.findByPk(gradeId);
    if (!grade) {
      console.log("Grade not found with ID:", gradeId);
      return;
    }
    grade.gradequota += 1;
    await grade.save();
    console.log("Grade quota updated for grade with ID:", gradeId);
    if (grade.gradequota === grade.gradeQuotaLimit) {
      console.log("Quota reached for grade with ID:", gradeId);
      console.log("Before update - Grade state:", grade.state);
      grade.state = false;
      await grade.save();
      console.log(
        "After update - Grade state set to false for grade with state:",
        grade.state
      );
    }
  } catch (error) {
    console.error("Error updating grade quota:", error.message);
    throw error;
  }
};

module.exports = { createOrder, receiveWebhook };

const express = require("express");
const {
  createPayPalOrder,
  capturePayPalOrder,
} = require("../Controllers/PayPal/createOrderPP");
const paymentRouterPP = express.Router();

paymentRouterPP.post("/create-order", createPayPalOrder);
paymentRouterPP.post("/capture-order/:orderID", capturePayPalOrder);

paymentRouterPP.get("/success", (req, res) => {
  console.log("PayPal data: ", req.query);
  res.redirect("http://localhost:5173/pp-pay-success");
});

// paymentRouterPP.get("/failed", (req, res) => {
//   console.log("PayPal data: ", req.query);
//   res.redirect("http://localhost:5173/failed?payment=failed");
// });

module.exports = paymentRouterPP;

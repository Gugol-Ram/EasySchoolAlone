const express = require("express");
const { Router } = require("express");
const { createOrder, receiveWebhook } = require("../controllers/aaa");
const router = Router();

router.post("/mercadopago", createOrder);

router.post("/webhook", receiveWebhook);

module.exports = router;

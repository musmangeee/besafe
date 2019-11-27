const express = require("express");
const router = express.Router();
const locker = require("../src/modules/locker");

router.get("/", async function(req, res, next) {
  res.reply({ data: "OK" });
});

router.get("/me", locker.unlock, async function(req, res, next) {
  res.reply({ data: req.user });
});

module.exports = router;

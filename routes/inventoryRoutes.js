const express     = require('express');
const router      = express.Router();
//==Models
const User        = require('../models/user');

const ensureLogin = require("connect-ensure-login");

router.get("/", ensureLogin.ensureLoggedIn('/bestow/login'), (req, res) => {
  
    res.render("inventory/inventory", { user: req.user._id });
  });//==END private page
module.exports = router;
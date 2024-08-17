const express = require("express");

const router = express.Router();
const {handleUserSignup, handleUserLogin} = require("../controller/user.controller");

const { validateSchema } = require("../middleware/validate.middleware");

const { signUpBodyValidation } = require("../validation/auth.validation");
const { loginBodyValidaton } = require("../validation/auth.validation");

const validateSignup = validateSchema(signUpBodyValidation);
const validateLogin = validateSchema(loginBodyValidaton);

router.post("/signup", validateSignup, handleUserSignup);
router.post("/login", validateLogin, handleUserLogin);

module.exports = router;
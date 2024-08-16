const express = require("express");

const router = express.Router();
const {handleUserSignup} = require("../controller/user.controller");

const { validateSchema } = require("../middleware/validate.middleware");

const {signUpBodyValidation} = require("../validation/auth.validation");

const validateSignup = validateSchema(signUpBodyValidation);

router.post("/signup", validateSignup, handleUserSignup);
// router.post("/login", validateLogin, handleUserLogin);

module.exports = router;
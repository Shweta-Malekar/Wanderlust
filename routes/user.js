const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.signupForm)
  .post(wrapAsync(userController.signupPost));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    //saveRedirect is to go back to the original place where the usr has requested before logging in check in middleware.js file
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginPost,
  );

//for logout
router.get("/logout", userController.logout);

module.exports = router;

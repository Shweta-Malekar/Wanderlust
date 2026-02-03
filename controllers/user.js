const User = require("../models/user.js");
const passport = require("passport");

module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signupPost = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    //passport has a method called req.login to get login automatically after we signed up
    //it also takes the call back similar to req.logout and the registered user
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("Success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("err", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = async (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginPost = async (req, res) => {
  req.flash("Success", "Welcome back to wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  //req.logout is a callback in itself provided by passport
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("Success", "You were logged out");
    res.redirect("/listings");
  });
};

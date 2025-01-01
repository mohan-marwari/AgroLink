const User = require("../models/user.js");
const passport = require("passport");

module.exports.signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });

    // Register user with passport-local-mongoose
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    // Ab user ko automatically login karne ke liye req.login ka use karenge
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash(
        "success",
        `Account created successfully! 🎉 Welcome to ${res.locals.websiteName}, ${username}!`
      );
      res.redirect("/");
    });
  } catch (error) {
    console.error("Error during signup:", error);

    // Flash error message and redirect to signup page
    req.flash(
      "error",
      `There was an error "${error}" during registration. Please try again.`
    );
    res.redirect("/signup");
  }
};

module.exports.loginUser = (req, res, next) => {
  let tempReturnTo = req.session.returnTo || "/";
  delete req.session.returnTo;

  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, () => {
    const redirectUrl = tempReturnTo || "/";
    req.flash(
      "success",
      `Welcome back 🙏 to ${res.locals.websiteName}, ${req.user.username}!`
    );

    res.redirect(redirectUrl);
  });
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out!");
    res.redirect("/");
  });
};

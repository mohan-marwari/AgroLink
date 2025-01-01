const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const userControllers = require("../controllers/users.js");

// Sign Up
router
  .route("/signup")
  .get(
    wrapAsync(async (req, res) => {
      res.render("../views/users/signup.ejs");
    })
  )
  .post(userControllers.signupUser);

// Login Route
router
  .route("/login")
  .get((req, res) => {
    res.render("../views/users/login");
  })
  .post(userControllers.loginUser);

// Log Out
router.get("/logout", userControllers.logoutUser);

module.exports = router;

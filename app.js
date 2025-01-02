if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

// connect db
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const flash = require("connect-flash");
app.use(cookieParser("secretcode"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR ON MONGO SESSION STORE", err);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.websiteName = "AgroLink";
  res.locals.currUser = req.user;
  res.locals.mapToken = process.env.MAPBOX_TOKEN;
  next();
});

const homeRouter = require("./routes/home");
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");

// routes
app.use("/listings", listingsRouter);
app.use("/", reviewsRouter);
app.use("/", homeRouter);
app.use("/", userRouter);

// Middleware
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

// Error Hadler route
app.use((err, req, res, next) => {
  console.error("Error Stack:", err.stack); // Full error stack for debugging
  console.log("Error Message:", err.message);
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listing to port 8080");
});
git add .
git commit -m "Updated DB connection logic and deployment settings. Added .gitignore to exclude sensitive files"

const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes");
const session = require("express-session");
app.use(
  session({
    secret: "s3Cur3",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

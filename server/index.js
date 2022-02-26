const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const uploadImage = require("./routes/image");
const users = require("./routes/user");
const auth = require("./routes/auth").router;
const bodyParser = require("body-parser");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DBConnection success!"))
  .catch((err) => {
    console.log(err);
  });
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.json());
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use("/api/images/", uploadImage);
app.use("/api/users/", users);
app.use("/api/auth/", auth);

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});

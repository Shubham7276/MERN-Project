const express = require("express");
const mongoose = require("mongoose");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressValidator = require('express-validator');
const cors = require('cors');

// load env variables
require("dotenv").config();

//import routes
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/ticket")


// app
const app = express();

//db connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/ticket", ticketRoutes)


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const express = require("express");
const app = express();   // at this point we r building our application

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//use dotenv to hide our confedential data like key, password etc.
dotenv.config();

// momgodb connection
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:true, useUnifiedTopology: true }, () => {
    console.log("connected to MongoDB")
});

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// we set or given a port to connect the server then after connecting we had given a callback fn
app.listen(8800, () => {                     
    console.log("backend server is connected and running and ready"); 
   });
                        
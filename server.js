import http from "http";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

import index from "./routes/index.js";

try {
  await mongoose.connect(
    "mongodb+srv://admin:admin@downloadfood-0.rxzwx.mongodb.net/downloadFoodDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  );
  console.log("connected to the database...");
} catch (err) {
  console.log("error connecting to database!");
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), "public")));
app.use(
  session({
    secret: "12345",
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", index);

const server = http.createServer(app);
server.listen(4000, () => {
  console.log("listening on *:4000");
});

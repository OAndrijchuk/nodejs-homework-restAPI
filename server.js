import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DB_HOST);

mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((erro) => {
    console.log(erro.message);
    process.exit(1);
  });

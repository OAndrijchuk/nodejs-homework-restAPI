import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const {DB_HOST,PORT}=process.env

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT||3000, () => {
      console.log(
        `Database connection successful. Server running on port: ${PORT}`
      );
    });
  })
  .catch((erro) => {
    console.log(erro.message);
    process.exit(1);
  });

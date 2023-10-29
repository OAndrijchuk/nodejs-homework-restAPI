import express from "express";
import { validateBody } from "../../decorators/index.js";
import { userSignUpShema, userSignInShema } from "../../models/auth/users.js";
import authControllers from "../../controllers/auth-controllers.js";
import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSignUpShema),
  authControllers.signUp
);
authRouter.post(
  "/login",
  validateBody(userSignInShema),
  authControllers.signIn
);
authRouter.patch("/", authenticate, authControllers.chengSubscription);
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.post("/logout", authenticate, authControllers.signOut);

export default authRouter;

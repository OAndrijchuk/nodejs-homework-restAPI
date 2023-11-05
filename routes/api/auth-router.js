import express from "express";
import { validateBody } from "../../decorators/index.js";
import { userSignUpShema, userSignInShema } from "../../models/auth/users.js";
import authControllers from "../../controllers/auth-controllers.js";
import { authenticate, upload } from "../../middlewares/index.js";

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

// upload.fields([{name:'avatar',maxCount:1}])
// upload.array('avatar',10)
authRouter.patch("/avatars", upload.single('avatar'), authenticate, authControllers.chengAvatar);

export default authRouter;

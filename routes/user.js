import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  userPasswordChange,
  userList,
  userAddItemToList,
  userRemoveItemFromList,
} from "../controllers/user.js";

const router = express.Router();

// authentication is required on this route
router.use(auth);

router.patch("/:userId/passwordChange", userPasswordChange);
router.get("/:userId/list/:listType", userList);
router.post("/:userId/list/:listType/item/add", userAddItemToList);
router.delete("/:userId/list/:listType/item/remove", userRemoveItemFromList);

export default router;

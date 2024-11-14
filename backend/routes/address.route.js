import express from "express";
import {
  addUserAddress,
  deleteUserAddress,
  fetchUserAddress,
  updateUserAddress,
} from "../controllers/address.controllers.js";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";

const router = express.Router();

router.post("/user", verifyJwtToken, addUserAddress);
router.get("/user", verifyJwtToken, fetchUserAddress);
router.delete("/user/:addressId", verifyJwtToken, deleteUserAddress);
router.put("/user", verifyJwtToken, updateUserAddress);

export default router;

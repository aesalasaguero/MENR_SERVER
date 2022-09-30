import express from "express";
const router = express.Router();

import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 request,
  message:
    "too many request from this IP address, please try again after 15 minutes",
});

import { register, login, updateUser } from "../controllers/authController.js";

// este es el middleare que verifica el token y lo pasacon next() al siguiente middleware
import authenticateUser from "../middleware/auth.js";

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.route("/updateUser").patch(authenticateUser, updateUser);

export default router;

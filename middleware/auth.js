import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

// este middleware verifica el token
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  //console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(payload);
    //req.user = payload;
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("authentication invalid token");
  }
};

export default auth;

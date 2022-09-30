// este paquete se usa para acabar con el error que salta porque las
//apps estan en diferentes server, se comenta porque es mejor usar la aproximacion de proxy
// hay que instalar npm install cors
//import cors from 'cors'

import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

// con esto eliminamos la necesidad de usar try/ catch en cada peticion
import "express-async-errors";
import morgan from "morgan";

// los ultimos package de seguridad
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

// db and authenticate user
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error_handler.js";
// este es el middleare que verifica el token y lo pasacon next() al siguiente middleware
import authenticateUser from "./middleware/auth.js";

//se usa para ver los errores en la consola de mejor forma
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// para el deploy, en EMS6 __dirname no est'a disponible por defecto
app.use(express.static(path.resolve(__dirname, "../client/build")));

//app.use(cors())
app.use(express.json());
// setting security middleware
app.use(helmet()); // secure headers
app.use(xss()); // sanitize the input
app.use(mongoSanitize()); // prevent mongo operator injection

// app.get("/", (req, res) => {
//   res.send("welcome");
// });

app.get("/api/v1/", (req, res) => {
  res.json({ msg: "API" });
});

app.use("/api/v1/auth", authRouter);
// aqui se coloca el middleware para no hacerlo en cada uno de las routes
// sino que de una vez se verifican todas
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// para el deploy para redirgir todo al index html en la carpeta build
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); // debe ir de ultimo

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server Running on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

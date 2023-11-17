import "reflect-metadata"
import express, { Request, Response } from "express"
import cors from "cors"
import routes from "./routes"
import bodyParser from "body-parser"
import { AppConfig } from "./config/config"
import rateLimit from "express-rate-limit"
import helmet from "helmet"

const config = AppConfig.config

const API_PREFIX = config.API_PREFIX;
const app = express();

if (config.NODE_ENV === "production") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Maximum 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });

  app.use(limiter);
}

app.use(express.json());
app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const corsOption = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOption));
app.use(`/${API_PREFIX}`, routes);

export default app;

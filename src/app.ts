import express from "express";
import "express-async-errors";
// import morgan from "morgan";
import http from "http";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

// security imports
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";

// ...................................
import { config } from "./config/config";
import { notFound } from "./middlewares/notFound";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import { connectDB } from "./db/connect";

// .........router.........
import userRouter from "./routes/userRoutes";
import pinRouter from "./routes/pinRoutes";
import commentRouter from "./routes/commentRoutes";

const app = express();

// ............cloudinary.................
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
      "script-src": [
        "'self'",
        "'unsafe-inline'",
        "https://accounts.google.com/gsi/client",
      ],
      "frame-src": ["'self'", "https://accounts.google.com/"],
      "connect-src": ["'self'", "https://accounts.google.com/gsi/status"],
    },
  })
);
app.use(mongoSanitize());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.SECRET));

// app.use(morgan("tiny"));

// .....................routes..................
app.use("/api/v1/user", userRouter);
app.use("/api/v1/pin", pinRouter);
app.use("/api/v1/comment", commentRouter);

if (process.env.NODE_ENV == "production") {
  const path = require("path");

  app.use(express.static(path.join(__dirname, "../client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

app.use(errorHandlerMiddleware);
app.use(notFound);

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();
  server.listen(config.server.port, () =>
    console.log(`server running on port ${config.server.port}`)
  );
};

startServer();

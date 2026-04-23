import cors from "cors";
import express from "express";
import morgan from "morgan";
import multer from "multer";

import { getUploadsDir } from "./middleware/upload.middleware";
import routes from "./routes";
import { AppError } from "./utils/app-error";

const app: express.Express = express();
app.get("/", (req, res) => {
  res.send("Express API is running");
});
app.use(morgan("tiny"));

app.use(express.json({ limit: "100mb" }));

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000","https://drive-web-fawn.vercel.app","http://localhost:3002"],
  })
);

app.use("/uploads", express.static(getUploadsDir()));

app.use("/v1", routes);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        message: err.message,
        ...(err.code ? { code: err.code } : {}),
      });
      return;
    }
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ message: "File too large" });
        return;
      }
      res.status(400).json({ message: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
);

export default app;

import { Router } from "express";

import authRouter from "./auth.routes";
import folderRouter from "./folder.routes";
import imageRouter from "./image.routes";
import testRouter from "./test";

const router = Router();

router.get("/", function (_req, res) {
  res.send("Express API is running");
});

router.use("/auth", authRouter);
router.use("/folders", folderRouter);
router.use("/images", imageRouter);
router.use("/test", testRouter);

export default router;

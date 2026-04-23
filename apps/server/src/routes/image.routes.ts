import { Router } from "express";

import * as imageController from "../controllers/image.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadImageMiddleware } from "../middleware/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", imageController.listByFolder);
router.get("/search", imageController.searchByquery);
router.post("/upload", uploadImageMiddleware, imageController.upload);
router.delete("/:imageId", imageController.deleteById);
router.patch("/:imageId", imageController.renameImage);

export default router;

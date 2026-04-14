import { Router } from "express";

import * as folderController from "../controllers/folder.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/tree", folderController.tree);
router.get("/", folderController.list);
router.post("/", folderController.create);

export default router;

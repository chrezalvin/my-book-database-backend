import {Router} from "express"
import { requiresJwt } from "server/middlewares/requiresJwt";
import upload from "server/middlewares/multerConfig";
import { 
    add_author,
    delete_author_by_id,
    edit_author_by_id,
    get_author_by_id
} from "server/controllers/authors";

const router = Router();

router.post("/authors/add", requiresJwt, upload.single("image"), add_author);
router.get("/authors/:author_id", get_author_by_id);
router.post("/authors/:author_id/edit", requiresJwt, upload.single("image"), edit_author_by_id);
router.get("/authors/:author_id/delete", requiresJwt, delete_author_by_id);

export default router;
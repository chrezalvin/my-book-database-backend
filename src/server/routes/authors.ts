import {Router} from "express"
import { requiresJwt } from "server/middlewares/requiresJwt";
import { 
    add_author,
    delete_author_by_id,
    edit_author_by_id,
    get_author_by_id,
    get_authors
} from "server/controllers/authors";

const router = Router();

router.get("/authors", get_authors);
router.post("/authors", requiresJwt, add_author);
router.get("/authors/:author_id", get_author_by_id);
router.patch("/authors/:author_id", requiresJwt, edit_author_by_id);
router.delete("/authors/:author_id", requiresJwt, delete_author_by_id);

export default router;
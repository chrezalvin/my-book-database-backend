import {Router} from "express"
import {
    add_genre,
    delete_genre_by_id,
    edit_genre_by_id,
    get_genres
} from "../controllers/genre"
import { requiresJwt } from "server/middlewares/requiresJwt";

const router = Router();

router.get("/genres", get_genres);
router.post("/genres/add", requiresJwt, add_genre);
router.post("/genres/edit/:genre_id", requiresJwt, edit_genre_by_id);
router.post("/genres/delete/:genre_id", requiresJwt, delete_genre_by_id);

export default router;
import {Router} from "express"
import { requiresJwt } from "server/middlewares/requiresJwt";
import {
    get_book_by_id,
    add_book,
    edit_book_by_id,
    delete_book_by_id,
    get_all_books_by_page
} from "../controllers/books"
import upload from "server/middlewares/multerConfig";

const router = Router();

router.get("/books", get_all_books_by_page);
router.post("/books/add", requiresJwt, upload.single("image"), add_book);
router.get("/books/:book_id", get_book_by_id);
router.post("/books/:book_id/edit", requiresJwt, upload.single("image"), edit_book_by_id);
router.get("/books/:book_id/delete", requiresJwt, delete_book_by_id);

export default router;
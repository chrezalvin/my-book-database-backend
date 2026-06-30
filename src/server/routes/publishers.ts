import {Router} from "express"
import { requiresJwt } from "server/middlewares/requiresJwt";
import { 
    add_publisher, 
    delete_publisher_by_id, 
    edit_publisher_by_id, 
    get_publisher_by_id, 
    get_publishers
} from "server/controllers/publishers";

const router = Router();

router.get("/publishers", get_publishers);
router.post("/publishers", requiresJwt, add_publisher);
router.get("/publishers/:publisher_id", get_publisher_by_id);
router.patch("/publishers/:publisher_id", requiresJwt, edit_publisher_by_id);
router.delete("/publishers/:publisher_id", requiresJwt, delete_publisher_by_id);

export default router;
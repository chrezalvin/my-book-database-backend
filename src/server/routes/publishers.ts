import {Router} from "express"
import { requiresJwt } from "server/middlewares/requiresJwt";
import { 
    add_publisher, 
    delete_publisher_by_id, 
    edit_publisher_by_id, 
    get_publisher_by_id 
} from "server/controllers/publishers";

const router = Router();

router.post("/publishers/add", requiresJwt, add_publisher);
router.get("/publishers/:publisher_id", get_publisher_by_id);
router.post("/publishers/:publisher_id/edit", requiresJwt, edit_publisher_by_id);
router.get("/publishers/:publisher_id/delete", requiresJwt, delete_publisher_by_id);

export default router;
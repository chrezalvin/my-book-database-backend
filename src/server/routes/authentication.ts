import {Router} from "express"
import {
    authenticate, 
    get_me, 
    sign_up
} from "../controllers/authentication"
import { requiresJwt } from "server/middlewares/requiresJwt";

const router = Router();

router.get("/users/me", requiresJwt, get_me);
router.post("/users/login", authenticate);
router.post("/users/signup", sign_up);

export default router;
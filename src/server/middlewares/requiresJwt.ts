import { JWT_SECRET } from "@configs";
import {Request, Response, NextFunction} from "express";
import { jwtModel } from "@models/Jwt";
import jwt from "jsonwebtoken";
import { UserService } from "@services/individual_services/UserService";

export const requiresJwt = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err)
            return res.status(401).json({ error: "Invalid token" });

        const parsed = jwtModel.safeParse(decoded);

        if (!parsed.success)
            return res.status(401).json({ error: "Invalid token payload" });

        const jwtPayload = parsed.data;

        if (Date.now() >= (jwtPayload.exp * 1000))
            return res.status(401).json({ error: "Token has expired" });

        const user = await UserService.fetchUserByIdAndEmail(
            jwtPayload.user_id, 
            jwtPayload.email
        );

        req.user = user;

        next();
    });
}
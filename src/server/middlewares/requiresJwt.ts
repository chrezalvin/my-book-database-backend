const debug = require("debug")("Server:Middlewares:RequiresJWT");

import { JWT_SECRET, PASSWORD_HASH_MODE} from "@configs";
import {Request, Response, NextFunction} from "express";
import { isJwt } from "@models/Jwt";
import jwt from "jsonwebtoken";
import { fetchUserByIdAndEmail } from "@services/userService";

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

        if (!isJwt(decoded))
            return res.status(401).json({ error: "Invalid token payload" });

        if (Date.now() >= decoded.exp * 1000)
            return res.status(401).json({ error: "Token has expired" });

        const user = await fetchUserByIdAndEmail(decoded.user_id, decoded.email);

        req.user = user;

        next();
    });
}
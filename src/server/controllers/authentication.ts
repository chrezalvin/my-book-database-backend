const debug = require("debug")("Server:Users");

import {Request, Response} from "express"
import {addUser, loginUser} from "@services/userService"
import {JWT_EXPIRATION, JWT_SECRET} from "@configs"
import jwt from "jsonwebtoken";
import { User } from "@models/User";

export const authenticate = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    debug(`Received sign-up request: ${JSON.stringify(req.body)}`);
    debug(`Email type: ${typeof email}, Password type: ${typeof password}`);

    if (typeof email !== "string" || typeof password !== "string")
        return res.status(400).json({ error: "Invalid email or password" });

    debug(`Logging in user with email: ${email}`);

    const user = await loginUser(email, password);
    
    debug(`User logged in successfully: ${JSON.stringify(user)}`);

    const token = jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
        }, JWT_SECRET, {expiresIn: JWT_EXPIRATION}
    )

    res.status(200).json({ data: {jwt: token} });
}

export const sign_up = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    debug(`Received sign-up request: ${JSON.stringify(req.body)}`);
    debug(`Email type: ${typeof email}, Password type: ${typeof password}`);

    if (typeof email !== "string" || typeof password !== "string")
        return res.status(400).json({ error: "Invalid email or password" });

    debug(`Signing up user with email: ${email}`);

    const user = await addUser(email, password);

    debug(`User signed up successfully: ${JSON.stringify(user)}`);

    const token = jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
        }, JWT_SECRET, {expiresIn: JWT_EXPIRATION}
    );

    res.status(200).json({ data: {jwt: token} });
}

export const get_me = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({error: "Unauthorized"});

    // omit password from user object before sending response
    const safeUser: Omit<User, "created_at" | "password"> = {
        user_id: req.user.user_id,
        email: req.user.email,
    }

    res.status(200).json({data: safeUser});
}
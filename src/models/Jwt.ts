import { z } from "zod";
import { userModel } from "./User";

export const jwtModel = z.object({
    user_id: userModel.shape.user_id,
    email: z.email(),
    iat: z.number(),
    exp: z.number()
});

export type Jwt = z.infer<typeof jwtModel>;
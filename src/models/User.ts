import { z } from "zod";

export const userModel = z.object({
    user_id: z.uuid(),
    created_at: z.string(),
    email: z.email(),
    password: z.string(),
});

export type User = z.infer<typeof userModel>;
import { genreModel } from "@models/Genre";
import z from "zod";

export const createGenreSchema = genreModel.omit({
    created_at: true,
    genre_id: true,
});

export const updateGenreSchema = createGenreSchema.partial();

export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
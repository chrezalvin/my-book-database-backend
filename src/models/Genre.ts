import { z } from "zod";

export const genreModel = z.object({
    genre_id: z.uuid(),
    genre_name: z.string(),
    created_at: z.string()
});

export const genreCreate = genreModel.omit({
    genre_id: true,
    created_at: true
});

export const genreUpdate = genreCreate.partial();

export type Genre = z.infer<typeof genreModel>;
export type GenreCreate = z.infer<typeof genreCreate>;
export type GenreUpdate = z.infer<typeof genreUpdate>;
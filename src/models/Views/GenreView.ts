import { z } from "zod";
import { genreModel } from "../Genre";

export const genreViewModel = z.object({
    genre_id: genreModel.shape.genre_id,
    genre_name: genreModel.shape.genre_name,
});

export type GenreView = z.infer<typeof genreViewModel>;
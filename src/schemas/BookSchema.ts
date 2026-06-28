import {bookModel} from "@models/Book"
import {genreModel} from "@models/Genre"
import {z} from "zod";

export const createBookSchema = bookModel.omit({
  created_at: true,
  book_id: true,
  cover_img: true,
}).extend({
  genre_ids: z.array(genreModel.shape.genre_id).optional(),
});

export const updateBookSchema = createBookSchema.partial();

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
import {z} from "zod";
import {bookModel} from "./Book";
import {genreModel} from "./Genre";

export const bookGenreModel = z.object({
    book_id: bookModel.shape.book_id,
    genre_id: genreModel.shape.genre_id
})

export type BookGenre = z.infer<typeof bookGenreModel>;
import { z } from "zod";

import { bookModel } from "../Book";
import { genreModel } from "../Genre";

export const bookViewModel = z.object({
    book_id: bookModel.shape.book_id,
    created_at: bookModel.shape.created_at,
    title: bookModel.shape.title,
    author: bookModel.shape.author,
    publisher: bookModel.shape.publisher,
    publication_year: bookModel.shape.publication_year,
    language: bookModel.shape.language,
    summary: bookModel.shape.summary,
    cover_img: bookModel.shape.cover_img,
    isbn: bookModel.shape.isbn,
    edition: bookModel.shape.edition,
    genres: z.array(
        z.object({
            genre_id: genreModel.shape.genre_id,
            genre_name: genreModel.shape.genre_name,
        })
    ).nullable(),
})

export type BookView = z.infer<typeof bookViewModel>;
import { z } from "zod";

import { bookModel } from "../Book";
import { genreModel } from "../Genre";
import { authorModel } from "../Author";
import { publisherModel } from "@models/Publisher";

export const bookViewModel = z.object({
    book_id: bookModel.shape.book_id,
    created_at: bookModel.shape.created_at,
    title: bookModel.shape.title,
    publication_year: bookModel.shape.publication_year,
    language: bookModel.shape.language,
    summary: bookModel.shape.summary,
    cover_img: bookModel.shape.cover_img,
    isbn: bookModel.shape.isbn,
    edition: bookModel.shape.edition,
    
    author_id: bookModel.shape.author_id, 
    author_name: authorModel.shape.author_name.nullable(),

    publisher_id: bookModel.shape.publisher_id,
    publisher_name: publisherModel.shape.publisher_name.nullable(),
    
    genres: z.array(
        z.object({
            genre_id: genreModel.shape.genre_id,
            genre_name: genreModel.shape.genre_name,
        })
    ).nullable(),
})

export type BookView = z.infer<typeof bookViewModel>;
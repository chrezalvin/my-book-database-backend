import {z} from "zod";
import { authorModel } from "./Author";
import { publisherModel } from "./Publisher";

export const bookModel = z.object({
    book_id: z.uuid(),
    created_at: z.string(),
    title: z.string(),
    publication_year: z.number().int().min(1000).max(new Date().getFullYear()),
    language: z.string(),
    summary: z.string(),
    cover_img: z.string().nullable(),
    isbn: z.string().nullable(),
    edition: z.string().nullable(),
    
    publisher_id: publisherModel.shape.publisher_id.nullable(),
    author_id: authorModel.shape.author_id.nullable(),
});

export const bookCreate = bookModel.omit({
    book_id: true,
    created_at: true,
    cover_img: true
})

export const bookUpdate = bookCreate.partial();

export type Book = z.infer<typeof bookModel>;
export type BookCreate = z.infer<typeof bookCreate>;
export type BookUpdate = z.infer<typeof bookUpdate>;
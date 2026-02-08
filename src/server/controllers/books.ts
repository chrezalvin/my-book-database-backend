const debug = require("debug")("Server:Books");

import {Request, Response} from "express"
import {addBook, deleteBookById, editBookById, fetchBookById, fetchBooksByPage} from "@services/bookService"
import { isBookPartial, isBookWithoutId } from "@models/Book";
import { PAGINATION_NUMBER } from "@configs";

export const get_all_books_by_page = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 0;

    const books = await fetchBooksByPage(page, PAGINATION_NUMBER);

    res.status(200).json({ data: books });
}

export const get_book_by_id = async (req: Request, res: Response) => {
    const book_id = req.params.book_id;

    if (typeof book_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    debug(`Fetching book with ID: ${book_id}`);

    const book = await fetchBookById(book_id);

    res.status(200).json({ data: book });
}

export const add_book = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({error: "Unauthorized"});

    const book = req.body?.book ? JSON.parse(req.body.book) : undefined;

    if(book === undefined)
        return res.status(400).json({error: "Book data is required"});

    if(!isBookWithoutId(book))
        return res.status(400).json({error: "Invalid book data"});

    debug(`Adding new book: ${JSON.stringify(book)}`);
    
    const newBook = await addBook(book, req.user.user_id, req.file ? {
        file: req.file.buffer,
        mimeType: req.file.mimetype
    } : undefined);

    res.status(200).json({data: newBook});
}

export const edit_book_by_id = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({error: "Unauthorized"});

    const book_id = req.params.book_id;
    const bookUpdates = req.body?.book ? JSON.parse(req.body.book) : undefined;

    if (typeof book_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    if (bookUpdates === undefined || !isBookPartial(bookUpdates))
        return res.status(400).json({ error: "Invalid book update data" });

    const book = await editBookById(book_id, bookUpdates, req.file ? {
        file: req.file.buffer,
        mimeType: req.file.mimetype
    } : undefined);

    res.status(200).json({ data: book });
}

export const delete_book_by_id = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({error: "Unauthorized"});

    const book_id = req.params.book_id;

    if (typeof book_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    const response = await deleteBookById(book_id);

    res.status(200).json({ data: { success: response } });
}
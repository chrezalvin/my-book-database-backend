const debug = require("debug")("Server:Books");

import { Request, Response } from "express"
import { PAGINATION_NUMBER } from "@configs";

import { BookViewService } from "@services/view_services/BookViewService"
import { BookServiceOrchestrator } from "@services/orchestrators/BookServiceOrchestrator";

import { createBookSchema, updateBookSchema } from "schemas/BookSchema";

export const get_all_books_by_page = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 0;
    const keyword = req.query.keyword as string | undefined;

    debug(`Fetching books for page: ${page} with keyword: ${keyword}`);

    const books = await BookViewService.fetchBookViewsByPage(page, PAGINATION_NUMBER, keyword);

    res.status(200).json({ data: books });
}

export const get_book_by_id = async (req: Request, res: Response) => {
    const book_id = req.params.book_id;

    if (typeof book_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    debug(`Fetching book with ID: ${book_id}`);

    const book = await BookViewService.fetchBookViewById(book_id);

    res.status(200).json({ data: book });
}

export const add_book = async (req: Request, res: Response) => {
    const bookInput: unknown = req.body.book ? JSON.parse(req.body.book) : undefined;

    if(bookInput === undefined)
        return res.status(400).json({error: "Book data is required"});

    const parsed = createBookSchema.parse(bookInput);

    const newBook = await BookServiceOrchestrator.createBook(
        parsed,
        req.file ? {
            file: req.file.buffer,
            mimeType: req.file.mimetype
        } : undefined
    )

    res.status(200).json({data: newBook});
}

export const edit_book_by_id = async (req: Request, res: Response) => {
    const book_id = req.params.book_id;
    const bookUpdates: unknown = req.body?.book ? JSON.parse(req.body.book) : undefined;

    if (typeof book_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    const parsed = updateBookSchema.parse(bookUpdates);

    debug(`Editing book with ID: ${book_id} with updates: ${JSON.stringify(parsed)}`);

    const editedBook = await BookServiceOrchestrator.editBook(
        book_id,
        parsed,
        req.file ? {
            file: req.file.buffer,
            mimeType: req.file.mimetype
        } : undefined
    )

    res.status(200).json({ data: editedBook });
}

export const delete_book_by_id = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({error: "Unauthorized"});

    const book_id = req.params.book_id;

    if (typeof book_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    const response = await BookServiceOrchestrator.deleteBook(book_id);

    res.status(200).json({ data: { success: response } });
} 
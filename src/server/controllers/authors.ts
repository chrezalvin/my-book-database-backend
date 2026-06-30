const debug = require("debug")("Server:Authors");

import { Request, Response } from "express"

import { AuthorService } from "@services/individual_services/AuthorService";
import { authorCreate, authorUpdate } from "@models/Author";

export const get_author_by_id = async (req: Request, res: Response) => {
    const author_id = req.params.author_id;

    if (typeof author_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    debug(`Fetching author with ID: ${author_id}`);

    const author = await AuthorService.fetchAuthorById(author_id);

    res.status(200).json({ data: author });
}

export const get_authors = async (req: Request, res: Response) => {
    const name = req.query.name as string | undefined;

    if (name && typeof name !== "string")
        return res.status(400).json({ error: "Invalid name" });

    debug(`Fetching authors with name: ${name}`);

    const authors = await AuthorService.fetchAuthors(name);

    res.status(200).json({ data: authors });
}

export const add_author = async (req: Request, res: Response) => {
    const authorInput: unknown = req.body;

    if(authorInput === undefined)
        return res.status(400).json({error: "Author data is required"});

    const parsed = authorCreate.parse(authorInput);

    const newAuthor = await AuthorService.addAuthor(parsed);

    res.status(200).json({data: newAuthor});
}

export const edit_author_by_id = async (req: Request, res: Response) => {
    const author_id = req.params.author_id;
    const bookUpdates: unknown = req.body;

    if (typeof author_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    const parsed = authorUpdate.parse(bookUpdates);

    debug(`Editing author with ID: ${author_id}`);

    const editedAuthor = await AuthorService.updateAuthor(author_id, parsed);

    res.status(200).json({ data: editedAuthor });
}

export const delete_author_by_id = async (req: Request, res: Response) => {
    const author_id = req.params.author_id;

    if (typeof author_id !== "string")
        return res.status(400).json({ error: "Invalid book ID" });

    const response = await AuthorService.deleteAuthor(author_id);

    res.status(200).json({ data: { success: response } });
} 